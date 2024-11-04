import { StyleSheet, ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { LineChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import useStore from '@/stores/useStore';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';

const screenWidth = Dimensions.get('window').width;

export default function ReportsScreen() {
  const { id } = useLocalSearchParams();
  const goal = useStore((state) => state.goals.find(g => g.id === id));
  const [selectedMetric, setSelectedMetric] = useState(goal?.metrics[0]);
  const progressLogs = useStore((state) => 
    state.progressLogs.filter(log => 
      log.goalId === id && log.metricId === selectedMetric?.id
    )
  );

  if (!goal) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText>Goal not found</ThemedText>
      </ThemedView>
    );
  }

  const chartData = {
    labels: progressLogs.map(log => 
      new Date(log.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    ),
    datasets: [{
      data: progressLogs.map(log => log.value),
    }],
  };

  return (
    <ScrollView>
      <ThemedView style={styles.container}>
        <ThemedText type="title">Progress Report</ThemedText>
        
        {/* Metric Selector */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <ThemedView style={styles.metricSelector}>
            {goal.metrics.map((metric) => (
              <ThemedView
                key={metric.id}
                style={[
                  styles.metricButton,
                  selectedMetric?.id === metric.id && styles.selectedMetric,
                ]}
                onTouchEnd={() => setSelectedMetric(metric)}>
                <ThemedText>{metric.name}</ThemedText>
              </ThemedView>
            ))}
          </ThemedView>
        </ScrollView>

        {/* Progress Chart */}
        {progressLogs.length > 0 ? (
          <ThemedView style={styles.chartContainer}>
            <LineChart
              data={chartData}
              width={screenWidth - 32}
              height={220}
              chartConfig={{
                backgroundColor: '#1D3D47',
                backgroundGradientFrom: '#1D3D47',
                backgroundGradientTo: '#1D3D47',
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(161, 206, 220, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                style: {
                  borderRadius: 16,
                },
                propsForDots: {
                  r: '6',
                  strokeWidth: '2',
                  stroke: '#A1CEDC',
                },
              }}
              bezier
              style={styles.chart}
            />
          </ThemedView>
        ) : (
          <ThemedView style={styles.emptyState}>
            <TabBarIcon name="bar-chart-outline" color="#FFFFFF" size={48} />
            <ThemedText>No progress data yet</ThemedText>
          </ThemedView>
        )}

        {/* Statistics */}
        <ThemedView style={styles.statsContainer}>
          <ThemedText type="subtitle">Statistics</ThemedText>
          <ThemedView style={styles.statRow}>
            <ThemedView style={styles.stat}>
              <ThemedText type="defaultSemiBold">Current</ThemedText>
              <ThemedText>{progressLogs[progressLogs.length - 1]?.value || 0}</ThemedText>
            </ThemedView>
            <ThemedView style={styles.stat}>
              <ThemedText type="defaultSemiBold">Average</ThemedText>
              <ThemedText>
                {progressLogs.length > 0
                  ? Math.round(
                      progressLogs.reduce((sum, log) => sum + log.value, 0) /
                        progressLogs.length
                    )
                  : 0}
              </ThemedText>
            </ThemedView>
            <ThemedView style={styles.stat}>
              <ThemedText type="defaultSemiBold">Total Logs</ThemedText>
              <ThemedText>{progressLogs.length}</ThemedText>
            </ThemedView>
          </ThemedView>
        </ThemedView>
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    gap: 16,
  },
  metricSelector: {
    flexDirection: 'row',
    gap: 8,
    paddingVertical: 8,
  },
  metricButton: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    padding: 8,
    paddingHorizontal: 16,
    borderRadius: 16,
  },
  selectedMetric: {
    backgroundColor: '#A1CEDC',
  },
  chartContainer: {
    backgroundColor: '#1D3D47',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  emptyState: {
    padding: 32,
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 16,
  },
  statsContainer: {
    gap: 8,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  stat: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
}); 