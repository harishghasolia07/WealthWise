'use client';

import { Transaction } from '@/lib/types';
import { defaultCategories } from '@/lib/categories';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
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
      <Card>
        <CardHeader>
          <CardTitle>Budget vs Actual</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80 flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              <p className="text-lg font-medium">No budgets set</p>
              <p className="text-sm">Set up budgets to track your spending</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Budget vs Actual - {format(new Date(), 'MMMM yyyy')}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                type="number" 
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `$${value}`}
              />
              <YAxis 
                type="category" 
                dataKey="category" 
                fontSize={12}
                tickLine={false}
                axisLine={false}
                width={100}
              />
              <Tooltip 
                formatter={(value: number, name: string) => [
                  `$${value.toFixed(2)}`,
                  name.charAt(0).toUpperCase() + name.slice(1)
                ]}
              />
              <Bar dataKey="budget" fill="#e5e7eb" radius={[0, 4, 4, 0]} />
              <Bar dataKey="spent" fill="#3b82f6" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 space-y-2">
          {data.map((item, index) => (
            <div key={index} className="flex items-center justify-between p-2 bg-muted/30 rounded-lg">
              <div className="flex items-center gap-2">
                <span className="text-lg">{item.icon}</span>
                <span className="font-medium">{item.category}</span>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <span>Budget: ${item.budget.toFixed(2)}</span>
                <span>Spent: ${item.spent.toFixed(2)}</span>
                <span className={`font-semibold ${item.over > 0 ? 'text-red-600' : 'text-green-600'}`}>
                  {item.over > 0 ? `Over by $${item.over.toFixed(2)}` : `$${item.remaining.toFixed(2)} left`}
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};