import { Expense } from '../types';

const STORAGE_KEY = 'finance-app-expenses';

export const saveExpenses = (expenses: Expense[]): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
};

export const loadExpenses = (): Expense[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading expenses:', error);
    return [];
  }
};

export const addExpense = (expense: Expense): void => {
  const expenses = loadExpenses();
  expenses.push(expense);
  saveExpenses(expenses);
};

export const deleteExpense = (id: string): void => {
  const expenses = loadExpenses();
  const filtered = expenses.filter(expense => expense.id !== id);
  saveExpenses(filtered);
};