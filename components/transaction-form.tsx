'use client';

import { useState } from 'react';
import { Transaction } from '@/lib/types';
import { defaultCategories } from '@/lib/categories';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface TransactionFormProps {
  onSubmit: (transaction: Omit<Transaction, 'id'>) => void;
  editTransaction?: Transaction;
  onCancel?: () => void;
}

export const TransactionForm = ({ onSubmit, editTransaction, onCancel }: TransactionFormProps) => {
  const [amount, setAmount] = useState(editTransaction?.amount?.toString() || '');
  const [date, setDate] = useState(editTransaction?.date || new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState(editTransaction?.description || '');
  const [category, setCategory] = useState(editTransaction?.category || '');
  const [type, setType] = useState<'expense' | 'income'>(editTransaction?.type || 'expense');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!amount || parseFloat(amount) <= 0) {
      newErrors.amount = 'Amount must be greater than 0';
    }
    if (!date) {
      newErrors.date = 'Date is required';
    }
    if (!description.trim()) {
      newErrors.description = 'Description is required';
    }
    if (!category) {
      newErrors.category = 'Category is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;

    onSubmit({
      amount: parseFloat(amount),
      date,
      description: description.trim(),
      category,
      type,
    });

    if (!editTransaction) {
      setAmount('');
      setDate(new Date().toISOString().split('T')[0]);
      setDescription('');
      setCategory('');
      setType('expense');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label>Type</Label>
        <RadioGroup value={type} onValueChange={(value) => setType(value as 'expense' | 'income')} className="flex gap-2">
          <Label htmlFor="expense" className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg cursor-pointer border transition-all duration-150 ${type === 'expense' ? 'border-red-200 bg-red-50 text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400' : 'border-border text-muted-foreground hover:border-muted-foreground/30'}`}>
            <RadioGroupItem value="expense" id="expense" className="sr-only" />
            <ArrowUpRight className="w-4 h-4" />
            <span className="text-sm font-medium cursor-pointer">Expense</span>
          </Label>
          <Label htmlFor="income" className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg cursor-pointer border transition-all duration-150 ${type === 'income' ? 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-400' : 'border-border text-muted-foreground hover:border-muted-foreground/30'}`}>
            <RadioGroupItem value="income" id="income" className="sr-only" />
            <ArrowDownRight className="w-4 h-4" />
            <span className="text-sm font-medium cursor-pointer">Income</span>
          </Label>
        </RadioGroup>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label htmlFor="amount">Amount</Label>
          <Input
            id="amount"
            type="number"
            step="0.01"
            min="0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            className={`h-9 text-sm ${errors.amount ? 'border-red-500' : ''}`}
          />
          {errors.amount && <p className="text-xs text-red-500">{errors.amount}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="date">Date</Label>
          <Input
            id="date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className={`h-9 text-sm ${errors.date ? 'border-red-500' : ''}`}
          />
          {errors.date && <p className="text-xs text-red-500">{errors.date}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Input
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="What was this for?"
          className={`h-9 text-sm ${errors.description ? 'border-red-500' : ''}`}
        />
        {errors.description && <p className="text-xs text-red-500">{errors.description}</p>}
      </div>

      <div className="space-y-2">
        <Label>Category</Label>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className={`h-9 text-sm ${errors.category ? 'border-red-500' : ''}`}>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {defaultCategories.map((cat) => (
              <SelectItem key={cat.id} value={cat.id}>
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.color }} />
                  {cat.icon} {cat.name}
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.category && <p className="text-xs text-red-500">{errors.category}</p>}
      </div>

      <div className="flex gap-2 pt-1">
        <Button type="submit" className="flex-1 h-9 text-sm">
          {editTransaction ? 'Update' : 'Add Transaction'}
        </Button>
        {editTransaction && onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} className="h-9 text-sm">
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
};
