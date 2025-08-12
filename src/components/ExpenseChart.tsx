import React, { useEffect, useRef } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';
import { Expense } from '../types';
import { formatCurrency } from '../utils/currency';
import { format, eachDayOfInterval, startOfMonth, endOfMonth, eachMonthOfInterval, startOfYear, endOfYear } from 'date-fns';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

interface ExpenseChartProps {
  expenses: Expense[];
  timeFrame: 'day' | 'month' | 'year';
  chartType: 'trend' | 'category';
}

const ExpenseChart: React.FC<ExpenseChartProps> = ({ expenses, timeFrame, chartType }) => {
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            return `${context.dataset.label}: ${formatCurrency(context.parsed.y || context.parsed)}`;
          },
        },
      },
    },
    scales: chartType === 'trend' ? {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value: any) => formatCurrency(value),
        },
      },
    } : undefined,
  };

  const getTrendChartData = () => {
    let labels: string[] = [];
    let dataPoints: number[] = [];

    if (timeFrame === 'month') {
      const days = eachDayOfInterval({
        start: startOfMonth(new Date()),
        end: endOfMonth(new Date())
      });

      labels = days.map(day => format(day, 'dd'));
      dataPoints = days.map(day => {
        const dayExpenses = expenses.filter(expense => 
          format(new Date(expense.date), 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd')
        );
        return dayExpenses.reduce((sum, expense) => sum + expense.amount, 0);
      });
    } else if (timeFrame === 'year') {
      const months = eachMonthOfInterval({
        start: startOfYear(new Date()),
        end: endOfYear(new Date())
      });

      labels = months.map(month => format(month, 'MMM'));
      dataPoints = months.map(month => {
        const monthExpenses = expenses.filter(expense => 
          format(new Date(expense.date), 'yyyy-MM') === format(month, 'yyyy-MM')
        );
        return monthExpenses.reduce((sum, expense) => sum + expense.amount, 0);
      });
    }

    return {
      labels,
      datasets: [
        {
          label: 'Expenses',
          data: dataPoints,
          backgroundColor: 'rgba(59, 130, 246, 0.5)',
          borderColor: 'rgba(59, 130, 246, 1)',
          borderWidth: 1,
        },
      ],
    };
  };

  const getCategoryChartData = () => {
    const categoryTotals = expenses.reduce((acc, expense) => {
      acc[expense.category.name] = (acc[expense.category.name] || 0) + expense.amount;
      return acc;
    }, {} as Record<string, number>);

    const labels = Object.keys(categoryTotals);
    const data = Object.values(categoryTotals);

    const colors = [
      '#FF6B6B',
      '#4ECDC4',
      '#45B7D1',
      '#96CEB4',
      '#FFEAA7',
      '#DDA0DD',
    ];

    return {
      labels,
      datasets: [
        {
          data,
          backgroundColor: colors.slice(0, labels.length),
          borderColor: colors.slice(0, labels.length),
          borderWidth: 1,
        },
      ],
    };
  };

  const chartData = chartType === 'trend' ? getTrendChartData() : getCategoryChartData();

  return (
    <div className="h-80">
      {chartType === 'trend' ? (
        <Bar data={chartData} options={chartOptions} />
      ) : (
        <Pie data={chartData} options={chartOptions} />
      )}
    </div>
  );
};

export default ExpenseChart;