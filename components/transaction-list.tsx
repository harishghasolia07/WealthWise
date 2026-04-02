'use client';

import { Transaction } from '@/lib/types';
import { defaultCategories } from '@/lib/categories';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, Calendar, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { format } from 'date-fns';

interface TransactionListProps {
  transactions: Transaction[];
  onEdit?: (transaction: Transaction) => void;
  onDelete?: (id: string) => void;
  canEdit?: boolean;
}

export const TransactionList = ({ transactions, onEdit, onDelete, canEdit = true }: TransactionListProps) => {
  if (transactions.length === 0) {
    return (
      <Card className="border-none shadow-sm">
        <CardContent className="p-12 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full border-2 border-dashed border-muted-foreground/20 flex items-center justify-center">
            <Calendar className="w-6 h-6 text-muted-foreground/50" />
          </div>
          <p className="text-sm font-medium text-foreground">No transactions</p>
          <p className="text-xs text-muted-foreground mt-1">Add your first transaction to get started</p>
        </CardContent>
      </Card>
    );
  }

  const getCategoryInfo = (categoryId: string) => {
    return defaultCategories.find(cat => cat.id === categoryId) || defaultCategories[0];
  };

  const sortedTransactions = [...transactions].sort((a, b) =>
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <Card className="border-none shadow-sm">
      <CardContent className="p-0">
        <div className="divide-y">
          {sortedTransactions.map((transaction) => {
            const category = getCategoryInfo(transaction.category);

            return (
              <div
                key={transaction.id}
                className="group flex items-start sm:items-center justify-between px-3 sm:px-4 py-3.5 hover:bg-secondary/30 transition-colors duration-150"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: category.color + '15' }}>
                    <span className="text-base">{category.icon}</span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{transaction.description}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs text-muted-foreground">{format(new Date(transaction.date), 'MMM d, yyyy')}</span>
                      <span className="w-1 h-1 rounded-full bg-muted-foreground/30" />
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: category.color }} />
                        {category.name}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0 ml-3">
                  <div className="text-right">
                    <p className={`text-xs sm:text-sm font-semibold ${transaction.type === 'income' ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                      {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toFixed(2)}
                    </p>
                  </div>
                  {canEdit && onEdit && onDelete && (
                    <div className="flex gap-0.5 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-150">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEdit(transaction)}
                        className="h-7 w-7 p-0"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDelete(transaction.id)}
                        className="h-7 w-7 p-0 text-red-500 hover:text-red-600"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
