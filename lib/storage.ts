import { Transaction, Budget } from './types';
import { writeFileSync, readFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';

const TRANSACTIONS_KEY = 'finance-transactions';
const BUDGETS_KEY = 'finance-budgets';

// Storage directory for server-side file storage
const STORAGE_DIR = join(process.cwd(), 'data');
const TRANSACTIONS_FILE = join(STORAGE_DIR, 'transactions.json');
const BUDGETS_FILE = join(STORAGE_DIR, 'budgets.json');

// Ensure storage directory exists
if (typeof window === 'undefined' && !existsSync(STORAGE_DIR)) {
  mkdirSync(STORAGE_DIR, { recursive: true });
}

export const storage = {
  getTransactions: (): Transaction[] => {
    if (typeof window === 'undefined') {
      // Server-side: use file system
      try {
        if (existsSync(TRANSACTIONS_FILE)) {
          const data = readFileSync(TRANSACTIONS_FILE, 'utf-8');
          return JSON.parse(data);
        }
      } catch (error) {
        console.error('Error reading transactions from file:', error);
      }
      return [];
    } else {
      // Client-side: use localStorage
      const stored = localStorage.getItem(TRANSACTIONS_KEY);
      return stored ? JSON.parse(stored) : [];
    }
  },

  saveTransactions: (transactions: Transaction[]) => {
    if (typeof window === 'undefined') {
      // Server-side: save to file system
      try {
        writeFileSync(TRANSACTIONS_FILE, JSON.stringify(transactions, null, 2));
      } catch (error) {
        console.error('Error saving transactions to file:', error);
      }
    } else {
      // Client-side: save to localStorage
      localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(transactions));
    }
  },

  getBudgets: (): Budget[] => {
    if (typeof window === 'undefined') {
      // Server-side: use file system
      try {
        if (existsSync(BUDGETS_FILE)) {
          const data = readFileSync(BUDGETS_FILE, 'utf-8');
          return JSON.parse(data);
        }
      } catch (error) {
        console.error('Error reading budgets from file:', error);
      }
      return [];
    } else {
      // Client-side: use localStorage
      const stored = localStorage.getItem(BUDGETS_KEY);
      return stored ? JSON.parse(stored) : [];
    }
  },

  saveBudgets: (budgets: Budget[]) => {
    if (typeof window === 'undefined') {
      // Server-side: save to file system
      try {
        writeFileSync(BUDGETS_FILE, JSON.stringify(budgets, null, 2));
      } catch (error) {
        console.error('Error saving budgets to file:', error);
      }
    } else {
      // Client-side: save to localStorage
      localStorage.setItem(BUDGETS_KEY, JSON.stringify(budgets));
    }
  },
};