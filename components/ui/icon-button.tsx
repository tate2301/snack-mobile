import { StyleSheet, Pressable, ViewStyle } from 'react-native';
import { MaterialSymbol } from '../MaterialSymbol';

interface IconButtonProps {
  icon: string;
  onPress?: () => void;
  size?: 'small' | 'medium' | 'large';
  color?: string;
  style?: ViewStyle;
  disabled?: boolean;
}

export function IconButton({
  icon,
  onPress,
  size = 'medium',
  color = '#000000',
  style,
  disabled
}: IconButtonProps) {
  const iconSize = size === 'small' ? 18 : size === 'medium' ? 24 : 32;

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.container,
        styles[size],
        pressed && styles.pressed,
        disabled && styles.disabled,
        style
      ]}>
      <MaterialSymbol
        name={icon}
        size={iconSize}
        color={color}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
  },
  small: {
    width: 32,
    height: 32,
  },
  medium: {
    width: 40,
    height: 40,
  },
  large: {
    width: 48,
    height: 48,
  },
  pressed: {
    backgroundColor: 'rgba(0, 0, 0, 0.12)',
  },
  disabled: {
    opacity: 0.38,
  },
}); 