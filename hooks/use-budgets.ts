'use client';

import { useState, useEffect } from 'react';
import { Budget } from '@/lib/types';

export const useBudgets = () => {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBudgets = async () => {
    try {
      const response = await fetch('/api/budgets');
      if (response.ok) {
        const data = await response.json();
        setBudgets(data);
      }
    } catch (error) {
      console.error('Error fetching budgets:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBudgets();
  }, []);

  const setBudget = async (categoryId: string, amount: number, month: string) => {
    try {
      const response = await fetch('/api/budgets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ categoryId, amount, month }),
      });

      if (response.ok) {
        // Update local state
        setBudgets(prev => {
          const existing = prev.find(b => b.categoryId === categoryId && b.month === month);
          if (existing) {
            return prev.map(b =>
              b.categoryId === categoryId && b.month === month
                ? { ...b, amount }
                : b
            );
          } else {
            return [...prev, { categoryId, amount, month }];
          }
        });
      }
    } catch (error) {
      console.error('Error setting budget:', error);
    }
  };

  const getBudget = (categoryId: string, month: string): number => {
    const budget = budgets.find(b => b.categoryId === categoryId && b.month === month);
    return budget?.amount || 0;
  };

  return {
    budgets,
    loading,
    setBudget,
    getBudget,
    refetch: fetchBudgets,
  };
};