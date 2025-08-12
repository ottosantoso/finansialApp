import React from 'react';
import { Trash2, Calendar, Tag, CreditCard, FileText } from 'lucide-react';
import { Expense } from '../types';
import { formatCurrency } from '../utils/currency';
import { formatDate } from '../utils/dateHelpers';

interface ExpenseListProps {
  expenses: Expense[];
  onDeleteExpense: (id: string) => void;
}

const ExpenseList: React.FC<ExpenseListProps> = ({ expenses, onDeleteExpense }) => {
  if (expenses.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
        <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <FileText className="w-8 h-8 text-gray-400" />
        </div>
        <p className="text-gray-500 text-lg font-medium">No expenses found</p>
        <p className="text-gray-400 mt-2">Add your first expense to get started</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="p-6 border-b border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900">Recent Expenses</h3>
        <p className="text-gray-500 mt-1">{expenses.length} expense(s)</p>
      </div>
      
      <div className="divide-y divide-gray-100 max-h-96 overflow-y-auto">
        {expenses.map((expense) => (
          <div key={expense.id} className="p-6 hover:bg-gray-50 transition-colors duration-200">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{expense.category.icon}</span>
                    <span className="font-medium text-gray-900">{expense.category.name}</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <Calendar className="w-4 h-4" />
                    {formatDate(expense.date)}
                  </div>
                </div>
                
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <span>{expense.source.icon}</span>
                    <span>{expense.source.name}</span>
                  </div>
                  {expense.notes && (
                    <div className="flex items-center gap-1">
                      <FileText className="w-4 h-4" />
                      <span className="truncate max-w-xs">{expense.notes}</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-lg font-semibold text-gray-900">
                    {formatCurrency(expense.amount)}
                  </p>
                </div>
                <button
                  onClick={() => onDeleteExpense(expense.id)}
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200"
                  title="Delete expense"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExpenseList;