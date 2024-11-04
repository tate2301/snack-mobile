import { IGoalMetric } from "@/services/GoalService";

interface GoalType {
  id: string;
  name: string;
  icon: string; // Material Symbols icon name
  metrics: IGoalMetric[];
}

interface Category {
  id: string;
  name: string;
  icon: string; // Material Symbols icon name
  goalTypes: GoalType[];
}

interface GoalTemplate {
  id: string;
  title: string;
  categoryId: string;
  goalTypeId: string;
  metrics: { [metricId: string]: any }; // Default values for metrics
}

interface IGoalTrackingManager {
  getGoalTypeById(id: string): GoalType | undefined;
  listGoalTypes(): GoalType[];
  getMetricById(id: string): IGoalMetric | undefined;
  listMetrics(): IGoalMetric[];
  getCategoryById(id: string): Category | undefined;
  listCategories(): Category[];
}

// Metrics Dictionary
const metrics: { [id: string]: IGoalMetric } = {
  percentageAchieved: {
    id: "percentageAchieved",
    name: "Percentage Achieved",
    icon: "percent",
    currentValue: 0,
    targetValue: 0,
  },
  startDate: {
    id: "startDate",
    name: "Start Date",
    icon: "today",
    currentValue: 0,
    targetValue: 0,
  },
  endDate: {
    id: "endDate",
    name: "End Date",
    icon: "event",
    currentValue: 0,
    targetValue: 0,
  },
  numberOfSessions: {
    id: "numberOfSessions",
    name: "Number of Sessions",
    icon: "format_list_numbered",
    currentValue: 0,
    targetValue: 0,
  },
  durationOfWorkouts: {
    id: "durationOfWorkouts",
    name: "Duration of Workouts",
    icon: "timer",
    currentValue: 0,
    targetValue: 0,
  },
  caloriesBurned: {
    id: "caloriesBurned",
    name: "Calories Burned",
    icon: "local_fire_department",
    currentValue: 0,
    targetValue: 0,
  },
  startWeight: {
    id: "startWeight",
    name: "Start Weight",
    icon: "fitness_center",
    currentValue: 0,
    targetValue: 0,
  },
  currentWeight: {
    id: "currentWeight",
    name: "Current Weight",
    icon: "fitness_center",
    currentValue: 0,
    targetValue: 0,
  },
  goalWeight: {
    id: "goalWeight",
    name: "Goal Weight",
    icon: "flag",
    currentValue: 0,
    targetValue: 0,
  },
  stepsCounted: {
    id: "stepsCounted",
    name: "Steps Counted",
    icon: "directions_walk",
    currentValue: 0,
    targetValue: 0,
  },
  numberOfDaysPracticed: {
    id: "numberOfDaysPracticed",
    name: "Number of Days Practiced",
    icon: "calendar_today",
    currentValue: 0,
    targetValue: 0,
  },
  durationPerSession: {
    id: "durationPerSession",
    name: "Duration per Session",
    icon: "timer",
    currentValue: 0,
    targetValue: 0,
  },
  entriesCompleted: {
    id: "entriesCompleted",
    name: "Entries Completed",
    icon: "edit",
    currentValue: 0,
    targetValue: 0,
  },
  habitsMaintained: {
    id: "habitsMaintained",
    name: "Habits Maintained",
    icon: "check_circle",
    currentValue: 0,
    targetValue: 0,
  },
  numberOfBooksRead: {
    id: "numberOfBooksRead",
    name: "Number of Books Read",
    icon: "book",
    currentValue: 0,
    targetValue: 0,
  },
  pagesCompleted: {
    id: "pagesCompleted",
    name: "Pages Completed",
    icon: "chrome_reader_mode",
    currentValue: 0,
    targetValue: 0,
  },
  coursesCompleted: {
    id: "coursesCompleted",
    name: "Courses Completed",
    icon: "assignment_turned_in",
    currentValue: 0,
    targetValue: 0,
  },
  coursesEnrolled: {
    id: "coursesEnrolled",
    name: "Courses Enrolled",
    icon: "assignment",
    currentValue: 0,
    targetValue: 0,
  },
  hoursSpentStudying: {
    id: "hoursSpentStudying",
    name: "Hours Spent Studying",
    icon: "timer",
    currentValue: 0,
    targetValue: 0,
  },
  skillLevelProgression: {
    id: "skillLevelProgression",
    name: "Skill Level Progression",
    icon: "trending_up",
    currentValue: 0,
    targetValue: 0,
  },
  hoursSpentPracticing: {
    id: "hoursSpentPracticing",
    name: "Hours Spent Practicing",
    icon: "timer",
    currentValue: 0,
    targetValue: 0,
  },
  numberOfTasksCompleted: {
    id: "numberOfTasksCompleted",
    name: "Number of Tasks Completed",
    icon: "check_box",
    currentValue: 0,
    targetValue: 0,
  },
  totalTasks: {
    id: "totalTasks",
    name: "Total Tasks",
    icon: "format_list_bulleted",
    currentValue: 0,
    targetValue: 0,
  },
  percentageOfToDoCompletion: {
    id: "percentageOfToDoCompletion",
    name: "Percentage of To-Do Completion",
    icon: "donut_large",
    currentValue: 0,
    targetValue: 0,
  },
  timeSpentOnTasks: {
    id: "timeSpentOnTasks",
    name: "Time Spent on Tasks",
    icon: "timer",
    currentValue: 0,
    targetValue: 0,
  },
  pomodoroSessionsCompleted: {
    id: "pomodoroSessionsCompleted",
    name: "Pomodoro Sessions Completed",
    icon: "alarm",
    currentValue: 0,
    targetValue: 0,
  },
  numberOfMilestonesCompleted: {
    id: "numberOfMilestonesCompleted",
    name: "Number of Milestones Completed",
    icon: "flag",
    currentValue: 0,
    targetValue: 0,
  },
  totalMilestones: {
    id: "totalMilestones",
    name: "Total Milestones",
    icon: "format_list_numbered",
    currentValue: 0,
    targetValue: 0,
  },
  projectCompletionPercentage: {
    id: "projectCompletionPercentage",
    name: "Project Completion Percentage",
    icon: "donut_large",
    currentValue: 0,
    targetValue: 0,
  },
  tasksCompleted: {
    id: "tasksCompleted",
    name: "Tasks Completed",
    icon: "check_box",
    currentValue: 0,
    targetValue: 0,
  },
  timeSpentOnPlanning: {
    id: "timeSpentOnPlanning",
    name: "Time Spent on Planning",
    icon: "timer",
    currentValue: 0,
    targetValue: 0,
  },
  eventDate: {
    id: "eventDate",
    name: "Event Date",
    icon: "event",
    currentValue: 0,
    targetValue: 0,
  },
};

// Goal Types Dictionary
const goalTypes: { [id: string]: GoalType } = {
  revenueTracking: {
    id: "revenueTracking",
    name: "Revenue Tracking",
    icon: "trending_up",
    metrics: [
      metrics.targetAmount,
      metrics.currentAmount,
      metrics.startDate,
      metrics.endDate,
      metrics.percentageAchieved,
    ],
  },
  savings: {
    id: "savings",
    name: "Savings",
    icon: "savings",
    metrics: [
      metrics.targetAmount,
      metrics.currentAmount,
      metrics.startDate,
      metrics.endDate,
      metrics.percentageAchieved,
    ],
  },
  budgetManagement: {
    id: "budgetManagement",
    name: "Budget Management",
    icon: "account_balance_wallet",
    metrics: [
      metrics.targetAmount,
      metrics.currentAmount,
      metrics.startDate,
      metrics.endDate,
    ],
  },
  workouts: {
    id: "workouts",
    name: "Workouts",
    icon: "fitness_center",
    metrics: [
      metrics.numberOfSessions,
      metrics.durationOfWorkouts,
      metrics.caloriesBurned,
      metrics.startDate,
      metrics.endDate,
    ],
  },
  weightManagement: {
    id: "weightManagement",
    name: "Weight Management",
    icon: "monitor_weight",
    metrics: [
      metrics.startWeight,
      metrics.currentWeight,
      metrics.goalWeight,
      metrics.startDate,
      metrics.endDate,
    ],
  },
  stepCount: {
    id: "stepCount",
    name: "Step Count",
    icon: "directions_walk",
    metrics: [metrics.stepsCounted, metrics.startDate, metrics.endDate],
  },
  meditation: {
    id: "meditation",
    name: "Meditation",
    icon: "self_improvement",
    metrics: [
      metrics.numberOfDaysPracticed,
      metrics.durationPerSession,
      metrics.startDate,
      metrics.endDate,
    ],
  },
  journaling: {
    id: "journaling",
    name: "Journaling",
    icon: "menu_book",
    metrics: [metrics.entriesCompleted, metrics.startDate, metrics.endDate],
  },
  habitTracking: {
    id: "habitTracking",
    name: "Habit Tracking",
    icon: "track_changes",
    metrics: [
      metrics.habitsMaintained,
      metrics.numberOfDaysPracticed,
      metrics.startDate,
      metrics.endDate,
    ],
  },
  readingBooks: {
    id: "readingBooks",
    name: "Reading Books",
    icon: "menu_book",
    metrics: [
      metrics.numberOfBooksRead,
      metrics.pagesCompleted,
      metrics.startDate,
      metrics.endDate,
    ],
  },
  completingCourses: {
    id: "completingCourses",
    name: "Completing Courses",
    icon: "school",
    metrics: [
      metrics.coursesCompleted,
      metrics.coursesEnrolled,
      metrics.hoursSpentStudying,
      metrics.startDate,
      metrics.endDate,
    ],
  },
  skillDevelopment: {
    id: "skillDevelopment",
    name: "Skill Development",
    icon: "build",
    metrics: [
      metrics.skillLevelProgression,
      metrics.hoursSpentPracticing,
      metrics.startDate,
      metrics.endDate,
    ],
  },
  dailyTasks: {
    id: "dailyTasks",
    name: "Daily Tasks",
    icon: "today",
    metrics: [
      metrics.numberOfTasksCompleted,
      metrics.totalTasks,
      metrics.startDate,
      metrics.endDate,
    ],
  },
  weeklyToDos: {
    id: "weeklyToDos",
    name: "Weekly To-Dos",
    icon: "date_range",
    metrics: [
      metrics.percentageOfToDoCompletion,
      metrics.startDate,
      metrics.endDate,
    ],
  },
  timeBlocking: {
    id: "timeBlocking",
    name: "Time Blocking",
    icon: "schedule",
    metrics: [
      metrics.timeSpentOnTasks,
      metrics.pomodoroSessionsCompleted,
      metrics.startDate,
      metrics.endDate,
    ],
  },
  buildingAProject: {
    id: "buildingAProject",
    name: "Building a Project",
    icon: "build",
    metrics: [
      metrics.numberOfMilestonesCompleted,
      metrics.totalMilestones,
      metrics.projectCompletionPercentage,
      metrics.timeSpentOnTasks,
      metrics.startDate,
      metrics.endDate,
    ],
  },
  eventPlanning: {
    id: "eventPlanning",
    name: "Event Planning",
    icon: "event",
    metrics: [
      metrics.tasksCompleted,
      metrics.totalTasks,
      metrics.timeSpentOnPlanning,
      metrics.startDate,
      metrics.eventDate,
    ],
  },
};

// Categories Dictionary
const categories: { [id: string]: Category } = {
  finance: {
    id: "financialGoals",
    name: "Financial Goals",
    icon: "attach_money",
    goalTypes: [
      goalTypes.revenueTracking,
      goalTypes.savings,
      goalTypes.budgetManagement,
    ],
  },
  healthAndFitnessGoals: {
    id: "healthAndFitnessGoals",
    name: "Health and Fitness Goals",
    icon: "fitness_center",
    goalTypes: [
      goalTypes.workouts,
      goalTypes.weightManagement,
      goalTypes.stepCount,
    ],
  },
  personalDevelopmentGoals: {
    id: "personalDevelopmentGoals",
    name: "Personal Development Goals",
    icon: "self_improvement",
    goalTypes: [
      goalTypes.meditation,
      goalTypes.journaling,
      goalTypes.habitTracking,
    ],
  },
  learningAndEducationalGoals: {
    id: "learningAndEducationalGoals",
    name: "Learning and Educational Goals",
    icon: "school",
    goalTypes: [
      goalTypes.readingBooks,
      goalTypes.completingCourses,
      goalTypes.skillDevelopment,
    ],
  },
  productivityAndTimeManagementGoals: {
    id: "productivityAndTimeManagementGoals",
    name: "Productivity and Time Management Goals",
    icon: "schedule",
    goalTypes: [
      goalTypes.dailyTasks,
      goalTypes.weeklyToDos,
      goalTypes.timeBlocking,
    ],
  },
  projectManagementGoals: {
    id: "projectManagementGoals",
    name: "Project Management Goals",
    icon: "assignment",
    goalTypes: [goalTypes.buildingAProject, goalTypes.eventPlanning],
  },
};

class GoalTrackingMananger implements IGoalTrackingManager {
  getGoalTypeById(id: string): GoalType | undefined {
    throw new Error("Method not implemented.");
  }
  listGoalTypes(): GoalType[] {
    throw new Error("Method not implemented.");
  }
  getMetricById(id: string): IGoalMetric | undefined {
    throw new Error("Method not implemented.");
  }
  listMetrics(): IGoalMetric[] {
    throw new Error("Method not implemented.");
  }
  getCategoryById(id: string): Category | undefined {
    throw new Error("Method not implemented.");
  }
  listCategories(): Category[] {
    throw new Error("Method not implemented.");
  }
}

export {
  GoalTrackingMananger,
  IGoalTrackingManager,
  metrics,
  goalTypes,
  categories,
  GoalType,
  Category,
};
