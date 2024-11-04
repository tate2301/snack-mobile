import { Image, StyleSheet, ScrollView } from 'react-native';
import { Link } from 'expo-router';
import { useEffect } from 'react';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import useStore from '@/stores/useStore';
import GoalService from '@/services/GoalService';

export default function HomeScreen() {
  const goals = useStore((state) => state.goals);
  const isLoading = useStore((state) => state.isLoading);
  const { setGoals, setIsLoading, setError } = useStore();

  useEffect(() => {
    loadGoals();
  }, []);

  const loadGoals = async () => {
    setIsLoading(true);
    try {
      const goalService = GoalService.getInstance();
      const loadedGoals = await goalService.getGoals();
      setGoals(loadedGoals);
    } catch (error) {
      console.error('Error loading goals:', error);
      setError('Failed to load goals');
    } finally {
      setIsLoading(false);
    }
  };

  const activeGoals = goals.filter(goal => !goal.isCompleted);
  const recentAchievements = goals
    .filter(goal => goal.isCompleted)
    .slice(0, 2)
    .map(goal => ({
      id: goal.id,
      title: goal.title,
      date: goal.updatedAt.toLocaleDateString(),
    }));

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
        {/* Quick Actions */}
        <ThemedView style={styles.quickActions}>
          <Link href="/goals/new" asChild>
            <ThemedView style={styles.quickActionButton}>
              <ThemedText type="defaultSemiBold">+ New Goal</ThemedText>
            </ThemedView>
          </Link>
          <Link href="/goals/log" asChild>
            <ThemedView style={styles.quickActionButton}>
              <ThemedText type="defaultSemiBold">Log Progress</ThemedText>
            </ThemedView>
          </Link>
        </ThemedView>

        {/* Active Goals Section */}
        <ThemedView style={styles.section}>
          <ThemedText type="title">Active Goals</ThemedText>
          {isLoading ? (
            <ThemedView style={styles.placeholder}>
              <ThemedText>Loading goals...</ThemedText>
            </ThemedView>
          ) : activeGoals.length === 0 ? (
            <ThemedView style={styles.placeholder}>
              <ThemedText>No active goals. Create your first goal!</ThemedText>
            </ThemedView>
          ) : (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
              {activeGoals.map(goal => (
                <Link key={goal.id} href={`/goals/${goal.id}`} asChild>
                  <ThemedView style={styles.goalCard}>
                    <ThemedText type="subtitle">{goal.title}</ThemedText>
                    <ThemedView style={styles.progressBar}>
                      <ThemedView style={[styles.progressFill, { width: `${goal.progress}%` }]} />
                    </ThemedView>
                    <ThemedText>{goal.goalType.name}</ThemedText>
                  </ThemedView>
                </Link>
              ))}
            </ScrollView>
          )}
        </ThemedView>

        {/* Recent Achievements */}
        <ThemedView style={styles.section}>
          <ThemedText type="title">Recent Achievements</ThemedText>
          {recentAchievements.length === 0 ? (
            <ThemedView style={styles.placeholder}>
              <ThemedText>Complete goals to see your achievements here!</ThemedText>
            </ThemedView>
          ) : (
            recentAchievements.map(achievement => (
              <ThemedView key={achievement.id} style={styles.achievementCard}>
                <ThemedText type="subtitle">{achievement.title}</ThemedText>
                <ThemedText>{achievement.date}</ThemedText>
              </ThemedView>
            ))
          )}
        </ThemedView>

        {/* Weekly Summary */}
        <ThemedView style={styles.section}>
          <ThemedText type="title">This Week</ThemedText>
          <ThemedView style={styles.card}>
            <ThemedText type="subtitle">Progress Overview</ThemedText>
            <ThemedText>{activeGoals.length} goals in progress</ThemedText>
            <ThemedText>{recentAchievements.length} achievements unlocked</ThemedText>
            <ThemedText>
              {activeGoals.length > 0
                ? `${Math.round(
                    activeGoals.reduce((sum, goal) => sum + goal.progress, 0) / activeGoals.length
                  )}% average completion`
                : 'No active goals'}
            </ThemedText>
          </ThemedView>
        </ThemedView>
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
  quickActions: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  quickActionButton: {
    backgroundColor: '#A1CEDC',
    padding: 12,
    borderRadius: 8,
    flex: 1,
    alignItems: 'center',
  },
  horizontalScroll: {
    marginHorizontal: -16,
    paddingHorizontal: 16,
  },
  goalCard: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    width: 200,
    marginRight: 8,
    gap: 8,
  },
  achievementCard: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  card: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    gap: 8,
  },
  progressBar: {
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#A1CEDC',
  },
  headerImage: {
    height: 178,
    width: 290,
    position: 'absolute',
    bottom: 0,
    left: 0,
  },
  placeholder: {
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  placeholderText: {
    color: 'rgba(255,255,255,0.5)',
  },
});
