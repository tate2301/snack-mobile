import { Category,  GoalType , metrics,   } from "@/utils/goal-tracking";
import { IGoal, IGoalMetric } from "./GoalService";

export interface IGoalBuilder {
  setTitle(title: string): GoalBuilder;
  setDescription(description: string): GoalBuilder;
  setCategory(category: Category): GoalBuilder;
  setGoalType(goalType: GoalType): GoalBuilder;
  addMetric(metric: IGoalMetric): GoalBuilder;
  build(): IGoal;
}

export class GoalBuilder implements IGoalBuilder {
  private goal: Partial<IGoal>;

  constructor(userId: string) {
    this.goal = {
      userId,
      metrics: [],
      progress: 0,
      isCompleted: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  public setTitle(title: string): GoalBuilder {
    this.goal.title = title;
    return this;
  }

  public setDescription(description: string): GoalBuilder {
    this.goal.description = description;
    return this;
  }

  public setCategory(category: Category): GoalBuilder {
    this.goal.category = category;
    return this;
  }

  public setGoalType(goalType: GoalType): GoalBuilder {
    this.goal.goalType = goalType;
    return this;
  }

  public addMetric(metric: IGoalMetric): GoalBuilder {
    if (!this.goal.metrics) {
      this.goal.metrics = [];
    }
    this.goal.metrics.push(metric);
    return this;
  }

  public build(): IGoal {
    if (
      !this.goal.title ||
      !this.goal.category ||
      !this.goal.goalType ||
      this.goal.metrics?.length === 0
    ) {
      throw new Error(
        "Title, Category, Goal Type, and at least one Metric are required to build a Goal."
      );
    }

    return {
      id: "goal_" + Date.now(),
      userId: this.goal.userId!,
      title: this.goal.title,
      description: this.goal.description || "",
      category: this.goal.category,
      goalType: this.goal.goalType,
      metrics: this.goal.metrics || [],
      progress: this.goal.progress!,
      isCompleted: this.goal.isCompleted!,
      createdAt: this.goal.createdAt!,
      updatedAt: this.goal.updatedAt!,
    };
  }
}
