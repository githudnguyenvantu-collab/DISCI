export type Gender = 'male' | 'female' | 'other';

export type FitnessGoal = 'muscle_gain' | 'fat_loss' | 'endurance' | 'general_health';

export type WorkoutEnvironment = 'home' | 'dormitory' | 'outdoor' | 'gym';

export type EquipmentOption = 'none' | 'resistance_band' | 'dumbbells' | 'pullup_bar' | 'gym_equipment';

export type ExperienceLevel = 'beginner' | 'intermediate' | 'advanced';

export type HealthStatusLevel = 'good' | 'caution' | 'high_warning';

export interface UserProfile {
  id: string;
  name: string;
  age: number;
  gender: Gender;
  heightCm: number;
  weightKg: number;
  goal: FitnessGoal;
  experienceLevel: ExperienceLevel;
  daysPerWeek: number;
  durationMinutes: number;
  preferredTimeSlot: string;
  environment: WorkoutEnvironment;
  equipment: EquipmentOption[];
  quietDormitoryMode: boolean; // Chế độ ký túc xá ít ồn, ít không gian
  createdAt: string;
  updatedAt: string;
}

export interface BodyMetricRecord {
  id: string;
  userId: string;
  date: string;
  weightKg: number;
  heightCm: number;
  bmi: number;
  bodyFatPercent?: number;
  notes?: string;
}

export interface HealthRecord {
  id: string;
  userId: string;
  recordedAt: string;
  facilityName?: string;
  systolicBp?: number; // mmHg
  diastolicBp?: number; // mmHg
  restingHeartRate?: number; // bpm
  fastingBloodGlucose?: number; // mg/dL
  totalCholesterol?: number; // mg/dL
  ldlCholesterol?: number; // mg/dL
  triglycerides?: number; // mg/dL
  jointBoneIssues?: string[];
  doctorExerciseRestrictions?: string; // Khuyến cáo bác sĩ
  doctorAllowedIntensity?: 'low' | 'moderate' | 'normal';
  medicalNotes?: string;
  attachmentFileName?: string;
  attachmentFileType?: 'pdf' | 'image';
  attachmentUrl?: string;
  consentForWorkoutAdjustment: boolean;
}

export interface HealthAssessment {
  status: HealthStatusLevel;
  statusLabel: string;
  summary: string;
  warnings: string[];
  cautions: string[];
  recommendations: string[];
  medicalDisclaimer: string;
  requiresDoctorClearance: boolean;
}

export interface Exercise {
  id: string;
  name: string;
  targetMuscles: string[];
  goalCategories: FitnessGoal[];
  difficulty: ExperienceLevel;
  durationSeconds?: number;
  defaultReps?: number;
  defaultSets: number;
  restSeconds: number;
  requiredEquipment: EquipmentOption;
  environmentSuitability: WorkoutEnvironment[];
  impactLevel: 'low' | 'medium' | 'high';
  isQuietDormFriendly: boolean;
  dormitoryAlternativeExerciseId?: string;
  jointFriendlyAlternativeId?: string;
  contraindications: string[]; // ví dụ: ['knee_pain', 'hypertension', 'lower_back_pain']
  instructions: string[];
  startingPosture: string;
  finishingPosture: string;
  commonMistakes: string[];
  difficultyAdjustments: {
    easier: string;
    harder: string;
  };
  demoImageUrl?: string;
}

export interface WorkoutExerciseItem {
  exerciseId: string;
  sets: number;
  reps?: number;
  durationSeconds?: number;
  restSeconds: number;
  isAlternative?: boolean;
  notes?: string;
}

export interface WorkoutDayPlan {
  id: string;
  dayOfWeek: number; // 1 = Thứ 2, 7 = Chủ nhật
  dayName: string;
  targetFocus: string;
  isRestDay: boolean;
  warmupMinutes: number;
  warmupNotes: string;
  exercises: WorkoutExerciseItem[];
  cooldownMinutes: number;
  cooldownNotes: string;
  estimatedMinutes: number;
  completed: boolean;
}

export interface WorkoutPlan {
  id: string;
  userId: string;
  weekNumber: number;
  startDate: string;
  goal: FitnessGoal;
  quietModeApplied: boolean;
  days: WorkoutDayPlan[];
}

export interface WorkoutSessionLog {
  id: string;
  planId: string;
  dayOfWeek: number;
  date: string;
  actualDurationMinutes: number;
  difficultyRating: 1 | 2 | 3 | 4 | 5; // 1: rất nhẹ -> 5: quá sức
  painReported: boolean;
  painLocation?: string;
  painSeverity?: 'light' | 'severe';
  fatigueLevel: 'good' | 'tired' | 'exhausted';
  notes?: string;
  completedExercisesCount: number;
  totalExercisesCount: number;
}

export interface DailyCheckIn {
  id: string;
  userId: string;
  date: string;
  sleepHoursStatus: 'sufficient' | 'insufficient'; // Đủ / Ít
  musclePainStatus: 'none' | 'light' | 'severe'; // Không / Nhẹ / Nhiều
  painArea?: string;
  fatigueStatus: 'okay' | 'tired'; // Ổn / Mệt
  actionTaken?: string;
}

export interface Product {
  id: string;
  name: string;
  category: 'essential' | 'secondary' | 'gym_replacement';
  estimatedPriceVnd: number;
  gymCompareCostVnd: number; // So sánh với chi phí phòng gym
  purpose: string;
  isNecessaryForBeginner: boolean;
  budgetPriority: 1 | 2 | 3; // 1 = cao nhất, rẻ nhất
  reasonRecommended: string;
  supplierInfo?: string;
  inStock: boolean;
  rating: number;
  imageUrl: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  subtotalVnd: number;
  shippingFeeVnd: number;
  totalVnd: number;
  customerName: string;
  phone: string;
  address: string;
  paymentMethod: 'cod' | 'vietqr' | 'momo';
  paymentStatus: 'pending' | 'success';
  orderStatus: 'pending_confirmation' | 'confirmed' | 'shipping' | 'delivered';
  createdAt: string;
}

export type PostVisibility = 'public' | 'friends' | 'private';

export interface PostComment {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  content: string;
  createdAt: string;
}

export interface CommunityPost {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  authorBio?: string;
  createdAt: string;
  content: string;
  mediaType?: 'image' | 'video' | 'workout_summary';
  mediaUrl?: string;
  videoDurationSeconds?: number;
  videoPosterUrl?: string;
  workoutSummary?: {
    focusName: string;
    durationMinutes: number;
    exercisesDone: number;
  };
  hashtags: string[];
  visibility: PostVisibility;
  likesCount: number;
  isLikedByMe: boolean;
  comments: PostComment[];
  isSavedByMe: boolean;
  isReported?: boolean;
}

export interface CommunityChallenge {
  id: string;
  title: string;
  description: string;
  durationDays: number;
  participantsCount: number;
  joined: boolean;
  currentDayProgress: number;
  badgeName: string;
}

export interface UserAchievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: string;
  isUnlocked: boolean;
}

export interface NutritionPlanRecommendation {
  tdeeKcal: number;
  targetKcal: number;
  targetProteinGramsMin: number;
  targetProteinGramsMax: number;
  calorieAdjustmentReason: string;
  dailyMeals: {
    mealName: 'Bữa sáng' | 'Bữa trưa' | 'Bữa tối' | 'Bữa phụ';
    dishName: string;
    estimatedKcal: number;
    estimatedProtein: number;
    estimatedCostVnd: number;
    budgetSavingTip: string;
  }[];
  disclaimer: string;
}

export interface NotificationSettings {
  workoutReminder: boolean;
  dailyCheckInReminder: boolean;
  reminderTime: string; // HH:mm
  activeDays: number[]; // 1-7
  communityInteractions: boolean;
  quietHoursEnabled: boolean;
}
