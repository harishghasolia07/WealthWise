'use client';

import { useState } from 'react';
import { defaultCategories } from '@/lib/categories';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useBudgets } from '@/hooks/use-budgets';
import { format } from 'date-fns';
import { Target } from 'lucide-react';

export const BudgetManager = () => {
  const { getBudget, setBudget } = useBudgets();
  const [budgets, setBudgets] = useState<Record<string, string>>({});
  const currentMonth = format(new Date(), 'yyyy-MM');

  const handleBudgetChange = (categoryId: string, value: string) => {
    setBudgets(prev => ({ ...prev, [categoryId]: value }));
  };

  const handleSaveBudget = (categoryId: string) => {
    const amount = parseFloat(budgets[categoryId] || '0');
    if (amount >= 0) {
      setBudget(categoryId, amount, currentMonth);
      setBudgets(prev => ({ ...prev, [categoryId]: '' }));
    }
  };

  const handleSaveAllBudgets = () => {
    Object.entries(budgets).forEach(([categoryId, value]) => {
      const amount = parseFloat(value || '0');
      if (amount >= 0) {
        setBudget(categoryId, amount, currentMonth);
      }
    });
    setBudgets({});
  };

  return (
    <Card className="border-none shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-sm font-medium">Budgets - {format(new Date(), 'MMMM yyyy')}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {defaultCategories.map(category => {
            const currentBudget = getBudget(category.id, currentMonth);
            const inputValue = budgets[category.id] || '';
            
            return (
              <div key={category.id} className="flex items-center gap-4 p-3 rounded-lg bg-secondary/20">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: category.color + '15' }}>
                  <span className="text-sm">{category.icon}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-medium">{category.name}</p>
                    {currentBudget > 0 && (
                      <p className="text-xs text-muted-foreground">${currentBudget.toFixed(2)}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      value={inputValue}
                      onChange={(e) => handleBudgetChange(category.id, e.target.value)}
                      placeholder={currentBudget > 0 ? `$${currentBudget.toFixed(2)}` : 'Set budget'}
                      className="h-8 text-xs flex-1"
                    />
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleSaveBudget(category.id)}
                      disabled={!inputValue}
                      className="h-8 text-xs px-3"
                    >
                      Save
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="mt-4 pt-4 border-t">
          <Button 
            onClick={handleSaveAllBudgets}
            className="w-full h-9 text-sm"
            disabled={Object.keys(budgets).length === 0}
          >
            <Target className="w-4 h-4 mr-2" />
            Save All Budgets
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
