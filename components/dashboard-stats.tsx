'use client';

import { Transaction } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, DollarSign, Target } from 'lucide-react';
import { format, startOfMonth, endOfMonth, subMonths } from 'date-fns';

interface DashboardStatsProps {
  transactions: Transaction[];
}

export const DashboardStats = ({ transactions }: DashboardStatsProps) => {
  const currentMonth = new Date();
  const previousMonth = subMonths(currentMonth, 1);
  
  const getMonthlyData = (date: Date) => {
    const monthStart = startOfMonth(date);
    const monthEnd = endOfMonth(date);
    
    const monthTransactions = transactions.filter(t => {
      const transactionDate = new Date(t.date);
      return transactionDate >= monthStart && transactionDate <= monthEnd;
    });

    const income = monthTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const expenses = monthTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    return { income, expenses, net: income - expenses };
  };

  const currentData = getMonthlyData(currentMonth);
  const previousData = getMonthlyData(previousMonth);

  const incomeChange = previousData.income > 0 
    ? ((currentData.income - previousData.income) / previousData.income) * 100
    : 0;

  const expenseChange = previousData.expenses > 0 
    ? ((currentData.expenses - previousData.expenses) / previousData.expenses) * 100
    : 0;

  const stats = [
    {
      title: 'Monthly Income',
      value: currentData.income,
      change: incomeChange,
      icon: TrendingUp,
      color: 'text-green-600',
    },
    {
      title: 'Monthly Expenses',
      value: currentData.expenses,
      change: expenseChange,
      icon: TrendingDown,
      color: 'text-red-600',
    },
    {
      title: 'Net Income',
      value: currentData.net,
      change: 0,
      icon: DollarSign,
      color: currentData.net >= 0 ? 'text-green-600' : 'text-red-600',
    },
    {
      title: 'Total Transactions',
      value: transactions.length,
      change: 0,
      icon: Target,
      color: 'text-blue-600',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className={`h-4 w-4 ${stat.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stat.title === 'Total Transactions' 
                ? stat.value.toLocaleString()
                : `$${stat.value.toFixed(2)}`
              }
            </div>
            {stat.change !== 0 && (
              <p className="text-xs text-muted-foreground">
                {stat.change > 0 ? '+' : ''}{stat.change.toFixed(1)}% from last month
              </p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};