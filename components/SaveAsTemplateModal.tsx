import { StyleSheet, TextInput, Modal, ScrollView } from 'react-native';
import { useState } from 'react';

import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';
import { TabBarIcon } from './navigation/TabBarIcon';
import TemplateService from '@/services/TemplateService';
import { IGoal } from '@/services/GoalService';
import useStore from '@/stores/useStore';

interface SaveAsTemplateModalProps {
  goal: IGoal;
  visible: boolean;
  onClose: () => void;
}

export function SaveAsTemplateModal({ goal, visible, onClose }: SaveAsTemplateModalProps) {
  const [title, setTitle] = useState(goal.title);
  const [description, setDescription] = useState(goal.description || '');
  const user = useStore((state) => state.user);
  const isLoading = useStore((state) => state.isLoading);
  const { setIsLoading, setError } = useStore();

  const handleSave = async () => {
    if (!title.trim() || isLoading || !user) return;

    setIsLoading(true);
    try {
      const templateService = TemplateService.getInstance();
      await templateService.createTemplate({
        userId: user.id,
        title: title.trim(),
        description: description.trim(),
        category: goal.category,
        goalType: goal.goalType,
        defaultMetrics: goal.metrics,
        icon: goal.goalType.icon,
        isCustom: true,
      });
      
      onClose();
    } catch (error) {
      console.error('Error saving template:', error);
      setError('Failed to save template');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}>
      <ThemedView style={styles.modalOverlay}>
        <ThemedView style={styles.modalContent}>
          <ThemedView style={styles.modalHeader}>
            <ThemedText type="subtitle">Save as Template</ThemedText>
            <TabBarIcon name="close" color="#FFFFFF" onPress={onClose} />
          </ThemedView>

          <ThemedView style={styles.inputContainer}>
            <ThemedText>Template Name</ThemedText>
            <TextInput
              style={styles.input}
              value={title}
              onChangeText={setTitle}
              placeholder="Enter template name"
              placeholderTextColor="rgba(255,255,255,0.5)"
              editable={!isLoading}
            />
          </ThemedView>

          <ThemedView style={styles.inputContainer}>
            <ThemedText>Description (Optional)</ThemedText>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={description}
              onChangeText={setDescription}
              placeholder="Add template description"
              placeholderTextColor="rgba(255,255,255,0.5)"
              multiline
              numberOfLines={4}
              editable={!isLoading}
            />
          </ThemedView>

          <ThemedView 
            style={[styles.button, !title.trim() && styles.buttonDisabled]}
            onTouchEnd={handleSave}>
            <ThemedText type="defaultSemiBold">
              {isLoading ? 'Saving...' : 'Save Template'}
            </ThemedText>
          </ThemedView>
        </ThemedView>
      </ThemedView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#1D3D47',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 16,
    gap: 16,
    minHeight: '50%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  inputContainer: {
    gap: 4,
  },
  input: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    padding: 12,
    color: '#FFFFFF',
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#A1CEDC',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
}); 