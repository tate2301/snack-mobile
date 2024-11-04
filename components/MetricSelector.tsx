import { StyleSheet, ScrollView, TextInput } from 'react-native';
import { useState } from 'react';
import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';
import { TabBarIcon } from './navigation/TabBarIcon';
import { Category, GoalType, metrics } from '@/utils/goal-tracking';
import { IGoalMetric } from '@/services/GoalService';

interface MetricSelectorProps {
  category: Category | null;
  goalType: GoalType | null;
  selectedMetrics: IGoalMetric[];
  onSelectMetric: (metric: IGoalMetric) => void;
  onRemoveMetric: (metricId: string) => void;
  disabled?: boolean;
}

export function MetricSelector({ 
  category, 
  goalType, 
  selectedMetrics, 
  onSelectMetric,
  onRemoveMetric,
  disabled 
}: MetricSelectorProps) {
  const [targetValues, setTargetValues] = useState<Record<string, string>>({});
  const availableMetrics = goalType?.metrics || [];

  if (!category || !goalType) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText style={styles.placeholderText}>
          Please select a category and goal type first
        </ThemedText>
      </ThemedView>
    );
  }

  const handleMetricPress = (metricId: string) => {
    const isSelected = selectedMetrics.some(m => m.id === metricId);
    if (isSelected) {
      onRemoveMetric(metricId);
    } else {
      const metric = metrics[metricId];
      const targetValue = parseFloat(targetValues[metricId] || '0');

      if(!metric) {
        return;
      }
      
      onSelectMetric({
        id: metric.id,
        name: metric.name,
        icon: metric.icon,
        currentValue: 0,
        targetValue,
      });
     
    }
  };

  const handleTargetValueChange = (metricId: string, value: string) => {
    setTargetValues(prev => ({ ...prev, [metricId]: value }));
    if (selectedMetrics.some(m => m.id === metricId)) {
      const metric = metrics[metricId];
      const numericValue = parseFloat(value || '0');
      if(!metric) {
        return;
      }
      onSelectMetric({
        id: metric.id,
        name: metric.name,
        icon: metric.icon,
        currentValue: 0,
        targetValue: numericValue,
      });
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="subtitle">Metrics</ThemedText>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <ThemedView style={styles.metricsContainer}>
          {availableMetrics.map((metric) => {
            const isSelected = selectedMetrics.some(m => m.id === metric.id);
            return (
              <ThemedView
                key={metric.id}
                style={[
                  styles.metricChip,
                  isSelected && styles.metricSelected,
                  disabled && styles.metricDisabled,
                ]}>
                <ThemedView 
                  style={styles.metricHeader}
                  onTouchEnd={() => !disabled && handleMetricPress(metric.id)}>
                  <TabBarIcon name={metric.icon as any} color="#FFFFFF" size={16} />
                  <ThemedText style={styles.metricText}>{metric.name}</ThemedText>
                </ThemedView>
                {isSelected && (
                  <ThemedView style={styles.targetValueContainer}>
                    <ThemedText style={styles.targetLabel}>Target:</ThemedText>
                    <TextInput
                      style={styles.targetInput}
                      value={targetValues[metric.id] || ''}
                      onChangeText={(value) => handleTargetValueChange(metric.id, value)}
                      keyboardType="numeric"
                      placeholder="0"
                      placeholderTextColor="rgba(255,255,255,0.5)"
                      editable={!disabled}
                    />
                  </ThemedView>
                )}
              </ThemedView>
            );
          })}
        </ThemedView>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  metricsContainer: {
    flexDirection: 'row',
    gap: 8,
    paddingVertical: 4,
  },
  metricChip: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    padding: 8,
    paddingHorizontal: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    minWidth: 120,
  },
  metricSelected: {
    backgroundColor: '#A1CEDC',
  },
  metricDisabled: {
    opacity: 0.5,
  },
  metricHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metricText: {
    fontSize: 12,
  },
  targetValueContainer: {
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  targetLabel: {
    fontSize: 10,
    opacity: 0.7,
  },
  targetInput: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 4,
    paddingHorizontal: 4,
    paddingVertical: 2,
    width: 40,
    color: '#FFFFFF',
    fontSize: 12,
    textAlign: 'center',
  },
  metricUnit: {
    fontSize: 10,
    opacity: 0.7,
  },
  placeholderText: {
    opacity: 0.7,
    textAlign: 'center',
    padding: 16,
  },
}); 