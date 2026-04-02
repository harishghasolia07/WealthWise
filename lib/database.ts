import { Transaction, Budget } from './types';
import { ObjectId } from 'mongodb';
import { storage } from './storage';

type TransactionRecord = Transaction & { userId?: string };
type BudgetRecord = Budget & { userId?: string };

// Try to import MongoDB client, but handle the case where it fails
let clientPromise: Promise<any> | null = null;
let mongoDisabled = false;
let mongoErrorLogged = false;
let transactionsFileFallbackLogged = false;
let budgetsFileFallbackLogged = false;

const isConnectionError = (error: unknown) => {
  const code = (error as { code?: string })?.code;
  const message = (error as { message?: string })?.message || '';

  return (
    code === 'ENOTFOUND' ||
    code === 'ECONNREFUSED' ||
    code === 'ETIMEDOUT' ||
    message.includes('querySrv') ||
    message.includes('Server selection timed out')
  );
};

const logMongoFallback = (context: string, error: unknown) => {
  const message = (error as { message?: string })?.message || 'Unknown MongoDB error';

  if (isConnectionError(error)) {
    mongoDisabled = true;
  }

  if (!mongoErrorLogged || !mongoDisabled) {
    console.warn(`MongoDB ${context} failed (${message}). Using file storage fallback.`);
  }

  if (mongoDisabled) {
    mongoErrorLogged = true;
  }
};

const getMongoClient = async () => {
  if (!clientPromise || mongoDisabled) {
    return null;
  }

  try {
    return await clientPromise;
  } catch (error) {
    logMongoFallback('connection', error);
    return null;
  }
};

try {
  const { default: mongoClientPromise } = require('./mongodb');
  clientPromise = mongoClientPromise;
} catch (error) {
  console.log('MongoDB not available, using file storage fallback:', (error as Error)?.message);
  clientPromise = null;
}

export async function getTransactions(userId: string): Promise<Transaction[]> {
  const client = await getMongoClient();

  if (client) {
    try {
      const db = client.db('finance_tracker');
      const transactions = await db.collection('transactions').find({ userId }).sort({ date: -1 }).toArray();

      return transactions.map((t: any) => ({
        id: t._id.toString(),
        amount: t.amount,
        date: t.date,
        description: t.description,
        category: t.category,
        type: t.type,
      }));
    } catch (error) {
      logMongoFallback('read transactions', error);
    }
  }

  // Fallback to file storage
  if (!transactionsFileFallbackLogged) {
    console.log('Using file storage for transactions');
    transactionsFileFallbackLogged = true;
  }
  return (storage.getTransactions() as TransactionRecord[]).filter((t) => t.userId === userId);
}

export async function createTransaction(userId: string, transaction: Omit<Transaction, 'id'>): Promise<Transaction> {
  const client = await getMongoClient();

  if (client) {
    try {
      const db = client.db('finance_tracker');

      const result = await db.collection('transactions').insertOne({
        ...transaction,
        userId,
        date: new Date(transaction.date),
        createdAt: new Date(),
      });

      console.log('Transaction created in MongoDB with ID:', result.insertedId.toString());
      return {
        id: result.insertedId.toString(),
        amount: transaction.amount,
        date: transaction.date,
        description: transaction.description,
        category: transaction.category,
        type: transaction.type,
      };
    } catch (error) {
      logMongoFallback('create transaction', error);
    }
  }

  // Fallback to file storage
  console.log('Creating transaction in file storage');
  const existingTransactions = storage.getTransactions() as TransactionRecord[];
  const newTransaction: TransactionRecord = {
    id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
    userId,
    ...transaction,
  };

  const updatedTransactions = [newTransaction, ...existingTransactions];
  storage.saveTransactions(updatedTransactions);

  return newTransaction;
}

export async function updateTransaction(userId: string, id: string, updates: Partial<Transaction>): Promise<void> {
  const client = await getMongoClient();

  if (client) {
    try {
      const db = client.db('finance_tracker');

      const updateData: any = { ...updates };
      if (updateData.date) {
        updateData.date = new Date(updateData.date);
      }

      await db.collection('transactions').updateOne(
        { _id: new ObjectId(id), userId },
        { $set: { ...updateData, updatedAt: new Date() } }
      );
      console.log('Transaction updated in MongoDB');
      return;
    } catch (error) {
      logMongoFallback('update transaction', error);
    }
  }

  // Fallback to file storage
  console.log('Updating transaction in file storage');
  const transactions = storage.getTransactions() as TransactionRecord[];
  const updatedTransactions = transactions.map((t) =>
    t.id === id && t.userId === userId ? { ...t, ...updates } : t
  );
  storage.saveTransactions(updatedTransactions);
}

export async function deleteTransaction(userId: string, id: string): Promise<void> {
  const client = await getMongoClient();

  if (client) {
    try {
      const db = client.db('finance_tracker');

      await db.collection('transactions').deleteOne({ _id: new ObjectId(id), userId });
      console.log('Transaction deleted from MongoDB');
      return;
    } catch (error) {
      logMongoFallback('delete transaction', error);
    }
  }

  // Fallback to file storage
  console.log('Deleting transaction from file storage');
  const transactions = storage.getTransactions() as TransactionRecord[];
  const updatedTransactions = transactions.filter((t) => !(t.id === id && t.userId === userId));
  storage.saveTransactions(updatedTransactions);
}

export async function getBudgets(userId: string): Promise<Budget[]> {
  const client = await getMongoClient();

  if (client) {
    try {
      const db = client.db('finance_tracker');
      const budgets = await db.collection('budgets').find({ userId }).toArray();

      return budgets.map((b: any) => ({
        categoryId: b.categoryId,
        amount: b.amount,
        month: b.month,
      }));
    } catch (error) {
      logMongoFallback('read budgets', error);
    }
  }

  // Fallback to file storage
  if (!budgetsFileFallbackLogged) {
    console.log('Using file storage for budgets');
    budgetsFileFallbackLogged = true;
  }
  return (storage.getBudgets() as BudgetRecord[]).filter((b) => b.userId === userId);
}

export async function setBudget(userId: string, categoryId: string, amount: number, month: string): Promise<void> {
  const client = await getMongoClient();

  if (client) {
    try {
      const db = client.db('finance_tracker');

      await db.collection('budgets').updateOne(
        { categoryId, month, userId },
        {
          $set: {
            categoryId,
            amount,
            month,
            userId,
            updatedAt: new Date()
          }
        },
        { upsert: true }
      );
      console.log('Budget set in MongoDB');
      return;
    } catch (error) {
      logMongoFallback('set budget', error);
    }
  }

  // Fallback to file storage
  console.log('Setting budget in file storage');
  const budgets = storage.getBudgets() as BudgetRecord[];
  const existingBudgetIndex = budgets.findIndex((b) => b.categoryId === categoryId && b.month === month && b.userId === userId);

  if (existingBudgetIndex >= 0) {
    budgets[existingBudgetIndex] = { ...budgets[existingBudgetIndex], categoryId, amount, month, userId };
  } else {
    budgets.push({ categoryId, amount, month, userId });
  }

  storage.saveBudgets(budgets);
}