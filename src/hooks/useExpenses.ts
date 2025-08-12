import { useState, useEffect } from 'react';
import { Expense, DashboardStats } from '../types';
import { loadExpenses, saveExpenses, addExpense as addExpenseToStorage, deleteExpense as deleteExpenseFromStorage } from '../utils/storage';
import { isExpenseToday, isExpenseThisMonth, isExpenseThisYear } from '../utils/dateHelpers';
import { logExpenseCreated, logExpenseDeleted } from '../utils/historyLogger';

export const useExpenses = (categories: any[] = [], sources: any[] = []) => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadedExpenses = loadExpenses();
    setExpenses(loadedExpenses);
    setLoading(false);
  }, []);

  const addExpense = (expense: Expense) => {
    const newExpenses = [...expenses, expense];
    setExpenses(newExpenses);
    addExpenseToStorage(expense);
    logExpenseCreated(expense);
  };

  const deleteExpense = (id: string) => {
    const expenseToDelete = expenses.find(expense => expense.id === id);
    const filteredExpenses = expenses.filter(expense => expense.id !== id);
    setExpenses(filteredExpenses);
    deleteExpenseFromStorage(id);
    if (expenseToDelete) {
      logExpenseDeleted(expenseToDelete);
    }
  };

  const getDashboardStats = (): DashboardStats => {
    const totalToday = expenses
      .filter(expense => isExpenseToday(expense.date))
      .reduce((sum, expense) => sum + expense.amount, 0);

    const totalThisMonth = expenses
      .filter(expense => isExpenseThisMonth(expense.date))
      .reduce((sum, expense) => sum + expense.amount, 0);

    const totalThisYear = expenses
      .filter(expense => isExpenseThisYear(expense.date))
      .reduce((sum, expense) => sum + expense.amount, 0);

    // Calculate highest category this month
    const monthlyExpenses = expenses.filter(expense => isExpenseThisMonth(expense.date));
    const categoryTotals = monthlyExpenses.reduce((acc, expense) => {
      acc[expense.category.id] = (acc[expense.category.id] || 0) + expense.amount;
      return acc;
    }, {} as Record<string, number>);

    const highestCategoryId = Object.keys(categoryTotals).reduce((a, b) => 
      categoryTotals[a] > categoryTotals[b] ? a : b, Object.keys(categoryTotals)[0]
    );
    const highestCategory = categories.find(cat => cat.id === highestCategoryId) || categories[0] || { name: 'Unknown', id: 'unknown' };

    // Calculate top source this month
    const sourceTotals = monthlyExpenses.reduce((acc, expense) => {
      acc[expense.source.id] = (acc[expense.source.id] || 0) + expense.amount;
      return acc;
    }, {} as Record<string, number>);

    const topSourceId = Object.keys(sourceTotals).reduce((a, b) => 
      sourceTotals[a] > sourceTotals[b] ? a : b, Object.keys(sourceTotals)[0]
    );
    const topSource = sources.find(source => source.id === topSourceId) || sources[0] || { name: 'Unknown', id: 'unknown' };

    return {
      totalToday,
      totalThisMonth,
      totalThisYear,
      highestCategory: {
        name: highestCategory.name,
        amount: categoryTotals[highestCategoryId] || 0
      },
      topSource: {
        name: topSource.name,
        amount: sourceTotals[topSourceId] || 0
      }
    };
  };

  const getFilteredExpenses = (
    timeFrame: 'day' | 'month' | 'year',
    category?: string,
    source?: string
  ): Expense[] => {
    let filtered = expenses;

    // Filter by time frame
    if (timeFrame === 'day') {
      filtered = filtered.filter(expense => isExpenseToday(expense.date));
    } else if (timeFrame === 'month') {
      filtered = filtered.filter(expense => isExpenseThisMonth(expense.date));
    } else if (timeFrame === 'year') {
      filtered = filtered.filter(expense => isExpenseThisYear(expense.date));
    }

    // Filter by category
    if (category && category !== 'all') {
      filtered = filtered.filter(expense => expense.category.id === category);
    }

    // Filter by source
    if (source && source !== 'all') {
      filtered = filtered.filter(expense => expense.source.id === source);
    }

    return filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  };

  return {
    expenses,
    loading,
    addExpense,
    deleteExpense,
    getDashboardStats,
    getFilteredExpenses
  };
};