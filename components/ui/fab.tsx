import { StyleSheet, Pressable, ViewStyle } from 'react-native';
import { Text } from './text';
import { View } from './view';
import { IconButton } from './icon-button';

interface FABProps {
  icon?: string;
  label?: string;
  onPress: () => void;
  variant?: 'surface' | 'primary' | 'secondary' | 'tertiary';
  size?: 'small' | 'medium' | 'large';
  style?: ViewStyle;
}

export function FAB({ 
  icon, 
  label, 
  onPress, 
  variant = 'primary',
  size = 'medium',
  style 
}: FABProps) {
  const isExtended = Boolean(label);

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.container,
        styles[variant],
        styles[size],
        isExtended && styles.extended,
        pressed && styles.pressed,
        style
      ]}>
      <View style={styles.content}>
        {icon && (
          <IconButton
            icon={icon}
            size={size === 'small' ? 'small' : 'medium'}
            color="#FFFFFF"
          />
        )}
        {label && <Text style={styles.label}>{label}</Text>}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  primary: {
    backgroundColor: '#6750A4',
  },
  secondary: {
    backgroundColor: '#625B71',
  },
  surface: {
    backgroundColor: '#FFFFFF',
  },
  tertiary: {
    backgroundColor: '#7D5260',
  },
  small: {
    width: 40,
    height: 40,
    padding: 8,
  },
  medium: {
    width: 56,
    height: 56,
    padding: 16,
  },
  large: {
    width: 96,
    height: 96,
    padding: 24,
  },
  extended: {
    width: 'auto',
    paddingHorizontal: 16,
  },
  pressed: {
    opacity: 0.8,
  },
  label: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
}); 