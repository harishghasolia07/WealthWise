'use client';

import { useState } from 'react';
import { defaultCategories } from '@/lib/categories';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useBudgets } from '@/hooks/use-budgets';
import { format } from 'date-fns';
import { Settings, Target } from 'lucide-react';

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
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="w-5 h-5" />
          Budget Manager - {format(new Date(), 'MMMM yyyy')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {defaultCategories.map(category => {
            const currentBudget = getBudget(category.id, currentMonth);
            const inputValue = budgets[category.id] || '';
            
            return (
              <div key={category.id} className="flex items-center gap-3 p-3 border rounded-lg">
                <div className="text-2xl">{category.icon}</div>
                <div className="flex-1">
                  <Label htmlFor={`budget-${category.id}`} className="text-sm font-medium">
                    {category.name}
                  </Label>
                  <div className="flex items-center gap-2 mt-1">
                    <Input
                      id={`budget-${category.id}`}
                      type="number"
                      min="0"
                      step="0.01"
                      value={inputValue}
                      onChange={(e) => handleBudgetChange(category.id, e.target.value)}
                      placeholder={currentBudget > 0 ? `$${currentBudget.toFixed(2)}` : '0.00'}
                      className="h-8"
                    />
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleSaveBudget(category.id)}
                      disabled={!inputValue}
                      className="h-8"
                    >
                      Set
                    </Button>
                  </div>
                  {currentBudget > 0 && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Current: ${currentBudget.toFixed(2)}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="mt-4 pt-4 border-t">
          <Button 
            onClick={handleSaveAllBudgets}
            className="w-full"
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