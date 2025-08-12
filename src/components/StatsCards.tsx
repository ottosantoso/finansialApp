import React from 'react';
import { TrendingUp, Calendar, Target, Award } from 'lucide-react';
import { DashboardStats } from '../types';
import { formatCurrency } from '../utils/currency';

interface StatsCardsProps {
  stats: DashboardStats;
}

const StatsCards: React.FC<StatsCardsProps> = ({ stats }) => {
  const cards = [
    {
      title: 'Today',
      value: stats.totalToday,
      icon: Calendar,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'This Month',
      value: stats.totalThisMonth,
      icon: TrendingUp,
      color: 'bg-green-500',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Highest Category',
      value: stats.highestCategory.amount,
      icon: Target,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50',
      subtitle: stats.highestCategory.name
    },
    {
      title: 'Top Source',
      value: stats.topSource.amount,
      icon: Award,
      color: 'bg-orange-500',
      bgColor: 'bg-orange-50',
      subtitle: stats.topSource.name
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {cards.map((card, index) => {
        const IconComponent = card.icon;
        return (
          <div
            key={index}
            className={`${card.bgColor} rounded-xl p-6 border border-gray-100 hover:shadow-md transition-all duration-200`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 ${card.color} rounded-lg flex items-center justify-center`}>
                <IconComponent className="w-5 h-5 text-white" />
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-600 font-medium">{card.title}</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {formatCurrency(card.value)}
              </p>
              {card.subtitle && (
                <p className="text-sm text-gray-500 mt-1">{card.subtitle}</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StatsCards;