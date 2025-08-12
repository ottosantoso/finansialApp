import { HistoryLog } from '../types';

const HISTORY_STORAGE_KEY = 'finance-app-history';

export const saveHistoryLogs = (logs: HistoryLog[]): void => {
  localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(logs));
};

export const loadHistoryLogs = (): HistoryLog[] => {
  try {
    const stored = localStorage.getItem(HISTORY_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading history logs:', error);
    return [];
  }
};

export const addHistoryLog = (log: Omit<HistoryLog, 'id' | 'timestamp'>): void => {
  const logs = loadHistoryLogs();
  const newLog: HistoryLog = {
    ...log,
    id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    timestamp: new Date().toISOString()
  };
  
  logs.unshift(newLog); // Add to beginning for newest first
  
  // Keep only last 1000 logs to prevent storage bloat
  if (logs.length > 1000) {
    logs.splice(1000);
  }
  
  saveHistoryLogs(logs);
};

export const clearHistoryLogs = (): void => {
  localStorage.removeItem(HISTORY_STORAGE_KEY);
};

// Helper functions for common log types
export const logExpenseCreated = (expense: any): void => {
  addHistoryLog({
    action: 'create',
    entityType: 'expense',
    entityId: expense.id,
    entityName: `${expense.category.name} - ${expense.amount}`,
    details: `Added expense of ${new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(expense.amount)} for ${expense.category.name}`,
    newData: expense,
    amount: expense.amount
  });
};

export const logExpenseDeleted = (expense: any): void => {
  addHistoryLog({
    action: 'delete',
    entityType: 'expense',
    entityId: expense.id,
    entityName: `${expense.category.name} - ${expense.amount}`,
    details: `Deleted expense of ${new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(expense.amount)} for ${expense.category.name}`,
    oldData: expense,
    amount: expense.amount
  });
};

export const logCategoryCreated = (category: any): void => {
  addHistoryLog({
    action: 'create',
    entityType: 'category',
    entityId: category.id,
    entityName: category.name,
    details: `Created new category "${category.name}" with icon ${category.icon}`,
    newData: category
  });
};

export const logCategoryUpdated = (oldCategory: any, newCategory: any): void => {
  addHistoryLog({
    action: 'update',
    entityType: 'category',
    entityId: newCategory.id,
    entityName: newCategory.name,
    details: `Updated category "${oldCategory.name}" to "${newCategory.name}"`,
    oldData: oldCategory,
    newData: newCategory
  });
};

export const logCategoryDeleted = (category: any): void => {
  addHistoryLog({
    action: 'delete',
    entityType: 'category',
    entityId: category.id,
    entityName: category.name,
    details: `Deleted category "${category.name}"`,
    oldData: category
  });
};

export const logSourceCreated = (source: any): void => {
  addHistoryLog({
    action: 'create',
    entityType: 'source',
    entityId: source.id,
    entityName: source.name,
    details: `Created new payment source "${source.name}" (${source.type})`,
    newData: source
  });
};

export const logSourceUpdated = (oldSource: any, newSource: any): void => {
  addHistoryLog({
    action: 'update',
    entityType: 'source',
    entityId: newSource.id,
    entityName: newSource.name,
    details: `Updated payment source "${oldSource.name}" to "${newSource.name}"`,
    oldData: oldSource,
    newData: newSource
  });
};

export const logSourceDeleted = (source: any): void => {
  addHistoryLog({
    action: 'delete',
    entityType: 'source',
    entityId: source.id,
    entityName: source.name,
    details: `Deleted payment source "${source.name}"`,
    oldData: source
  });
};