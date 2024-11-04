import { Image, StyleSheet } from 'react-native';
import { Link } from 'expo-router';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import ParallaxScrollView from '@/components/ParallaxScrollView';

export default function SetupScreen() {
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
        <ThemedView style={styles.section}>
          <ThemedText type="subtitle">Let's Get Started</ThemedText>
          
          <ThemedView style={styles.card}>
            <ThemedText type="defaultSemiBold">Create Your First Goal</ThemedText>
            <ThemedText>What would you like to achieve? Set your first goal to get started.</ThemedText>
          </ThemedView>

          <ThemedView style={styles.card}>
            <ThemedText type="defaultSemiBold">Enable Notifications</ThemedText>
            <ThemedText>Stay on track with helpful reminders and progress updates.</ThemedText>
          </ThemedView>
        </ThemedView>

        <ThemedView style={styles.section}>
          <Link href="/(tabs)" asChild>
            <ThemedView style={styles.button}>
              <ThemedText type="defaultSemiBold">Complete Setup</ThemedText>
            </ThemedView>
          </Link>
        </ThemedView>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 16,
  },
  section: {
    gap: 20,
  },
  card: {
    backgroundColor: '#eeeeee',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    gap: 8,
  },
  headerImage: {
    height: 178,
    width: 290,
    position: 'absolute',
    bottom: 0,
    left: 0,
  },
  button: {
    backgroundColor: '#A1CEDC',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    width: '100%',
  },
}); 