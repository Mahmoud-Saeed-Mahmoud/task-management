import React from 'react';
import { TaskList } from '../components/tasks/TaskList';
import { MainLayout } from '../components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { useTask } from '../contexts/TaskContext';
import { CategoryManager } from '../components/categories/CategoryManager';

export const Dashboard: React.FC = () => {
  const { tasks } = useTask();
  
  // Statistics
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.completed).length;
  const remainingTasks = totalTasks - completedTasks;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  
  // Task priorities
  const highPriorityTasks = tasks.filter(task => task.priority === 'high').length;
  const mediumPriorityTasks = tasks.filter(task => task.priority === 'medium').length;
  const lowPriorityTasks = tasks.filter(task => task.priority === 'low').length;
  
  // Tasks due soon (next 3 days)
  const currentDate = new Date();
  const threeDaysFromNow = new Date();
  threeDaysFromNow.setDate(currentDate.getDate() + 3);
  
  const tasksDueSoon = tasks.filter(task => {
    if (!task.completed && task.dueDate) {
      const dueDate = new Date(task.dueDate);
      return dueDate >= currentDate && dueDate <= threeDaysFromNow;
    }
    return false;
  }).length;

  return (
    <MainLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Welcome back! Here's an overview of your tasks.
        </p>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">{totalTasks}</div>
            <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-1">Total Tasks</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">{completedTasks}</div>
            <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-1">Completed</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-3xl font-bold text-amber-600 dark:text-amber-400">{remainingTasks}</div>
            <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-1">Remaining</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-end">
              <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">{completionRate}%</div>
              <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1 ml-1">complete</div>
            </div>
            <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-1">Completion Rate</div>
          </CardContent>
        </Card>
      </div>
      
      {/* Second Row - Task Status & Due Soon */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Task Priorities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">High Priority</span>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {highPriorityTasks} tasks
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                  <div 
                    className="bg-rose-500 h-2.5 rounded-full"
                    style={{ width: `${totalTasks > 0 ? (highPriorityTasks / totalTasks) * 100 : 0}%` }}
                  ></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Medium Priority</span>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {mediumPriorityTasks} tasks
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                  <div 
                    className="bg-amber-500 h-2.5 rounded-full"
                    style={{ width: `${totalTasks > 0 ? (mediumPriorityTasks / totalTasks) * 100 : 0}%` }}
                  ></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Low Priority</span>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {lowPriorityTasks} tasks
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                  <div 
                    className="bg-emerald-500 h-2.5 rounded-full"
                    style={{ width: `${totalTasks > 0 ? (lowPriorityTasks / totalTasks) * 100 : 0}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Tasks Due Soon</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center h-32">
              <div className="text-center">
                <div className="text-4xl font-bold text-amber-600 dark:text-amber-400">
                  {tasksDueSoon}
                </div>
                <div className="text-gray-600 dark:text-gray-400 mt-2">
                  {tasksDueSoon === 1 ? 'task' : 'tasks'} due in the next 3 days
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Task List & Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>My Tasks</CardTitle>
            </CardHeader>
            <CardContent>
              <TaskList />
            </CardContent>
          </Card>
        </div>
        
        <div>
          <CategoryManager />
        </div>
      </div>
    </MainLayout>
  );
};