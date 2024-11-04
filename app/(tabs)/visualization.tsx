import { Image, StyleSheet, ScrollView } from 'react-native';
import { LineChart, BarChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import { useEffect, useState } from 'react';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import useStore from '@/stores/useStore';
import { IGoal, IGoalMetric } from '@/services/GoalService';

const screenWidth = Dimensions.get('window').width;

interface MetricData {
  labels: string[];
  datasets: {
    data: number[];
    color?: (opacity: number) => string;
    strokeWidth?: number;
  }[];
}

export default function VisualizationScreen() {
  const goals = useStore((state) => state.goals);
  const [selectedGoal, setSelectedGoal] = useState<IGoal | null>(null);
  const [metricData, setMetricData] = useState<Record<string, MetricData>>({});

  useEffect(() => {
    if (selectedGoal) {
      generateMetricData(selectedGoal);
    } else if (goals.length > 0) {
      setSelectedGoal(goals[0]);
    }
  }, [selectedGoal, goals]);

  const generateMetricData = (goal: IGoal) => {
    const data: Record<string, MetricData> = {};
    
    goal.metrics.forEach((metric) => {
      // For demo purposes, generate some random historical data
      const historicalData = Array.from({ length: 7 }, (_, i) => ({
        value: Math.random() * Number(metric.targetValue),
        date: new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000),
      }));

      data[metric.id] = {
        labels: historicalData.map(d => d.date.toLocaleDateString('en-US', { weekday: 'short' })),
        datasets: [{
          data: historicalData.map(d => d.value),
          color: (opacity = 1) => `rgba(161, 206, 220, ${opacity})`,
          strokeWidth: 2,
        }],
      };
    });

    setMetricData(data);
  };

  const chartConfig = {
    backgroundGradientFrom: '#1D3D47',
    backgroundGradientTo: '#1D3D47',
    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.5,
    useShadowColorFromDataset: false,
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.headerImage}
        />
      }>
      <ThemedView style={styles.container}>
        {/* Goal Selector */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <ThemedView style={styles.goalSelector}>
            {goals.map(goal => (
              <ThemedView
                key={goal.id}
                style={[
                  styles.goalChip,
                  selectedGoal?.id === goal.id && styles.goalChipSelected,
                ]}
                onTouchEnd={() => setSelectedGoal(goal)}>
                <ThemedText>{goal.title}</ThemedText>
              </ThemedView>
            ))}
          </ThemedView>
        </ScrollView>

        {selectedGoal ? (
          <>
            {/* Goal Overview */}
            <ThemedView style={styles.section}>
              <ThemedText type="title">{selectedGoal.title}</ThemedText>
              <ThemedView style={styles.categoryBadge}>
                <ThemedText style={styles.categoryText}>
                  {selectedGoal.category.name}
                </ThemedText>
              </ThemedView>
            </ThemedView>

            {/* Metrics Charts */}
            <ScrollView style={styles.chartsContainer}>
              {selectedGoal.metrics.map((metric) => (
                <ThemedView key={metric.id} style={styles.chartCard}>
                  <ThemedText type="subtitle">{metric.id}</ThemedText>
                  <ThemedText>
                    Current: {metric.currentValue.toString()} / Target: {metric.targetValue.toString()}
                  </ThemedText>
                  
                  {metricData[metric.id] && (
                    <>
                      <LineChart
                        data={metricData[metric.id]}
                        width={screenWidth - 64}
                        height={220}
                        chartConfig={chartConfig}
                        bezier
                        style={styles.chart}
                      />
                      <BarChart
                        data={metricData[metric.id]}
                        width={screenWidth - 64}
                        height={220}
                        chartConfig={chartConfig}
                        yAxisLabel=""
                        yAxisSuffix=""
                        style={styles.chart}
                      />
                    </>
                  )}
                </ThemedView>
              ))}
            </ScrollView>
          </>
        ) : (
          <ThemedView style={styles.placeholder}>
            <ThemedText>No goals to visualize. Create a goal to get started!</ThemedText>
          </ThemedView>
        )}
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    gap: 16,
  },
  section: {
    gap: 8,
  },
  goalSelector: {
    flexDirection: 'row',
    gap: 8,
    paddingVertical: 4,
  },
  goalChip: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    padding: 8,
    paddingHorizontal: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  goalChipSelected: {
    backgroundColor: '#A1CEDC',
  },
  categoryBadge: {
    backgroundColor: '#A1CEDC',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  categoryText: {
    fontSize: 12,
  },
  chartsContainer: {
    gap: 16,
  },
  chartCard: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    marginBottom: 16,
    gap: 8,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 8,
  },
  placeholder: {
    padding: 24,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
  },
  headerImage: {
    height: 178,
    width: 290,
    position: 'absolute',
    bottom: 0,
    left: 0,
  },
}); 