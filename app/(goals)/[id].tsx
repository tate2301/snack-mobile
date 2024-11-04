import { Image, StyleSheet, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { SubGoalList } from '@/components/SubGoalList';
import useStore from '@/stores/useStore';
import { MetricProgress } from '@/components/MetricProgress';
import { SaveAsTemplateModal } from '@/components/SaveAsTemplateModal';
import { ReminderForm } from '@/components/ReminderForm';
import NotificationService from '@/services/NotificationService';
import type { IReminder } from '@/services/NotificationService';

export default function GoalDetailsScreen() {
  const { id } = useLocalSearchParams();
  const goal = useStore((state) => state.goals.find(g => g.id === id));
  const isLoading = useStore((state) => state.isLoading);
  const { setIsLoading, setError, deleteGoal } = useStore();
  const router = useRouter();

  const [isTemplateModalVisible, setIsTemplateModalVisible] = useState(false);
  const [isReminderModalVisible, setIsReminderModalVisible] = useState(false);
  const [reminders, setReminders] = useState<IReminder[]>([]);

  useEffect(() => {
    const loadReminders = async () => {
      if (!goal?.id) return;
      const notificationService = NotificationService.getInstance();
      const goalReminders = await notificationService.getReminders(goal.id);
      setReminders(goalReminders);
    };
    
    loadReminders();
  }, [goal?.id]);

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      await deleteGoal(id as string);
      router.back();
    } catch (error) {
      console.error('Error deleting goal:', error);
      setError('Failed to delete goal');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText>Loading goal details...</ThemedText>
      </ThemedView>
    );
  }

  if (!goal) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText>Goal not found</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.wrapper}>
      <ParallaxScrollView
        headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
        headerImage={
          <Image
            source={require('@/assets/images/partial-react-logo.png')}
            style={styles.headerImage}
          />
        }>
        <ThemedView style={styles.container}>
          {/* Goal Header */}
          <ThemedView style={styles.section}>
            <ThemedView style={styles.goalHeader}>
              <ThemedText type="title">{goal.title}</ThemedText>
              <ThemedView style={styles.categoryBadge}>
                <ThemedText style={styles.categoryText}>{goal.category.name}</ThemedText>
              </ThemedView>
            </ThemedView>
            {goal.description && <ThemedText>{goal.description}</ThemedText>}
          </ThemedView>

          {/* Progress Section */}
          <ThemedView style={styles.section}>
            <ThemedText type="subtitle">Progress</ThemedText>
            {goal.metrics.map((metric) => (
              <MetricProgress
                key={metric.id}
                goalId={goal.id}
                metric={metric}
              />
            ))}
          </ThemedView>

          {/* Sub-Goals Section */}
          <SubGoalList goalId={goal.id} />

          {/* Quick Actions */}
          <ThemedView style={styles.section}>
            <ThemedText type="subtitle">Quick Actions</ThemedText>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <ThemedView style={styles.actionButtons}>
                <ThemedView style={styles.actionButton}>
                  <TabBarIcon name="add-circle-outline" color="#FFFFFF" />
                  <ThemedText>Log Progress</ThemedText>
                </ThemedView>
                <ThemedView 
                  style={styles.actionButton}
                  onTouchEnd={() => setIsReminderModalVisible(true)}>
                  <TabBarIcon name="notifications-outline" color="#FFFFFF" />
                  <ThemedText>Reminders</ThemedText>
                </ThemedView>
                <ThemedView 
                  style={styles.actionButton}
                  onTouchEnd={() => router.push(`/(goals)/${goal.id}/reports`)}>
                  <TabBarIcon name="bar-chart-outline" color="#FFFFFF" />
                  <ThemedText>Reports</ThemedText>
                </ThemedView>
                <ThemedView 
                  style={styles.actionButton} 
                  onTouchEnd={() => setIsTemplateModalVisible(true)}>
                  <TabBarIcon name="bookmark-outline" color="#FFFFFF" />
                  <ThemedText>Save as Template</ThemedText>
                </ThemedView>
              </ThemedView>
            </ScrollView>
          </ThemedView>

          {/* Danger Zone */}
          <ThemedView style={[styles.section, styles.dangerZone]}>
            <ThemedText type="subtitle" style={styles.dangerText}>Danger Zone</ThemedText>
            <ThemedView style={styles.dangerButton} onTouchEnd={handleDelete}>
              <TabBarIcon name="trash-outline" color="#FF4444" />
              <ThemedText style={styles.dangerText}>Delete Goal</ThemedText>
            </ThemedView>
          </ThemedView>

          {/* Reminders Section */}
          <ThemedView style={styles.section}>
            <ThemedText type="subtitle">Reminders</ThemedText>
            {reminders.map((reminder) => (
              <ThemedView key={reminder.id} style={styles.reminderItem}>
                <ThemedView>
                  <ThemedText type="defaultSemiBold">{reminder.message}</ThemedText>
                  <ThemedText style={styles.reminderTime}>
                    {new Date(reminder.scheduledTime).toLocaleString()}
                  </ThemedText>
                </ThemedView>
                <TabBarIcon 
                  name="trash-outline" 
                  color="#FF4444" 
                  onPress={() => {
                    const notificationService = NotificationService.getInstance();
                    notificationService.cancelReminder(reminder.id!);
                    setReminders(reminders.filter(r => r.id !== reminder.id));
                  }}
                />
              </ThemedView>
            ))}
            <ThemedView 
              style={styles.actionButton}
              onTouchEnd={() => setIsReminderModalVisible(true)}>
              <TabBarIcon name="add-outline" color="#FFFFFF" />
              <ThemedText>Add Reminder</ThemedText>
            </ThemedView>
          </ThemedView>
        </ThemedView>
      </ParallaxScrollView>

      {/* Modals */}
      <SaveAsTemplateModal
        goal={goal}
        visible={isTemplateModalVisible}
        onClose={() => setIsTemplateModalVisible(false)}
      />
      <ReminderForm
        goalId={goal.id}
        visible={isReminderModalVisible}
        onClose={() => setIsReminderModalVisible(false)}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 16,
    gap: 16,
  },
  section: {
    gap: 8,
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryBadge: {
    backgroundColor: '#A1CEDC',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryText: {
    fontSize: 12,
  },
  progressContainer: {
    gap: 4,
  },
  progressBar: {
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#A1CEDC',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
    paddingVertical: 4,
  },
  actionButton: {
    backgroundColor: '#A1CEDC',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    gap: 4,
    width: 100,
  },
  activityCard: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
  },
  dangerZone: {
    marginTop: 16,
    padding: 16,
    backgroundColor: 'rgba(255,68,68,0.1)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,68,68,0.2)',
  },
  dangerText: {
    color: '#FF4444',
  },
  dangerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    borderRadius: 8,
    backgroundColor: 'rgba(255,68,68,0.1)',
  },
  headerImage: {
    height: 178,
    width: 290,
    position: 'absolute',
    bottom: 0,
    left: 0,
  },
  reminderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  reminderTime: {
    fontSize: 12,
    opacity: 0.7,
  },
}); 