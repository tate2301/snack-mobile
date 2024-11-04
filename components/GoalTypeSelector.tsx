import { StyleSheet, ScrollView } from 'react-native';
import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';
import { TabBarIcon } from './navigation/TabBarIcon';
import { categories, GoalType } from '@/utils/goal-tracking';

interface GoalTypeSelectorProps {
  goalTypes: Record<string, GoalType>;
  selectedGoalType: string | null;
  onSelectGoalType: (goalTypeId: string) => void;
  disabled?: boolean;
  categoryId?: string;
}

export function GoalTypeSelector({ 
  goalTypes, 
  selectedGoalType, 
  onSelectGoalType,
  disabled,
  categoryId 
}: GoalTypeSelectorProps) {
  // Filter goal types based on category if provided
  const availableGoalTypes = categories[categoryId || categories.financialGoals.id].goalTypes

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="subtitle">Goal Type</ThemedText>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <ThemedView style={styles.goalTypeContainer}>
          {availableGoalTypes.map((goalType) => (
            <ThemedView
              key={goalType.id}
              style={[
                styles.goalTypeChip,
                selectedGoalType === goalType.id && styles.goalTypeSelected,
                disabled && styles.goalTypeDisabled,
              ]}
              onTouchEnd={() => !disabled && onSelectGoalType(goalType.id)}>
              <TabBarIcon name={goalType.icon as any} color="#FFFFFF" size={16} />
              <ThemedText style={styles.goalTypeText}>{goalType.name}</ThemedText>
            </ThemedView>
          ))}
        </ThemedView>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  goalTypeContainer: {
    flexDirection: 'row',
    gap: 8,
    paddingVertical: 4,
  },
  goalTypeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255,255,255,0.1)',
    padding: 8,
    paddingHorizontal: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  goalTypeSelected: {
    backgroundColor: '#A1CEDC',
  },
  goalTypeDisabled: {
    opacity: 0.5,
  },
  goalTypeText: {
    fontSize: 12,
  },
}); 