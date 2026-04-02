'use client';

import { Transaction } from '@/lib/types';
import { defaultCategories } from '@/lib/categories';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { endOfMonth, startOfMonth, subMonths } from 'date-fns';
import { Lightbulb, TrendingDown, TrendingUp, ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface InsightsSectionProps {
  transactions: Transaction[];
}

export const InsightsSection = ({ transactions }: InsightsSectionProps) => {
  const currentDate = new Date();
  const previousDate = subMonths(currentDate, 1);

  const inMonth = (date: string, monthDate: Date) => {
    const d = new Date(date);
    return d >= startOfMonth(monthDate) && d <= endOfMonth(monthDate);
  };

  const currentMonthTransactions = transactions.filter((t) => inMonth(t.date, currentDate));
  const previousMonthTransactions = transactions.filter((t) => inMonth(t.date, previousDate));

  const currentIncome = currentMonthTransactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  const currentExpenses = currentMonthTransactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const previousIncome = previousMonthTransactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  const previousExpenses = previousMonthTransactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const expenseByCategory = currentMonthTransactions
    .filter((t) => t.type === 'expense')
    .reduce<Record<string, number>>((acc, tx) => {
      acc[tx.category] = (acc[tx.category] || 0) + tx.amount;
      return acc;
    }, {});

  const highestEntry = Object.entries(expenseByCategory).sort((a, b) => b[1] - a[1])[0];
  const highestCategory = highestEntry
    ? defaultCategories.find((c) => c.id === highestEntry[0])
    : null;

  const expenseChangePercent = previousExpenses > 0
    ? ((currentExpenses - previousExpenses) / previousExpenses) * 100
    : null;

  const incomeChangePercent = previousIncome > 0
    ? ((currentIncome - previousIncome) / previousIncome) * 100
    : null;

  const topCategoryShare = highestEntry && currentExpenses > 0
    ? (highestEntry[1] / currentExpenses) * 100
    : null;

  let observation = 'Add more transactions to unlock stronger spending insights.';
  if (currentIncome === 0 && currentExpenses === 0) {
    observation = 'No activity this month yet. Start by adding your income and expenses.';
  } else if (currentIncome - currentExpenses >= 0) {
    observation = `You are net positive by $${(currentIncome - currentExpenses).toFixed(2)} this month.`;
  } else {
    observation = `You are net negative by $${Math.abs(currentIncome - currentExpenses).toFixed(2)} this month.`;
  }

  return (
    <Card className="border-none shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Lightbulb className="w-4 h-4 text-amber-500" />
          Insights
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <p className="section-label">Top Spending</p>
            {highestCategory && highestEntry ? (
              <div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: highestCategory.color + '15' }}>
                    <span className="text-sm">{highestCategory.icon}</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{highestCategory.name}</p>
                    <p className="text-xs text-muted-foreground">${highestEntry[1].toFixed(2)}</p>
                  </div>
                </div>
                {topCategoryShare !== null && (
                  <span className="pill-badge pill-badge-neutral mt-2">
                    {topCategoryShare.toFixed(0)}% of expenses
                  </span>
                )}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No expenses yet</p>
            )}
          </div>

          <div className="space-y-2">
            <p className="section-label">Expenses vs Last Month</p>
            <div className="flex items-center gap-2">
              {expenseChangePercent !== null ? (
                <>
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${expenseChangePercent <= 0 ? 'bg-emerald-500/10' : 'bg-red-500/10'}`}>
                    {expenseChangePercent <= 0 ? <TrendingDown className="w-4 h-4 text-emerald-500" /> : <TrendingUp className="w-4 h-4 text-red-500" />}
                  </div>
                  <div>
                    <p className={`text-sm font-semibold ${expenseChangePercent <= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                      {expenseChangePercent > 0 ? '+' : ''}{expenseChangePercent.toFixed(1)}%
                    </p>
                    <p className="text-xs text-muted-foreground">vs ${previousExpenses.toFixed(0)}</p>
                  </div>
                </>
              ) : (
                <p className="text-sm text-muted-foreground">No data</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <p className="section-label">Income vs Last Month</p>
            <div className="flex items-center gap-2">
              {incomeChangePercent !== null ? (
                <>
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${incomeChangePercent >= 0 ? 'bg-emerald-500/10' : 'bg-red-500/10'}`}>
                    {incomeChangePercent >= 0 ? <ArrowUpRight className="w-4 h-4 text-emerald-500" /> : <ArrowDownRight className="w-4 h-4 text-red-500" />}
                  </div>
                  <div>
                    <p className={`text-sm font-semibold ${incomeChangePercent >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                      {incomeChangePercent > 0 ? '+' : ''}{incomeChangePercent.toFixed(1)}%
                    </p>
                    <p className="text-xs text-muted-foreground">vs ${previousIncome.toFixed(0)}</p>
                  </div>
                </>
              ) : (
                <p className="text-sm text-muted-foreground">No data</p>
              )}
            </div>
          </div>
        </div>

        <div className="pl-4 border-l-2 border-primary/20">
          <p className="text-sm text-muted-foreground">{observation}</p>
        </div>
      </CardContent>
    </Card>
  );
};
