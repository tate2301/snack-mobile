import { StyleSheet, TextInput, Modal } from 'react-native';
import { useState } from 'react';

import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';
import { TabBarIcon } from './navigation/TabBarIcon';
import { IGoalMetric } from '@/services/GoalService';
import useStore from '@/stores/useStore';

interface ProgressInputProps {
  goalId: string;
  metric: IGoalMetric;
  visible: boolean;
  onClose: () => void;
}

export function ProgressInput({ goalId, metric, visible, onClose }: ProgressInputProps) {
  const [value, setValue] = useState('');
  const [notes, setNotes] = useState('');
  const isLoading = useStore((state) => state.isLoading);
  const { setIsLoading, setError, updateGoal } = useStore();

  const handleSubmit = async () => {
    if (!value.trim() || isLoading) return;

    setIsLoading(true);
    try {
      const numericValue = parseFloat(value);
      if (isNaN(numericValue)) {
        throw new Error('Invalid numeric value');
      }

      await updateGoal(goalId, {
        metrics: [
          {
            ...metric,
            currentValue: numericValue,
          },
        ],
      });

      setValue('');
      setNotes('');
      onClose();
    } catch (error) {
      console.error('Error logging progress:', error);
      setError('Failed to log progress');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}>
      <ThemedView style={styles.modalOverlay}>
        <ThemedView style={styles.modalContent}>
          <ThemedView style={styles.modalHeader}>
            <ThemedText type="subtitle">Log Progress</ThemedText>
            <TabBarIcon name="close" color="#FFFFFF" onPress={onClose} />
          </ThemedView>

          <ThemedView style={styles.inputContainer}>
            <ThemedText>Current Value: {metric.currentValue}</ThemedText>
            <ThemedText>Target Value: {metric.targetValue}</ThemedText>
            <TextInput
              style={styles.input}
              placeholder="Enter new value"
              placeholderTextColor="rgba(255,255,255,0.5)"
              value={value}
              onChangeText={setValue}
              keyboardType="numeric"
              editable={!isLoading}
            />
          </ThemedView>

          <ThemedView style={styles.inputContainer}>
            <ThemedText>Notes (Optional)</ThemedText>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Add some notes..."
              placeholderTextColor="rgba(255,255,255,0.5)"
              value={notes}
              onChangeText={setNotes}
              multiline
              numberOfLines={4}
              editable={!isLoading}
            />
          </ThemedView>

          <ThemedView 
            style={[styles.button, !value.trim() && styles.buttonDisabled]}
            onTouchEnd={handleSubmit}>
            <ThemedText type="defaultSemiBold">
              {isLoading ? 'Saving...' : 'Save Progress'}
            </ThemedText>
          </ThemedView>
        </ThemedView>
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
  textArea: {
    height: 100,
    textAlignVertical: 'top',
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