import { StyleSheet, ScrollView, TextInput } from 'react-native';
import { useState } from 'react';
import { Text } from './text';
import { View } from './view';
import { IconButton } from './icon-button';
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
      <View style={styles.container}>
        <Text style={styles.placeholderText}>
          Please select a category and goal type first
        </Text>
      </View>
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
    <View style={styles.container}>
      <Text variant="subtitle">Metrics</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.metricsContainer}>
          {availableMetrics.map((metric) => {
            const isSelected = selectedMetrics.some(m => m.id === metric.id);
            return (
              <View
                key={metric.id}
                style={[
                  styles.metricChip,
                  isSelected && styles.metricSelected,
                  disabled && styles.metricDisabled,
                ]}>
                <View 
                  style={styles.metricHeader}
                  onTouchEnd={() => !disabled && handleMetricPress(metric.id)}>
                  <IconButton 
                    icon={metric.icon} 
                    size="small"
                    color="#FFFFFF"
                  />
                  <Text style={styles.metricText}>{metric.name}</Text>
                </View>
                {isSelected && (
                  <View style={styles.targetValueContainer}>
                    <Text style={styles.targetLabel}>Target:</Text>
                    <TextInput
                      style={styles.targetInput}
                      value={targetValues[metric.id] || ''}
                      onChangeText={(value) => handleTargetValueChange(metric.id, value)}
                      keyboardType="numeric"
                      placeholder="0"
                      placeholderTextColor="rgba(255,255,255,0.5)"
                      editable={!disabled}
                    />
                  </View>
                )}
              </View>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  metricsContainer: {
    flexDirection: 'row',
    gap: 12,
    paddingVertical: 8,
    paddingHorizontal: 24,
  },
  metricChip: {
    backgroundColor: '#F0F2F5',
    padding: 16,
    paddingHorizontal: 20,
    borderRadius: 20,
    minWidth: 140,
  },
  metricSelected: {
    backgroundColor: '#FF6B6B',
  },
  metricDisabled: {
    opacity: 0.5,
  },
  metricHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  metricText: {
    fontSize: 15,
    color: '#666666',
    fontWeight: '500',
  },
  targetValueContainer: {
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  targetLabel: {
    fontSize: 13,
    color: '#999999',
  },
  targetInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    width: 48,
    color: '#000000',
    fontSize: 14,
    textAlign: 'center',
  },
  placeholderText: {
    color: '#999999',
    textAlign: 'center',
    padding: 24,
    fontSize: 15,
  },
});