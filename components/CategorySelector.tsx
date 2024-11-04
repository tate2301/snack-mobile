import { StyleSheet, ScrollView } from 'react-native';
import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';
import { TabBarIcon } from './navigation/TabBarIcon';
import { Category } from '@/utils/goal-tracking';

interface CategorySelectorProps {
  categories: Record<string, Category>;
  selectedCategory: string | null;
  onSelectCategory: (categoryId: string) => void;
  disabled?: boolean;
}

export function CategorySelector({ 
  categories, 
  selectedCategory, 
  onSelectCategory,
  disabled 
}: CategorySelectorProps) {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="subtitle">Category</ThemedText>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <ThemedView style={styles.categoryContainer}>
          {Object.entries(categories).map(([id, category]) => (
            <ThemedView
              key={id}
              style={[
                styles.categoryChip,
                selectedCategory === id && styles.categorySelected,
                disabled && styles.categoryDisabled,
              ]}
              onTouchEnd={() => !disabled && onSelectCategory(id)}>
              <TabBarIcon name={category.icon as any} color="#FFFFFF" size={16} />
              <ThemedText style={styles.categoryText}>{category.name}</ThemedText>
            </ThemedView>
          ))}
        </ThemedView>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  categoryContainer: {
    flexDirection: 'row',
    gap: 8,
    paddingVertical: 4,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255,255,255,0.1)',
    padding: 8,
    paddingHorizontal: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  categorySelected: {
    backgroundColor: '#A1CEDC',
  },
  categoryDisabled: {
    opacity: 0.5,
  },
  categoryText: {
    fontSize: 12,
  },
}); 