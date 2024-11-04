import { Image, StyleSheet, TextInput, ScrollView, Animated } from 'react-native';
import { useRouter, useLocalSearchParams, useNavigation } from 'expo-router';
import { useState, useEffect, useRef } from 'react';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { GoalBuilder } from '@/services/GoalBuilder';
import { MetricSelector } from '@/components/MetricSelector';
import useStore from '@/stores/useStore';
import { categories, goalTypes } from '@/utils/goal-tracking';
import TemplateService from '@/services/TemplateService';
import { IGoalMetric } from '@/services/GoalService';
import { MaterialSymbol } from '@/components/MaterialSymbol';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function NewGoalScreen() {
  const { templateId } = useLocalSearchParams();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedGoalType, setSelectedGoalType] = useState<string | null>(null);
  const [selectedMetrics, setSelectedMetrics] = useState<Array<IGoalMetric>>([]);
  const router = useRouter();
  const navigation = useNavigation()

  const user = useStore((state) => state.user);
  const isLoading = useStore((state) => state.isLoading);
  const error = useStore((state) => state.error);
  const { addGoal, setIsLoading, setError } = useStore();

  const buttonScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (templateId) {
      loadTemplate();
    }
  }, [templateId]);

  useEffect(() => {
    navigation.setOptions({
        headerShown: true,
        headerTitle: 'Add New Goal',
        headerTitleStyle: {
            fontFamily: 'Inter_Tight',
            fontWeight: '600',
        }
    })
  }, [router]);

  const loadTemplate = async () => {
    setIsLoading(true);
    try {
      const templateService = TemplateService.getInstance();
      const template = await templateService.getTemplateById(templateId as string);
      
      if (template) {
        setTitle(template.title);
        setDescription(template.description || '');
        setSelectedCategory(template.category.id);
        setSelectedGoalType(template.goalType.id);
        setSelectedMetrics(template.defaultMetrics);
      }
    } catch (error) {
      console.error('Error loading template:', error);
      setError('Failed to load template');
    } finally {
      setIsLoading(false);
    }
  };

  const animateButton = () => {
    Animated.sequence([
      Animated.spring(buttonScale, {
        toValue: 0.95,
        useNativeDriver: true,
      }),
      Animated.spring(buttonScale, {
        toValue: 1,
        useNativeDriver: true,
      })
    ]).start();
  };

  const handleCreate = async () => {
    if (!title.trim() || !selectedCategory || !selectedGoalType || selectedMetrics.length === 0 || isLoading || !user) {
      return;
    }

    animateButton();
    setIsLoading(true);
    try {
      const category = categories[selectedCategory];
      const goalType = goalTypes[selectedGoalType];

      if (!category || !goalType) {
        throw new Error('Invalid category or goal type');
      }

      // Use GoalBuilder to construct the goal
      const goalBuilder = new GoalBuilder(user.id)
        .setTitle(title.trim())
        .setDescription(description.trim())
        .setCategory(category)
        .setGoalType(goalType);

      // Add all selected metrics
      selectedMetrics.forEach(metric => {
        goalBuilder.addMetric(metric);
      });

      const goal = goalBuilder.build();

      // Save the goal to the store
      addGoal(goal);

      // Navigate to the new goal's details
      router.push(`/(goals)/${goal.id}`);
    } catch (error) {
      console.error('Error creating goal:', error);
      setError(error instanceof Error ? error.message : 'Failed to create goal');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectMetric = (metric: IGoalMetric   ) => {
    setSelectedMetrics(prev => {
      const exists = prev.find(m => m.id === metric.id);
      if (exists) {
        return prev.map(m => m.id === metric.id ? { ...m, } : m);
      }
      return [...prev, { ...metric,  }];
    });
  };

  const handleRemoveMetric = (metricId: string) => {
    setSelectedMetrics(prev => prev.filter(m => m.id !== metricId));
  };

  const isFormValid = 
    title.trim() && 
    selectedCategory && 
    selectedGoalType && 
    selectedMetrics.length > 0 && 
    !isLoading && 
    user;

  const renderChip = (
    key: string, 
    isSelected: boolean, 
    onSelect: () => void, 
    icon: string
  ) => (
    <ThemedView
      key={key}
      style={[
        styles.chip,
        isSelected && styles.chipSelected,
      ]}
      onTouchEnd={() => !isLoading && onSelect()}>
      <MaterialSymbol 
        name={icon} 
        size={18} 
        color={isSelected ? '#11181C' : '#687076'}
      />
      <ThemedText style={[
        styles.chipText,
        isSelected && styles.chipTextSelected
      ]}>
        {key}
      </ThemedText>
    </ThemedView>
  );

  const renderGoalTypeChip = (
    key: string, 
    isSelected: boolean, 
    onSelect: () => void,
  ) => (
    <ThemedView
      key={key}
      style={[
        styles.chip,
        isSelected && styles.chipSelected,
      ]}
      onTouchEnd={() => !isLoading && onSelect()}>
      <MaterialSymbol 
        name={isSelected ? 'check_circle' : 'radio_button_unchecked'} 
        size={18} 
        color={isSelected ? '#11181C' : '#687076'}
      />
      <ThemedText style={[
        styles.chipText,
        isSelected && styles.chipTextSelected
      ]}>
        {key}
      </ThemedText>
    </ThemedView>
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <ScrollView style={styles.container}>
        <ThemedView style={styles.content}>
          {error ? (
            <ThemedView style={styles.errorCard}>
              <MaterialSymbol name="error" color="#FF4444" size={20} />
              <ThemedText style={styles.errorText}>{error}</ThemedText>
            </ThemedView>
          ) : null}

          <ThemedView style={[styles.inputContainer, {paddingHorizontal: 16}]}>
            <ThemedText type="label">Title</ThemedText>
            <ThemedView style={styles.inputWrapper}>
              <MaterialSymbol 
                name="edit" 
                size={20} 
                color="#687076" 
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="What do you want to achieve?"
                placeholderTextColor="#687076"
                value={title}
                onChangeText={setTitle}
                editable={!isLoading}
                maxLength={50}
              />
            </ThemedView>
            <ThemedText style={styles.helperText}>
              {50 - title.length} characters remaining
            </ThemedText>
          </ThemedView>

          <ThemedView style={[styles.inputContainer, {paddingHorizontal: 16}]}>
            <ThemedText type="label">Description (Optional)</ThemedText>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Add some details about your goal"
              placeholderTextColor="rgba(255,255,255,0.5)"
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={4}
              editable={!isLoading}
              maxLength={200}
            />
          </ThemedView>

          <ThemedView style={[styles.inputContainer,]}>
            <ThemedText type="label" style={ {paddingHorizontal: 16, }}>Category</ThemedText>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <ThemedView style={styles.chipContainer}>
                {Object.keys(categories).map((category) => 
                  renderChip(
                    categories[category].name,
                    selectedCategory === category,
                    () => setSelectedCategory(category),
                    'category' // Use appropriate icon for each category
                  )
                )}
              </ThemedView>
            </ScrollView>
          </ThemedView>

          <ThemedView style={[styles.inputContainer,]}>
            <ThemedText type="label" style={ {paddingHorizontal: 16, }}>Goal Type</ThemedText>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <ThemedView style={styles.chipContainer}>
                {categories[selectedCategory || 'finance'].goalTypes.map((goalType) => 
                  renderGoalTypeChip(
                    goalType.name,
                    selectedGoalType === goalType.id,
                    () => setSelectedGoalType(goalType.id)
                  )
                )}
              </ThemedView>
            </ScrollView>
          </ThemedView>

          <ThemedView style={[styles.inputContainer, {paddingHorizontal: 16}]}>
            <ThemedText type="label">Metrics</ThemedText>
            <MetricSelector
              category={selectedCategory ? categories[selectedCategory] : null}
              goalType={selectedGoalType ? goalTypes[selectedGoalType] : null}
              selectedMetrics={selectedMetrics}
              onSelectMetric={handleSelectMetric}
              onRemoveMetric={handleRemoveMetric}
            />
          </ThemedView>

          <Animated.View style={[
            styles.buttonContainer,
            { transform: [{ scale: buttonScale }] }
          ]}>
            <ThemedView 
              style={[styles.button, !isFormValid && styles.buttonDisabled]}
              onTouchEnd={handleCreate}>
              <MaterialSymbol 
                name="add_task" 
                size={24} 
                color="#FFFFFF"
              />
              <ThemedText style={styles.buttonText}>
                {isLoading ? 'Creating...' : 'Create Goal'}
              </ThemedText>
            </ThemedView>
          </Animated.View>
        </ThemedView>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FAFAFA"
  },
  container: {
    flex: 1,
  },
  header: {
    padding: 24,
    paddingTop: 32,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.06)',
  },
  headerTitle: {
    fontSize: 28,
    color: '#000000',
    fontWeight: '700',
  },
  headerIcon: {
    color: '#FF6B6B',
  },
  content: {
    gap: 24,
    paddingVertical: 24,
  },
  inputContainer: {
    gap: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F2F5',
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 56,
  },
  input: {
    flex: 1,
    color: '#000000',
    fontSize: 16,
    paddingVertical: 12,
  },
  textArea: {
    height: 120,
    backgroundColor: '#F0F2F5',
    borderRadius: 16,
    padding: 16,
    textAlignVertical: 'top',
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F2F5',
    padding: 12,
    paddingHorizontal: 20,
    borderRadius: 24,
    gap: 8,
  },
  chipSelected: {
    backgroundColor: '#FF6B6B',
  },
  chipText: {
    color: '#666666',
    fontSize: 15,
    fontWeight: '500',
  },
  chipTextSelected: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  chipContainer: {
    flexDirection: 'row',
    gap: 12,
    paddingVertical: 8,
  },
  buttonContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  button: {
    backgroundColor: '#FF6B6B',
    padding: 20,
    borderRadius: 28,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    shadowColor: '#FF6B6B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  buttonDisabled: {
    backgroundColor: '#E0E0E0',
    shadowColor: 'rgba(0,0,0,0.1)',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '600',
  },
  errorCard: {
    backgroundColor: '#FFF5F5',
    padding: 16,
    borderRadius: 16,
    marginHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  errorText: {
    color: '#FF6B6B',
    fontSize: 15,
    flex: 1,
  },
  helperText: {
    fontSize: 13,
    color: '#999999',
    marginTop: 6,
    marginLeft: 4,
  },
  inputIcon: {
    marginRight: 12,
    color: '#999999',
  },
}); 