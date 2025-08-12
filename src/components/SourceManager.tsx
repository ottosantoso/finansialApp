import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Save, X, CreditCard } from 'lucide-react';
import { ExpenseSource } from '../types';

interface SourceManagerProps {
  sources: ExpenseSource[];
  onAddSource: (source: ExpenseSource) => void;
  onUpdateSource: (source: ExpenseSource) => void;
  onDeleteSource: (id: string) => void;
}

const SourceManager: React.FC<SourceManagerProps> = ({
  sources,
  onAddSource,
  onUpdateSource,
  onDeleteSource,
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    type: 'bank' as 'bank' | 'ewallet' | 'cash',
    icon: '🏦'
  });

  const typeIcons = {
    bank: '🏦',
    ewallet: '📱',
    cash: '💵'
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) return;

    const newSource: ExpenseSource = {
      id: editingId || `source-${Date.now()}`,
      name: formData.name.trim(),
      type: formData.type,
      icon: typeIcons[formData.type]
    };

    if (editingId) {
      onUpdateSource(newSource);
      setEditingId(null);
    } else {
      onAddSource(newSource);
      setIsAdding(false);
    }

    setFormData({ name: '', type: 'bank', icon: '🏦' });
  };

  const handleEdit = (source: ExpenseSource) => {
    setFormData({
      name: source.name,
      type: source.type,
      icon: source.icon
    });
    setEditingId(source.id);
    setIsAdding(false);
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingId(null);
    setFormData({ name: '', type: 'bank', icon: '🏦' });
  };

  const handleTypeChange = (type: 'bank' | 'ewallet' | 'cash') => {
    setFormData({
      ...formData,
      type,
      icon: typeIcons[type]
    });
  };

  const groupedSources = {
    bank: sources.filter(s => s.type === 'bank'),
    ewallet: sources.filter(s => s.type === 'ewallet'),
    cash: sources.filter(s => s.type === 'cash')
  };

  const typeLabels = {
    bank: 'Bank Accounts',
    ewallet: 'E-Wallets',
    cash: 'Cash'
  };

  return (
    <div className="space-y-6">
      {/* Add New Source Button */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Payment Sources</h2>
          <p className="text-gray-600 mt-1">{sources.length} payment sources available</p>
        </div>
        {!isAdding && !editingId && (
          <button
            onClick={() => setIsAdding(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Source
          </button>
        )}
      </div>

      {/* Add/Edit Form */}
      {(isAdding || editingId) && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {editingId ? 'Edit Payment Source' : 'Add New Payment Source'}
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Source Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter source name (e.g., BCA, GoPay, Cash)"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Source Type
              </label>
              <div className="grid grid-cols-3 gap-3">
                {Object.entries(typeLabels).map(([type, label]) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => handleTypeChange(type as 'bank' | 'ewallet' | 'cash')}
                    className={`p-3 border rounded-lg text-center transition-all duration-200 ${
                      formData.type === type
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <div className="text-2xl mb-1">{typeIcons[type as keyof typeof typeIcons]}</div>
                    <div className="text-sm font-medium">{label}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleCancel}
                className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors duration-200 flex items-center justify-center gap-2"
              >
                <X className="w-4 h-4" />
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4" />
                {editingId ? 'Update' : 'Add'} Source
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Sources List by Type */}
      <div className="space-y-6">
        {Object.entries(groupedSources).map(([type, typeSources]) => (
          <div key={type} className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{typeIcons[type as keyof typeof typeIcons]}</span>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {typeLabels[type as keyof typeof typeLabels]}
                  </h3>
                  <p className="text-sm text-gray-500">{typeSources.length} sources</p>
                </div>
              </div>
            </div>
            
            {typeSources.length > 0 ? (
              <div className="divide-y divide-gray-100">
                {typeSources.map((source) => (
                  <div key={source.id} className="p-6 hover:bg-gray-50 transition-colors duration-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-xl">
                          {source.icon}
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{source.name}</h4>
                          <p className="text-sm text-gray-500 capitalize">{source.type}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEdit(source)}
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                          title="Edit source"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onDeleteSource(source.id)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                          title="Delete source"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 text-center text-gray-500">
                No {typeLabels[type as keyof typeof typeLabels].toLowerCase()} added yet
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SourceManager;