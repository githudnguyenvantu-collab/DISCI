import React, { createContext, useContext, useEffect, useState } from 'react';
import { STORE_PRODUCTS } from '../../data/products';
import {
  BodyMetricRecord,
  CartItem,
  CommunityChallenge,
  CommunityPost,
  DailyCheckIn,
  HealthRecord,
  NotificationSettings,
  Order,
  UserAchievement,
  UserProfile,
  WorkoutPlan,
  WorkoutSessionLog
} from '../../types';
import { calculateBmi } from '../health/metrics';
import { generateWeeklyWorkoutPlan } from '../workout/scheduler';

interface AppStoreContextType {
  // Profile
  profile: UserProfile;
  updateProfile: (updated: Partial<UserProfile>) => void;

  // Body Metrics
  bodyMetrics: BodyMetricRecord[];
  addBodyMetric: (weightKg: number, heightCm: number, notes?: string) => void;

  // Health Record
  healthRecord: HealthRecord | null;
  saveHealthRecord: (record: Partial<HealthRecord>) => void;
  deleteHealthRecord: () => void;
  revokeHealthConsent: () => void;

  // Workout Plan
  currentPlan: WorkoutPlan | null;
  createNewPlan: (forceQuiet?: boolean) => void;
  toggleDayComplete: (dayOfWeek: number) => void;
  substituteDayExercise: (dayOfWeek: number, exerciseIndex: number, newExerciseId: string) => void;

  // Workout Session Logs
  sessionLogs: WorkoutSessionLog[];
  logCompletedSession: (log: Omit<WorkoutSessionLog, 'id'>) => void;

  // Daily Check-ins
  dailyCheckIns: DailyCheckIn[];
  recordDailyCheckIn: (checkIn: Omit<DailyCheckIn, 'id' | 'userId' | 'date'>) => void;

  // Store & Orders
  cart: CartItem[];
  addToCart: (productId: string, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  orders: Order[];
  createOrder: (orderData: Omit<Order, 'id' | 'userId' | 'createdAt'>) => Order;

  // Community
  posts: CommunityPost[];
  addPost: (post: Omit<CommunityPost, 'id' | 'authorId' | 'authorName' | 'authorAvatar' | 'createdAt' | 'likesCount' | 'isLikedByMe' | 'comments' | 'isSavedByMe'>) => void;
  toggleLikePost: (postId: string) => void;
  addCommentToPost: (postId: string, content: string) => void;
  toggleSavePost: (postId: string) => void;
  reportPost: (postId: string) => void;
  deletePost: (postId: string) => void;

  // Challenges & Achievements
  challenges: CommunityChallenge[];
  toggleJoinChallenge: (challengeId: string) => void;
  achievements: UserAchievement[];

  // Notifications
  notifications: NotificationSettings;
  updateNotifications: (settings: Partial<NotificationSettings>) => void;

  // Offline & Data Management
  syncStatus: 'synced' | 'pending' | 'offline';
  triggerManualSync: () => Promise<void>;
  resetAllData: () => void;
  exportDataJson: () => string;
}

const STORAGE_KEY = 'disci_app_v1_store';

const DEFAULT_PROFILE: UserProfile = {
  id: 'usr-viet-001',
  name: 'Nguyễn Văn Tuấn',
  age: 23,
  gender: 'male',
  heightCm: 172,
  weightKg: 66,
  goal: 'muscle_gain',
  experienceLevel: 'beginner',
  daysPerWeek: 3,
  durationMinutes: 30,
  preferredTimeSlot: '18:00 - 19:00',
  environment: 'home',
  equipment: ['none', 'resistance_band'],
  quietDormitoryMode: false,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

const DEFAULT_BODY_METRICS: BodyMetricRecord[] = [
  {
    id: 'bm-1',
    userId: 'usr-viet-001',
    date: '2026-09-15',
    weightKg: 68.5,
    heightCm: 172,
    bmi: 23.2,
    notes: 'Bắt đầu đặt mục tiêu rèn luyện tại nhà'
  },
  {
    id: 'bm-2',
    userId: 'usr-viet-001',
    date: '2026-10-01',
    weightKg: 67.2,
    heightCm: 172,
    bmi: 22.7,
    notes: 'Tập đều đặn tuần 3 buổi'
  },
  {
    id: 'bm-3',
    userId: 'usr-viet-001',
    date: '2026-10-18',
    weightKg: 66.0,
    heightCm: 172,
    bmi: 22.3,
    notes: 'Cân nặng ổn định, cơ săn chắc hơn'
  }
];

const DEFAULT_CHALLENGES: CommunityChallenge[] = [
  {
    id: 'ch-7days',
    title: 'Thử thách 7 ngày tập luyện không nghỉ',
    description: 'Duy trì ít nhất 15 phút vận động hoặc giãn cơ mỗi ngày trong 7 ngày liên tiếp.',
    durationDays: 7,
    participantsCount: 384,
    joined: true,
    currentDayProgress: 4,
    badgeName: 'Chiến binh 7 Ngày'
  },
  {
    id: 'ch-quiet-dorm',
    title: 'Ký túc xá yên lặng (Dorm Quiet Master)',
    description: 'Hoàn thành 5 buổi tập với các bài tập triệt tiêu tiếng ồn, không phiền bạn cùng phòng.',
    durationDays: 14,
    participantsCount: 192,
    joined: false,
    currentDayProgress: 0,
    badgeName: 'Bậc thầy Tĩnh Lặng'
  }
];

const DEFAULT_ACHIEVEMENTS: UserAchievement[] = [
  {
    id: 'ach-first-step',
    title: 'Bước Chân Đầu Tiên',
    description: 'Hoàn thành buổi tập đầu tiên trên DISCI',
    icon: '🎯',
    isUnlocked: true,
    unlockedAt: '2026-10-02'
  },
  {
    id: 'ach-consistent-week',
    title: 'Kỷ Luật Vàng',
    description: 'Đạt 100% mục tiêu số buổi tập trong tuần',
    icon: '🔥',
    isUnlocked: true,
    unlockedAt: '2026-10-12'
  },
  {
    id: 'ach-dorm-hero',
    title: 'Người Hàng Xóm Tinh Tế',
    description: 'Bật chế độ ký túc xá ít ồn và hoàn thành buổi tập',
    icon: '🤫',
    isUnlocked: false
  },
  {
    id: 'ach-safety-mind',
    title: 'Ý Thức An Toàn',
    description: 'Cập nhật chỉ số sức khỏe và tuân thủ giới hạn an toàn',
    icon: '🛡️',
    isUnlocked: true,
    unlockedAt: '2026-10-10'
  }
];

const DEFAULT_POSTS: CommunityPost[] = [
  {
    id: 'post-1',
    authorId: 'usr-viet-001',
    authorName: 'Nguyễn Văn Tuấn',
    authorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    authorBio: 'Sinh viên năm cuối ĐHQG • Mục tiêu tăng cơ giảm mỡ tại nhà',
    createdAt: '2 giờ trước',
    content: 'Vừa hoàn thành buổi tập Thân trên 30 phút với dây kháng lực! Phòng trọ chỉ 12m2 nhưng áp dụng chế độ ký túc xá của DISCI không phát ra tiếng động nào, bạn cùng phòng ngủ ngon lành 💪 #LuyenTapTaiNha #TangCo #DISCI',
    mediaType: 'workout_summary',
    workoutSummary: {
      focusName: 'Thân trên & Cơ lõi',
      durationMinutes: 30,
      exercisesDone: 4
    },
    hashtags: ['LuyenTapTaiNha', 'TangCo', 'DISCI'],
    visibility: 'public',
    likesCount: 18,
    isLikedByMe: false,
    comments: [
      {
        id: 'c-1',
        authorId: 'usr-2',
        authorName: 'Minh Hoàng',
        authorAvatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
        content: 'Dây kháng lực tập ngực ăn vào cơ tốt thật bạn ạ!',
        createdAt: '1 giờ trước'
      }
    ],
    isSavedByMe: false
  },
  {
    id: 'post-2',
    authorId: 'usr-lan-le',
    authorName: 'Lê Thu Lan',
    authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    authorBio: 'Nhân viên văn phòng trẻ • Đam mê sống khỏe tiết kiệm',
    createdAt: '5 giờ trước',
    content: 'Chia sẻ video ngắn động tác Glute Bridge biến thể bảo vệ thắt lưng cho các bạn hay ngồi nhiều. Các bạn nhớ siết chặt cơ mông ở đỉnh thay vì ưỡn lưng nhé!',
    mediaType: 'video',
    mediaUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    videoDurationSeconds: 15,
    videoPosterUrl: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&auto=format&fit=crop&q=80',
    hashtags: ['GiamDauLung', 'GluteBridge', 'KhoeMoiNgay'],
    visibility: 'public',
    likesCount: 42,
    isLikedByMe: true,
    comments: [],
    isSavedByMe: true
  }
];

const AppStoreContext = createContext<AppStoreContextType | undefined>(undefined);

export const AppStoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_profile`);
      return saved ? JSON.parse(saved) : DEFAULT_PROFILE;
    } catch {
      return DEFAULT_PROFILE;
    }
  });

  const [bodyMetrics, setBodyMetrics] = useState<BodyMetricRecord[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_metrics`);
      return saved ? JSON.parse(saved) : DEFAULT_BODY_METRICS;
    } catch {
      return DEFAULT_BODY_METRICS;
    }
  });

  const [healthRecord, setHealthRecord] = useState<HealthRecord | null>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_health`);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [currentPlan, setCurrentPlan] = useState<WorkoutPlan | null>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_plan`);
      if (saved) return JSON.parse(saved);
      return generateWeeklyWorkoutPlan({ profile: DEFAULT_PROFILE, healthRecord: null });
    } catch {
      return generateWeeklyWorkoutPlan({ profile: DEFAULT_PROFILE, healthRecord: null });
    }
  });

  const [sessionLogs, setSessionLogs] = useState<WorkoutSessionLog[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_logs`);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [dailyCheckIns, setDailyCheckIns] = useState<DailyCheckIn[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_checkins`);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_cart`);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_orders`);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [posts, setPosts] = useState<CommunityPost[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_posts`);
      return saved ? JSON.parse(saved) : DEFAULT_POSTS;
    } catch {
      return DEFAULT_POSTS;
    }
  });

  const [challenges, setChallenges] = useState<CommunityChallenge[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_challenges`);
      return saved ? JSON.parse(saved) : DEFAULT_CHALLENGES;
    } catch {
      return DEFAULT_CHALLENGES;
    }
  });

  const [achievements, setAchievements] = useState<UserAchievement[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_achievements`);
      return saved ? JSON.parse(saved) : DEFAULT_ACHIEVEMENTS;
    } catch {
      return DEFAULT_ACHIEVEMENTS;
    }
  });

  const [notifications, setNotifications] = useState<NotificationSettings>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_notifications`);
      return saved ? JSON.parse(saved) : {
        workoutReminder: true,
        dailyCheckInReminder: true,
        reminderTime: '17:30',
        activeDays: [1, 2, 3, 4, 5, 6, 7],
        communityInteractions: true,
        quietHoursEnabled: true
      };
    } catch {
      return {
        workoutReminder: true,
        dailyCheckInReminder: true,
        reminderTime: '17:30',
        activeDays: [1, 2, 3, 4, 5, 6, 7],
        communityInteractions: true,
        quietHoursEnabled: true
      };
    }
  });

  const [syncStatus, setSyncStatus] = useState<'synced' | 'pending' | 'offline'>('synced');

  // Persistence effects
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_profile`, JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_metrics`, JSON.stringify(bodyMetrics));
  }, [bodyMetrics]);

  useEffect(() => {
    if (healthRecord) {
      localStorage.setItem(`${STORAGE_KEY}_health`, JSON.stringify(healthRecord));
    } else {
      localStorage.removeItem(`${STORAGE_KEY}_health`);
    }
  }, [healthRecord]);

  useEffect(() => {
    if (currentPlan) {
      localStorage.setItem(`${STORAGE_KEY}_plan`, JSON.stringify(currentPlan));
    }
  }, [currentPlan]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_logs`, JSON.stringify(sessionLogs));
  }, [sessionLogs]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_checkins`, JSON.stringify(dailyCheckIns));
  }, [dailyCheckIns]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_cart`, JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_orders`, JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_posts`, JSON.stringify(posts));
  }, [posts]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_challenges`, JSON.stringify(challenges));
  }, [challenges]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_achievements`, JSON.stringify(achievements));
  }, [achievements]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_notifications`, JSON.stringify(notifications));
  }, [notifications]);

  // Online / Offline listener
  useEffect(() => {
    const handleOnline = () => setSyncStatus('synced');
    const handleOffline = () => setSyncStatus('offline');
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Update profile
  const updateProfile = (updated: Partial<UserProfile>) => {
    setProfile(prev => {
      const next = { ...prev, ...updated, updatedAt: new Date().toISOString() };
      // Tự động tái tạo lịch tập nếu môi trường hoặc số ngày thay đổi
      if (
        updated.goal !== undefined ||
        updated.daysPerWeek !== undefined ||
        updated.durationMinutes !== undefined ||
        updated.quietDormitoryMode !== undefined ||
        updated.equipment !== undefined ||
        updated.environment !== undefined
      ) {
        const newPlan = generateWeeklyWorkoutPlan({
          profile: next,
          healthRecord,
          forceQuietDormMode: next.quietDormitoryMode
        });
        setCurrentPlan(newPlan);
      }
      return next;
    });
  };

  // Add body metric
  const addBodyMetric = (weightKg: number, heightCm: number, notes?: string) => {
    const { bmi } = calculateBmi(weightKg, heightCm);
    const newRecord: BodyMetricRecord = {
      id: `bm-${Date.now()}`,
      userId: profile.id,
      date: new Date().toISOString().split('T')[0],
      weightKg,
      heightCm,
      bmi,
      notes
    };
    setBodyMetrics(prev => [newRecord, ...prev]);
    // Cập nhật profile cân nặng
    setProfile(prev => ({ ...prev, weightKg, heightCm }));
  };

  // Save health record
  const saveHealthRecord = (record: Partial<HealthRecord>) => {
    const full: HealthRecord = {
      id: healthRecord?.id || `hr-${Date.now()}`,
      userId: profile.id,
      recordedAt: new Date().toISOString(),
      consentForWorkoutAdjustment: record.consentForWorkoutAdjustment ?? true,
      ...healthRecord,
      ...record
    };
    setHealthRecord(full);
    // Tái điều chỉnh lịch nếu có sự đồng ý
    if (full.consentForWorkoutAdjustment) {
      const updatedPlan = generateWeeklyWorkoutPlan({
        profile,
        healthRecord: full,
        forceQuietDormMode: profile.quietDormitoryMode
      });
      setCurrentPlan(updatedPlan);
    }
  };

  const deleteHealthRecord = () => {
    setHealthRecord(null);
    // Tái lập lịch không áp dụng dữ liệu khám
    const updatedPlan = generateWeeklyWorkoutPlan({
      profile,
      healthRecord: null,
      forceQuietDormMode: profile.quietDormitoryMode
    });
    setCurrentPlan(updatedPlan);
  };

  const revokeHealthConsent = () => {
    if (healthRecord) {
      const revoked = { ...healthRecord, consentForWorkoutAdjustment: false };
      setHealthRecord(revoked);
      const updatedPlan = generateWeeklyWorkoutPlan({
        profile,
        healthRecord: null,
        forceQuietDormMode: profile.quietDormitoryMode
      });
      setCurrentPlan(updatedPlan);
    }
  };

  // Workout Plan controls
  const createNewPlan = (forceQuiet?: boolean) => {
    const newPlan = generateWeeklyWorkoutPlan({
      profile: {
        ...profile,
        quietDormitoryMode: forceQuiet ?? profile.quietDormitoryMode
      },
      healthRecord: healthRecord?.consentForWorkoutAdjustment ? healthRecord : null
    });
    setCurrentPlan(newPlan);
  };

  const toggleDayComplete = (dayOfWeek: number) => {
    if (!currentPlan) return;
    const updatedDays = currentPlan.days.map(d => {
      if (d.dayOfWeek === dayOfWeek) {
        return { ...d, completed: !d.completed };
      }
      return d;
    });
    setCurrentPlan({ ...currentPlan, days: updatedDays });
  };

  const substituteDayExercise = (dayOfWeek: number, exerciseIndex: number, newExerciseId: string) => {
    if (!currentPlan) return;
    const updatedDays = currentPlan.days.map(d => {
      if (d.dayOfWeek === dayOfWeek) {
        const nextExercises = [...d.exercises];
        if (nextExercises[exerciseIndex]) {
          nextExercises[exerciseIndex] = {
            ...nextExercises[exerciseIndex],
            exerciseId: newExerciseId,
            isAlternative: true,
            notes: 'Người dùng chủ động đổi bài tập'
          };
        }
        return { ...d, exercises: nextExercises };
      }
      return d;
    });
    setCurrentPlan({ ...currentPlan, days: updatedDays });
  };

  // Workout logs
  const logCompletedSession = (log: Omit<WorkoutSessionLog, 'id'>) => {
    const newLog: WorkoutSessionLog = {
      ...log,
      id: `log-${Date.now()}`
    };
    setSessionLogs(prev => [newLog, ...prev]);

    // Đánh dấu ngày tương ứng hoàn thành
    if (currentPlan) {
      const updatedDays = currentPlan.days.map(d => {
        if (d.dayOfWeek === log.dayOfWeek) {
          return { ...d, completed: true };
        }
        return d;
      });
      setCurrentPlan({ ...currentPlan, days: updatedDays });
    }

    // Mở khóa danh hiệu nếu đạt mốc
    if (!achievements.find(a => a.id === 'ach-first-step')?.isUnlocked) {
      setAchievements(prev => prev.map(a => a.id === 'ach-first-step' ? { ...a, isUnlocked: true, unlockedAt: new Date().toISOString() } : a));
    }
  };

  // Daily Check-in
  const recordDailyCheckIn = (checkIn: Omit<DailyCheckIn, 'id' | 'userId' | 'date'>) => {
    let actionTaken = 'Duy trì lịch tập hiện tại.';
    if (checkIn.musclePainStatus === 'severe') {
      actionTaken = 'Khuyên nghỉ ngơi hoặc giãn cơ nhẹ, tránh vận động gắng sức.';
    } else if (checkIn.fatigueStatus === 'tired' || checkIn.sleepHoursStatus === 'insufficient') {
      actionTaken = 'Giảm 20% số hiệp để tối ưu khả năng phục hồi cơ thể.';
    }

    const newCheckIn: DailyCheckIn = {
      ...checkIn,
      id: `ci-${Date.now()}`,
      userId: profile.id,
      date: new Date().toISOString().split('T')[0],
      actionTaken
    };

    setDailyCheckIns(prev => [newCheckIn, ...prev]);
  };

  // Cart & Order
  const addToCart = (productId: string, quantity = 1) => {
    const prod = STORE_PRODUCTS.find(p => p.id === productId);
    if (!prod) return;
    setCart(prev => {
      const existing = prev.find(item => item.product.id === productId);
      if (existing) {
        return prev.map(item => item.product.id === productId ? { ...item, quantity: item.quantity + quantity } : item);
      }
      return [...prev, { product: prod, quantity }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(i => i.product.id !== productId));
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev => prev.map(item => item.product.id === productId ? { ...item, quantity } : item));
  };

  const clearCart = () => setCart([]);

  const createOrder = (orderData: Omit<Order, 'id' | 'userId' | 'createdAt'>): Order => {
    const newOrder: Order = {
      ...orderData,
      id: `ORD-${Date.now().toString().slice(-6)}`,
      userId: profile.id,
      createdAt: new Date().toISOString()
    };
    setOrders(prev => [newOrder, ...prev]);
    clearCart();
    return newOrder;
  };

  // Community
  const addPost = (postData: Omit<CommunityPost, 'id' | 'authorId' | 'authorName' | 'authorAvatar' | 'createdAt' | 'likesCount' | 'isLikedByMe' | 'comments' | 'isSavedByMe'>) => {
    const newPost: CommunityPost = {
      ...postData,
      id: `post-${Date.now()}`,
      authorId: profile.id,
      authorName: profile.name,
      authorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      createdAt: 'Vừa xong',
      likesCount: 0,
      isLikedByMe: false,
      comments: [],
      isSavedByMe: false
    };
    setPosts(prev => [newPost, ...prev]);
  };

  const toggleLikePost = (postId: string) => {
    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        return {
          ...p,
          isLikedByMe: !p.isLikedByMe,
          likesCount: p.isLikedByMe ? p.likesCount - 1 : p.likesCount + 1
        };
      }
      return p;
    }));
  };

  const addCommentToPost = (postId: string, content: string) => {
    if (!content.trim()) return;
    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        const newC = {
          id: `c-${Date.now()}`,
          authorId: profile.id,
          authorName: profile.name,
          authorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
          content: content.trim(),
          createdAt: 'Vừa xong'
        };
        return { ...p, comments: [...p.comments, newC] };
      }
      return p;
    }));
  };

  const toggleSavePost = (postId: string) => {
    setPosts(prev => prev.map(p => p.id === postId ? { ...p, isSavedByMe: !p.isSavedByMe } : p));
  };

  const reportPost = (postId: string) => {
    setPosts(prev => prev.map(p => p.id === postId ? { ...p, isReported: true } : p));
  };

  const deletePost = (postId: string) => {
    setPosts(prev => prev.filter(p => p.id !== postId));
  };

  // Challenges
  const toggleJoinChallenge = (challengeId: string) => {
    setChallenges(prev => prev.map(c => {
      if (c.id === challengeId) {
        const nextJoined = !c.joined;
        return {
          ...c,
          joined: nextJoined,
          participantsCount: nextJoined ? c.participantsCount + 1 : c.participantsCount - 1
        };
      }
      return c;
    }));
  };

  const updateNotifications = (settings: Partial<NotificationSettings>) => {
    setNotifications(prev => ({ ...prev, ...settings }));
  };

  const triggerManualSync = async () => {
    setSyncStatus('pending');
    await new Promise(r => setTimeout(r, 600));
    setSyncStatus('synced');
  };

  const resetAllData = () => {
    localStorage.clear();
    setProfile(DEFAULT_PROFILE);
    setBodyMetrics(DEFAULT_BODY_METRICS);
    setHealthRecord(null);
    setCurrentPlan(generateWeeklyWorkoutPlan({ profile: DEFAULT_PROFILE, healthRecord: null }));
    setSessionLogs([]);
    setDailyCheckIns([]);
    setCart([]);
    setOrders([]);
    setPosts(DEFAULT_POSTS);
    setChallenges(DEFAULT_CHALLENGES);
    setAchievements(DEFAULT_ACHIEVEMENTS);
  };

  const exportDataJson = () => {
    const data = {
      exportDate: new Date().toISOString(),
      profile,
      bodyMetrics,
      healthRecord: healthRecord?.consentForWorkoutAdjustment ? healthRecord : 'Người dùng đã thu hồi hoặc chưa đồng ý xuất',
      workoutPlan: currentPlan,
      sessionLogs,
      dailyCheckIns,
      orders
    };
    return JSON.stringify(data, null, 2);
  };

  return (
    <AppStoreContext.Provider
      value={{
        profile,
        updateProfile,
        bodyMetrics,
        addBodyMetric,
        healthRecord,
        saveHealthRecord,
        deleteHealthRecord,
        revokeHealthConsent,
        currentPlan,
        createNewPlan,
        toggleDayComplete,
        substituteDayExercise,
        sessionLogs,
        logCompletedSession,
        dailyCheckIns,
        recordDailyCheckIn,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        orders,
        createOrder,
        posts,
        addPost,
        toggleLikePost,
        addCommentToPost,
        toggleSavePost,
        reportPost,
        deletePost,
        challenges,
        toggleJoinChallenge,
        achievements,
        notifications,
        updateNotifications,
        syncStatus,
        triggerManualSync,
        resetAllData,
        exportDataJson
      }}
    >
      {children}
    </AppStoreContext.Provider>
  );
};

export const useAppStore = () => {
  const context = useContext(AppStoreContext);
  if (!context) {
    throw new Error('useAppStore must be used within an AppStoreProvider');
  }
  return context;
};
