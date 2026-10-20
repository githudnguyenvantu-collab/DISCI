import { Exercise } from '../types';

export const EXERCISE_DATABASE: Exercise[] = [
  {
    id: 'squat',
    name: 'Bodyweight Squat (Ngồi xổm tay không)',
    targetMuscles: ['Cơ đùi trước (Quadriceps)', 'Cơ mông (Glutes)', 'Cơ đùi sau'],
    goalCategories: ['muscle_gain', 'fat_loss', 'general_health', 'endurance'],
    difficulty: 'beginner',
    defaultSets: 3,
    defaultReps: 12,
    restSeconds: 60,
    requiredEquipment: 'none',
    environmentSuitability: ['home', 'dormitory', 'outdoor', 'gym'],
    impactLevel: 'low',
    isQuietDormFriendly: true,
    jointFriendlyAlternativeId: 'glute_bridge',
    contraindications: ['acute_knee_pain'],
    startingPosture: 'Đứng thẳng, hai chân mở rộng bằng vai, mũi chân xoay nhẹ ra ngoài 15-30 độ, mắt nhìn thẳng.',
    finishingPosture: 'Đẩy hông về sau và hạ thấp đùi song song với sàn, sau đó đạp gót chân đứng thẳng về vị trí ban đầu.',
    instructions: [
      'Hít một hơi sâu, siết chặt cơ bụng và bắt đầu đẩy hông về phía sau như sắp ngồi vào ghế.',
      'Hạ người xuống đến khi đùi gần song song mặt sàn, giữ lưng thẳng tự nhiên.',
      'Đạp mạnh hai gót chân xuống sàn để đẩy người đứng thẳng dậy, thở ra khi lên đỉnh động tác.'
    ],
    commonMistakes: [
      'Gối chụm vào trong (valgus gối)',
      'Nhấc gót chân lên khỏi mặt sàn',
      'Cong gù lưng dưới khi xuống sâu'
    ],
    difficultyAdjustments: {
      easier: 'Squat có điểm tựa ghế (Box squat) hoặc giảm biên độ xuống một nửa.',
      harder: 'Thêm tạ tay cầm trước ngực (Goblet Squat) hoặc giữ tĩnh 3 giây ở đáy.'
    }
  },
  {
    id: 'pushup',
    name: 'Push-up (Chống đẩy)',
    targetMuscles: ['Cơ ngực (Pectorals)', 'Cơ vai trước (Deltoids)', 'Tay sau (Triceps)', 'Cơ lõi (Core)'],
    goalCategories: ['muscle_gain', 'fat_loss', 'endurance', 'general_health'],
    difficulty: 'beginner',
    defaultSets: 3,
    defaultReps: 10,
    restSeconds: 60,
    requiredEquipment: 'none',
    environmentSuitability: ['home', 'dormitory', 'outdoor', 'gym'],
    impactLevel: 'low',
    isQuietDormFriendly: true,
    jointFriendlyAlternativeId: 'incline_pushup',
    contraindications: ['acute_wrist_pain', 'shoulder_impingement'],
    startingPosture: 'Nằm sấp, chống hai tay xuống sàn rộng hơn vai một chút, chân duỗi thẳng, mũi chân chạm sàn, siết mông và bụng tạo thành một đường thẳng.',
    finishingPosture: 'Hạ ngực sát mặt đất cách 5cm, rồi duỗi thẳng tay đẩy thân trên về lại tư thế ban đầu mà không khóa khớp khuỷu.',
    instructions: [
      'Khóa chặt cơ bụng, hít vào và từ từ gập khuỷu tay góc 45 độ so với thân người để hạ ngực xuống.',
      'Khi ngực cách sàn khoảng một nắm tay, dừng nhẹ 1 nhịp ngắn.',
      'Thở ra, dùng lực cơ ngực và tay sau đẩy mạnh thân người trở về vị trí bắt đầu.'
    ],
    commonMistakes: [
      'Võng lưng dưới làm đau cột sống',
      'Khuỷu tay bạnh sang hai bên vuông góc 90 độ gây áp lực vai',
      'Đầu gục xuống sàn trước khi ngực hạ'
    ],
    difficultyAdjustments: {
      easier: 'Chống đẩy quỳ gối (Knee push-up) hoặc chống tay vào mép bàn/tường cao.',
      harder: 'Chống đẩy kê cao chân (Decline push-up) hoặc tạm dừng 2 giây ở đáy.'
    }
  },
  {
    id: 'incline_pushup',
    name: 'Incline Push-up (Chống đẩy nghiêng mép bàn/tường)',
    targetMuscles: ['Cơ ngực', 'Tay sau', 'Cơ bụng'],
    goalCategories: ['general_health', 'endurance', 'fat_loss'],
    difficulty: 'beginner',
    defaultSets: 3,
    defaultReps: 12,
    restSeconds: 45,
    requiredEquipment: 'none',
    environmentSuitability: ['home', 'dormitory', 'outdoor', 'gym'],
    impactLevel: 'low',
    isQuietDormFriendly: true,
    contraindications: ['acute_wrist_pain'],
    startingPosture: 'Đặt hai tay lên thành bàn hoặc tường vững chắc, lùi chân về sau tạo góc nghiêng 45-60 độ.',
    finishingPosture: 'Hạ ngực chạm mép tựa rồi đẩy dứt khoát về vị trí ban đầu.',
    instructions: [
      'Siết mông và bụng, hạ ngực từ từ về phía thành bàn.',
      'Đẩy người trở lại tư thế bắt đầu một cách có kiểm soát.'
    ],
    commonMistakes: ['Đẩy hông lên quá cao', 'Võng lưng'],
    difficultyAdjustments: {
      easier: 'Chống đẩy vào tường đứng thẳng hơn.',
      harder: 'Hạ độ cao thành bàn hoặc chuyển sang chống đẩy sàn.'
    }
  },
  {
    id: 'plank',
    name: 'Plank (Giữ tĩnh thân người)',
    targetMuscles: ['Cơ bụng ngang', 'Cơ bụng thẳng', 'Cơ liên sườn', 'Cơ vai'],
    goalCategories: ['endurance', 'fat_loss', 'general_health', 'muscle_gain'],
    difficulty: 'beginner',
    defaultSets: 3,
    durationSeconds: 30,
    restSeconds: 45,
    requiredEquipment: 'none',
    environmentSuitability: ['home', 'dormitory', 'outdoor', 'gym'],
    impactLevel: 'low',
    isQuietDormFriendly: true,
    jointFriendlyAlternativeId: 'dead_bug',
    contraindications: ['hypertension_uncontrolled', 'acute_lower_back_pain'],
    startingPosture: 'Chống hai cẳng tay xuống sàn, khuỷu tay vuông góc ngay dưới vai, hai chân duỗi thẳng phía sau.',
    finishingPosture: 'Duy trì thân người từ đầu, lưng, mông đến gót chân thành một đường thẳng tuyệt đối.',
    instructions: [
      'Siết chặt cơ mông, cuộn nhẹ xương chậu và hóp rốn về phía cột sống.',
      'Mắt nhìn xuống sàn giữa hai bàn tay, giữ cổ thẳng tự nhiên.',
      'Duy trì nhịp thở đều đặn và giữ nguyên tư thế trong suốt thời gian quy định.'
    ],
    commonMistakes: [
      'Nín thở khi gồng bụng',
      'Võng lưng dưới xuống sàn gây đau thắt lưng',
      'Đẩy mông lên hình chóp tam giác để ăn gian lực'
    ],
    difficultyAdjustments: {
      easier: 'Chống khuỷu tay kết hợp hạ gối chạm sàn (Knee Plank).',
      harder: 'Nhấc luân phiên một chân khỏi sàn hoặc Plank chạm vai.'
    }
  },
  {
    id: 'bird_dog',
    name: 'Bird-Dog (Tăng cường cơ thắt lưng & cân bằng)',
    targetMuscles: ['Cơ dựng cột sống', 'Cơ mông', 'Cơ bụng sâu'],
    goalCategories: ['general_health', 'endurance', 'muscle_gain'],
    difficulty: 'beginner',
    defaultSets: 3,
    defaultReps: 10,
    restSeconds: 45,
    requiredEquipment: 'none',
    environmentSuitability: ['home', 'dormitory', 'outdoor', 'gym'],
    impactLevel: 'low',
    isQuietDormFriendly: true,
    contraindications: [],
    startingPosture: 'Tư thế quỳ 4 điểm (bò trên sàn): bàn tay ngay dưới vai, đầu gối ngay dưới hông, cột sống ở vị trí trung tính.',
    finishingPosture: 'Duỗi đồng thời tay phải về phía trước và chân trái về phía sau tạo thành một trục thẳng.',
    instructions: [
      'Gồng chặt cơ lõi, từ từ nâng và duỗi thẳng tay phải ra trước và chân trái ra sau ngang tầm thân người.',
      'Giữ yên 2 giây ở vị trí cao nhất, không để hông bị nghiêng hoặc lắc lư.',
      'Hạ về vị trí ban đầu rồi đổi sang tay trái và chân phải.'
    ],
    commonMistakes: [
      'Đá chân quá cao làm võng thắt lưng',
      'Xoay vặn khung chậu sang một bên',
      'Chuyển động quá vội vàng không kiểm soát cơ lõi'
    ],
    difficultyAdjustments: {
      easier: 'Chỉ duỗi chân hoặc chỉ nâng tay riêng biệt.',
      harder: 'Giữ tĩnh 5 giây ở đỉnh hoặc đeo thêm dây kháng lực ở cổ chân.'
    }
  },
  {
    id: 'dead_bug',
    name: 'Dead Bug (Bảo vệ cột sống thắt lưng & kích hoạt cơ bụng)',
    targetMuscles: ['Cơ bụng sâu (Transverse Abdominis)', 'Cơ gập hông', 'Cơ sàn chậu'],
    goalCategories: ['general_health', 'endurance', 'fat_loss'],
    difficulty: 'beginner',
    defaultSets: 3,
    defaultReps: 12,
    restSeconds: 45,
    requiredEquipment: 'none',
    environmentSuitability: ['home', 'dormitory', 'outdoor', 'gym'],
    impactLevel: 'low',
    isQuietDormFriendly: true,
    contraindications: [],
    startingPosture: 'Nằm ngửa trên sàn hoặc thảm, nâng hai tay thẳng lên trần nhà, nâng hai chân gập gối 90 độ (cẳng chân song song sàn).',
    finishingPosture: 'Lưng dưới dán chặt mặt sàn, duỗi tay phải qua đầu và hạ chân trái cách sàn 5cm.',
    instructions: [
      'Chủ động ấn toàn bộ lưng dưới áp sát xuống mặt sàn, không để có khoảng hở giữa thắt lưng và sàn.',
      'Từ từ hạ tay phải qua đầu và duỗi chân trái ra xa mà lưng dưới vẫn không được hở khỏi sàn.',
      'Thu tay và chân về tư thế ban đầu và đổi bên luân phiên.'
    ],
    commonMistakes: [
      'Thắt lưng bị nhấc cong khỏi sàn khi hạ chân',
      'Thở nông hoặc nín thở',
      'Chuyển động quán tính quá nhanh'
    ],
    difficultyAdjustments: {
      easier: 'Chỉ gót chân chạm sàn nhẹ mà không duỗi thẳng gối.',
      harder: 'Giữ một quả tạ nhẹ 1-2kg trong lòng bàn tay.'
    }
  },
  {
    id: 'glute_bridge',
    name: 'Glute Bridge (Cầu mông tăng cường sức mạnh chuỗi cơ sau)',
    targetMuscles: ['Cơ mông lớn (Gluteus Maximus)', 'Cơ đùi sau', 'Cơ lưng dưới'],
    goalCategories: ['muscle_gain', 'general_health', 'endurance'],
    difficulty: 'beginner',
    defaultSets: 3,
    defaultReps: 15,
    restSeconds: 45,
    requiredEquipment: 'none',
    environmentSuitability: ['home', 'dormitory', 'outdoor', 'gym'],
    impactLevel: 'low',
    isQuietDormFriendly: true,
    contraindications: [],
    startingPosture: 'Nằm ngửa, hai gối co khoảng 90 độ, bàn chân đặt bằng phẳng trên sàn rộng bằng vai, hai tay duỗi xuôi theo thân người.',
    finishingPosture: 'Đẩy hông lên cao đến khi đầu gối, hông và vai tạo thành một đường thẳng, siết chặt cơ mông ở đỉnh.',
    instructions: [
      'Ấn mạnh hai gót chân xuống sàn, dùng lực từ cơ mông đẩy hông lên cao.',
      'Siết chặt mông trong 1-2 giây ở vị trí cao nhất.',
      'Từ từ hạ hông xuống cách mặt sàn 1cm rồi lặp lại nhịp tiếp theo.'
    ],
    commonMistakes: [
      'Ưỡn quá đà làm cong lưng dưới thay vì dùng cơ mông',
      'Đẩy người bằng mũi chân thay vì gót chân'
    ],
    difficultyAdjustments: {
      easier: 'Hạ thấp độ cao đẩy hông.',
      harder: 'Glute bridge bằng một chân (Single-leg glute bridge) hoặc lồng dây kháng lực.'
    }
  },
  {
    id: 'marching_in_place',
    name: 'Đi bộ tại chỗ có kiểm soát (Marching in Place)',
    targetMuscles: ['Tim mạch', 'Cơ bắp chân', 'Cơ đùi trước', 'Cơ gập hông'],
    goalCategories: ['fat_loss', 'general_health', 'endurance'],
    difficulty: 'beginner',
    defaultSets: 3,
    durationSeconds: 60,
    restSeconds: 30,
    requiredEquipment: 'none',
    environmentSuitability: ['home', 'dormitory', 'outdoor', 'gym'],
    impactLevel: 'low',
    isQuietDormFriendly: true, // Hoàn toàn yên tĩnh cho ký túc xá!
    contraindications: [],
    startingPosture: 'Đứng thẳng, ngực mở rộng, hai tay để tự nhiên bên hông.',
    finishingPosture: 'Nâng đùi lên cao ngang hông luân phiên, tiếp đất bằng ức bàn chân êm ái tuyệt đối không phát ra tiếng ồn.',
    instructions: [
      'Nâng chân phải lên sao cho đùi song song mặt sàn, đồng thời đánh tay trái ra trước.',
      'Hạ êm chân phải xuống và lập tức nâng chân trái cùng tay phải.',
      'Duy trì nhịp thở nhịp nhàng, tiếp đất nhẹ nhàng như bước trên thảm mềm.'
    ],
    commonMistakes: ['Dậm chân mạnh gây rung sàn phòng', 'Ngả người về sau'],
    difficultyAdjustments: {
      easier: 'Nâng đùi thấp hơn (góc 45 độ).',
      harder: 'Nâng cao gối dứt khoát kết hợp giữ 1 giây mỗi bước.'
    }
  },
  {
    id: 'jumping_jacks',
    name: 'Jumping Jacks (Bật nhảy tay chân)',
    targetMuscles: ['Tim mạch toàn thân', 'Cơ bắp chân', 'Cơ vai'],
    goalCategories: ['fat_loss', 'endurance'],
    difficulty: 'beginner',
    defaultSets: 3,
    durationSeconds: 45,
    restSeconds: 45,
    requiredEquipment: 'none',
    environmentSuitability: ['home', 'outdoor', 'gym'],
    impactLevel: 'high',
    isQuietDormFriendly: false, // Ồn và có rung chấn!
    dormitoryAlternativeExerciseId: 'step_jacks_quiet',
    jointFriendlyAlternativeId: 'marching_in_place',
    contraindications: ['acute_knee_pain', 'hypertension_uncontrolled', 'obesity_high_impact'],
    startingPosture: 'Đứng thẳng hai chân khép sát, hai tay buông dọc thân người.',
    finishingPosture: 'Bật nhảy mở rộng hai chân đồng thời vỗ hai tay qua đầu, rồi nhảy khép chân về.',
    instructions: [
      'Bật nhẹ chân sang hai bên rộng hơn vai, đồng thời đưa hai tay vòng lên qua đầu.',
      'Bật nhảy khép chân lại và hạ tay về vị trí xuất phát.',
      'Tiếp đất bằng nửa bàn chân trước để giảm chấn thương.'
    ],
    commonMistakes: ['Tiếp đất bằng cả gót chân gây dội lực lên khớp gối và cột sống'],
    difficultyAdjustments: {
      easier: 'Chuyển sang Step Jacks (bước chân luân phiên không nhảy).',
      harder: 'Tăng tốc độ hoặc nhảy cao hơn.'
    }
  },
  {
    id: 'step_jacks_quiet',
    name: 'Step Jacks (Biến thể Jumping Jacks ít ồn cho ký túc xá)',
    targetMuscles: ['Tim mạch toàn thân', 'Cơ vai', 'Cơ đùi'],
    goalCategories: ['fat_loss', 'endurance', 'general_health'],
    difficulty: 'beginner',
    defaultSets: 3,
    durationSeconds: 45,
    restSeconds: 30,
    requiredEquipment: 'none',
    environmentSuitability: ['home', 'dormitory', 'outdoor', 'gym'],
    impactLevel: 'low',
    isQuietDormFriendly: true, // 100% không tiếng ồn!
    contraindications: [],
    startingPosture: 'Đứng thẳng, chân khép, tay áp sát thân người.',
    finishingPosture: 'Bước chân phải sang ngang đồng thời nâng hai tay qua đầu, thu về rồi bước chân trái.',
    instructions: [
      'Bước một chân sang ngang rộng bằng vai, cùng lúc nâng hai cánh tay lên cao qua đầu.',
      'Thu chân và tay về vị trí trung tâm.',
      'Lập tức bước chân đối diện sang ngang và nâng tay, tiếp đất hoàn toàn tĩnh lặng.'
    ],
    commonMistakes: ['Chuyển động uể oải, không siết cơ vai và cơ bụng'],
    difficultyAdjustments: {
      easier: 'Chỉ nâng tay ngang vai.',
      harder: 'Khuỵu gối xuống tư thế half-squat khi bước chân sang.'
    }
  },
  {
    id: 'burpee_quiet',
    name: 'Step-back Burpee (Burpee bước chân không nhảy - Ký túc xá)',
    targetMuscles: ['Toàn thân', 'Cơ ngực', 'Cơ lõi', 'Cơ đùi'],
    goalCategories: ['fat_loss', 'endurance', 'muscle_gain'],
    difficulty: 'intermediate',
    defaultSets: 3,
    defaultReps: 8,
    restSeconds: 60,
    requiredEquipment: 'none',
    environmentSuitability: ['home', 'dormitory', 'outdoor', 'gym'],
    impactLevel: 'low',
    isQuietDormFriendly: true,
    contraindications: ['acute_wrist_pain'],
    startingPosture: 'Đứng thẳng, chân rộng bằng hông.',
    finishingPosture: 'Chống tay xuống sàn, bước từng chân về tư thế plank, bước từng chân lên rồi đứng thẳng (không bật nhảy).',
    instructions: [
      'Ngồi xổm xuống và đặt hai bàn tay vững chắc lên sàn.',
      'Bước lùi chân phải rồi chân trái về sau tạo tư thế plank cao.',
      'Bước chân phải rồi chân trái lên sát tay.',
      'Đứng thẳng dậy và vươn tay lên trời, không cần nhảy lên khỏi sàn.'
    ],
    commonMistakes: ['Võng lưng khi bước về sau', 'Dậm chân phát tiếng động'],
    difficultyAdjustments: {
      easier: 'Chống tay lên mặt ghế sofa/giường thay vì sàn nhà.',
      harder: 'Thêm một nhịp chống đẩy hít đất khi ở tư thế plank.'
    }
  },
  {
    id: 'band_glute_bridge',
    name: 'Glute Bridge với dây kháng lực (Miniband)',
    targetMuscles: ['Cơ mông nhỡ', 'Cơ mông lớn', 'Cơ căng mạc đùi'],
    goalCategories: ['muscle_gain', 'fat_loss', 'general_health'],
    difficulty: 'intermediate',
    defaultSets: 3,
    defaultReps: 15,
    restSeconds: 45,
    requiredEquipment: 'resistance_band',
    environmentSuitability: ['home', 'dormitory', 'outdoor', 'gym'],
    impactLevel: 'low',
    isQuietDormFriendly: true,
    contraindications: [],
    startingPosture: 'Lồng dây kháng lực ngay trên đầu gối 5cm, nằm ngửa co chân như tư thế glute bridge.',
    finishingPosture: 'Đẩy hông lên cao đồng thời chủ động mở rộng hai đầu gối kéo căng dây kháng lực.',
    instructions: [
      'Giữ lực ép hai gối mở rộng ra ngoài chống lại lực co của dây.',
      'Đẩy hông lên cao, siết mông thật chặt trong 2 giây.',
      'Hạ hông xuống từ từ mà hai gối vẫn giữ căng dây.'
    ],
    commonMistakes: ['Để dây kéo hai đầu gối chụm vào nhau'],
    difficultyAdjustments: {
      easier: 'Dùng dây có mức kháng lực nhẹ (Light).',
      harder: 'Dùng dây nặng (Heavy) và giữ 3 giây ở đỉnh.'
    }
  },
  {
    id: 'band_row',
    name: 'Kéo lưng xô với dây kháng lực (Resistance Band Row)',
    targetMuscles: ['Cơ lưng xô (Lats)', 'Cơ trám', 'Cơ bắp tay trước'],
    goalCategories: ['muscle_gain', 'general_health'],
    difficulty: 'beginner',
    defaultSets: 3,
    defaultReps: 12,
    restSeconds: 45,
    requiredEquipment: 'resistance_band',
    environmentSuitability: ['home', 'dormitory', 'outdoor', 'gym'],
    impactLevel: 'low',
    isQuietDormFriendly: true,
    contraindications: ['acute_lower_back_pain'],
    startingPosture: 'Ngồi thẳng chân trên sàn hoặc đứng dẫm giữa sợi dây, hai tay cầm hai đầu dây.',
    finishingPosture: 'Kéo khuỷu tay sát sườn về phía sau, ép chặt hai bả vai vào nhau.',
    instructions: [
      'Giữ ngực mở rộng, lưng thẳng tự nhiên.',
      'Thở ra, kéo dây về phía bụng dưới, tập trung cảm nhận hai xương bả vai khép lại.',
      'Hít vào, từ từ nhả dây về vị trí ban đầu trong 2 giây có kiểm soát.'
    ],
    commonMistakes: ['Rụt vai lên tai', 'Gù lưng khi kéo dây'],
    difficultyAdjustments: {
      easier: 'Cầm dây nới lỏng hơn.',
      harder: 'Gập đôi sợi dây hoặc tạm dừng 2 giây ở vị trí co cơ.'
    }
  },
  {
    id: 'dumbbell_goblet_squat',
    name: 'Goblet Squat với tạ tay (Dumbbell)',
    targetMuscles: ['Cơ đùi trước', 'Cơ mông', 'Cơ lõi'],
    goalCategories: ['muscle_gain', 'fat_loss'],
    difficulty: 'intermediate',
    defaultSets: 3,
    defaultReps: 10,
    restSeconds: 60,
    requiredEquipment: 'dumbbells',
    environmentSuitability: ['home', 'dormitory', 'gym'],
    impactLevel: 'low',
    isQuietDormFriendly: true,
    jointFriendlyAlternativeId: 'glute_bridge',
    contraindications: ['acute_knee_pain'],
    startingPosture: 'Hai tay ôm một quả tạ đơn trước ngực sát xương ức, đứng chân rộng hơn vai.',
    finishingPosture: 'Ngồi xổm sâu có kiểm soát, đùi song song sàn, rồi đẩy người đứng dậy.',
    instructions: [
      'Giữ tạ vững trước ngực, khuỷu tay hướng xuống sàn.',
      'Hít sâu, đẩy hông về sau và hạ người xuống.',
      'Đạp mạnh gót chân để vươn người đứng thẳng dậy, thở ra.'
    ],
    commonMistakes: ['Để tạ kéo rơi người về trước làm cong lưng'],
    difficultyAdjustments: {
      easier: 'Giảm trọng lượng tạ (2-3kg) hoặc tập squat tay không.',
      harder: 'Tăng trọng lượng tạ hoặc hạ người chậm 3 giây.'
    }
  },
  {
    id: 'wall_sit',
    name: 'Wall Sit (Ngồi tựa tường - Bảo vệ khớp & tĩnh lặng)',
    targetMuscles: ['Cơ đùi trước', 'Cơ mông', 'Cơ bắp chân'],
    goalCategories: ['endurance', 'general_health', 'muscle_gain'],
    difficulty: 'beginner',
    defaultSets: 3,
    durationSeconds: 30,
    restSeconds: 45,
    requiredEquipment: 'none',
    environmentSuitability: ['home', 'dormitory', 'gym'],
    impactLevel: 'low',
    isQuietDormFriendly: true,
    contraindications: [],
    startingPosture: 'Đứng tựa lưng vào bức tường phẳng, bước hai chân ra trước khoảng 50cm.',
    finishingPosture: 'Trượt lưng xuống dọc tường đến khi đùi song song sàn (gối góc 90 độ), hai tay đặt lên đùi hoặc buông xuôi.',
    instructions: [
      'Ép toàn bộ lưng trên và thắt lưng áp sát vào tường.',
      'Đầu gối giữ vuông góc 90 độ ngay trên cổ chân, không để vượt quá mũi chân.',
      'Duy trì hơi thở sâu và giữ vững tư thế trong 30-45 giây.'
    ],
    commonMistakes: ['Dùng tay chống đè lên đầu gối', 'Trượt chân trên sàn trơn'],
    difficultyAdjustments: {
      easier: 'Hạ đùi ở góc 45-60 độ thay vì 90 độ.',
      harder: 'Nâng thời gian lên 45-60 giây hoặc kẹp thêm gối/bóng giữa hai đùi.'
    }
  }
];

export function getExerciseById(id: string): Exercise | undefined {
  return EXERCISE_DATABASE.find(e => e.id === id);
}
