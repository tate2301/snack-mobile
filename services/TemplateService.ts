import { Category, GoalType } from '@/utils/goal-tracking';
import { IGoalMetric } from './GoalService';
import useStore from '@/stores/useStore';

export interface ITemplate {
  id: string;
  userId: string;
  title: string;
  description?: string;
  category: Category;
  goalType: GoalType;
  defaultMetrics: IGoalMetric[];
  icon: string;
  isCustom: boolean;
  createdAt: Date;
  updatedAt: Date;
}

class TemplateService {
  private static instance: TemplateService;

  private constructor() {}

  public static getInstance(): TemplateService {
    if (!TemplateService.instance) {
      TemplateService.instance = new TemplateService();
    }
    return TemplateService.instance;
  }

  public async getTemplates(categoryId?: string, goalTypeId?: string): Promise<ITemplate[]> {
    const templates = useStore.getState().templates;
    let filteredTemplates = templates;
    
    if (categoryId) {
      filteredTemplates = filteredTemplates.filter(t => t.category.id === categoryId);
    }
    
    if (goalTypeId) {
      filteredTemplates = filteredTemplates.filter(t => t.goalType.id === goalTypeId);
    }
    
    return filteredTemplates;
  }

  public async getTemplateById(templateId: string): Promise<ITemplate | null> {
    const templates = useStore.getState().templates;
    return templates.find(t => t.id === templateId) || null;
  }

  public async createTemplate(template: Omit<ITemplate, 'id' | 'createdAt' | 'updatedAt'>): Promise<ITemplate> {
    const newTemplate: ITemplate = {
      ...template,
      id: 'template_' + Date.now(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    useStore.getState().addTemplate(newTemplate);
    return newTemplate;
  }

  public async updateTemplate(templateId: string, updates: Partial<ITemplate>): Promise<void> {
    useStore.getState().updateTemplate(templateId, updates);
  }

  public async deleteTemplate(templateId: string): Promise<void> {
    useStore.getState().deleteTemplate(templateId);
  }
}

export default TemplateService; 