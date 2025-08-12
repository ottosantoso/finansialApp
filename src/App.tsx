import React, { useState } from 'react';
import { Wallet, Plus, BarChart3, List, Menu, X, Tag, CreditCard, History } from 'lucide-react';
import { useExpenses } from './hooks/useExpenses';
import { useCategories } from './hooks/useCategories';
import { useSources } from './hooks/useSources';
import ExpenseForm from './components/ExpenseForm';
import StatsCards from './components/StatsCards';
import FilterControls from './components/FilterControls';
import ChartSection from './components/ChartSection';
import ExpenseList from './components/ExpenseList';
import CategoryManager from './components/CategoryManager';
import SourceManager from './components/SourceManager';
import HistoryLog from './components/HistoryLog';

type ActiveTab = 'dashboard' | 'add' | 'analytics' | 'expenses' | 'categories' | 'sources' | 'history';

function App() {
  const { categories, addCategory, updateCategory, deleteCategory } = useCategories();
  const { sources, addSource, updateSource, deleteSource } = useSources();
  const { expenses, addExpense, deleteExpense, getDashboardStats, getFilteredExpenses } = useExpenses(categories, sources);
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [timeFrame, setTimeFrame] = useState<'day' | 'month' | 'year'>('month');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sourceFilter, setSourceFilter] = useState('all');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const stats = getDashboardStats();
  const filteredExpenses = getFilteredExpenses(timeFrame, categoryFilter, sourceFilter);

  const navigationItems = [
    {
      id: 'dashboard' as const,
      label: 'Dashboard',
      icon: BarChart3,
      description: 'Overview and statistics'
    },
    {
      id: 'add' as const,
      label: 'Add Expense',
      icon: Plus,
      description: 'Record new expense'
    },
    {
      id: 'analytics' as const,
      label: 'Analytics',
      icon: BarChart3,
      description: 'Charts and insights'
    },
    {
      id: 'expenses' as const,
      label: 'Expenses',
      icon: List,
      description: 'View all expenses'
    },
    {
      id: 'categories' as const,
      label: 'Categories',
      icon: Tag,
      description: 'Manage expense categories'
    },
    {
      id: 'sources' as const,
      label: 'Payment Sources',
      icon: CreditCard,
      description: 'Manage payment sources'
    },
    {
      id: 'history' as const,
      label: 'History Log',
      icon: History,
      description: 'View activity history'
    }
  ];

  const handleAddExpense = (expense: any) => {
    addExpense(expense);
    setActiveTab('expenses'); // Redirect to expenses list after adding
  };

  const handleCancelAddExpense = () => {
    setActiveTab('expenses'); // Go back to expenses list
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Financial Dashboard</h1>
              <p className="text-gray-600">Welcome back! Here's your spending overview.</p>
            </div>
            <StatsCards stats={stats} />
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <ChartSection expenses={expenses.filter(e => e.date >= new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString())} timeFrame="month" />
              <ExpenseList
                expenses={expenses.slice(0, 5)}
                onDeleteExpense={deleteExpense}
              />
            </div>
          </div>
        );

      case 'add':
        return (
          <div className="max-w-2xl">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Add New Expense</h1>
              <p className="text-gray-600">Record your latest expense with detailed information.</p>
            </div>
            <ExpenseForm 
              onAddExpense={handleAddExpense}
              onCancel={handleCancelAddExpense}
              categories={categories}
              sources={sources}
            />
          </div>
        );

      case 'analytics':
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Analytics & Insights</h1>
              <p className="text-gray-600">Analyze your spending patterns with detailed charts and filters.</p>
            </div>
            <FilterControls
              timeFrame={timeFrame}
              category={categoryFilter}
              source={sourceFilter}
              onTimeFrameChange={setTimeFrame}
              onCategoryChange={setCategoryFilter}
              onSourceChange={setSourceFilter}
            />
            <ChartSection expenses={filteredExpenses} timeFrame={timeFrame} />
          </div>
        );

      case 'expenses':
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">All Expenses</h1>
              <p className="text-gray-600">View and manage all your recorded expenses.</p>
            </div>
            <FilterControls
              timeFrame={timeFrame}
              category={categoryFilter}
              source={sourceFilter}
              onTimeFrameChange={setTimeFrame}
              onCategoryChange={setCategoryFilter}
              onSourceChange={setSourceFilter}
            />
            <ExpenseList
              expenses={filteredExpenses}
              onDeleteExpense={deleteExpense}
            />
          </div>
        );

      case 'categories':
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Manage Categories</h1>
              <p className="text-gray-600">Add, edit, or remove expense categories.</p>
            </div>
            <CategoryManager
              categories={categories}
              onAddCategory={addCategory}
              onUpdateCategory={updateCategory}
              onDeleteCategory={deleteCategory}
            />
          </div>
        );

      case 'sources':
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Manage Payment Sources</h1>
              <p className="text-gray-600">Add, edit, or remove payment sources.</p>
            </div>
            <SourceManager
              sources={sources}
              onAddSource={addSource}
              onUpdateSource={updateSource}
              onDeleteSource={deleteSource}
            />
          </div>
        );

      case 'history':
        return <HistoryLog />;

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white shadow-sm border-b border-gray-200 px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Wallet className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-gray-900">FinanceApp</h1>
          </div>
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            <Menu className="w-6 h-6 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black bg-opacity-50" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <div className={`lg:fixed lg:inset-y-0 lg:left-0 lg:z-40 lg:w-72 lg:transform-none fixed inset-y-0 left-0 z-50 w-72 transform transition-transform duration-300 ease-in-out ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0`}>
        <div className="flex flex-col h-full bg-white shadow-xl">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                <Wallet className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">FinanceApp</h1>
                <p className="text-sm text-gray-500">Personal Finance Manager</p>
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigationItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200 ${
                    activeTab === item.id
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <IconComponent className="w-5 h-5" />
                  <div>
                    <div className="font-medium">{item.label}</div>
                    <div className="text-xs text-gray-500">{item.description}</div>
                  </div>
                </button>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-6 border-t border-gray-200">
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-xl border border-blue-100">
              <h3 className="font-semibold text-gray-900 mb-1">Quick Stats</h3>
              <p className="text-sm text-gray-600">
                {expenses.length} total expenses recorded
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:ml-72">
        <main className="p-4 lg:p-8">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

export default App;