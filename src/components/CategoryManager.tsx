import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Save, X, Tag } from 'lucide-react';
import { ExpenseCategory } from '../types';
import { EXPENSE_CATEGORIES } from '../data/constants';

interface CategoryManagerProps {
  categories: ExpenseCategory[];
  onAddCategory: (category: ExpenseCategory) => void;
  onUpdateCategory: (category: ExpenseCategory) => void;
  onDeleteCategory: (id: string) => void;
}

const CategoryManager: React.FC<CategoryManagerProps> = ({
  categories,
  onAddCategory,
  onUpdateCategory,
  onDeleteCategory,
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    icon: '📦',
    color: '#DDA0DD'
  });

  const availableIcons = ['🍽️', '🚗', '⚡', '🎬', '🏥', '📦', '🛒', '🎓', '🏠', '💼', '🎯', '🎨'];
  const availableColors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#74B9FF', '#FD79A8'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) return;

    const newCategory: ExpenseCategory = {
      id: editingId || `category-${Date.now()}`,
      name: formData.name.trim(),
      icon: formData.icon,
      color: formData.color
    };

    if (editingId) {
      onUpdateCategory(newCategory);
      setEditingId(null);
    } else {
      onAddCategory(newCategory);
      setIsAdding(false);
    }

    setFormData({ name: '', icon: '📦', color: '#DDA0DD' });
  };

  const handleEdit = (category: ExpenseCategory) => {
    setFormData({
      name: category.name,
      icon: category.icon,
      color: category.color
    });
    setEditingId(category.id);
    setIsAdding(false);
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingId(null);
    setFormData({ name: '', icon: '📦', color: '#DDA0DD' });
  };

  return (
    <div className="space-y-6">
      {/* Add New Category Button */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Categories</h2>
          <p className="text-gray-600 mt-1">{categories.length} categories available</p>
        </div>
        {!isAdding && !editingId && (
          <button
            onClick={() => setIsAdding(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Category
          </button>
        )}
      </div>

      {/* Add/Edit Form */}
      {(isAdding || editingId) && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {editingId ? 'Edit Category' : 'Add New Category'}
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter category name"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Icon
              </label>
              <div className="grid grid-cols-6 gap-2">
                {availableIcons.map((icon) => (
                  <button
                    key={icon}
                    type="button"
                    onClick={() => setFormData({ ...formData, icon })}
                    className={`p-3 text-xl border rounded-lg hover:bg-gray-50 transition-colors duration-200 ${
                      formData.icon === icon ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                    }`}
                  >
                    {icon}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Color
              </label>
              <div className="grid grid-cols-4 gap-2">
                {availableColors.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setFormData({ ...formData, color })}
                    className={`w-12 h-12 rounded-lg border-2 transition-all duration-200 ${
                      formData.color === color ? 'border-gray-400 scale-110' : 'border-gray-200'
                    }`}
                    style={{ backgroundColor: color }}
                  />
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
                {editingId ? 'Update' : 'Add'} Category
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Categories List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">All Categories</h3>
        </div>
        
        <div className="divide-y divide-gray-100">
          {categories.map((category) => (
            <div key={category.id} className="p-6 hover:bg-gray-50 transition-colors duration-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div 
                    className="w-12 h-12 rounded-lg flex items-center justify-center text-xl"
                    style={{ backgroundColor: `${category.color}20`, color: category.color }}
                  >
                    {category.icon}
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{category.name}</h4>
                    <p className="text-sm text-gray-500">Color: {category.color}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleEdit(category)}
                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                    title="Edit category"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDeleteCategory(category.id)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                    title="Delete category"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryManager;