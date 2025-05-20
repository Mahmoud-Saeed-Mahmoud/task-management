import React, { useState, useMemo } from 'react';
import { Plus, Search, Filter, X, CheckCircle } from 'lucide-react';
import { useTask } from '../../contexts/TaskContext';
import { TaskCard } from './TaskCard';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { TaskFormModal } from './TaskFormModal';
import { Select } from '../ui/Select';
import { Checkbox } from '../ui/Checkbox';
import { Badge } from '../ui/Badge';

export const TaskList: React.FC = () => {
  const { tasks, categories } = useTask();
  const [searchTerm, setSearchTerm] = useState('');
  const [showCompleted, setShowCompleted] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedPriority, setSelectedPriority] = useState('');
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Filter and sort tasks
  const filteredTasks = useMemo(() => {
    return tasks
      .filter(task => {
        // Filter by completion status
        if (!showCompleted && task.completed) {
          return false;
        }
        
        // Filter by search term
        if (
          searchTerm &&
          !task.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
          !task.description.toLowerCase().includes(searchTerm.toLowerCase())
        ) {
          return false;
        }
        
        // Filter by category
        if (selectedCategory && task.categoryId !== selectedCategory) {
          return false;
        }
        
        // Filter by priority
        if (selectedPriority && task.priority !== selectedPriority) {
          return false;
        }
        
        return true;
      })
      .sort((a, b) => {
        // Sort completed tasks to the bottom
        if (a.completed !== b.completed) {
          return a.completed ? 1 : -1;
        }
        
        // Sort by due date (null dates at the bottom)
        if (a.dueDate !== b.dueDate) {
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        }
        
        // Sort by priority (high → medium → low)
        const priorityOrder = { high: 0, medium: 1, low: 2 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      });
  }, [tasks, searchTerm, showCompleted, selectedCategory, selectedPriority]);

  const resetFilters = () => {
    setSearchTerm('');
    setShowCompleted(true);
    setSelectedCategory('');
    setSelectedPriority('');
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Count tasks
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.completed).length;
  const remainingTasks = totalTasks - completedTasks;
  
  // Get active filters count
  const activeFiltersCount = [
    !showCompleted,
    !!selectedCategory,
    !!selectedPriority
  ].filter(Boolean).length;

  return (
    <div>
      {/* Search and Filter Bar */}
      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={handleSearchChange}
            leftIcon={<Search size={18} />}
            rightIcon={
              searchTerm ? (
                <button onClick={() => setSearchTerm('')}>
                  <X size={18} />
                </button>
              ) : undefined
            }
            fullWidth
          />
        </div>
        
        <div className="flex gap-2">
          <Button
            variant={isFilterOpen ? 'primary' : 'outline'}
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            icon={<Filter size={18} />}
          >
            Filters
            {activeFiltersCount > 0 && (
              <Badge variant="primary" size="sm" className="ml-2">
                {activeFiltersCount}
              </Badge>
            )}
          </Button>
          
          <Button
            variant="primary"
            onClick={() => setIsFormModalOpen(true)}
            icon={<Plus size={18} />}
          >
            New Task
          </Button>
        </div>
      </div>
      
      {/* Filters Panel */}
      {isFilterOpen && (
        <div className="mb-6 p-4 bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium">Filters</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={resetFilters}
            >
              Reset All
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Checkbox
                checked={showCompleted}
                onChange={setShowCompleted}
                label="Show completed tasks"
              />
            </div>
            
            <Select
              options={[
                { value: '', label: 'All Categories' },
                ...categories.map(category => ({
                  value: category.id,
                  label: category.name,
                }))
              ]}
              value={selectedCategory}
              onChange={setSelectedCategory}
              label="Category"
            />
            
            <Select
              options={[
                { value: '', label: 'All Priorities' },
                { value: 'high', label: 'High Priority' },
                { value: 'medium', label: 'Medium Priority' },
                { value: 'low', label: 'Low Priority' },
              ]}
              value={selectedPriority}
              onChange={setSelectedPriority}
              label="Priority"
            />
          </div>
        </div>
      )}
      
      {/* Task Summary */}
      <div className="mb-6 flex flex-wrap gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow border border-gray-200 dark:border-gray-700 flex-1 min-w-[180px]">
          <div className="text-gray-500 dark:text-gray-400 text-sm font-medium">Total Tasks</div>
          <div className="text-2xl font-bold mt-1">{totalTasks}</div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow border border-gray-200 dark:border-gray-700 flex-1 min-w-[180px]">
          <div className="text-gray-500 dark:text-gray-400 text-sm font-medium">Remaining</div>
          <div className="text-2xl font-bold mt-1 text-indigo-600 dark:text-indigo-400">{remainingTasks}</div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow border border-gray-200 dark:border-gray-700 flex-1 min-w-[180px]">
          <div className="text-gray-500 dark:text-gray-400 text-sm font-medium">Completed</div>
          <div className="text-2xl font-bold mt-1 text-emerald-600 dark:text-emerald-400">
            {completedTasks}
            {totalTasks > 0 && (
              <span className="text-sm font-normal ml-2 text-gray-500">
                ({Math.round((completedTasks / totalTasks) * 100)}%)
              </span>
            )}
          </div>
        </div>
      </div>
      
      {/* Tasks List */}
      <div>
        {filteredTasks.length > 0 ? (
          filteredTasks.map(task => (
            <TaskCard key={task.id} task={task} />
          ))
        ) : (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <CheckCircle size={48} className="mx-auto text-gray-300 dark:text-gray-600" />
            <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-gray-100">
              {searchTerm || selectedCategory || selectedPriority || !showCompleted
                ? 'No tasks match your filters'
                : 'No tasks yet'}
            </h3>
            <p className="mt-2 text-gray-500 dark:text-gray-400">
              {searchTerm || selectedCategory || selectedPriority || !showCompleted
                ? 'Try adjusting your filters or create a new task'
                : 'Get started by creating your first task'}
            </p>
            <Button
              variant="primary"
              className="mt-4"
              onClick={() => setIsFormModalOpen(true)}
              icon={<Plus size={18} />}
            >
              Add Your First Task
            </Button>
          </div>
        )}
      </div>
      
      {/* New Task Modal */}
      <TaskFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
      />
    </div>
  );
};