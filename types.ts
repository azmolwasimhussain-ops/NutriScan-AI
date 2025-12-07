export interface NutritionData {
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  fiber: number;
  sodium: number;
}

export interface DietaryInfo {
  type: 'Veg' | 'Non-veg' | 'Vegan';
  isGlutenFree: boolean;
  isDairyFree: boolean;
}

export interface FoodAnalysisResult {
  dishName: string;
  portionSize: string;
  nutrition: NutritionData;
  ingredients: string[];
  healthRating: number;
  healthRatingReason: string;
  dietaryInfo: DietaryInfo;
  allergens: string[];
  healthierAlternative: string;
}

export enum InputMode {
  UPLOAD = 'UPLOAD',
  TEXT = 'TEXT'
}

export interface ChartData {
  name: string;
  value: number;
  fill: string;
}
