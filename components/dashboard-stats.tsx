'use client';

import { Transaction } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { TrendingUp, TrendingDown, DollarSign, Target, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { startOfMonth, endOfMonth, subMonths } from 'date-fns';

interface DashboardStatsProps {
  transactions: Transaction[];
}

export const DashboardStats = ({ transactions }: DashboardStatsProps) => {
  const currentMonth = new Date();
  const previousMonth = subMonths(currentMonth, 1);
  const totalBalance = transactions.reduce((sum, transaction) => {
    return transaction.type === 'income' ? sum + transaction.amount : sum - transaction.amount;
  }, 0);
  
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
      title: 'Total Balance',
      value: totalBalance,
      change: 0,
      icon: DollarSign,
      iconBg: 'bg-primary/10',
      iconColor: 'text-primary',
      valueColor: totalBalance >= 0 ? 'text-foreground' : 'text-destructive',
    },
    {
      title: 'Income',
      value: currentData.income,
      change: incomeChange,
      icon: ArrowUpRight,
      iconBg: 'bg-emerald-500/10',
      iconColor: 'text-emerald-500',
      valueColor: 'text-emerald-600 dark:text-emerald-400',
    },
    {
      title: 'Expenses',
      value: currentData.expenses,
      change: expenseChange,
      icon: ArrowDownRight,
      iconBg: 'bg-red-500/10',
      iconColor: 'text-red-500',
      valueColor: 'text-red-600 dark:text-red-400',
    },
    {
      title: 'Net Income',
      value: currentData.net,
      change: 0,
      icon: Target,
      iconBg: currentData.net >= 0 ? 'bg-emerald-500/10' : 'bg-red-500/10',
      iconColor: currentData.net >= 0 ? 'text-emerald-500' : 'text-red-500',
      valueColor: currentData.net >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <Card key={index} className="flex flex-col justify-between rounded-xl border bg-card p-6 transition-all duration-200 py-[24px] hover:shadow-sm">
          <div className="flex items-start justify-between mb-4">
            <div className={`w-10 h-10 rounded-lg ${stat.iconBg} flex items-center justify-center`}>
              <stat.icon className={`w-5 h-5 ${stat.iconColor}`} />
            </div>
            {stat.change !== 0 && (
              <span className={`pill-badge ${stat.change > 0 ? 'pill-badge-positive' : 'pill-badge-negative'}`}>
                {stat.change > 0 ? '+' : ''}{stat.change.toFixed(1)}%
              </span>
            )}
          </div>
          <div className="mt-auto">
            <p className="text-2xl font-semibold tracking-tight break-all">
              <span className={stat.valueColor}>${stat.value.toFixed(2)}</span>
            </p>
            <p className="text-xs text-muted-foreground mt-1">{stat.title}</p>
          </div>
        </Card>
      ))}
    </div>
  );
};
