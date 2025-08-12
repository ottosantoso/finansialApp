import React from 'react';
import { Filter, Calendar, Tag, CreditCard } from 'lucide-react';
import { ExpenseCategory, ExpenseSource } from '../types';

interface FilterControlsProps {
  timeFrame: 'day' | 'month' | 'year';
  category: string;
  source: string;
  categories?: ExpenseCategory[];
  sources?: ExpenseSource[];
  onTimeFrameChange: (timeFrame: 'day' | 'month' | 'year') => void;
  onCategoryChange: (category: string) => void;
  onSourceChange: (source: string) => void;
}

const FilterControls: React.FC<FilterControlsProps> = ({
  timeFrame,
  category,
  source,
  categories = [],
  sources = [],
  onTimeFrameChange,
  onCategoryChange,
  onSourceChange,
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
          <Filter className="w-4 h-4 text-gray-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Time Frame */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
            <Calendar className="w-4 h-4" />
            Time Period
          </label>
          <select
            value={timeFrame}
            onChange={(e) => onTimeFrameChange(e.target.value as 'day' | 'month' | 'year')}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          >
            <option value="day">Today</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
          </select>
        </div>

        {/* Category */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
            <Tag className="w-4 h-4" />
            Category
          </label>
          <select
            value={category}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          >
            <option value="all">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.icon} {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Source */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
            <CreditCard className="w-4 h-4" />
            Source
          </label>
          <select
            value={source}
            onChange={(e) => onSourceChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          >
            <option value="all">All Sources</option>
            <optgroup label="🏦 Bank Accounts">
              {sources.filter(s => s.type === 'bank').map((source) => (
                <option key={source.id} value={source.id}>
                  {source.name}
                </option>
              ))}
            </optgroup>
            <optgroup label="📱 E-Wallets">
              {sources.filter(s => s.type === 'ewallet').map((source) => (
                <option key={source.id} value={source.id}>
                  {source.name}
                </option>
              ))}
            </optgroup>
            <optgroup label="💵 Cash">
              {sources.filter(s => s.type === 'cash').map((source) => (
                <option key={source.id} value={source.id}>
                  {source.name}
                </option>
              ))}
            </optgroup>
          </select>
        </div>
      </div>
    </div>
  );
};

export default FilterControls;