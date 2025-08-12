import { ExpenseCategory, ExpenseSource } from '../types';

export const EXPENSE_CATEGORIES: ExpenseCategory[] = [
  {
    id: 'food-drinks',
    name: 'Food & Drinks',
    icon: '🍽️',
    color: '#FF6B6B'
  },
  {
    id: 'transportation',
    name: 'Transportation',
    icon: '🚗',
    color: '#4ECDC4'
  },
  {
    id: 'bills-utilities',
    name: 'Bills & Utilities',
    icon: '⚡',
    color: '#45B7D1'
  },
  {
    id: 'entertainment',
    name: 'Entertainment',
    icon: '🎬',
    color: '#96CEB4'
  },
  {
    id: 'health',
    name: 'Health',
    icon: '🏥',
    color: '#FFEAA7'
  },
  {
    id: 'others',
    name: 'Others',
    icon: '📦',
    color: '#DDA0DD'
  }
];

export const EXPENSE_SOURCES: ExpenseSource[] = [
  // Bank Accounts
  {
    id: 'bri',
    name: 'BRI',
    type: 'bank',
    icon: '🏦'
  },
  {
    id: 'mandiri',
    name: 'Mandiri',
    type: 'bank',
    icon: '🏦'
  },
  {
    id: 'bca',
    name: 'BCA',
    type: 'bank',
    icon: '🏦'
  },
  {
    id: 'bni',
    name: 'BNI',
    type: 'bank',
    icon: '🏦'
  },
  // E-Wallets
  {
    id: 'gopay',
    name: 'GoPay',
    type: 'ewallet',
    icon: '📱'
  },
  {
    id: 'ovo',
    name: 'OVO',
    type: 'ewallet',
    icon: '📱'
  },
  {
    id: 'shopeepay',
    name: 'ShopeePay',
    type: 'ewallet',
    icon: '📱'
  },
  {
    id: 'linkaja',
    name: 'LinkAja',
    type: 'ewallet',
    icon: '📱'
  },
  // Cash
  {
    id: 'cash',
    name: 'Cash',
    type: 'cash',
    icon: '💵'
  }
];