export interface Transaction {
  id: string;
  amount: number;
  date: string;
  description: string;
  category: string;
  type: 'expense' | 'income';
  createdAt?: string;
  updatedAt?: string;
}

export interface Budget {
  id?: string;
  categoryId: string;
  amount: number;
  month: string; // YYYY-MM format
  createdAt?: string;
  updatedAt?: string;
}

export interface Category {
  id: string;
  name: string;
  color: string;
  icon: string;
}

export interface MonthlyData {
  month: string;
  totalExpenses: number;
  totalIncome: number;
  categoryBreakdown: Record<string, number>;
}