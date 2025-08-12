import { format, isToday, isThisMonth, isThisYear, startOfMonth, endOfMonth, eachDayOfInterval, eachMonthOfInterval, startOfYear, endOfYear } from 'date-fns';

export const formatDate = (date: string): string => {
  return format(new Date(date), 'dd/MM/yyyy');
};

export const formatDateLong = (date: string): string => {
  return format(new Date(date), 'dd MMMM yyyy');
};

export const isExpenseToday = (expenseDate: string): boolean => {
  return isToday(new Date(expenseDate));
};

export const isExpenseThisMonth = (expenseDate: string): boolean => {
  return isThisMonth(new Date(expenseDate));
};

export const isExpenseThisYear = (expenseDate: string): boolean => {
  return isThisYear(new Date(expenseDate));
};

export const getDaysInCurrentMonth = (): Date[] => {
  const today = new Date();
  const start = startOfMonth(today);
  const end = endOfMonth(today);
  return eachDayOfInterval({ start, end });
};

export const getMonthsInCurrentYear = (): Date[] => {
  const today = new Date();
  const start = startOfYear(today);
  const end = endOfYear(today);
  return eachMonthOfInterval({ start, end });
};