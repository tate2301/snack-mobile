import { StyleSheet, TextInput, Modal, ScrollView } from 'react-native';
import { useState } from 'react';

import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';
import { TabBarIcon } from './navigation/TabBarIcon';
import { MetricSelector } from './MetricSelector';
import SubGoalService from '@/services/SubGoalService';
import useStore from '@/stores/useStore';
import { categories, goalTypes } from '@/utils/goal-tracking';
import { IGoalMetric } from '@/services/GoalService';

interface AddSubGoalModalProps {
  goalId: string;
  parentCategory: string;
  parentGoalType: string;
  visible: boolean;
  onClose: () => void;
}

export function AddSubGoalModal({ 
  goalId, 
  parentCategory, 
  parentGoalType, 
  visible, 
  onClose 
}: AddSubGoalModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedMetrics, setSelectedMetrics] = useState<IGoalMetric[]>([]);
  const isLoading = useStore((state) => state.isLoading);
  const { setIsLoading, setError } = useStore();

  const category = categories[parentCategory];
  const goalType = goalTypes[parentGoalType];

  const handleSelectMetric = (metric: IGoalMetric) => {
    setSelectedMetrics(prev => 
      prev.some(m => m.id === metric.id)
        ? prev.filter(m => m.id !== metric.id)
        : [...prev, metric]
    );
  };

  const handleSubmit = async () => {
    if (!title.trim() || isLoading || selectedMetrics.length === 0) return;

    setIsLoading(true);
    try {
      const subGoalService = SubGoalService.getInstance();
      await subGoalService.addSubGoal({
        goalId,
        title: title.trim(),
        description: description.trim(),
        metrics: selectedMetrics.map(metric => ({
          id: metric.id,
          currentValue: 0,
          targetValue: metric.targetValue,
          name: metric.name,
          icon: metric.icon,
        })),
        isCompleted: false,
      });
      
      setTitle('');
      setDescription('');
      setSelectedMetrics([]);
      onClose();
    } catch (error) {
      console.error('Error adding sub-goal:', error);
      setError('Failed to add sub-goal');
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = title.trim() && selectedMetrics.length > 0 && !isLoading;

  const handleRemoveMetric = (metricId: string) => {
    setSelectedMetrics(prev => prev.filter(m => m.id !== metricId));
  };

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
              <ThemedText type="subtitle">Add Sub-Goal</ThemedText>
              <TabBarIcon name="close" color="#FFFFFF" onPress={onClose} />
            </ThemedView>

            <ThemedView style={styles.inputContainer}>
              <ThemedText>Title</ThemedText>
              <TextInput
                style={styles.input}
                placeholder="What's the sub-goal?"
                placeholderTextColor="rgba(255,255,255,0.5)"
                value={title}
                onChangeText={setTitle}
                editable={!isLoading}
                maxLength={50}
              />
            </ThemedView>

            <ThemedView style={styles.inputContainer}>
              <ThemedText>Description (Optional)</ThemedText>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Add some details..."
                placeholderTextColor="rgba(255,255,255,0.5)"
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={4}
                editable={!isLoading}
                maxLength={200}
              />
            </ThemedView>

            <MetricSelector
              category={category}
              goalType={goalType}
              selectedMetrics={selectedMetrics}
              onSelectMetric={handleSelectMetric}
              onRemoveMetric={handleRemoveMetric}
            />

            <ThemedView 
              style={[styles.button, !isFormValid && styles.buttonDisabled]}
              onTouchEnd={handleSubmit}>
              <ThemedText type="defaultSemiBold">
                {isLoading ? 'Adding...' : 'Add Sub-Goal'}
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