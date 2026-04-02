'use client';

import { useEffect, useMemo, useState } from 'react';
import { Transaction } from '@/lib/types';
import { defaultCategories } from '@/lib/categories';
import { normalizeRole } from '@/lib/roles';
import { useTransactions } from '@/hooks/use-transactions';
import { TransactionForm } from '@/components/transaction-form';
import { TransactionList } from '@/components/transaction-list';
import { DashboardStats } from '@/components/dashboard-stats';
import { InsightsSection } from '@/components/insights-section';
import { MonthlyExpensesChart } from '@/components/charts/monthly-expenses-chart';
import { CategoryPieChart } from '@/components/charts/category-pie-chart';
import { BudgetComparisonChart } from '@/components/charts/budget-comparison-chart';
import { BudgetManager } from '@/components/budget-manager';
import { ThemeToggle } from '@/components/theme-toggle';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UserButton, useUser } from '@clerk/nextjs';
import { BarChart3, Download, PieChart, Settings, Wallet, Search, SlidersHorizontal, X } from 'lucide-react';

type TransactionTypeFilter = 'all' | 'income' | 'expense';

export default function DashboardPage() {
  const { user, isLoaded } = useUser();
  const { transactions, loading, addTransaction, updateTransaction, deleteTransaction } = useTransactions();
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [isUpdatingRole, setIsUpdatingRole] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<TransactionTypeFilter>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [startDateFilter, setStartDateFilter] = useState('');
  const [endDateFilter, setEndDateFilter] = useState('');
  const [minAmountFilter, setMinAmountFilter] = useState('');
  const [maxAmountFilter, setMaxAmountFilter] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const selectedRole = normalizeRole(user?.publicMetadata?.role);
  const isAdmin = selectedRole === 'admin';

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const persistedType = localStorage.getItem('ui:typeFilter') as TransactionTypeFilter | null;
    const persistedCategory = localStorage.getItem('ui:categoryFilter');
    const persistedStartDate = localStorage.getItem('ui:startDateFilter');
    const persistedEndDate = localStorage.getItem('ui:endDateFilter');
    const persistedMinAmount = localStorage.getItem('ui:minAmountFilter');
    const persistedMaxAmount = localStorage.getItem('ui:maxAmountFilter');

    if (persistedType === 'all' || persistedType === 'income' || persistedType === 'expense') {
      setTypeFilter(persistedType);
    }
    if (persistedCategory) {
      setCategoryFilter(persistedCategory);
    }
    if (persistedStartDate) {
      setStartDateFilter(persistedStartDate);
    }
    if (persistedEndDate) {
      setEndDateFilter(persistedEndDate);
    }
    if (persistedMinAmount) {
      setMinAmountFilter(persistedMinAmount);
    }
    if (persistedMaxAmount) {
      setMaxAmountFilter(persistedMaxAmount);
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    localStorage.setItem('ui:typeFilter', typeFilter);
    localStorage.setItem('ui:categoryFilter', categoryFilter);
    localStorage.setItem('ui:startDateFilter', startDateFilter);
    localStorage.setItem('ui:endDateFilter', endDateFilter);
    localStorage.setItem('ui:minAmountFilter', minAmountFilter);
    localStorage.setItem('ui:maxAmountFilter', maxAmountFilter);
  }, [typeFilter, categoryFilter, startDateFilter, endDateFilter, minAmountFilter, maxAmountFilter]);

  useEffect(() => {
    if (!isAdmin) {
      setEditingTransaction(null);
    }
  }, [isAdmin]);

  const filteredTransactions = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    return transactions.filter((transaction) => {
      const categoryName = defaultCategories.find((cat) => cat.id === transaction.category)?.name || '';

      const matchesSearch = normalizedQuery.length === 0 ||
        transaction.description.toLowerCase().includes(normalizedQuery) ||
        categoryName.toLowerCase().includes(normalizedQuery);

      const matchesType = typeFilter === 'all' || transaction.type === typeFilter;
      const matchesCategory = categoryFilter === 'all' || transaction.category === categoryFilter;
      const transactionDate = new Date(transaction.date);

      const matchesStartDate = startDateFilter.length === 0 || transactionDate >= new Date(startDateFilter);
      const matchesEndDate = endDateFilter.length === 0 || transactionDate <= new Date(endDateFilter);

      const amount = Number(transaction.amount);
      const minAmount = minAmountFilter.length > 0 ? Number(minAmountFilter) : null;
      const maxAmount = maxAmountFilter.length > 0 ? Number(maxAmountFilter) : null;
      const matchesMinAmount = minAmount === null || amount >= minAmount;
      const matchesMaxAmount = maxAmount === null || amount <= maxAmount;

      return (
        matchesSearch &&
        matchesType &&
        matchesCategory &&
        matchesStartDate &&
        matchesEndDate &&
        matchesMinAmount &&
        matchesMaxAmount
      );
    });
  }, [
    transactions,
    searchQuery,
    typeFilter,
    categoryFilter,
    startDateFilter,
    endDateFilter,
    minAmountFilter,
    maxAmountFilter,
  ]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setTypeFilter('all');
    setCategoryFilter('all');
    setStartDateFilter('');
    setEndDateFilter('');
    setMinAmountFilter('');
    setMaxAmountFilter('');
  };

  const downloadFile = (content: string, filename: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = filename;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    URL.revokeObjectURL(url);
  };

  const handleExportJson = () => {
    const content = JSON.stringify(filteredTransactions, null, 2);
    downloadFile(content, 'transactions-export.json', 'application/json');
  };

  const handleExportCsv = () => {
    const headers = ['id', 'date', 'description', 'category', 'type', 'amount'];
    const escape = (value: string) => `"${value.replace(/"/g, '""')}"`;

    const rows = filteredTransactions.map((transaction) => {
      return [
        transaction.id,
        transaction.date,
        transaction.description,
        transaction.category,
        transaction.type,
        transaction.amount.toString(),
      ]
        .map(escape)
        .join(',');
    });

    const content = [headers.join(','), ...rows].join('\n');
    downloadFile(content, 'transactions-export.csv', 'text/csv;charset=utf-8;');
  };

  const handleAddTransaction = async (transaction: Omit<Transaction, 'id'>) => {
    if (!isAdmin) return;

    const result = await addTransaction(transaction);
    if (result) {
      console.log('Transaction added successfully');
    }
  };

  const handleUpdateTransaction = async (transaction: Omit<Transaction, 'id'>) => {
    if (!isAdmin) return;

    if (editingTransaction) {
      await updateTransaction(editingTransaction.id!, transaction);
      setEditingTransaction(null);
    }
  };

  const handleEditTransaction = (transaction: Transaction) => {
    if (!isAdmin) return;
    setEditingTransaction(transaction);
  };

  const handleCancelEdit = () => {
    setEditingTransaction(null);
  };

  const handleDeleteTransaction = async (id: string) => {
    if (!isAdmin) return;

    if (window.confirm('Are you sure you want to delete this transaction?')) {
      await deleteTransaction(id);
    }
  };

  const handleRoleChange = async (role: 'admin' | 'viewer') => {
    if (!user || role === selectedRole) {
      return;
    }

    try {
      setIsUpdatingRole(true);

      const response = await fetch('/api/me/role', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role }),
      });

      if (!response.ok) {
        console.error('Failed to update role:', response.statusText);
        return;
      }

      await user.reload();
    } catch (error) {
      console.error('Error updating role:', error);
    } finally {
      setIsUpdatingRole(false);
    }
  };

  const activeFilterCount = [typeFilter !== 'all', categoryFilter !== 'all', startDateFilter, endDateFilter, minAmountFilter, maxAmountFilter].filter(Boolean).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-2 border-primary/20 border-t-primary rounded-full animate-spin mx-auto"></div>
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-2 border-primary/20 border-t-primary rounded-full animate-spin mx-auto"></div>
          <p className="text-sm text-muted-foreground">Loading account...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">WealthWise</h1>
            <p className="text-base sm:text-lg text-muted-foreground mt-2">Track your income, expenses, and savings</p>
          </div>
          <div className="flex items-center flex-wrap sm:flex-nowrap gap-2 sm:gap-3">
            <Select value={selectedRole} onValueChange={(value) => handleRoleChange(value as 'admin' | 'viewer')} disabled={isUpdatingRole}>
              <SelectTrigger className="w-[130px] h-9 text-xs sm:text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="viewer">Viewer</SelectItem>
              </SelectContent>
            </Select>
            <ThemeToggle />
            <UserButton afterSignOutUrl="/" />
          </div>
        </div>

        <Tabs defaultValue="dashboard" className="space-y-8">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 h-auto bg-secondary/50 p-1 rounded-lg gap-1">
            <TabsTrigger value="dashboard" className="text-xs sm:text-sm py-2.5 data-[state=active]:bg-background data-[state=active]:shadow-sm">
              <BarChart3 className="w-4 h-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="transactions" className="text-xs sm:text-sm py-2.5 data-[state=active]:bg-background data-[state=active]:shadow-sm">
              <Wallet className="w-4 h-4 mr-2" />
              Transactions
            </TabsTrigger>
            <TabsTrigger value="analytics" className="text-xs sm:text-sm py-2.5 data-[state=active]:bg-background data-[state=active]:shadow-sm">
              <PieChart className="w-4 h-4 mr-2" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="budgets" className="text-xs sm:text-sm py-2.5 data-[state=active]:bg-background data-[state=active]:shadow-sm">
              <Settings className="w-4 h-4 mr-2" />
              Budgets
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-8 animate-in fade-in-50 duration-300">
            <DashboardStats transactions={transactions} />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <MonthlyExpensesChart transactions={transactions} />
              <CategoryPieChart transactions={transactions} />
            </div>
            <InsightsSection transactions={transactions} />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="border-none shadow-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="text-sm font-medium">{isAdmin ? 'Quick Add' : 'Add Disabled'}</CardTitle>
                </CardHeader>
                <CardContent>
                  {isAdmin ? (
                    <TransactionForm onSubmit={handleAddTransaction} />
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Your account role is viewer. Ask an admin to grant write access.
                    </p>
                  )}
                </CardContent>
              </Card>
              <Card className="border-none shadow-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <TransactionList
                    transactions={transactions.slice(0, 5)}
                    onEdit={isAdmin ? handleEditTransaction : undefined}
                    onDelete={isAdmin ? handleDeleteTransaction : undefined}
                    canEdit={isAdmin}
                  />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="transactions" className="space-y-8 animate-in fade-in-50 duration-300">
            <Card className="border-none shadow-sm">
              <CardHeader className="pb-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <CardTitle className="text-sm font-medium">Transactions</CardTitle>
                  <div className="flex items-center flex-wrap gap-2">
                    <Button variant="outline" size="sm" className="h-8 text-xs" onClick={() => setShowFilters(!showFilters)}>
                      <SlidersHorizontal className="w-3.5 h-3.5 mr-1.5" />
                      Filters
                      {activeFilterCount > 0 && (
                        <span className="ml-1.5 w-4 h-4 rounded-full bg-primary text-primary-foreground text-[10px] flex items-center justify-center">
                          {activeFilterCount}
                        </span>
                      )}
                    </Button>
                    <Button variant="outline" size="sm" className="h-8 text-xs" onClick={handleExportCsv}>
                      <Download className="w-3.5 h-3.5 mr-1.5" />
                      CSV
                    </Button>
                    <Button variant="outline" size="sm" className="h-8 text-xs" onClick={handleExportJson}>
                      <Download className="w-3.5 h-3.5 mr-1.5" />
                      JSON
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search transactions..."
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    className="pl-9 h-10 text-sm"
                  />
                </div>

                {showFilters && (
                  <div className="space-y-4 pt-4 border-t animate-in fade-in-50 duration-200">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      <Select value={typeFilter} onValueChange={(value) => setTypeFilter(value as TransactionTypeFilter)}>
                        <SelectTrigger className="h-9 text-sm">
                          <SelectValue placeholder="Type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Types</SelectItem>
                          <SelectItem value="income">Income</SelectItem>
                          <SelectItem value="expense">Expense</SelectItem>
                        </SelectContent>
                      </Select>
                      <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                        <SelectTrigger className="h-9 text-sm">
                          <SelectValue placeholder="Category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Categories</SelectItem>
                          {defaultCategories.map((category) => (
                            <SelectItem key={category.id} value={category.id}>
                              {category.icon} {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Input type="date" value={startDateFilter} onChange={(event) => setStartDateFilter(event.target.value)} className="h-9 text-sm" placeholder="From date" />
                      <Input type="date" value={endDateFilter} onChange={(event) => setEndDateFilter(event.target.value)} className="h-9 text-sm" placeholder="To date" />
                      <Input type="number" min="0" step="0.01" placeholder="Min amount" value={minAmountFilter} onChange={(event) => setMinAmountFilter(event.target.value)} className="h-9 text-sm" />
                      <Input type="number" min="0" step="0.01" placeholder="Max amount" value={maxAmountFilter} onChange={(event) => setMaxAmountFilter(event.target.value)} className="h-9 text-sm" />
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-muted-foreground pr-3">
                        {filteredTransactions.length} of {transactions.length} transactions
                      </p>
                      {activeFilterCount > 0 && (
                        <Button variant="ghost" size="sm" className="h-7 text-xs text-muted-foreground" onClick={handleResetFilters}>
                          <X className="w-3 h-3 mr-1" />
                          Clear filters
                        </Button>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
              <div className="xl:col-span-2">
                <TransactionList
                  transactions={filteredTransactions}
                  onEdit={isAdmin ? handleEditTransaction : undefined}
                  onDelete={isAdmin ? handleDeleteTransaction : undefined}
                  canEdit={isAdmin}
                />
              </div>
              <div className="xl:col-span-2 space-y-8">
                {isAdmin ? (
                  <Card className="border-none shadow-sm">
                    <CardHeader className="pb-4">
                      <CardTitle className="text-sm font-medium">{editingTransaction ? 'Edit Transaction' : 'Add Transaction'}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <TransactionForm
                        key={editingTransaction ? editingTransaction.id : 'new'}
                        onSubmit={editingTransaction ? handleUpdateTransaction : handleAddTransaction}
                        editTransaction={editingTransaction || undefined}
                        onCancel={editingTransaction ? handleCancelEdit : undefined}
                      />
                    </CardContent>
                  </Card>
                ) : (
                  <Card className="border-none shadow-sm">
                    <CardHeader className="pb-4">
                      <CardTitle className="text-sm font-medium">Read-only</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        Your account role is viewer. Ask an admin to grant write access.
                      </p>
                    </CardContent>
                  </Card>
                )}
                <DashboardStats transactions={transactions} />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-8 animate-in fade-in-50 duration-300">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <MonthlyExpensesChart transactions={transactions} />
              <CategoryPieChart transactions={transactions} />
            </div>
            <InsightsSection transactions={transactions} />
            <BudgetComparisonChart transactions={transactions} />
          </TabsContent>

          <TabsContent value="budgets" className="space-y-8 animate-in fade-in-50 duration-300">
            {isAdmin ? (
              <BudgetManager />
            ) : (
              <Card className="border-none shadow-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="text-sm font-medium">Budget Manager</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Your account role is viewer. Ask an admin to grant write access.
                  </p>
                </CardContent>
              </Card>
            )}
            <BudgetComparisonChart transactions={transactions} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
