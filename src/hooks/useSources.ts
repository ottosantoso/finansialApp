import { useState, useEffect } from 'react';
import { ExpenseSource } from '../types';
import { EXPENSE_SOURCES } from '../data/constants';
import { logSourceCreated, logSourceUpdated, logSourceDeleted } from '../utils/historyLogger';

const STORAGE_KEY = 'finance-app-sources';

export const useSources = () => {
  const [sources, setSources] = useState<ExpenseSource[]>([]);

  useEffect(() => {
    const loadSources = () => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          setSources(JSON.parse(stored));
        } else {
          // Initialize with default sources
          setSources(EXPENSE_SOURCES);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(EXPENSE_SOURCES));
        }
      } catch (error) {
        console.error('Error loading sources:', error);
        setSources(EXPENSE_SOURCES);
      }
    };

    loadSources();
  }, []);

  const saveSources = (newSources: ExpenseSource[]) => {
    setSources(newSources);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newSources));
  };

  const addSource = (source: ExpenseSource) => {
    const newSources = [...sources, source];
    saveSources(newSources);
    logSourceCreated(source);
  };

  const updateSource = (updatedSource: ExpenseSource) => {
    const oldSource = sources.find(src => src.id === updatedSource.id);
    const newSources = sources.map(src => 
      src.id === updatedSource.id ? updatedSource : src
    );
    saveSources(newSources);
    if (oldSource) {
      logSourceUpdated(oldSource, updatedSource);
    }
  };

  const deleteSource = (id: string) => {
    const sourceToDelete = sources.find(src => src.id === id);
    const newSources = sources.filter(src => src.id !== id);
    saveSources(newSources);
    if (sourceToDelete) {
      logSourceDeleted(sourceToDelete);
    }
  };

  return {
    sources,
    addSource,
    updateSource,
    deleteSource
  };
};