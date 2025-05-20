import React, { createContext, useContext, useState, useEffect } from 'react';
import { Notification, Task } from '../types';
import { useAuth } from './AuthContext';

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (notificationId: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (notificationId: string) => void;
  createTaskReminderNotification: (task: Task) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

// Mock notification data
const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: 'notif-1',
    title: 'Task Due Soon',
    message: 'Complete project proposal is due in 2 days',
    read: false,
    createdAt: new Date().toISOString(),
    taskId: 'task-1',
  },
  {
    id: 'notif-2',
    title: 'Reminder',
    message: 'Don\'t forget your weekly grocery shopping tomorrow',
    read: false,
    createdAt: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
    taskId: 'task-2',
  },
];

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    if (user) {
      // Load notifications from localStorage or use mock data
      const storedNotifications = localStorage.getItem(`taskApp_notifications_${user.id}`);
      setNotifications(storedNotifications ? JSON.parse(storedNotifications) : MOCK_NOTIFICATIONS);
    } else {
      setNotifications([]);
    }
  }, [user]);

  // Save notifications to localStorage when they change
  useEffect(() => {
    if (user) {
      localStorage.setItem(`taskApp_notifications_${user.id}`, JSON.stringify(notifications));
    }
  }, [notifications, user]);

  const unreadCount = notifications.filter(notification => !notification.read).length;

  const markAsRead = (notificationId: string) => {
    setNotifications(prevNotifications =>
      prevNotifications.map(notification =>
        notification.id === notificationId
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prevNotifications =>
      prevNotifications.map(notification => ({ ...notification, read: true }))
    );
  };

  const deleteNotification = (notificationId: string) => {
    setNotifications(prevNotifications =>
      prevNotifications.filter(notification => notification.id !== notificationId)
    );
  };

  const createTaskReminderNotification = (task: Task) => {
    const newNotification: Notification = {
      id: `notif-${Date.now()}`,
      title: 'Task Reminder',
      message: `"${task.title}" is due soon`,
      read: false,
      createdAt: new Date().toISOString(),
      taskId: task.id,
    };

    setNotifications(prevNotifications => [newNotification, ...prevNotifications]);
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        createTaskReminderNotification,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};