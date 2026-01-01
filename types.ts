
export enum ActivityType {
  SUPPLEMENT = 'SUPPLEMENT',
  MEAL = 'MEAL',
  EXERCISE = 'EXERCISE',
  SLEEP = 'SLEEP',
  FASTING = 'FASTING',
  BIOHACK = 'BIOHACK'
}

export interface PlanItem {
  id: string;
  time: string;
  activity: string;
  type: ActivityType;
  description: string;
  completed: boolean;
}

export interface DailyPlan {
  day: string;
  items: PlanItem[];
}

export interface LongevityPlan {
  week: DailyPlan[];
}

export interface GroceryItem {
  category: string;
  items: string[];
}

export interface HealthMetrics {
  // Activity
  dailySteps: string;
  activeCalories: string;
  vo2Max: string;
  flightsClimbed: string;
  
  // Vitals
  avgHeartRate: string;
  restingHeartRate: string;
  hrv: string;
  bloodOxygen: string;
  respiratoryRate: string;
  
  // Sleep
  totalSleepMinutes: string;
  deepSleepMinutes: string;
  remSleepMinutes: string;
  sleepEfficiency: string; // percentage
  
  // Body & Metabolic
  weightKg: string;
  bodyFatPercentage: string;
  bloodGlucoseMgDl: string;
  insulinMicroIU: string;
  
  // Lifestyle
  mindfulMinutes: string;
  caffeineMg: string;
  
  lastSynced: string;
  isConnected: boolean;
}

export interface UserProfile {
  age: string;
  gender: string;
  ethnicity: string;
  height: string;
  weight: string;
  lifestyle: string;
  goals: string;
  healthMetrics?: HealthMetrics;
}

export type AppTab = 'dashboard' | 'daily' | 'weekly' | 'voice' | 'profile' | 'integrations' | 'grocery' | 'export';
