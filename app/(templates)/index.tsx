import { Image, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { TemplateCard } from '@/components/TemplateCard';
import { CategorySelector } from '@/components/CategorySelector';
import { GoalTypeSelector } from '@/components/GoalTypeSelector';
import TemplateService, { ITemplate } from '@/services/TemplateService';
import { categories, goalTypes } from '@/utils/goal-tracking';
import useStore from '@/stores/useStore';

export default function TemplatesScreen() {
  const [templates, setTemplates] = useState<ITemplate[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedGoalType, setSelectedGoalType] = useState<string | null>(null);
  const isLoading = useStore((state) => state.isLoading);
  const { setIsLoading, setError } = useStore();
  const router = useRouter();

  useEffect(() => {
    loadTemplates();
  }, [selectedCategory, selectedGoalType]);

  const loadTemplates = async () => {
    setIsLoading(true);
    try {
      const templateService = TemplateService.getInstance();
      const loadedTemplates = await templateService.getTemplates(
        selectedCategory || undefined,
        selectedGoalType || undefined
      );
      setTemplates(loadedTemplates);
    } catch (error) {
      console.error('Error loading templates:', error);
      setError('Failed to load templates');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectTemplate = (template: ITemplate) => {
    router.push({
      pathname: '/(goals)/new',
      params: { templateId: template.id },
    });
  };

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
        {/* Filters */}
        <ThemedView style={styles.section}>
          <CategorySelector
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            disabled={isLoading}
          />

          <GoalTypeSelector
            goalTypes={goalTypes}
            selectedGoalType={selectedGoalType}
            onSelectGoalType={setSelectedGoalType}
            disabled={isLoading}
            categoryId={selectedCategory || undefined}
          />
        </ThemedView>

        {/* Templates List */}
        <ThemedView style={styles.section}>
          <ThemedText type="title">Templates</ThemedText>
          {isLoading ? (
            <ThemedView style={styles.placeholder}>
              <ThemedText>Loading templates...</ThemedText>
            </ThemedView>
          ) : templates.length === 0 ? (
            <ThemedView style={styles.placeholder}>
              <ThemedText>No templates found for the selected filters.</ThemedText>
            </ThemedView>
          ) : (
            templates.map((template) => (
              <TemplateCard
                key={template.id}
                template={template}
                onSelect={() => handleSelectTemplate(template)}
              />
            ))
          )}
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
  placeholder: {
    padding: 24,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
  },
  headerImage: {
    height: 178,
    width: 290,
    position: 'absolute',
    bottom: 0,
    left: 0,
  },
}); 