import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import useStore from '@/stores/useStore';
import { router } from 'expo-router';

export interface IReminder {
  id?: string;
  goalId: string;
  message: string;
  scheduledTime: Date;
  repeatInterval?: 'daily' | 'weekly' | 'monthly';
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

class NotificationService {
  private static instance: NotificationService;

  private constructor() {
    this.initializeNotifications();
  }

  public static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  private async initializeNotifications() {
    // Request permissions
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== 'granted') {
      console.warn('Notification permissions not granted');
      return;
    }

    // Configure notification behavior
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
      }),
    });

    // Update notification tap handler
    Notifications.addNotificationResponseReceivedListener((response) => {
      const data = response.notification.request.content.data;
      if (data.goalId) {
        // Navigate to goal details using expo-router
        router.push(`/(goals)/${data.goalId}`);
      }
    });
  }

  public async scheduleReminder(reminder: IReminder): Promise<void> {
    const trigger = this.calculateTrigger(reminder.scheduledTime, reminder.repeatInterval);
    
    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Goal Reminder',
        body: reminder.message,
        data: { goalId: reminder.goalId },
      },
      trigger,
    });

    const newReminder: IReminder = {
      ...reminder,
      id: notificationId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    useStore.getState().addReminder(newReminder);
  }

  public async cancelReminder(reminderId: string): Promise<void> {
    await Notifications.cancelScheduledNotificationAsync(reminderId);
    useStore.getState().deleteReminder(reminderId);
  }

  public async getReminders(goalId: string): Promise<IReminder[]> {
    return useStore.getState().reminders.filter(r => r.goalId === goalId);
  }

  private calculateTrigger(scheduledTime: Date, repeatInterval?: 'daily' | 'weekly' | 'monthly') {
    const seconds = Math.floor((scheduledTime.getTime() - Date.now()) / 1000);
    
    switch (repeatInterval) {
      case 'daily':
        return {
          hour: scheduledTime.getHours(),
          minute: scheduledTime.getMinutes(),
          repeats: true,
        };
      case 'weekly':
        return {
          weekday: scheduledTime.getDay() + 1,
          hour: scheduledTime.getHours(),
          minute: scheduledTime.getMinutes(),
          repeats: true,
        };
      case 'monthly':
        return {
          day: scheduledTime.getDate(),
          hour: scheduledTime.getHours(),
          minute: scheduledTime.getMinutes(),
          repeats: true,
        };
      default:
        return {
          seconds: Math.max(seconds, 0),
        };
    }
  }
}

export default NotificationService; 