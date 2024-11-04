import { StyleSheet, TextInput, Modal, ScrollView } from 'react-native';
import { useState } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';

import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';
import { TabBarIcon } from './navigation/TabBarIcon';
import NotificationService from '@/services/NotificationService';
import useStore from '@/stores/useStore';

interface ReminderFormProps {
  goalId: string;
  visible: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function ReminderForm({ goalId, visible, onClose, onSuccess }: ReminderFormProps) {
  const [message, setMessage] = useState('');
  const [scheduledTime, setScheduledTime] = useState(new Date());
  const [repeatInterval, setRepeatInterval] = useState<'daily' | 'weekly' | 'monthly' | undefined>();
  const isLoading = useStore((state) => state.isLoading);
  const { setIsLoading, setError } = useStore();

  const handleSubmit = async () => {
    if (!message.trim() || isLoading) return;

    setIsLoading(true);
    try {
      const notificationService = NotificationService.getInstance();
      await notificationService.scheduleReminder({
        goalId,
        message: message.trim(),
        scheduledTime,
        repeatInterval,
        isActive: true,
      });
      
      setMessage('');
      setScheduledTime(new Date());
      setRepeatInterval(undefined);
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error('Error scheduling reminder:', error);
      setError('Failed to schedule reminder');
    } finally {
      setIsLoading(false);
    }
  };

  const repeatOptions: Array<{ value: typeof repeatInterval; label: string }> = [
    { value: undefined, label: 'Once' },
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' },
  ];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}>
      <ThemedView style={styles.modalOverlay}>
        <ScrollView>
          <ThemedView style={styles.modalContent}>
            <ThemedView style={styles.modalHeader}>
              <ThemedText type="subtitle">Set Reminder</ThemedText>
              <TabBarIcon name="close" color="#FFFFFF" onPress={onClose} />
            </ThemedView>

            <ThemedView style={styles.inputContainer}>
              <ThemedText>Message</ThemedText>
              <TextInput
                style={styles.input}
                placeholder="Reminder message..."
                placeholderTextColor="rgba(255,255,255,0.5)"
                value={message}
                onChangeText={setMessage}
                editable={!isLoading}
                maxLength={100}
              />
            </ThemedView>

            <ThemedView style={styles.inputContainer}>
              <ThemedText>Time</ThemedText>
              <DateTimePicker
                value={scheduledTime}
                mode="datetime"
                onChange={(_, date) => date && setScheduledTime(date)}
                minimumDate={new Date()}
                textColor="#FFFFFF"
              />
            </ThemedView>

            <ThemedView style={styles.inputContainer}>
              <ThemedText>Repeat</ThemedText>
              <ThemedView style={styles.repeatOptions}>
                {repeatOptions.map((option) => (
                  <ThemedView
                    key={option.label}
                    style={[
                      styles.repeatOption,
                      repeatInterval === option.value && styles.repeatOptionSelected,
                    ]}
                    onTouchEnd={() => setRepeatInterval(option.value)}>
                    <ThemedText>{option.label}</ThemedText>
                  </ThemedView>
                ))}
              </ThemedView>
            </ThemedView>

            <ThemedView 
              style={[styles.button, !message.trim() && styles.buttonDisabled]}
              onTouchEnd={handleSubmit}>
              <ThemedText type="defaultSemiBold">
                {isLoading ? 'Scheduling...' : 'Set Reminder'}
              </ThemedText>
            </ThemedView>
          </ThemedView>
        </ScrollView>
      </ThemedView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#1D3D47',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 16,
    gap: 16,
    minHeight: '50%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  inputContainer: {
    gap: 4,
  },
  input: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    padding: 12,
    color: '#FFFFFF',
    fontSize: 16,
  },
  repeatOptions: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  repeatOption: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    padding: 8,
    paddingHorizontal: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  repeatOptionSelected: {
    backgroundColor: '#A1CEDC',
  },
  button: {
    backgroundColor: '#A1CEDC',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
}); 