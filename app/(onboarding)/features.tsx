import { Image, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';

const features = [
  {
    icon: 'flag',
    title: 'Track goals',
    description: 'Create and track your goals with customizable metrics.',
  },
  {
    icon: 'journal',
    title: 'Workplans',
    description: 'Break down complex goals into manageable sub-goals.',
  },
  {
    icon: 'notifications',
    title: 'Reminders',
    description: 'Stay on track with customizable reminders and notifications.',
  },
  {
    icon: 'bookmark',
    title: 'Templates',
    description: 'Use and create templates for common goal types.',
  },
];

export default function FeaturesScreen() {
  const router = useRouter();

  return (
    <ThemedView style={styles.container}>
        <ThemedView style={styles.section}>
          <ThemedText type="title" style={{textAlign: 'center'}}>Just what you need</ThemedText>
        </ThemedView>

        <ThemedView style={styles.section}>
          {features.map((feature, index) => (
            <ThemedView key={index} style={styles.featureCard}>
              <TabBarIcon name={feature.icon as any} color="#EF5F00" size={32} />
              <ThemedView style={styles.featureContent}>
                <ThemedText type="defaultSemiBold">{feature.title}</ThemedText>
                <ThemedText style={styles.description}>{feature.description}</ThemedText>
              </ThemedView>
            </ThemedView>
          ))}
        </ThemedView>

        <ThemedView style={[styles.section, ]}>
          <ThemedView 
            style={styles.button}
            onTouchEnd={() => router.push('/(onboarding)/setup')}>
            <ThemedText style={{color: '#fff'}} type="defaultSemiBold">Continue</ThemedText>
          </ThemedView>
        </ThemedView>
      </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 24,
    padding: 16,
  },
  section: {
    gap: 2,
    paddingVertical: 16,
  },
  featureCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 24,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    marginBottom: 20
  },
  featureContent: {
    flex: 1,
    gap: 4,
  },
  description: {
    opacity: 0.7,
  },
  button: {
    backgroundColor: '#EF5F00',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    height: 48
  },
  headerImage: {
    height: 178,
    width: 290,
    position: 'absolute',
    bottom: 0,
    left: 0,
  },
}); 