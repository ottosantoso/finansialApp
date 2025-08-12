import React, { useState } from 'react';
import { Plus, Calendar, DollarSign, Tag, CreditCard, FileText } from 'lucide-react';
import { Expense, ExpenseCategory, ExpenseSource } from '../types';

interface ExpenseFormProps {
  onAddExpense: (expense: Expense) => void;
  onCancel?: () => void;
  categories?: ExpenseCategory[];
  sources?: ExpenseSource[];
}

const ExpenseForm: React.FC<ExpenseFormProps> = ({ 
  onAddExpense, 
  onCancel, 
  categories = [], 
  sources = [] 
}) => {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    amount: '',
    categoryId: '',
    sourceId: '',
    notes: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Amount must be greater than 0';
    }

    if (!formData.categoryId) {
      newErrors.categoryId = 'Please select a category';
    }

    if (!formData.sourceId) {
      newErrors.sourceId = 'Please select a source';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const category = categories.find(cat => cat.id === formData.categoryId)!;
    const source = sources.find(src => src.id === formData.sourceId)!;

    const expense: Expense = {
      id: Date.now().toString(),
      date: formData.date,
      amount: parseFloat(formData.amount),
      category,
      source,
      notes: formData.notes,
      createdAt: new Date().toISOString()
    };

    onAddExpense(expense);

    // Reset form
    setFormData({
      date: new Date().toISOString().split('T')[0],
      amount: '',
      categoryId: '',
      sourceId: '',
      notes: ''
    });
    setErrors({});
  };

  const bankSources = sources.filter(source => source.type === 'bank');
  const ewalletSources = sources.filter(source => source.type === 'ewallet');
  const cashSources = sources.filter(source => source.type === 'cash');

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
          <Plus className="w-5 h-5 text-blue-600" />
        </div>
        <h2 className="text-xl font-semibold text-gray-900">Add New Expense</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Date */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <Calendar className="w-4 h-4" />
              Date
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
          </div>

          {/* Amount */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <DollarSign className="w-4 h-4" />
              Amount (IDR)
            </label>
            <input
              type="number"
              placeholder="0"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                errors.amount ? 'border-red-300 bg-red-50' : 'border-gray-200'
              }`}
            />
            {errors.amount && (
              <p className="text-red-500 text-sm mt-1">{errors.amount}</p>
            )}
          </div>
        </div>

        {/* Category */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
            <Tag className="w-4 h-4" />
            Category
          </label>
          <select
            value={formData.categoryId}
            onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
              errors.categoryId ? 'border-red-300 bg-red-50' : 'border-gray-200'
            }`}
          >
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.icon} {category.name}
              </option>
            ))}
          </select>
          {errors.categoryId && (
            <p className="text-red-500 text-sm mt-1">{errors.categoryId}</p>
          )}
        </div>

        {/* Source */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
            <CreditCard className="w-4 h-4" />
            Payment Source
          </label>
          <select
            value={formData.sourceId}
            onChange={(e) => setFormData({ ...formData, sourceId: e.target.value })}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
              errors.sourceId ? 'border-red-300 bg-red-50' : 'border-gray-200'
            }`}
          >
            <option value="">Select payment source</option>
            <optgroup label="🏦 Bank Accounts">
              {bankSources.map((source) => (
                <option key={source.id} value={source.id}>
                  {source.name}
                </option>
              ))}
            </optgroup>
            <optgroup label="📱 E-Wallets">
              {ewalletSources.map((source) => (
                <option key={source.id} value={source.id}>
                  {source.name}
                </option>
              ))}
            </optgroup>
            <optgroup label="💵 Cash">
              {cashSources.map((source) => (
                <option key={source.id} value={source.id}>
                  {source.name}
                </option>
              ))}
            </optgroup>
          </select>
          {errors.sourceId && (
            <p className="text-red-500 text-sm mt-1">{errors.sourceId}</p>
          )}
        </div>

        {/* Notes */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
            <FileText className="w-4 h-4" />
            Notes (Optional)
          </label>
          <textarea
            placeholder="Add notes about this expense..."
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            rows={3}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 bg-gray-100 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-200 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200 font-medium"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 font-medium flex items-center justify-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add Expense
          </button>
        </div>
      </form>
    </div>
  );
};

export default ExpenseForm;