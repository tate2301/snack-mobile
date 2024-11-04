import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { IUser } from '@/services/AuthenticationService';
import { IGoal } from '@/services/GoalService';
import { ISubGoal } from '@/services/SubGoalService';
import { IReminder } from '@/services/NotificationService';
import { ITemplate } from '@/services/TemplateService';

interface AppState {
  // User State
  user: IUser | null;
  setUser: (user: IUser | null) => void;
  hasCompletedOnboarding: boolean;
  setHasCompletedOnboarding: (completed: boolean) => void;

  // Goals State
  goals: IGoal[];
  setGoals: (goals: IGoal[]) => void;
  addGoal: (goal: IGoal) => void;
  updateGoal: (goalId: string, updates: Partial<IGoal>) => void;
  deleteGoal: (goalId: string) => void;

  // SubGoals State
  subGoals: Record<string, ISubGoal[]>; // Keyed by goalId
  setSubGoals: (goalId: string, subGoals: ISubGoal[]) => void;
  addSubGoal: (subGoal: ISubGoal) => void;
  updateSubGoal: (subGoalId: string, updates: Partial<ISubGoal>) => void;
  deleteSubGoal: (goalId: string, subGoalId: string) => void;
  reorderSubGoals: (goalId: string, orderedIds: string[]) => void;

  // Reminders State
  reminders: IReminder[];
  addReminder: (reminder: IReminder) => void;
  deleteReminder: (reminderId: string) => void;

  // Templates State
  templates: ITemplate[];
  addTemplate: (template: ITemplate) => void;
  updateTemplate: (templateId: string, updates: Partial<ITemplate>) => void;
  deleteTemplate: (templateId: string) => void;

  // UI State
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  error: string | null;
  setError: (error: string | null) => void;
}

const useStore = create<AppState>()(
  persist(
    (set) => ({
      // User State
      user: null,
      setUser: (user) => set({ user }),
      hasCompletedOnboarding: false,
      setHasCompletedOnboarding: (completed) => set({ hasCompletedOnboarding: completed }),

      // Goals State
      goals: [],
      setGoals: (goals) => set({ goals }),
      addGoal: (goal) => set((state) => ({ 
        goals: [...state.goals, goal] 
      })),
      updateGoal: (goalId, updates) => set((state) => ({
        goals: state.goals.map(g => 
          g.id === goalId 
            ? { ...g, ...updates, updatedAt: new Date() }
            : g
        )
      })),
      deleteGoal: (goalId) => set((state) => ({
        goals: state.goals.filter(g => g.id !== goalId)
      })),

      // SubGoals State
      subGoals: {},
      setSubGoals: (goalId, subGoals) =>
        set((state) => ({
          subGoals: { ...state.subGoals, [goalId]: subGoals },
        })),
      addSubGoal: (subGoal) =>
        set((state) => ({
          subGoals: {
            ...state.subGoals,
            [subGoal.goalId]: [...(state.subGoals[subGoal.goalId] || []), subGoal],
          },
        })),
      updateSubGoal: (subGoalId, updates) =>
        set((state) => {
          const newSubGoals = { ...state.subGoals };
          Object.keys(newSubGoals).forEach((goalId) => {
            newSubGoals[goalId] = newSubGoals[goalId].map((sg) =>
              sg.id === subGoalId ? { ...sg, ...updates } : sg
            );
          });
          return { subGoals: newSubGoals };
        }),
      deleteSubGoal: (goalId, subGoalId) =>
        set((state) => ({
          subGoals: {
            ...state.subGoals,
            [goalId]: state.subGoals[goalId].filter((sg) => sg.id !== subGoalId),
          },
        })),
      reorderSubGoals: (goalId, orderedIds) =>
        set((state) => {
          const subGoals = state.subGoals[goalId];
          if (!subGoals) return state;

          const reorderedSubGoals = orderedIds
            .map((id) => subGoals.find((sg) => sg.id === id))
            .filter((sg): sg is ISubGoal => sg !== undefined)
            .map((sg, index) => ({ ...sg, order: index }));

          return {
            subGoals: {
              ...state.subGoals,
              [goalId]: reorderedSubGoals,
            },
          };
        }),

      // Reminders State
      reminders: [],
      addReminder: (reminder) => set((state) => ({ 
        reminders: [...state.reminders, reminder] 
      })),
      deleteReminder: (reminderId) => set((state) => ({ 
        reminders: state.reminders.filter(r => r.id !== reminderId) 
      })),

      // Templates State
      templates: [],
      addTemplate: (template) => set((state) => ({ 
        templates: [...state.templates, template] 
      })),
      updateTemplate: (templateId, updates) => set((state) => ({
        templates: state.templates.map(t => 
          t.id === templateId 
            ? { ...t, ...updates, updatedAt: new Date() }
            : t
        )
      })),
      deleteTemplate: (templateId) => set((state) => ({
        templates: state.templates.filter(t => t.id !== templateId)
      })),

      // UI State
      isLoading: false,
      setIsLoading: (loading) => set({ isLoading: loading }),
      error: null,
      setError: (error) => set({ error }),
    }),
    {
      name: 'goal-tracker-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export default useStore; 