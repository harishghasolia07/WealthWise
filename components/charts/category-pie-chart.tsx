'use client';

import { Transaction } from '@/lib/types';
import { defaultCategories } from '@/lib/categories';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { format, startOfMonth, endOfMonth } from 'date-fns';

interface CategoryPieChartProps {
  transactions: Transaction[];
}

export const CategoryPieChart = ({ transactions }: CategoryPieChartProps) => {
  const generateCategoryData = () => {
    const currentMonth = new Date();
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);

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

    return Object.entries(categoryTotals).map(([categoryId, amount]) => {
      const category = defaultCategories.find(cat => cat.id === categoryId);
      return {
        name: category?.name || 'Unknown',
        value: amount,
        color: category?.color || '#8884d8',
        icon: category?.icon || '📦',
      };
    }).sort((a, b) => b.value - a.value);
  };

  const data = generateCategoryData();
  const total = data.reduce((sum, item) => sum + item.value, 0);

  if (data.length === 0) {
    return (
      <Card className="border-none shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-sm font-medium">Spending by Category</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-72 flex items-center justify-center">
            <div className="text-center">
              <p className="text-sm font-medium text-foreground">No expenses this month</p>
              <p className="text-xs text-muted-foreground mt-1">Add transactions to see breakdown</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-none shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-sm font-medium">Spending by Category</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
                stroke="none"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                  fontSize: '12px',
                }}
                formatter={(value: number) => `$${value.toFixed(2)}`}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="pt-4 border-t space-y-3">
          <p className="text-xs text-muted-foreground">
            Total: <span className="font-medium text-foreground">${total.toFixed(2)}</span>
          </p>
          <div className="grid grid-cols-2 gap-x-4 gap-y-2">
            {data.map((item, index) => (
              <div key={index} className="flex items-center gap-2 text-xs">
                <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                <span className="text-muted-foreground truncate">{item.name}</span>
                <span className="ml-auto font-medium text-foreground">${item.value.toFixed(0)}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
