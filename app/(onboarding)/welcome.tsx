import { Image, ScrollView, StyleSheet, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import AuthenticationService from '@/services/AuthenticationService';
import useStore from '@/stores/useStore';

export default function WelcomeScreen() {
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const { setIsLoading, setError } = useStore();
  const router = useRouter();

  const handleContinue = async () => {
    if (!nickname.trim()) return;

    setIsLoading(true);
    try {
      const authService = AuthenticationService.getInstance();
      await authService.registerUser(nickname.trim(), email.trim() || undefined);
      router.push('/(onboarding)/features');
    } catch (error) {
      console.error('Error registering user:', error);
      setError('Failed to register user');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ThemedView style={{flex: 1, backgroundColor: '#fff', padding: 16, justifyContent: 'center', }}>
      
        <ThemedView style={{flex: 1, justifyContent: 'center', }}>
          <ThemedText style={styles.label} type="subtitle">Hi explorer,</ThemedText>
          <ThemedText style={[styles.label, {marginBottom: 16}]} type="subtitle">What's your name?</ThemedText>
          <ThemedView style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Enter your nickname"
              value={nickname}
              onChangeText={setNickname}
              autoFocus
              autoCorrect={false}
              maxLength={20}
            />
          </ThemedView>
          <ThemedText style={styles.disclaimer}>
            We value your privacy and will never share your data with anyone. Your data never leaves your device.
          </ThemedText>
        </ThemedView>

        <ThemedView style={styles.section}>
          <ThemedView 
            style={[styles.button, !nickname.trim() && styles.buttonDisabled]}
            onTouchEnd={handleContinue}>
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
  },
  section: {
    gap: 2,
  },
  disclaimer: {
    fontSize: 14,
    color: '#666',
  },
  label: {
    marginBottom: 24
  },
  card: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  inputContainer: {
    backgroundColor: '#f1f1f1',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    padding: 4,
    marginBottom: 20,
    width: '100%',
    
  },
  input: {
    height: 48,
    padding: 8,
    fontSize: 16,
    width: '100%',
  },
  button: {
    backgroundColor: '#EF5F00',
    padding: 16,
    borderRadius: 50,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  headerImage: {
    height: 178,
    width: 290,
    position: 'absolute',
    bottom: 0,
    left: 0,
  },
}); 