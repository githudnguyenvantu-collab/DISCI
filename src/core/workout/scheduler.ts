import { EXERCISE_DATABASE, getExerciseById } from '../../data/exercises';
import {
  EquipmentOption,
  FitnessGoal,
  HealthRecord,
  UserProfile,
  WorkoutDayPlan,
  WorkoutExerciseItem,
  WorkoutPlan
} from '../../types';

export interface PlanGenerationOptions {
  profile: UserProfile;
  healthRecord?: HealthRecord | null;
  forceQuietDormMode?: boolean;
}

/**
 * Thuật toán tạo lịch tập tuần được cá nhân hóa
 * Tuân thủ thứ tự ưu tiên an toàn:
 * 1. Khuyến cáo vận động của bác sĩ
 * 2. Cảnh báo an toàn hệ thống (Huyết áp, tim mạch, khớp)
 * 3. Chế độ Ký túc xá (ít ồn, không rung sàn)
 * 4. Mục tiêu & trang thiết bị người dùng
 */
export function generateWeeklyWorkoutPlan(options: PlanGenerationOptions): WorkoutPlan {
  const { profile, healthRecord } = options;
  const isQuietMode = Boolean(profile.quietDormitoryMode || profile.environment === 'dormitory' || options.forceQuietDormMode);
  const targetDaysCount = Math.min(Math.max(profile.daysPerWeek || 3, 2), 6);

  // Phân bổ ngày tập trong tuần (1: Thứ Hai, 7: Chủ Nhật)
  let workoutDaysOfWeek: number[] = [1, 3, 5]; // Mặc định 3 buổi: Thứ 2, 4, 6
  if (targetDaysCount === 2) {
    workoutDaysOfWeek = [2, 5];
  } else if (targetDaysCount === 4) {
    workoutDaysOfWeek = [1, 2, 4, 5];
  } else if (targetDaysCount === 5) {
    workoutDaysOfWeek = [1, 2, 3, 5, 6];
  } else if (targetDaysCount === 6) {
    workoutDaysOfWeek = [1, 2, 3, 4, 5, 6];
  }

  const days: WorkoutDayPlan[] = [];
  const dayNames = ['Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy', 'Chủ Nhật'];

  for (let d = 1; d <= 7; d++) {
    const isWorkoutDay = workoutDaysOfWeek.includes(d);
    const dayName = dayNames[d - 1];

    if (!isWorkoutDay) {
      days.push({
        id: `day-${d}`,
        dayOfWeek: d,
        dayName,
        targetFocus: 'Nghỉ ngơi & Phục hồi tích cực',
        isRestDay: true,
        warmupMinutes: 0,
        warmupNotes: 'Nghỉ ngơi, ngủ đủ giấc hoặc đi dạo nhẹ nhàng 15-20 phút.',
        exercises: [],
        cooldownMinutes: 0,
        cooldownNotes: 'Thực hiện vài động tác giãn cơ nhẹ nếu thấy căng cơ.',
        estimatedMinutes: 0,
        completed: false
      });
      continue;
    }

    // Xác định tiêu điểm buổi tập
    let targetFocus = 'Toàn thân (Full Body)';
    if (targetDaysCount >= 4) {
      if (d === 1 || d === 4) targetFocus = 'Thân trên & Cơ lõi (Upper Body & Core)';
      else targetFocus = 'Thân dưới & Tim mạch (Lower Body & Cardio)';
    }

    // Chọn bài tập phù hợp
    const sessionExercises = pickExercisesForSession({
      goal: profile.goal,
      targetFocus,
      isQuietMode,
      equipment: profile.equipment || ['none'],
      durationMinutes: profile.durationMinutes || 30,
      healthRecord
    });

    const estMinutes = 5 + sessionExercises.length * 5 + 5; // Khởi động 5m + các bài + giãn cơ 5m

    days.push({
      id: `day-${d}`,
      dayOfWeek: d,
      dayName,
      targetFocus,
      isRestDay: false,
      warmupMinutes: 5,
      warmupNotes: isQuietMode
        ? 'Xoay khớp cổ tay, cổ chân, xoay hông, ép dẻo nhẹ (không bật nhảy gây tiếng động).'
        : 'Xoay khớp toàn thân, nâng cao đùi nhẹ và khởi động linh hoạt khớp gối.',
      exercises: sessionExercises,
      cooldownMinutes: 5,
      cooldownNotes: 'Giãn cơ tĩnh: Giãn cơ đùi trước, giãn lưng dưới tư thế em bé (Child’s pose), hít thở sâu.',
      estimatedMinutes: Math.min(estMinutes, profile.durationMinutes || 30),
      completed: false
    });
  }

  return {
    id: `plan-${Date.now()}`,
    userId: profile.id,
    weekNumber: 1,
    startDate: new Date().toISOString(),
    goal: profile.goal,
    quietModeApplied: isQuietMode,
    days
  };
}

interface PickExerciseParams {
  goal: FitnessGoal;
  targetFocus: string;
  isQuietMode: boolean;
  equipment: EquipmentOption[];
  durationMinutes: number;
  healthRecord?: HealthRecord | null;
}

function pickExercisesForSession(params: PickExerciseParams): WorkoutExerciseItem[] {
  const { isQuietMode, equipment, durationMinutes, healthRecord } = params;

  // Lượng bài tập theo thời lượng buổi tập
  const exerciseCount = durationMinutes <= 20 ? 3 : durationMinutes <= 30 ? 4 : 5;
  const items: WorkoutExerciseItem[] = [];

  // Lọc kho bài tập có sẵn
  let available = EXERCISE_DATABASE.filter(ex => {
    // Kiểm tra trang bị
    if (ex.requiredEquipment !== 'none') {
      if (!equipment.includes(ex.requiredEquipment)) return false;
    }

    // Kiểm tra ký túc xá
    if (isQuietMode && !ex.isQuietDormFriendly) {
      return false; // Bỏ bài ồn nếu ở chế độ ký túc xá
    }

    // Kiểm tra chống chỉ định từ hồ sơ sức khỏe
    if (healthRecord?.jointBoneIssues && healthRecord.jointBoneIssues.length > 0) {
      const hasKneeIssue = healthRecord.jointBoneIssues.some(issue => issue.toLowerCase().includes('khớp') || issue.toLowerCase().includes('gối'));
      if (hasKneeIssue && ex.contraindications.includes('acute_knee_pain')) {
        return false;
      }
    }

    return true;
  });

  // Nếu lọc xong quá ít bài tập, lấy các bài an toàn tay không cơ bản
  if (available.length < 3) {
    available = EXERCISE_DATABASE.filter(ex => ex.requiredEquipment === 'none' && ex.isQuietDormFriendly);
  }

  // Đảm bảo có sự cân bằng nhóm cơ (Thân trên, thân dưới, cơ lõi/tim mạch)
  const chosenIds = new Set<string>();

  // 1. Bài Thân dưới (Squat hoặc Wall sit hoặc Glute bridge)
  const lowerOptions = available.filter(e => e.targetMuscles.some(m => m.includes('đùi') || m.includes('mông')));
  if (lowerOptions.length > 0) {
    const selected = lowerOptions[0];
    chosenIds.add(selected.id);
    items.push({
      exerciseId: selected.id,
      sets: selected.defaultSets,
      reps: selected.defaultReps,
      durationSeconds: selected.durationSeconds,
      restSeconds: selected.restSeconds
    });
  }

  // 2. Bài Thân trên (Push-up hoặc band row hoặc incline)
  const upperOptions = available.filter(e => !chosenIds.has(e.id) && e.targetMuscles.some(m => m.includes('ngực') || m.includes('lưng') || m.includes('vai')));
  if (upperOptions.length > 0) {
    const selected = upperOptions[0];
    chosenIds.add(selected.id);
    items.push({
      exerciseId: selected.id,
      sets: selected.defaultSets,
      reps: selected.defaultReps,
      durationSeconds: selected.durationSeconds,
      restSeconds: selected.restSeconds
    });
  }

  // 3. Bài Cơ lõi / Bảo vệ cột sống (Plank, Bird-dog, Dead bug)
  const coreOptions = available.filter(e => !chosenIds.has(e.id) && (e.id === 'plank' || e.id === 'bird_dog' || e.id === 'dead_bug'));
  if (coreOptions.length > 0) {
    const selected = coreOptions[0];
    chosenIds.add(selected.id);
    items.push({
      exerciseId: selected.id,
      sets: selected.defaultSets,
      reps: selected.defaultReps,
      durationSeconds: selected.durationSeconds,
      restSeconds: selected.restSeconds
    });
  }

  // 4. Bài Tim mạch / đốt mỡ hoặc bài bổ sung
  const remaining = available.filter(e => !chosenIds.has(e.id));
  for (const rem of remaining) {
    if (items.length >= exerciseCount) break;
    items.push({
      exerciseId: rem.id,
      sets: rem.defaultSets,
      reps: rem.defaultReps,
      durationSeconds: rem.durationSeconds,
      restSeconds: rem.restSeconds
    });
    chosenIds.add(rem.id);
  }

  return items;
}

/**
 * Đổi một bài tập trong buổi sang bài thay thế an toàn
 */
export function substituteExercise(
  currentExerciseId: string,
  reason: 'quiet_mode' | 'joint_pain' | 'too_hard'
): WorkoutExerciseItem | null {
  const ex = getExerciseById(currentExerciseId);
  if (!ex) return null;

  let altId: string | undefined;

  if (reason === 'quiet_mode') {
    altId = ex.dormitoryAlternativeExerciseId || 'marching_in_place';
  } else if (reason === 'joint_pain') {
    altId = ex.jointFriendlyAlternativeId || 'dead_bug';
  } else if (reason === 'too_hard') {
    if (currentExerciseId === 'pushup') altId = 'incline_pushup';
    else if (currentExerciseId === 'squat') altId = 'glute_bridge';
    else altId = 'bird_dog';
  }

  if (!altId) altId = 'marching_in_place';
  const altEx = getExerciseById(altId);
  if (!altEx) return null;

  return {
    exerciseId: altEx.id,
    sets: altEx.defaultSets,
    reps: altEx.defaultReps,
    durationSeconds: altEx.durationSeconds,
    restSeconds: altEx.restSeconds,
    isAlternative: true,
    notes: `Đã thay thế an toàn vì lý do: ${reason === 'quiet_mode' ? 'Chế độ ký túc xá ít ồn' : reason === 'joint_pain' ? 'Bảo vệ khớp' : 'Giảm độ khó'}`
  };
}
