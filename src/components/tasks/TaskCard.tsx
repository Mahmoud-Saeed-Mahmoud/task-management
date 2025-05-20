import React, { useState } from 'react';
import { Edit, Trash2, ChevronDown, ChevronUp, CheckCircle, Circle, Plus } from 'lucide-react';
import { Task, Priority, SubTask } from '../../types';
import { useTask } from '../../contexts/TaskContext';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Card, CardContent } from '../ui/Card';
import { Checkbox } from '../ui/Checkbox';
import { TaskFormModal } from './TaskFormModal';

interface TaskCardProps {
  task: Task;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
  const { updateTask, deleteTask, addSubTask, updateSubTask, deleteSubTask, categories } = useTask();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [newSubTaskTitle, setNewSubTaskTitle] = useState('');

  // Find the category of this task
  const category = categories.find(c => c.id === task.categoryId);
  
  // Calculate progress
  const totalSubTasks = task.subTasks.length;
  const completedSubTasks = task.subTasks.filter(st => st.completed).length;
  const progress = totalSubTasks === 0 ? 0 : Math.round((completedSubTasks / totalSubTasks) * 100);

  // Format date
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'No due date';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Get priority badge color
  const getPriorityColor = (priority: Priority) => {
    switch (priority) {
      case 'high':
        return 'danger';
      case 'medium':
        return 'warning';
      case 'low':
        return 'success';
      default:
        return 'default';
    }
  };

  const toggleTaskCompletion = () => {
    updateTask(task.id, { completed: !task.completed });
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const handleDeleteTask = () => {
    if (confirm('Are you sure you want to delete this task?')) {
      deleteTask(task.id);
    }
  };

  const handleSubTaskChange = (subTaskId: string, completed: boolean) => {
    updateSubTask(task.id, subTaskId, completed);
  };

  const handleAddSubTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSubTaskTitle.trim()) {
      addSubTask(task.id, newSubTaskTitle.trim());
      setNewSubTaskTitle('');
    }
  };

  const handleDeleteSubTask = (subTaskId: string) => {
    deleteSubTask(task.id, subTaskId);
  };

  return (
    <>
      <Card className={`mb-4 transition-all duration-200 ${task.completed ? 'opacity-70' : ''}`}>
        <CardContent className="p-0">
          <div className="p-4">
            <div className="flex items-start">
              <button
                className="mt-1 mr-3 text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400 transition-colors"
                onClick={toggleTaskCompletion}
              >
                {task.completed ? (
                  <CheckCircle size={20} className="text-emerald-500" />
                ) : (
                  <Circle size={20} />
                )}
              </button>
              
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <h3 className={`text-lg font-medium ${task.completed ? 'line-through text-gray-500 dark:text-gray-400' : ''}`}>
                    {task.title}
                  </h3>
                  
                  <div className="flex space-x-2 ml-2">
                    <button
                      className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      onClick={() => setIsEditModalOpen(true)}
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      className="text-gray-400 hover:text-rose-500"
                      onClick={handleDeleteTask}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                
                <div className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                  {task.description}
                </div>
                
                <div className="mt-3 flex flex-wrap gap-2 items-center">
                  <Badge 
                    variant={getPriorityColor(task.priority)}
                    size="sm"
                  >
                    {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                  </Badge>
                  
                  {category && (
                    <Badge
                      variant="outline"
                      size="sm"
                      className="border-0"
                      style={{ backgroundColor: `${category.color}20`, color: category.color }}
                    >
                      {category.name}
                    </Badge>
                  )}
                  
                  <div className="text-xs text-gray-500 dark:text-gray-400 ml-auto">
                    Due: {formatDate(task.dueDate)}
                  </div>
                </div>
                
                {totalSubTasks > 0 && (
                  <div className="mt-3">
                    <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                      <span>{completedSubTasks} of {totalSubTasks} subtasks</span>
                      <span>{progress}%</span>
                    </div>
                    <div className="mt-1 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                      <div
                        className="bg-indigo-600 dark:bg-indigo-500 h-1.5 rounded-full"
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                  </div>
                )}
                
                {task.subTasks.length > 0 && (
                  <button
                    className="mt-3 flex items-center text-sm text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400"
                    onClick={toggleExpand}
                  >
                    {isExpanded ? (
                      <>Hide subtasks <ChevronUp size={16} className="ml-1" /></>
                    ) : (
                      <>Show subtasks <ChevronDown size={16} className="ml-1" /></>
                    )}
                  </button>
                )}
              </div>
            </div>

            {/* Subtasks List */}
            {isExpanded && task.subTasks.length > 0 && (
              <div className="mt-4 ml-8 border-l-2 border-gray-200 dark:border-gray-700 pl-4">
                <ul className="space-y-2">
                  {task.subTasks.map((subTask) => (
                    <li key={subTask.id} className="flex items-center justify-between group">
                      <div className="flex items-center">
                        <Checkbox
                          checked={subTask.completed}
                          onChange={(checked) => handleSubTaskChange(subTask.id, checked)}
                          label={subTask.title}
                          className={subTask.completed ? 'line-through text-gray-400' : ''}
                        />
                      </div>
                      <button
                        className="hidden group-hover:block text-gray-400 hover:text-rose-500"
                        onClick={() => handleDeleteSubTask(subTask.id)}
                      >
                        <Trash2 size={14} />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Add new subtask */}
            {isExpanded && (
              <form onSubmit={handleAddSubTask} className="mt-3 ml-8 pl-4 flex items-center">
                <input
                  type="text"
                  value={newSubTaskTitle}
                  onChange={(e) => setNewSubTaskTitle(e.target.value)}
                  placeholder="Add a subtask..."
                  className="flex-1 text-sm border-b border-gray-300 dark:border-gray-700 focus:border-indigo-500 dark:focus:border-indigo-500 bg-transparent py-1 outline-none"
                />
                <Button
                  type="submit"
                  variant="ghost"
                  size="sm"
                  icon={<Plus size={16} />}
                  className="ml-2"
                  disabled={!newSubTaskTitle.trim()}
                >
                  Add
                </Button>
              </form>
            )}
          </div>
        </CardContent>
      </Card>
      
      {isEditModalOpen && (
        <TaskFormModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          taskToEdit={task}
        />
      )}
    </>
  );
};