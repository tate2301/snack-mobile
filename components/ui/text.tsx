import { Text as RNText, TextStyle, StyleSheet } from 'react-native';
import { ReactNode } from 'react';

interface TextProps {
  children: ReactNode;
  style?: TextStyle;
  variant?: 'body' | 'title' | 'subtitle' | 'caption';
}

export function Text({ children, style, variant = 'body' }: TextProps) {
  return (
    <RNText style={[styles[variant], style]}>
      {children}
    </RNText>
  );
}

const styles = StyleSheet.create({
  body: {
    fontSize: 14,
    color: '#FFFFFF',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  caption: {
    fontSize: 12,
    color: '#FFFFFF',
    opacity: 0.7,
  },
}); 