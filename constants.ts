
import { ActivityType, LongevityPlan, UserProfile } from './types';

export const INITIAL_PLAN: LongevityPlan = {
  week: [
    {
      day: 'Monday',
      items: [
        { id: '1', time: '06:00', activity: 'Waking & Hydration', type: ActivityType.BIOHACK, description: '500ml water with electrolytes and lemon.', completed: false },
        { id: '2', time: '06:15', activity: 'Cold Plunge', type: ActivityType.BIOHACK, description: '2 mins @ 10°C. Activates brown fat and boosts dopamine.', completed: false },
        { id: '3', time: '06:30', activity: 'Morning Longevity Stack', type: ActivityType.SUPPLEMENT, description: '1g NMN, 500mg Resveratrol, D3+K2, High-EPA Omega-3.', completed: false },
        { id: '4', time: '07:00', activity: 'Zone 2 Cardio', type: ActivityType.EXERCISE, description: '45 mins brisk incline walk. Target heart rate: 65-75% of max.', completed: false },
        { id: '5', time: '12:00', activity: 'Blueprint Meal: Nutty Pudding', type: ActivityType.MEAL, description: 'Macadamia nuts, walnuts, flaxseeds, berries, pomegranate juice, and pea protein.', completed: false },
        { id: '6', time: '18:00', activity: 'Last Meal: Super Veggie', type: ActivityType.MEAL, description: 'Lentils, broccoli, cauliflower, ginger, garlic, and wild salmon.', completed: false },
        { id: '7', time: '21:00', activity: 'Evening Protocol', type: ActivityType.SLEEP, description: 'Magnesium Threonate + 5m Box Breathing. No screens.', completed: false },
      ]
    },
    {
      day: 'Tuesday',
      items: [
        { id: 't1', time: '07:00', activity: 'Strength Training', type: ActivityType.EXERCISE, description: 'Compound lifts (Squats, Deadlifts). Focus on slow eccentric control.', completed: false },
        { id: 't2', time: '17:00', activity: 'Sauna Session', type: ActivityType.BIOHACK, description: '20 mins dry heat. Mimics cardio stress and repairs proteins.', completed: false },
      ]
    },
    { day: 'Wednesday', items: [] },
    { day: 'Thursday', items: [] },
    { day: 'Friday', items: [] },
    { day: 'Saturday', items: [] },
    { day: 'Sunday', items: [] },
  ]
};

export const DEFAULT_PROFILE: UserProfile = {
  age: '38',
  gender: 'Male',
  ethnicity: 'Not Specified',
  height: '182cm',
  weight: '78kg',
  lifestyle: 'Moderately Active',
  goals: 'Reverse biological age by 5 years, reach peak VO2 Max, optimize mitochondrial energy.',
  healthMetrics: {
    dailySteps: '12000',
    activeCalories: '550',
    vo2Max: '46',
    flightsClimbed: '15',
    avgHeartRate: '60',
    restingHeartRate: '52',
    hrv: '78',
    bloodOxygen: '99',
    respiratoryRate: '13',
    totalSleepMinutes: '480',
    deepSleepMinutes: '125',
    remSleepMinutes: '110',
    sleepEfficiency: '95',
    weightKg: '78',
    bodyFatPercentage: '14.5',
    bloodGlucoseMgDl: '82',
    insulinMicroIU: '3.5',
    mindfulMinutes: '15',
    caffeineMg: '100',
    lastSynced: 'Just Now',
    isConnected: true
  }
};

export const COLORS = {
  primary: '#D4AF37', // Imperial Gold
  secondary: '#1A1A1A', // Deep Charcoal
  accent: '#722F37', // Wine / Roman Red
  background: '#050505',
  glass: 'rgba(13, 13, 13, 0.7)',
};
