import React, { useState } from 'react';
import { LoginForm } from '../components/auth/LoginForm';
import { SignupForm } from '../components/auth/SignupForm';
import { CheckSquare } from 'lucide-react';

export const Auth: React.FC = () => {
  const [isLoginView, setIsLoginView] = useState(true);
  
  const toggleForm = () => {
    setIsLoginView(!isLoginView);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      {/* Header */}
      <header className="py-4 px-6 bg-white dark:bg-gray-800 shadow">
        <div className="container mx-auto flex items-center">
          <CheckSquare size={28} className="text-indigo-600 dark:text-indigo-400 mr-2" />
          <span className="text-xl font-bold text-gray-900 dark:text-white">TaskMaster</span>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="max-w-4xl w-full mx-auto flex flex-col md:flex-row">
          {/* Left Column - Info */}
          <div className="md:w-1/2 mb-8 md:mb-0 md:pr-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Manage your tasks with ease
            </h1>
            
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              TaskMaster helps you organize your work and personal tasks in one place.
              Stay on top of your deadlines and track your productivity.
            </p>
            
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="flex-shrink-0 h-6 w-6 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 rounded-full flex items-center justify-center mr-3">
                  <span className="text-sm font-bold">1</span>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">Create and organize tasks</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Add tasks, set priorities, and organize them into categories
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 h-6 w-6 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 rounded-full flex items-center justify-center mr-3">
                  <span className="text-sm font-bold">2</span>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">Track your progress</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    See how much you've accomplished and what's left to do
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 h-6 w-6 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 rounded-full flex items-center justify-center mr-3">
                  <span className="text-sm font-bold">3</span>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">Never miss a deadline</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Get notifications for upcoming tasks and stay on schedule
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right Column - Auth Form */}
          <div className="md:w-1/2">
            {isLoginView ? (
              <LoginForm onToggleForm={toggleForm} />
            ) : (
              <SignupForm onToggleForm={toggleForm} />
            )}
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="py-4 px-6 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <div className="container mx-auto text-center text-sm text-gray-600 dark:text-gray-400">
          &copy; {new Date().getFullYear()} TaskMaster. All rights reserved.
        </div>
      </footer>
    </div>
  );
};