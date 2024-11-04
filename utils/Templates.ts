import { IGoalMetric } from "@/services/GoalService";
import { categories } from "./goal-tracking";
import { goalTypes } from "./goal-tracking";
import { metrics } from "./goal-tracking";

export interface ITemplate {
    id: string;
    title: string;
    description?: string;
    categoryId: string;
    goalTypeId: string;
    defaultMetrics: IGoalMetric[];
    icon: string; // Icon representing the template
  }


  const template1: ITemplate = {
  id: 'template1',
  title: 'Save $5,000 in 6 Months',
  description: 'A plan to save $5,000 over the next 6 months.',
  categoryId: categories.financial.id,
  goalTypeId: goalTypes.savingsGoal.id,
  defaultMetrics: [
    { ...metrics.targetAmount, targetValue: 5000 },
    { ...metrics.currentAmount, targetValue: 0 },
    { ...metrics.startDate, targetValue: new Date().toISOString() },
    {
      ...metrics.endDate,
      targetValue: new Date(new Date().setMonth(new Date().getMonth() + 6)).toISOString(),
    },
  ],
  icon: 'savings',
};

const template2: ITemplate = {
    id: 'template2',
    title: 'Walk 10,000 Steps Daily',
    description: 'Aim to walk 10,000 steps every day for better health.',
    categoryId: categories.healthAndFitness.id,
    goalTypeId: goalTypes.stepCountGoal.id,
    defaultMetrics: [
      { ...metrics.stepsCounted, targetValue: 10000 },
      { ...metrics.startDate, targetValue: new Date().toISOString() },
      {
        ...metrics.endDate,
        targetValue: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString(),
      },
    ],
    icon: 'directions_walk',
  };

  const template3: ITemplate = {
    id: 'template3',
    title: 'Read 12 Books This Year',
    description: 'Challenge yourself to read one book per month.',
    categoryId: categories.personalDevelopment.id,
    goalTypeId: goalTypes.readingGoal.id,
    defaultMetrics: [
      { ...metrics.numberOfBooksRead, targetValue: 12 },
      { ...metrics.startDate, targetValue: new Date().toISOString() },
      {
        ...metrics.endDate,
        targetValue: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString(),
      },
    ],
    icon: 'menu_book',
  };

  const template4: ITemplate = {
    id: 'template4',
    title: 'Lose 10kg in 3 Months',
    description: 'A weight loss plan to lose 10kg over 3 months.',
    categoryId: categories.healthAndFitness.id,
    goalTypeId: goalTypes.weightLossGoal.id,
    defaultMetrics: [
      { ...metrics.weight, targetValue: 0 }, // User needs to input current weight
      { ...metrics.startDate, targetValue: new Date().toISOString() },
      {
        ...metrics.endDate,
        targetValue: new Date(new Date().setMonth(new Date().getMonth() + 3)).toISOString(),
      },
    ],
    icon: 'fitness_center',
  };
  
  const template5: ITemplate = {
    id: 'template5',
    title: 'Study 200 Hours for the Upcoming Exam',
    description: 'Prepare for your exam by dedicating sufficient study time.',
    categoryId: categories.personalDevelopment.id,
    goalTypeId: goalTypes.studyHoursGoal.id,
    defaultMetrics: [
      { ...metrics.hoursSpentStudying, targetValue: 200 },
      { ...metrics.startDate, targetValue: new Date().toISOString() },
      {
        ...metrics.endDate,
        targetValue: new Date(new Date().setMonth(new Date().getMonth() + 2)).toISOString(),
      },
    ],
    icon: 'school',
  };

  const template6: ITemplate = {
    id: 'template6',
    title: 'Complete 50 Workouts in 6 Months',
    description: 'Stay active by completing regular workout sessions.',
    categoryId: categories.healthAndFitness.id,
    goalTypeId: goalTypes.workoutGoal.id,
    defaultMetrics: [
      { ...metrics.numberOfWorkouts, targetValue: 50 },
      { ...metrics.startDate, targetValue: new Date().toISOString() },
      {
        ...metrics.endDate,
        targetValue: new Date(new Date().setMonth(new Date().getMonth() + 6)).toISOString(),
      },
    ],
    icon: 'fitness_center',
  };

  const templates: ITemplate[] = [template1, template2, template3, template4, template5, template6];