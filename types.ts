
export interface Meal {
  day: number;
  mealName: string;
  imagePrompt: string;
  imageUrl?: string;
}

export type MealPlan = Meal[];
