import React, { useState, useEffect } from 'react';
import { History, Clock, Plus, Edit, Trash2, Filter, Calendar, TrendingUp, Activity } from 'lucide-react';
import { HistoryLog as HistoryLogType } from '../types';
import { loadHistoryLogs, clearHistoryLogs } from '../utils/historyLogger';
import { formatCurrency } from '../utils/currency';
import { format, isToday, isThisWeek, isThisMonth } from 'date-fns';

const HistoryLog: React.FC = () => {
  const [logs, setLogs] = useState<HistoryLogType[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<HistoryLogType[]>([]);
  const [filter, setFilter] = useState({
    action: 'all',
    entityType: 'all',
    timeFrame: 'all'
  });

  useEffect(() => {
    const loadLogs = () => {
      const historyLogs = loadHistoryLogs();
      setLogs(historyLogs);
      setFilteredLogs(historyLogs);
    };

    loadLogs();
    
    // Refresh logs every 5 seconds to catch new activities
    const interval = setInterval(loadLogs, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let filtered = [...logs];

    // Filter by action
    if (filter.action !== 'all') {
      filtered = filtered.filter(log => log.action === filter.action);
    }

    // Filter by entity type
    if (filter.entityType !== 'all') {
      filtered = filtered.filter(log => log.entityType === filter.entityType);
    }

    // Filter by time frame
    if (filter.timeFrame !== 'all') {
      const now = new Date();
      filtered = filtered.filter(log => {
        const logDate = new Date(log.timestamp);
        switch (filter.timeFrame) {
          case 'today':
            return isToday(logDate);
          case 'week':
            return isThisWeek(logDate);
          case 'month':
            return isThisMonth(logDate);
          default:
            return true;
        }
      });
    }

    setFilteredLogs(filtered);
  }, [logs, filter]);

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'create':
        return <Plus className="w-4 h-4" />;
      case 'update':
        return <Edit className="w-4 h-4" />;
      case 'delete':
        return <Trash2 className="w-4 h-4" />;
      default:
        return <Activity className="w-4 h-4" />;
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'create':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'update':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'delete':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getEntityIcon = (entityType: string) => {
    switch (entityType) {
      case 'expense':
        return '💰';
      case 'category':
        return '🏷️';
      case 'source':
        return '💳';
      default:
        return '📝';
    }
  };

  const getStats = () => {
    const today = logs.filter(log => isToday(new Date(log.timestamp)));
    const thisWeek = logs.filter(log => isThisWeek(new Date(log.timestamp)));
    const thisMonth = logs.filter(log => isThisMonth(new Date(log.timestamp)));

    const actionCounts = logs.reduce((acc, log) => {
      acc[log.action] = (acc[log.action] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      total: logs.length,
      today: today.length,
      thisWeek: thisWeek.length,
      thisMonth: thisMonth.length,
      creates: actionCounts.create || 0,
      updates: actionCounts.update || 0,
      deletes: actionCounts.delete || 0
    };
  };

  const handleClearHistory = () => {
    if (window.confirm('Are you sure you want to clear all history logs? This action cannot be undone.')) {
      clearHistoryLogs();
      setLogs([]);
      setFilteredLogs([]);
    }
  };

  const stats = getStats();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Activity History</h1>
          <p className="text-gray-600">Track all changes and activities in your finance app</p>
        </div>
        <button
          onClick={handleClearHistory}
          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors duration-200 flex items-center gap-2"
        >
          <Trash2 className="w-4 h-4" />
          Clear History
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
              <Activity className="w-5 h-5 text-white" />
            </div>
          </div>
          <div>
            <p className="text-sm text-gray-600 font-medium">Total Activities</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{stats.total}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-white" />
            </div>
          </div>
          <div>
            <p className="text-sm text-gray-600 font-medium">Today</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{stats.today}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
          </div>
          <div>
            <p className="text-sm text-gray-600 font-medium">This Week</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{stats.thisWeek}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-white" />
            </div>
          </div>
          <div>
            <p className="text-sm text-gray-600 font-medium">This Month</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{stats.thisMonth}</p>
          </div>
        </div>
      </div>

      {/* Action Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-green-50 rounded-xl border border-green-200 p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
              <Plus className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm text-green-700 font-medium">Created</p>
              <p className="text-2xl font-bold text-green-900">{stats.creates}</p>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 rounded-xl border border-blue-200 p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
              <Edit className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm text-blue-700 font-medium">Updated</p>
              <p className="text-2xl font-bold text-blue-900">{stats.updates}</p>
            </div>
          </div>
        </div>

        <div className="bg-red-50 rounded-xl border border-red-200 p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center">
              <Trash2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm text-red-700 font-medium">Deleted</p>
              <p className="text-2xl font-bold text-red-900">{stats.deletes}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
            <Filter className="w-4 h-4 text-gray-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Action</label>
            <select
              value={filter.action}
              onChange={(e) => setFilter({ ...filter, action: e.target.value })}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Actions</option>
              <option value="create">Created</option>
              <option value="update">Updated</option>
              <option value="delete">Deleted</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
            <select
              value={filter.entityType}
              onChange={(e) => setFilter({ ...filter, entityType: e.target.value })}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Types</option>
              <option value="expense">Expenses</option>
              <option value="category">Categories</option>
              <option value="source">Payment Sources</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Time Frame</label>
            <select
              value={filter.timeFrame}
              onChange={(e) => setFilter({ ...filter, timeFrame: e.target.value })}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
            </select>
          </div>
        </div>
      </div>

      {/* History List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">Activity Log</h3>
          <p className="text-gray-500 mt-1">{filteredLogs.length} activities</p>
        </div>

        {filteredLogs.length === 0 ? (
          <div className="p-8 text-center">
            <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <History className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-500 text-lg font-medium">No activities found</p>
            <p className="text-gray-400 mt-2">Activities will appear here as you use the app</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100 max-h-96 overflow-y-auto">
            {filteredLogs.map((log) => (
              <div key={log.id} className="p-6 hover:bg-gray-50 transition-colors duration-200">
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-lg border flex items-center justify-center ${getActionColor(log.action)}`}>
                    {getActionIcon(log.action)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg">{getEntityIcon(log.entityType)}</span>
                      <span className="font-medium text-gray-900 capitalize">{log.action}</span>
                      <span className="text-gray-500">•</span>
                      <span className="text-sm text-gray-500 capitalize">{log.entityType}</span>
                    </div>
                    
                    <p className="text-gray-700 mb-2">{log.details}</p>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {format(new Date(log.timestamp), 'dd/MM/yyyy HH:mm')}
                      </div>
                      {log.amount && (
                        <div className="flex items-center gap-1">
                          <span>💰</span>
                          {formatCurrency(log.amount)}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoryLog;