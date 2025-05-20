import React, { useState } from 'react';
import { Plus, Edit, Trash2, Check } from 'lucide-react';
import { useTask } from '../../contexts/TaskContext';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';

export const CategoryManager: React.FC = () => {
  const { categories, addCategory, updateCategory, deleteCategory } = useTask();
  const [name, setName] = useState('');
  const [color, setColor] = useState('#4F46E5');
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleAddCategory = () => {
    if (!name.trim()) {
      setError('Category name is required');
      return;
    }
    
    addCategory(name.trim(), color);
    resetForm();
  };

  const handleUpdateCategory = () => {
    if (!editingId) return;
    
    if (!name.trim()) {
      setError('Category name is required');
      return;
    }
    
    updateCategory(editingId, name.trim(), color);
    resetForm();
  };

  const startEditing = (id: string, name: string, color: string) => {
    setEditingId(id);
    setName(name);
    setColor(color);
    setError('');
  };

  const handleDeleteCategory = (id: string) => {
    if (confirm('Are you sure you want to delete this category?')) {
      deleteCategory(id);
      if (editingId === id) {
        resetForm();
      }
    }
  };

  const resetForm = () => {
    setName('');
    setColor('#4F46E5');
    setEditingId(null);
    setError('');
  };

  const predefinedColors = [
    '#4F46E5', // Indigo
    '#0D9488', // Teal
    '#F59E0B', // Amber
    '#10B981', // Emerald
    '#F43F5E', // Rose
    '#8B5CF6', // Violet
    '#3B82F6', // Blue
    '#EC4899', // Pink
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Categories</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <Input
              label="Category Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter category name"
              error={error}
              fullWidth
            />
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Color
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="w-10 h-10 rounded-md border border-gray-300 dark:border-gray-700 cursor-pointer p-0"
                />
                <div className="flex flex-wrap gap-2">
                  {predefinedColors.map((presetColor) => (
                    <button
                      key={presetColor}
                      type="button"
                      className={`w-6 h-6 rounded-full transition-transform hover:scale-110 ${
                        color === presetColor ? 'ring-2 ring-offset-2 ring-gray-400' : ''
                      }`}
                      style={{ backgroundColor: presetColor }}
                      onClick={() => setColor(presetColor)}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end space-x-3">
            {editingId ? (
              <>
                <Button
                  variant="outline"
                  onClick={resetForm}
                >
                  Cancel
                </Button>
                <Button
                  variant="success"
                  onClick={handleUpdateCategory}
                  icon={<Check size={16} />}
                >
                  Update Category
                </Button>
              </>
            ) : (
              <Button
                variant="primary"
                onClick={handleAddCategory}
                icon={<Plus size={16} />}
              >
                Add Category
              </Button>
            )}
          </div>
        </div>
        
        <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
          <h3 className="font-medium mb-3">Your Categories</h3>
          <div className="space-y-3">
            {categories.length > 0 ? (
              categories.map((category) => (
                <div
                  key={category.id}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-md group"
                >
                  <div className="flex items-center">
                    <div
                      className="w-4 h-4 rounded-full mr-3"
                      style={{ backgroundColor: category.color }}
                    ></div>
                    <span className="font-medium">{category.name}</span>
                    {category.isDefault && (
                      <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">(Default)</span>
                    )}
                  </div>
                  <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      onClick={() => startEditing(category.id, category.name, category.color)}
                      disabled={category.isDefault}
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      className="text-gray-400 hover:text-rose-500"
                      onClick={() => handleDeleteCategory(category.id)}
                      disabled={category.isDefault}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-6 text-gray-500 dark:text-gray-400">
                No categories yet. Create your first category.
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};