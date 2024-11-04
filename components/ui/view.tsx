import { View as RNView, ViewProps as RNViewProps, StyleSheet } from 'react-native';

interface ViewProps extends RNViewProps {
  onTouchEnd?: () => void;
}

export function View({ style, children, onTouchEnd, ...props }: ViewProps) {
  return (
    <RNView 
      style={[styles.default, style]} 
      onTouchEnd={onTouchEnd}
      {...props}
    >
      {children}
    </RNView>
  );
}

const styles = StyleSheet.create({
  default: {
    // Add any default styles you want all Views to have
  },
}); 