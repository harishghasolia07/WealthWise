import { Transaction, Budget } from './types';
import { ObjectId } from 'mongodb';
import { storage } from './storage';

// Try to import MongoDB client, but handle the case where it fails
let clientPromise: Promise<any> | null = null;

try {
  const { default: mongoClientPromise } = require('./mongodb');
  clientPromise = mongoClientPromise;
  console.log('MongoDB client initialized successfully');
} catch (error) {
  console.log('MongoDB not available, using file storage fallback:', (error as Error)?.message);
  clientPromise = null;
}

export async function getTransactions(): Promise<Transaction[]> {
  if (clientPromise) {
    try {
      const client = await clientPromise;
      const db = client.db('finance_tracker');
      const transactions = await db.collection('transactions').find({}).sort({ date: -1 }).toArray();

      console.log(`Retrieved ${transactions.length} transactions from MongoDB`);
      return transactions.map((t: any) => ({
        id: t._id.toString(),
        amount: t.amount,
        date: t.date,
        description: t.description,
        category: t.category,
        type: t.type,
      }));
    } catch (error) {
      console.error('Error fetching transactions from MongoDB, falling back to file storage:', error);
    }
  }

  // Fallback to file storage
  console.log('Using file storage for transactions');
  return storage.getTransactions();
}

export async function createTransaction(transaction: Omit<Transaction, 'id'>): Promise<Transaction> {
  if (clientPromise) {
    try {
      const client = await clientPromise;
      const db = client.db('finance_tracker');

      const result = await db.collection('transactions').insertOne({
        ...transaction,
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
      console.error('Error creating transaction in MongoDB, falling back to file storage:', error);
    }
  }

  // Fallback to file storage
  console.log('Creating transaction in file storage');
  const existingTransactions = storage.getTransactions();
  const newTransaction: Transaction = {
    id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
    ...transaction,
  };

  const updatedTransactions = [newTransaction, ...existingTransactions];
  storage.saveTransactions(updatedTransactions);

  return newTransaction;
}

export async function updateTransaction(id: string, updates: Partial<Transaction>): Promise<void> {
  if (clientPromise) {
    try {
      const client = await clientPromise;
      const db = client.db('finance_tracker');

      const updateData: any = { ...updates };
      if (updateData.date) {
        updateData.date = new Date(updateData.date);
      }

      await db.collection('transactions').updateOne(
        { _id: new ObjectId(id) },
        { $set: { ...updateData, updatedAt: new Date() } }
      );
      console.log('Transaction updated in MongoDB');
      return;
    } catch (error) {
      console.error('Error updating transaction in MongoDB, falling back to file storage:', error);
    }
  }

  // Fallback to file storage
  console.log('Updating transaction in file storage');
  const transactions = storage.getTransactions();
  const updatedTransactions = transactions.map((t: Transaction) =>
    t.id === id ? { ...t, ...updates } : t
  );
  storage.saveTransactions(updatedTransactions);
}

export async function deleteTransaction(id: string): Promise<void> {
  if (clientPromise) {
    try {
      const client = await clientPromise;
      const db = client.db('finance_tracker');

      await db.collection('transactions').deleteOne({ _id: new ObjectId(id) });
      console.log('Transaction deleted from MongoDB');
      return;
    } catch (error) {
      console.error('Error deleting transaction in MongoDB, falling back to file storage:', error);
    }
  }

  // Fallback to file storage
  console.log('Deleting transaction from file storage');
  const transactions = storage.getTransactions();
  const updatedTransactions = transactions.filter((t: Transaction) => t.id !== id);
  storage.saveTransactions(updatedTransactions);
}

export async function getBudgets(): Promise<Budget[]> {
  if (clientPromise) {
    try {
      const client = await clientPromise;
      const db = client.db('finance_tracker');
      const budgets = await db.collection('budgets').find({}).toArray();

      console.log(`Retrieved ${budgets.length} budgets from MongoDB`);
      return budgets.map((b: any) => ({
        categoryId: b.categoryId,
        amount: b.amount,
        month: b.month,
      }));
    } catch (error) {
      console.error('Error fetching budgets from MongoDB, falling back to file storage:', error);
    }
  }

  // Fallback to file storage
  console.log('Using file storage for budgets');
  return storage.getBudgets();
}

export async function setBudget(categoryId: string, amount: number, month: string): Promise<void> {
  if (clientPromise) {
    try {
      const client = await clientPromise;
      const db = client.db('finance_tracker');

      await db.collection('budgets').updateOne(
        { categoryId, month },
        {
          $set: {
            categoryId,
            amount,
            month,
            updatedAt: new Date()
          }
        },
        { upsert: true }
      );
      console.log('Budget set in MongoDB');
      return;
    } catch (error) {
      console.error('Error setting budget in MongoDB, falling back to file storage:', error);
    }
  }

  // Fallback to file storage
  console.log('Setting budget in file storage');
  const budgets = storage.getBudgets();
  const existingBudgetIndex = budgets.findIndex(b => b.categoryId === categoryId && b.month === month);

  if (existingBudgetIndex >= 0) {
    budgets[existingBudgetIndex] = { categoryId, amount, month };
  } else {
    budgets.push({ categoryId, amount, month });
  }

  storage.saveBudgets(budgets);
}