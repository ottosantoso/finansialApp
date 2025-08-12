export interface Expense {
  id: string;
  date: string;
  amount: number;
  category: ExpenseCategory;
  source: ExpenseSource;
  notes?: string;
  createdAt: string;
}

export interface ExpenseCategory {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export interface ExpenseSource {
  id: string;
  name: string;
  type: 'bank' | 'ewallet' | 'cash';
  icon: string;
}

export interface DashboardStats {
  totalToday: number;
  totalThisMonth: number;
  totalThisYear: number;
  highestCategory: {
    name: string;
    amount: number;
  };
  topSource: {
    name: string;
    amount: number;
  };
}

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string | string[];
    borderColor?: string;
    borderWidth?: number;
  }[];
}

export interface HistoryLog {
  id: string;
  action: 'create' | 'update' | 'delete';
  entityType: 'expense' | 'category' | 'source';
  entityId: string;
  entityName: string;
  details: string;
  oldData?: any;
  newData?: any;
  timestamp: string;
  amount?: number;
}