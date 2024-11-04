import React, { useCallback, useState } from 'react';
import { StyleSheet } from 'react-native';
import DraggableFlatList, { 
  ScaleDecorator,
  RenderItemParams,
} from 'react-native-draggable-flatlist';

import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';
import { TabBarIcon } from './navigation/TabBarIcon';
import { AddSubGoalModal } from './AddSubGoalModal';
import SubGoalService, { ISubGoal } from '@/services/SubGoalService';
import useStore from '@/stores/useStore';
import { goalTypes } from '@/utils/goal-tracking';
import { categories } from '@/utils/goal-tracking';

interface SubGoalListProps {
  goalId: string;
}

export function SubGoalList({ goalId }: SubGoalListProps) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const subGoals = useStore((state) => state.subGoals[goalId] || []);
  const parentGoal = useStore((state) => state.goals.find(g => g.id === goalId));
  const isLoading = useStore((state) => state.isLoading);
  const { updateSubGoal, deleteSubGoal, reorderSubGoals } = useStore();

  const handleToggleComplete = async (subGoal: ISubGoal) => {
    try {
      const subGoalService = SubGoalService.getInstance();
      await subGoalService.updateSubGoal(subGoal.id, {
        isCompleted: !subGoal.isCompleted,
      });
    } catch (error) {
      console.error('Error toggling subgoal:', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const subGoalService = SubGoalService.getInstance();
      await subGoalService.deleteSubGoal(goalId, id);
    } catch (error) {
      console.error('Error deleting subgoal:', error);
    }
  };

  const handleDragEnd = async ({ data }: { data: ISubGoal[] }) => {
    try {
      const subGoalService = SubGoalService.getInstance();
      await subGoalService.reorderSubGoals(
        goalId,
        data.map(item => item.id)
      );
    } catch (error) {
      console.error('Error reordering subgoals:', error);
    }
  };

  const renderItem = useCallback(({ item, drag, isActive }: RenderItemParams<ISubGoal>) => {
    return (
      <ScaleDecorator>
        <ThemedView 
          style={[styles.subGoalItem, isActive && styles.subGoalItemActive]}
          // onLongPress={drag}
          >
          <ThemedView style={styles.subGoalContent}>
            <TabBarIcon
              name={item.isCompleted ? 'checkmark-circle' : 'ellipse-outline'}
              color={item.isCompleted ? '#4CAF50' : '#A1CEDC'}
              onPress={() => handleToggleComplete(item)}
            />
            <ThemedView style={styles.subGoalTextContainer}>
              <ThemedText style={item.isCompleted && styles.completedText}>
                {item.title}
              </ThemedText>
              {item.description && (
                <ThemedText style={[styles.description, item.isCompleted && styles.completedText]}>
                  {item.description}
                </ThemedText>
              )}
            </ThemedView>
          </ThemedView>
          <TabBarIcon
            name="trash-outline"
            color="#FF4444"
            onPress={() => handleDelete(item.id)}
          />
        </ThemedView>
      </ScaleDecorator>
    );
  }, []);

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText type="subtitle">Sub-Goals</ThemedText>
        <ThemedView 
          style={styles.addButton}
          onTouchEnd={() => setIsModalVisible(true)}>
          <TabBarIcon name="add-outline" color="#FFFFFF" />
          <ThemedText>Add Sub-Goal</ThemedText>
        </ThemedView>
      </ThemedView>

      {subGoals.length === 0 ? (
        <ThemedView style={styles.emptyState}>
          <ThemedText>No sub-goals yet. Add one to get started!</ThemedText>
        </ThemedView>
      ) : (
        <DraggableFlatList
          data={subGoals}
          onDragEnd={handleDragEnd}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
        />
      )}

      <AddSubGoalModal
        goalId={goalId}
        parentCategory={parentGoal?.category.id || categories.finance.id}
        parentGoalType={parentGoal?.goalType.id || categories.finance.goalTypes[0].id}
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    padding: 8,
    backgroundColor: '#A1CEDC',
    borderRadius: 8,
  },
  subGoalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 8,
    marginBottom: 8,
  },
  subGoalItemActive: {
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  subGoalContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  completedText: {
    textDecorationLine: 'line-through',
    opacity: 0.7,
  },
  emptyState: {
    padding: 16,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 8,
    alignItems: 'center',
  },
  subGoalTextContainer: {
    flex: 1,
    gap: 4,
  },
  description: {
    fontSize: 12,
    opacity: 0.7,
  },
}); 