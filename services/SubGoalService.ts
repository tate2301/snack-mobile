import useStore from '@/stores/useStore';
import { IGoalMetric } from './GoalService';

export interface ISubGoal {
  id: string;
  goalId: string;
  title: string;
  description?: string;
  metrics: IGoalMetric[];
  isCompleted: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

class SubGoalService {
  private static instance: SubGoalService;

  private constructor() {}

  public static getInstance(): SubGoalService {
    if (!SubGoalService.instance) {
      SubGoalService.instance = new SubGoalService();
    }
    return SubGoalService.instance;
  }

  public async getSubGoals(goalId: string): Promise<ISubGoal[]> {
    return useStore.getState().subGoals[goalId] || [];
  }

  public async addSubGoal(subgoal: Omit<ISubGoal, 'id' | 'order' | 'createdAt' | 'updatedAt'>): Promise<ISubGoal> {
    const newSubGoal: ISubGoal = {
      ...subgoal,
      id: 'subgoal_' + Date.now(),
      order: (useStore.getState().subGoals[subgoal.goalId] || []).length,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    useStore.getState().addSubGoal(newSubGoal);
    return newSubGoal;
  }

  public async updateSubGoal(id: string, updates: Partial<ISubGoal>): Promise<void> {
    useStore.getState().updateSubGoal(id, { ...updates, updatedAt: new Date() });
  }

  public async deleteSubGoal(goalId: string, id: string): Promise<void> {
    useStore.getState().deleteSubGoal(goalId, id);
  }

  public async reorderSubGoals(goalId: string, orderedIds: string[]): Promise<void> {
    useStore.getState().reorderSubGoals(goalId, orderedIds);
  }
}

export default SubGoalService; 