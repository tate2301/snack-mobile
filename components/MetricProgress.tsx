import { StyleSheet } from 'react-native';
import { useState } from 'react';

import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';
import { TabBarIcon } from './navigation/TabBarIcon';
import { ProgressInput } from './ProgressInput';
import { IGoalMetric } from '@/services/GoalService';

interface MetricProgressProps {
  goalId: string;
  metric: IGoalMetric;
}

export function MetricProgress({ goalId, metric }: MetricProgressProps) {
  const [isInputVisible, setIsInputVisible] = useState(false);
  const progress = (Number(metric.currentValue) / Number(metric.targetValue)) * 100;

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText>{metric.id}</ThemedText>
        <TabBarIcon 
          name="add-circle-outline" 
          color="#A1CEDC" 
          onPress={() => setIsInputVisible(true)} 
        />
      </ThemedView>

      <ThemedView style={styles.progressContainer}>
        <ThemedView style={styles.progressBar}>
          <ThemedView 
            style={[
              styles.progressFill, 
              { width: `${Math.min(progress, 100)}%` }
            ]} 
          />
        </ThemedView>
        <ThemedText style={styles.progressText}>
          {metric.currentValue.toString()} / {metric.targetValue.toString()}
        </ThemedText>
      </ThemedView>

      <ProgressInput
        goalId={goalId}
        metric={metric}
        visible={isInputVisible}
        onClose={() => setIsInputVisible(false)}
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
  progressText: {
    fontSize: 12,
    opacity: 0.7,
  },
}); 