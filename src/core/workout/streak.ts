/**
 * Tính toán chuỗi ngày tập luyện liên tiếp (Workout Streak)
 * và các mốc thành tích (Milestones) tạo động lực cho người dùng.
 */

export interface StreakInfo {
  currentStreak: number;
  bestStreak: number;
  isMilestone: boolean;
  milestoneMessage: string;
  nextMilestone: number;
  streakTitle: string;
}

export function calculateWorkoutStreak(
  workoutDates: string[],
  referenceDateStr?: string
): StreakInfo {
  if (!workoutDates || workoutDates.length === 0) {
    return {
      currentStreak: 0,
      bestStreak: 0,
      isMilestone: false,
      milestoneMessage: 'Hãy hoàn thành buổi tập đầu tiên để kích hoạt chuỗi phong độ!',
      nextMilestone: 3,
      streakTitle: 'Khởi động'
    };
  }

  // Chuẩn hóa và lọc trùng các ngày (YYYY-MM-DD)
  const uniqueDateSet = new Set<string>();
  for (const d of workoutDates) {
    const cleanDate = d.slice(0, 10);
    uniqueDateSet.add(cleanDate);
  }

  const sortedDates = Array.from(uniqueDateSet).sort();

  // Tính chuỗi dài nhất trong lịch sử (Best streak)
  let bestStreak = 0;
  let runningStreak = 0;
  let prevTimestamp: number | null = null;

  for (const dateStr of sortedDates) {
    const currentTimestamp = new Date(dateStr).getTime();
    if (prevTimestamp === null) {
      runningStreak = 1;
    } else {
      const diffDays = Math.round((currentTimestamp - prevTimestamp) / (1000 * 60 * 60 * 24));
      if (diffDays === 1) {
        runningStreak += 1;
      } else if (diffDays > 1) {
        runningStreak = 1;
      }
    }
    if (runningStreak > bestStreak) {
      bestStreak = runningStreak;
    }
    prevTimestamp = currentTimestamp;
  }

  // Tính chuỗi hiện tại tính ngược từ ngày tham chiếu (mặc định là hôm nay)
  const refDate = referenceDateStr ? new Date(referenceDateStr) : new Date();
  const refDateStr = refDate.toISOString().slice(0, 10);

  // Ngày hôm qua
  const yesterday = new Date(refDate);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().slice(0, 10);

  let currentStreak = 0;

  // Kiểm tra xem có tập hôm nay hoặc hôm qua không để tiếp tục chuỗi
  let anchorDate: Date | null = null;
  if (uniqueDateSet.has(refDateStr)) {
    anchorDate = new Date(refDateStr);
  } else if (uniqueDateSet.has(yesterdayStr)) {
    anchorDate = new Date(yesterdayStr);
  }

  if (anchorDate) {
    let checkDate = new Date(anchorDate);
    while (true) {
      const checkStr = checkDate.toISOString().slice(0, 10);
      if (uniqueDateSet.has(checkStr)) {
        currentStreak += 1;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }
  }

  // Nếu người dùng có các buổi tập nhưng ngắt quãng, đảm bảo streak tối thiểu phản ánh buổi tập gần nhất nếu vừa tập
  if (currentStreak === 0 && sortedDates.length > 0) {
    // Nếu có ít nhất 1 buổi tập ghi nhận, ghi nhận mốc khởi đầu
    currentStreak = 1;
  }

  if (currentStreak > bestStreak) {
    bestStreak = currentStreak;
  }

  // Xác định mốc danh hiệu
  let streakTitle = 'Người Mới Bắt Đầu';
  let nextMilestone = 3;
  let isMilestone = false;
  let milestoneMessage = 'Khởi đầu tuyệt vời! Duy trì thêm để đạt chuỗi 3 ngày liên tiếp.';

  if (currentStreak >= 30) {
    streakTitle = 'Huyền Thoại Kỷ Luật';
    nextMilestone = 60;
    isMilestone = true;
    milestoneMessage = '🏆 30 NGÀY BẤT BẠI! Bạn đã biến rèn luyện thành lối sống vững vàng.';
  } else if (currentStreak >= 14) {
    streakTitle = 'Bậc Thầy Kiên Trì';
    nextMilestone = 30;
    isMilestone = true;
    milestoneMessage = '⚡ Chuỗi 2 tuần rực rỡ! Thói quen luyện tập của bạn đã hình thành vững chắc.';
  } else if (currentStreak >= 7) {
    streakTitle = 'Chiến Binh 7 Ngày';
    nextMilestone = 14;
    isMilestone = true;
    milestoneMessage = '🔥 XUẤT SẮC! Hoàn thành trọn vẹn chuỗi 7 ngày liên tiếp không bỏ cuộc.';
  } else if (currentStreak >= 3) {
    streakTitle = 'Đang Bứt Phá';
    nextMilestone = 7;
    isMilestone = true;
    milestoneMessage = '✨ Đã đạt mốc 3 ngày liên tiếp! Cơ thể bạn đang thích ứng rất nhanh.';
  } else if (currentStreak >= 1) {
    streakTitle = 'Bắt Đầu Bùng Nổ';
    nextMilestone = 3;
    isMilestone = currentStreak >= 1;
    milestoneMessage = '🎯 Tuyệt vời! Bạn đã giữ vững ngọn lửa luyện tập hôm nay.';
  }

  return {
    currentStreak,
    bestStreak,
    isMilestone,
    milestoneMessage,
    nextMilestone,
    streakTitle
  };
}
