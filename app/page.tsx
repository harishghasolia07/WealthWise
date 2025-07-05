'use client';

import { useState } from 'react';
import { Transaction } from '@/lib/types';
import { useTransactions } from '@/hooks/use-transactions';
import { TransactionForm } from '@/components/transaction-form';
import { TransactionList } from '@/components/transaction-list';
import { DashboardStats } from '@/components/dashboard-stats';
import { MonthlyExpensesChart } from '@/components/charts/monthly-expenses-chart';
import { CategoryPieChart } from '@/components/charts/category-pie-chart';
import { BudgetComparisonChart } from '@/components/charts/budget-comparison-chart';
import { BudgetManager } from '@/components/budget-manager';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, PieChart, Settings, Wallet } from 'lucide-react';

export default function Home() {
  const { transactions, loading, addTransaction, updateTransaction, deleteTransaction } = useTransactions();
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  const handleAddTransaction = async (transaction: Omit<Transaction, 'id'>) => {
    const result = await addTransaction(transaction);
    if (result) {
      console.log('Transaction added successfully');
    }
  };

  const handleUpdateTransaction = async (transaction: Omit<Transaction, 'id'>) => {
    if (editingTransaction) {
      await updateTransaction(editingTransaction.id!, transaction);
      setEditingTransaction(null);
    }
  };

  const handleEditTransaction = (transaction: Transaction) => {
    setEditingTransaction(transaction);
  };

  const handleCancelEdit = () => {
    setEditingTransaction(null);
  };

  const handleDeleteTransaction = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      await deleteTransaction(id);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg font-medium text-gray-600">Loading your finances...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Personal Finance Tracker</h1>
          <p className="text-lg text-gray-600">Take control of your finances with detailed tracking and insights</p>
        </div>

        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="transactions" className="flex items-center gap-2">
              <Wallet className="w-4 h-4" />
              Transactions
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <PieChart className="w-4 h-4" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="budgets" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Budgets
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <DashboardStats transactions={transactions} />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <MonthlyExpensesChart transactions={transactions} />
              <CategoryPieChart transactions={transactions} />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Quick Add Transaction</CardTitle>
                </CardHeader>
                <CardContent>
                  <TransactionForm
                    onSubmit={handleAddTransaction}
                  />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <TransactionList
                    transactions={transactions.slice(0, 5)}
                    onEdit={handleEditTransaction}
                    onDelete={handleDeleteTransaction}
                  />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="transactions" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <TransactionForm
                onSubmit={editingTransaction ? handleUpdateTransaction : handleAddTransaction}
                editTransaction={editingTransaction || undefined}
                onCancel={editingTransaction ? handleCancelEdit : undefined}
              />
              <div className="space-y-4">
                <DashboardStats transactions={transactions} />
              </div>
            </div>
            <TransactionList
              transactions={transactions}
              onEdit={handleEditTransaction}
              onDelete={handleDeleteTransaction}
            />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <MonthlyExpensesChart transactions={transactions} />
              <CategoryPieChart transactions={transactions} />
            </div>
            <BudgetComparisonChart transactions={transactions} />
          </TabsContent>

          <TabsContent value="budgets" className="space-y-6">
            <BudgetManager />
            <BudgetComparisonChart transactions={transactions} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}