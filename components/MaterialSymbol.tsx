import { Text } from 'react-native';
import { StyleSheet } from 'react-native';

interface MaterialSymbolProps {
  name: string;
  size?: number;
  color?: string;
  weight?: number;
  grade?: number;
  opticalSize?: number;
  fill?: boolean;
  style?: any;
}

export function MaterialSymbol({
  name,
  size = 24,
  color = '#000000',
  weight = 400,
  grade = 0,
  opticalSize = 48,
  fill = false,
  style,
}: MaterialSymbolProps) {
  return (
    <Text
      style={[
        styles.symbol,
        {
          fontSize: size,
          color,
          fontVariationSettings: `'FILL' ${fill ? 1 : 0}, 'wght' ${weight}, 'GRAD' ${grade}, 'opsz' ${opticalSize}`,
        },
        style,
      ]}
    >
      {name}
    </Text>
  );
}

const styles = StyleSheet.create({
  symbol: {
    fontFamily: 'MaterialSymbols',
  },
});
