import { useState, useEffect } from 'react';
import { ExpenseCategory } from '../types';
import { EXPENSE_CATEGORIES } from '../data/constants';
import { logCategoryCreated, logCategoryUpdated, logCategoryDeleted } from '../utils/historyLogger';

const STORAGE_KEY = 'finance-app-categories';

export const useCategories = () => {
  const [categories, setCategories] = useState<ExpenseCategory[]>([]);

  useEffect(() => {
    const loadCategories = () => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          setCategories(JSON.parse(stored));
        } else {
          // Initialize with default categories
          setCategories(EXPENSE_CATEGORIES);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(EXPENSE_CATEGORIES));
        }
      } catch (error) {
        console.error('Error loading categories:', error);
        setCategories(EXPENSE_CATEGORIES);
      }
    };

    loadCategories();
  }, []);

  const saveCategories = (newCategories: ExpenseCategory[]) => {
    setCategories(newCategories);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newCategories));
  };

  const addCategory = (category: ExpenseCategory) => {
    const newCategories = [...categories, category];
    saveCategories(newCategories);
    logCategoryCreated(category);
  };

  const updateCategory = (updatedCategory: ExpenseCategory) => {
    const oldCategory = categories.find(cat => cat.id === updatedCategory.id);
    const newCategories = categories.map(cat => 
      cat.id === updatedCategory.id ? updatedCategory : cat
    );
    saveCategories(newCategories);
    if (oldCategory) {
      logCategoryUpdated(oldCategory, updatedCategory);
    }
  };

  const deleteCategory = (id: string) => {
    const categoryToDelete = categories.find(cat => cat.id === id);
    const newCategories = categories.filter(cat => cat.id !== id);
    saveCategories(newCategories);
    if (categoryToDelete) {
      logCategoryDeleted(categoryToDelete);
    }
  };

  return {
    categories,
    addCategory,
    updateCategory,
    deleteCategory
  };
};