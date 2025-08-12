import React, { useState } from 'react';
import { BarChart3, PieChart, TrendingUp } from 'lucide-react';
import { Expense } from '../types';
import ExpenseChart from './ExpenseChart';

interface ChartSectionProps {
  expenses: Expense[];
  timeFrame: 'day' | 'month' | 'year';
}

const ChartSection: React.FC<ChartSectionProps> = ({ expenses, timeFrame }) => {
  const [chartType, setChartType] = useState<'trend' | 'category'>('trend');

  const chartTypes = [
    {
      id: 'trend' as const,
      label: 'Trend Analysis',
      icon: BarChart3,
      description: 'View spending trends over time'
    },
    {
      id: 'category' as const,
      label: 'Category Distribution',
      icon: PieChart,
      description: 'See spending breakdown by category'
    }
  ];

  if (expenses.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
        <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <TrendingUp className="w-8 h-8 text-gray-400" />
        </div>
        <p className="text-gray-500 text-lg font-medium">No data to display</p>
        <p className="text-gray-400 mt-2">Add some expenses to see analytics</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Analytics</h3>
          <p className="text-gray-500 mt-1">Visual insights into your spending patterns</p>
        </div>
        
        <div className="flex items-center gap-2">
          {chartTypes.map((type) => {
            const IconComponent = type.icon;
            return (
              <button
                key={type.id}
                onClick={() => setChartType(type.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  chartType === type.id
                    ? 'bg-blue-100 text-blue-700 border border-blue-200'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                title={type.description}
              >
                <IconComponent className="w-4 h-4" />
                <span className="hidden sm:inline">{type.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <ExpenseChart
        expenses={expenses}
        timeFrame={timeFrame}
        chartType={chartType}
      />
    </div>
  );
};

export default ChartSection;