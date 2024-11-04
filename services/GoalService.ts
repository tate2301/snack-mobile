import { Category, GoalType } from '@/utils/goal-tracking';
import useStore from '@/stores/useStore';

export interface IGoalMetric {
  id: string;
  name: string;
  icon: string;
  currentValue: number;
  targetValue: number;
}

export interface IGoal {
  id: string;
  userId: string;
  title: string;
  description?: string;
  category: Category;
  goalType: GoalType;
  metrics: IGoalMetric[];
  progress: number;
  isCompleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

class GoalService {
  private static instance: GoalService;

  private constructor() {}

  public static getInstance(): GoalService {
    if (!GoalService.instance) {
      GoalService.instance = new GoalService();
    }
    return GoalService.instance;
  }

  public async getGoals(): Promise<IGoal[]> {
    return useStore.getState().goals;
  }

  public async createGoal(goal: IGoal): Promise<void> {
    useStore.getState().addGoal(goal);
  }

  public async updateGoal(goalId: string, updates: Partial<IGoal>): Promise<void> {
    useStore.getState().updateGoal(goalId, updates);
  }

  public async deleteGoal(goalId: string): Promise<void> {
    useStore.getState().deleteGoal(goalId);
  }
}

export default GoalService;
