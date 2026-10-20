/**
 * Cung cấp dữ liệu các giai đoạn tư thế (Phases), góc khớp an toàn (Angles)
 * và vùng cơ kích hoạt cho từng bài tập trong DISCI.
 */

export interface PosturePhase {
  phaseIndex: number;
  phaseName: string;
  description: string;
  jointAngleNote: string;
  activeMuscle: string;
}

export interface ExercisePostureGuide {
  exerciseId: string;
  keySafetyAngle: string;
  phases: PosturePhase[];
  rhythmCadence: string; // ví dụ: "2 giây xuống - 1 giây giữ - 2 giây lên"
}

export const EXERCISE_POSTURE_GUIDES: Record<string, ExercisePostureGuide> = {
  squat: {
    exerciseId: 'squat',
    keySafetyAngle: 'Góc gối 90° (đùi song song sàn) • Lưng thẳng nghiêng tự nhiên 45°',
    rhythmCadence: '2 giây hạ hông - 1 giây siết đáy - 2 giây đạp gót đứng dậy',
    phases: [
      {
        phaseIndex: 0,
        phaseName: 'Tư thế bắt đầu',
        description: 'Đứng thẳng, chân mở rộng bằng vai, mũi chân mở 15-30°, hai tay đan trước ngực.',
        jointAngleNote: 'Khớp gối mở thẳng tự nhiên, không khóa chặt khớp.',
        activeMuscle: 'Cơ bụng gồng nhẹ giữ thăng bằng'
      },
      {
        phaseIndex: 1,
        phaseName: 'Chuyển động hạ hông',
        description: 'Đẩy hông về sau như sắp ngồi vào ghế, gối hướng theo hướng ngón chân thứ hai.',
        jointAngleNote: 'Góc gối uốn cong dần đến 90°, đùi song song mặt sàn.',
        activeMuscle: 'Cơ đùi trước & Cơ mông căng lực'
      },
      {
        phaseIndex: 2,
        phaseName: 'Điểm siết cơ đỉnh',
        description: 'Đạp mạnh gót chân xuống sàn đẩy thẳng người lên, siết chặt cơ mông ở đỉnh.',
        jointAngleNote: 'Đứng thẳng hoàn toàn nhưng không ưỡn thắt lưng ra sau.',
        activeMuscle: 'Cơ mông lớn (Glutes) siết tối đa'
      }
    ]
  },
  pushup: {
    exerciseId: 'pushup',
    keySafetyAngle: 'Khuỷu tay gập góc 45° so với thân người • Toàn thân thẳng một trục',
    rhythmCadence: '2 giây hạ ngực - 1 giây giữ sát sàn cách 5cm - 1 giây đẩy lên',
    phases: [
      {
        phaseIndex: 0,
        phaseName: 'Tư thế bắt đầu (Plank cao)',
        description: 'Chống hai tay rộng hơn vai một chút, chân duỗi thẳng, siết mông và bụng tạo một đường thẳng.',
        jointAngleNote: 'Cổ tay thẳng dưới vai, mắt nhìn sàn cách mũi tay 20cm.',
        activeMuscle: 'Cơ bụng & cơ mông siết chặt'
      },
      {
        phaseIndex: 1,
        phaseName: 'Hạ ngực có kiểm soát',
        description: 'Gập khuỷu tay 45 độ đưa ngực sát mặt đất cách 5cm, không để võng thắt lưng.',
        jointAngleNote: 'Khuỷu tay tạo hình mũi tên 45°, tránh bạnh ngang 90°.',
        activeMuscle: 'Cơ ngực lớn (Pecs) căng tối đa'
      },
      {
        phaseIndex: 2,
        phaseName: 'Đẩy thân người lên',
        description: 'Thở ra, dùng lực ngực và tay sau đẩy mạnh thân người trở về vị trí bắt đầu.',
        jointAngleNote: 'Duỗi thẳng tay nhưng không bẻ khóa khớp khuỷu.',
        activeMuscle: 'Cơ tay sau & Cơ ngực siết'
      }
    ]
  },
  plank: {
    exerciseId: 'plank',
    keySafetyAngle: 'Khuỷu tay vuông góc 90° dưới vai • Trục đầu-lưng-gót chân thẳng 180°',
    rhythmCadence: 'Giữ tĩnh liên tục (Isometric) kết hợp hít thở sâu đều đặn',
    phases: [
      {
        phaseIndex: 0,
        phaseName: 'Tư thế giữ chuẩn',
        description: 'Chống hai cẳng tay xuống sàn, khuỷu tay vuông góc dưới vai, chân duỗi thẳng.',
        jointAngleNote: 'Khuỷu tay 90°, cột sống trung tính không võng cũng không nhô chóp.',
        activeMuscle: 'Toàn bộ cơ lõi (Core) & bụng ngang'
      },
      {
        phaseIndex: 1,
        phaseName: 'Điểm siết bụng sâu',
        description: 'Chủ động hóp rốn về phía cột sống, siết cơ mông để khóa chặt khung chậu.',
        jointAngleNote: 'Cổ thẳng hàng với lưng, mắt nhìn khoảng giữa hai bàn tay.',
        activeMuscle: 'Cơ bụng thẳng, cơ liên sườn và cơ sàn chậu'
      }
    ]
  },
  glute_bridge: {
    exerciseId: 'glute_bridge',
    keySafetyAngle: 'Đầu gối góc 90° • Điểm nâng tạo đường thẳng Gối - Hông - Vai',
    rhythmCadence: '2 giây nâng hông - 2 giây siết đỉnh - 2 giây hạ có kiểm soát',
    phases: [
      {
        phaseIndex: 0,
        phaseName: 'Tư thế bắt đầu',
        description: 'Nằm ngửa, hai gối co 90°, hai bàn chân đặt bằng phẳng trên sàn rộng bằng vai.',
        jointAngleNote: 'Lưng dưới áp sát mặt thảm, hai tay buông dọc thân người.',
        activeMuscle: 'Cơ lõi ổn định'
      },
      {
        phaseIndex: 1,
        phaseName: 'Đẩy hông lên cao',
        description: 'Ấn mạnh gót chân xuống sàn, dùng lực cơ mông đẩy xương chậu lên cao.',
        jointAngleNote: 'Tạo thành đường thẳng từ đầu gối qua hông đến vai.',
        activeMuscle: 'Cơ mông lớn (Gluteus Maximus) siết cực độ'
      },
      {
        phaseIndex: 2,
        phaseName: 'Hạ hông chạm sàn nhẹ',
        description: 'Từ từ hạ hông xuống cách mặt sàn 1cm rồi lặp lại nhịp tiếp theo.',
        jointAngleNote: 'Không thả rơi hông tự do để duy trì lực căng cơ liên tục.',
        activeMuscle: 'Cơ đùi sau và cơ mông'
      }
    ]
  },
  bird_dog: {
    exerciseId: 'bird_dog',
    keySafetyAngle: 'Tư thế quỳ 4 điểm 90° • Tay và chân đối diện duỗi thẳng trục 180°',
    rhythmCadence: '2 giây vươn duỗi - 1 giây giữ thăng bằng - 2 giây thu về',
    phases: [
      {
        phaseIndex: 0,
        phaseName: 'Bò trên 4 điểm',
        description: 'Bàn tay ngay dưới vai, đầu gối ngay dưới hông, cột sống thắt lưng phẳng tự nhiên.',
        jointAngleNote: 'Góc hông 90°, góc gối 90° so với sàn.',
        activeMuscle: 'Cơ bụng sâu kích hoạt'
      },
      {
        phaseIndex: 1,
        phaseName: 'Duỗi tay và chân đối diện',
        description: 'Vươn tay phải ra trước và đạp chân trái ra sau ngang tầm người, hông giữ thăng bằng.',
        jointAngleNote: 'Trục thẳng từ cổ tay phải qua lưng đến gót chân trái.',
        activeMuscle: 'Cơ dựng cột sống, cơ mông và vai'
      }
    ]
  },
  dead_bug: {
    exerciseId: 'dead_bug',
    keySafetyAngle: 'Lưng dưới dán chặt mặt sàn 0 khoảng hở • Gối góc 90° co duỗi luân phiên',
    rhythmCadence: '2 giây hạ tay chân - 1 giây dừng - 2 giây thu về vị trí vuông góc',
    phases: [
      {
        phaseIndex: 0,
        phaseName: 'Tư thế con bọ ngửa',
        description: 'Nằm ngửa, hai tay hướng thẳng trần nhà, hai chân nâng vuông góc 90 độ.',
        jointAngleNote: 'Toàn bộ vùng thắt lưng dán phẳng xuống sàn tuyệt đối.',
        activeMuscle: 'Cơ bụng sâu (Transverse Abdominis)'
      },
      {
        phaseIndex: 1,
        phaseName: 'Hạ tay phải & chân trái',
        description: 'Từ từ hạ tay phải qua đầu và duỗi chân trái ra xa cách sàn 5cm mà lưng không được cong.',
        jointAngleNote: 'Chân hạ dừng trước khi thắt lưng bị nhấc khỏi thảm.',
        activeMuscle: 'Cơ bụng chéo và cơ sàn chậu'
      }
    ]
  },
  marching_in_place: {
    exerciseId: 'marching_in_place',
    keySafetyAngle: 'Nâng đùi góc 90° ngang hông • Tiếp đất bằng ức bàn chân êm ái 0 tiếng ồn',
    rhythmCadence: 'Bước nhịp nhàng 1-2-1-2 có kiểm soát tuyệt đối tĩnh lặng',
    phases: [
      {
        phaseIndex: 0,
        phaseName: 'Đứng thẳng mở ngực',
        description: 'Hai chân khép nhẹ, tay tự nhiên bên hông, ngực mở rộng.',
        jointAngleNote: 'Trọng tâm vững vàng.',
        activeMuscle: 'Cơ bắp chân và cơ đùi'
      },
      {
        phaseIndex: 1,
        phaseName: 'Nâng cao gối không tiếng động',
        description: 'Nâng đùi phải song song mặt sàn, đánh tay trái ra trước, hạ chân êm như bước trên nhung.',
        jointAngleNote: 'Đùi nâng góc 90°, tiếp đất bằng mũi và ức bàn chân.',
        activeMuscle: 'Cơ gập hông và cơ tim mạch'
      }
    ]
  },
  wall_sit: {
    exerciseId: 'wall_sit',
    keySafetyAngle: 'Lưng dán phẳng tường • Đùi song song sàn 90° • Gối không vượt mũi chân',
    rhythmCadence: 'Giữ tĩnh kiên trì (Isometric) 30-45 giây',
    phases: [
      {
        phaseIndex: 0,
        phaseName: 'Tựa lưng trượt xuống',
        description: 'Tựa lưng vào tường, trượt người xuống đến khi đùi tạo góc vuông 90° so với cẳng chân.',
        jointAngleNote: 'Khớp gối vuông góc 90° ngay trên cổ chân, bảo vệ hoàn toàn sụn khớp.',
        activeMuscle: 'Cơ tứ đầu đùi (Quadriceps) cháy lực'
      }
    ]
  }
};

export function getExercisePostureGuide(exerciseId: string): ExercisePostureGuide {
  if (EXERCISE_POSTURE_GUIDES[exerciseId]) {
    return EXERCISE_POSTURE_GUIDES[exerciseId];
  }
  // Mặc định an toàn cho các biến thể
  if (exerciseId.includes('squat')) {
    return EXERCISE_POSTURE_GUIDES['squat'];
  }
  if (exerciseId.includes('pushup')) {
    return EXERCISE_POSTURE_GUIDES['pushup'];
  }
  if (exerciseId.includes('bridge')) {
    return EXERCISE_POSTURE_GUIDES['glute_bridge'];
  }
  if (exerciseId.includes('jacks') || exerciseId.includes('marching') || exerciseId.includes('burpee')) {
    return EXERCISE_POSTURE_GUIDES['marching_in_place'];
  }
  return EXERCISE_POSTURE_GUIDES['squat'];
}
