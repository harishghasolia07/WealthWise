'use client';

import { Transaction } from '@/lib/types';
import { defaultCategories } from '@/lib/categories';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { format, startOfMonth, endOfMonth } from 'date-fns';
import { useBudgets } from '@/hooks/use-budgets';

interface BudgetComparisonChartProps {
  transactions: Transaction[];
}

export const BudgetComparisonChart = ({ transactions }: BudgetComparisonChartProps) => {
  const { getBudget } = useBudgets();

  const generateBudgetData = () => {
    const currentMonth = new Date();
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const monthKey = format(currentMonth, 'yyyy-MM');

    const currentMonthExpenses = transactions.filter(t => {
      const transactionDate = new Date(t.date);
      return transactionDate >= monthStart &&
        transactionDate <= monthEnd &&
        t.type === 'expense';
    });

    const categoryTotals = currentMonthExpenses.reduce((acc, transaction) => {
      acc[transaction.category] = (acc[transaction.category] || 0) + transaction.amount;
      return acc;
    }, {} as Record<string, number>);

    return defaultCategories.map(category => {
      const spent = categoryTotals[category.id] || 0;
      const budget = getBudget(category.id, monthKey);

      return {
        category: category.name,
        spent,
        budget,
        remaining: Math.max(0, budget - spent),
        over: Math.max(0, spent - budget),
        color: category.color,
        icon: category.icon,
      };
    }).filter(item => item.budget > 0 || item.spent > 0);
  };

  const data = generateBudgetData();

  if (data.length === 0) {
    return (
      <Card className="border-none shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-sm font-medium">Budget vs Actual</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-72 flex items-center justify-center">
            <div className="text-center">
              <p className="text-sm font-medium text-foreground">No budgets set</p>
              <p className="text-xs text-muted-foreground mt-1">Set budgets to track spending</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-none shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-sm font-medium">Budget vs Actual - {format(new Date(), 'MMMM yyyy')}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="vertical" barGap={2}>
              <XAxis
                type="number"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `$${value}`}
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
              />
              <YAxis
                type="category"
                dataKey="category"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                width={90}
                tick={{ fill: 'hsl(var(--foreground))' }}
              />
              <Tooltip
                cursor={{ fill: 'hsl(var(--muted))' }}
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                  fontSize: '12px',
                }}
                formatter={(value: number, name: string) => [
                  `$${value.toFixed(2)}`,
                  name.charAt(0).toUpperCase() + name.slice(1)
                ]}
              />
              <Bar dataKey="budget" fill="hsl(var(--muted))" radius={[0, 3, 3, 0]} barSize={12} />
              <Bar dataKey="spent" fill="hsl(var(--chart-3))" radius={[0, 3, 3, 0]} barSize={12} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="space-y-2">
          {data.map((item, index) => (
            <div key={index} className="flex items-center justify-between py-2 px-3 rounded-lg bg-secondary/20">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: item.color + '15' }}>
                  <span className="text-sm">{item.icon}</span>
                </div>
                <span className="text-sm font-medium">{item.category}</span>
              </div>
              <div className="flex items-center gap-4 text-xs">
                <span className="text-muted-foreground">Budget: ${item.budget.toFixed(0)}</span>
                <span className="text-muted-foreground">Spent: ${item.spent.toFixed(0)}</span>
                <span className={`font-medium ${item.over > 0 ? 'text-red-600 dark:text-red-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                  {item.over > 0 ? `-$${item.over.toFixed(0)}` : `$${item.remaining.toFixed(0)}`}
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
