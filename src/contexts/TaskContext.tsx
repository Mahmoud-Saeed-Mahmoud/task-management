import React, { createContext, useContext, useState, useEffect } from 'react';
import { Task, SubTask, Priority, Category } from '../types';
import { useAuth } from './AuthContext';

interface TaskContextType {
  tasks: Task[];
  categories: Category[];
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'userId'>) => void;
  updateTask: (taskId: string, updatedTask: Partial<Task>) => void;
  deleteTask: (taskId: string) => void;
  addSubTask: (taskId: string, title: string) => void;
  updateSubTask: (taskId: string, subTaskId: string, completed: boolean) => void;
  deleteSubTask: (taskId: string, subTaskId: string) => void;
  addCategory: (name: string, color: string) => void;
  updateCategory: (categoryId: string, name: string, color: string) => void;
  deleteCategory: (categoryId: string) => void;
}

// Mock data
const DEFAULT_CATEGORIES: Category[] = [
  { id: 'cat-1', name: 'Work', color: '#4F46E5', isDefault: true },
  { id: 'cat-2', name: 'Personal', color: '#0D9488', isDefault: true },
  { id: 'cat-3', name: 'Shopping', color: '#F59E0B', isDefault: true },
  { id: 'cat-4', name: 'Health', color: '#10B981', isDefault: true },
];

const MOCK_TASKS: Task[] = [
  {
    id: 'task-1',
    title: 'Complete project proposal',
    description: 'Finish the quarterly project proposal for the client meeting',
    completed: false,
    dueDate: new Date(Date.now() + 86400000 * 2).toISOString(), // 2 days from now
    createdAt: new Date().toISOString(),
    priority: 'high',
    categoryId: 'cat-1',
    userId: 'user-1',
    subTasks: [
      { id: 'subtask-1', title: 'Research competition', completed: true },
      { id: 'subtask-2', title: 'Draft proposal outline', completed: false },
      { id: 'subtask-3', title: 'Create budget estimation', completed: false },
    ],
  },
  {
    id: 'task-2',
    title: 'Weekly grocery shopping',
    description: 'Buy groceries for the week',
    completed: false,
    dueDate: new Date(Date.now() + 86400000).toISOString(), // 1 day from now
    createdAt: new Date().toISOString(),
    priority: 'medium',
    categoryId: 'cat-3',
    userId: 'user-1',
    subTasks: [
      { id: 'subtask-4', title: 'Make shopping list', completed: true },
      { id: 'subtask-5', title: 'Check pantry for existing items', completed: true },
    ],
  },
  {
    id: 'task-3',
    title: 'Morning workout routine',
    description: '30-minute exercise session',
    completed: true,
    dueDate: new Date().toISOString(), // Today
    createdAt: new Date(Date.now() - 86400000).toISOString(), // Created yesterday
    priority: 'low',
    categoryId: 'cat-4',
    userId: 'user-1',
    subTasks: [],
  },
];

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  // Load data when user changes
  useEffect(() => {
    if (user) {
      // Load tasks from localStorage or use mock data
      const storedTasks = localStorage.getItem(`taskApp_tasks_${user.id}`);
      setTasks(storedTasks ? JSON.parse(storedTasks) : MOCK_TASKS);

      // Load categories from localStorage or use default categories
      const storedCategories = localStorage.getItem(`taskApp_categories_${user.id}`);
      setCategories(storedCategories ? JSON.parse(storedCategories) : DEFAULT_CATEGORIES);
    } else {
      setTasks([]);
      setCategories([]);
    }
  }, [user]);

  // Save data to localStorage when it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem(`taskApp_tasks_${user.id}`, JSON.stringify(tasks));
      localStorage.setItem(`taskApp_categories_${user.id}`, JSON.stringify(categories));
    }
  }, [tasks, categories, user]);

  const addTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'userId'>) => {
    if (!user) return;
    
    const newTask: Task = {
      ...taskData,
      id: `task-${Date.now()}`,
      createdAt: new Date().toISOString(),
      userId: user.id,
    };
    
    setTasks(prevTasks => [...prevTasks, newTask]);
  };

  const updateTask = (taskId: string, updatedTask: Partial<Task>) => {
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === taskId ? { ...task, ...updatedTask } : task
      )
    );
  };

  const deleteTask = (taskId: string) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
  };

  const addSubTask = (taskId: string, title: string) => {
    const newSubTask: SubTask = {
      id: `subtask-${Date.now()}`,
      title,
      completed: false,
    };

    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === taskId 
          ? { ...task, subTasks: [...task.subTasks, newSubTask] } 
          : task
      )
    );
  };

  const updateSubTask = (taskId: string, subTaskId: string, completed: boolean) => {
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === taskId 
          ? { 
              ...task, 
              subTasks: task.subTasks.map(subTask => 
                subTask.id === subTaskId 
                  ? { ...subTask, completed } 
                  : subTask
              ) 
            } 
          : task
      )
    );
  };

  const deleteSubTask = (taskId: string, subTaskId: string) => {
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === taskId 
          ? { 
              ...task, 
              subTasks: task.subTasks.filter(subTask => subTask.id !== subTaskId) 
            } 
          : task
      )
    );
  };

  const addCategory = (name: string, color: string) => {
    const newCategory: Category = {
      id: `cat-${Date.now()}`,
      name,
      color,
      isDefault: false,
    };
    
    setCategories(prevCategories => [...prevCategories, newCategory]);
  };

  const updateCategory = (categoryId: string, name: string, color: string) => {
    setCategories(prevCategories => 
      prevCategories.map(category => 
        category.id === categoryId 
          ? { ...category, name, color } 
          : category
      )
    );
  };

  const deleteCategory = (categoryId: string) => {
    // Check if category is in use
    const categoryInUse = tasks.some(task => task.categoryId === categoryId);
    
    if (categoryInUse) {
      // In a real app, you might want to show a warning or move tasks to a default category
      console.warn('Cannot delete category that is in use');
      return;
    }
    
    // Don't delete default categories
    const categoryToDelete = categories.find(c => c.id === categoryId);
    if (categoryToDelete?.isDefault) {
      console.warn('Cannot delete default categories');
      return;
    }
    
    setCategories(prevCategories => 
      prevCategories.filter(category => category.id !== categoryId)
    );
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        categories,
        addTask,
        updateTask,
        deleteTask,
        addSubTask,
        updateSubTask,
        deleteSubTask,
        addCategory,
        updateCategory,
        deleteCategory,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTask = () => {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTask must be used within a TaskProvider');
  }
  return context;
};