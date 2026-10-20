import { FitnessGoal, NutritionPlanRecommendation } from '../../types';

export function generateNutritionPlan(
  tdeeKcal: number,
  weightKg: number,
  goal: FitnessGoal
): NutritionPlanRecommendation {
  let targetKcal = tdeeKcal;
  let reason = 'Duy trì năng lượng cân bằng, nâng cao sức khỏe chung.';

  if (goal === 'fat_loss') {
    targetKcal = Math.max(tdeeKcal - 400, 1300);
    reason = 'Thâm hụt năng lượng khoảng 400 kcal/ngày giúp giảm mỡ an toàn, hạn chế mất cơ.';
  } else if (goal === 'muscle_gain') {
    targetKcal = tdeeKcal + 300;
    reason = 'Thặng dư năng lượng khoảng 300 kcal/ngày hỗ trợ quá trình tổng hợp và phát triển cơ bắp.';
  } else if (goal === 'endurance') {
    targetKcal = tdeeKcal + 100;
    reason = 'Bổ sung nhẹ năng lượng để đáp ứng nhu cầu phục hồi sức bền.';
  }

  // Khuyến nghị đạm 1.2 - 1.6 g/kg thể trọng cho người có tập luyện
  const minProtein = Math.round(weightKg * 1.2);
  const maxProtein = Math.round(weightKg * 1.6);

  // Mẫu thực đơn món Việt thân thuộc, dinh dưỡng và tiết kiệm ngân sách cho sinh viên / người đi làm
  const dailyMeals = [
    {
      mealName: 'Bữa sáng' as const,
      dishName: 'Yến mạch nấu trứng & chuối tiêu (hoặc Bánh mì 2 trứng ốp la)',
      estimatedKcal: Math.round(targetKcal * 0.25),
      estimatedProtein: Math.round(minProtein * 0.25),
      estimatedCostVnd: 15000,
      budgetSavingTip: 'Mua yến mạch túi lớn 1kg và trứng gà theo vỉ để tiết kiệm đến 40% so với ăn sáng ngoài quán.'
    },
    {
      mealName: 'Bữa trưa' as const,
      dishName: 'Cơm gạo tẻ, ức gà áp chảo sốt tỏi ớt, rau muống luộc dầm sấu',
      estimatedKcal: Math.round(targetKcal * 0.35),
      estimatedProtein: Math.round(minProtein * 0.40),
      estimatedCostVnd: 25000,
      budgetSavingTip: 'Ức gà đông lạnh tại siêu thị chỉ khoảng 55.000đ - 65.000đ/kg, là nguồn đạm rẻ và tinh khiết nhất.'
    },
    {
      mealName: 'Bữa tối' as const,
      dishName: 'Cơm trắng, đậu hũ sốt cà chua thịt nạc băm, canh cải thìa',
      estimatedKcal: Math.round(targetKcal * 0.30),
      estimatedProtein: Math.round(minProtein * 0.25),
      estimatedCostVnd: 22000,
      budgetSavingTip: 'Đậu phụ làng tươi (3.000đ - 5.000đ/bìa) cung cấp đạm thực vật lành mạnh và canxi dồi dào.'
    },
    {
      mealName: 'Bữa phụ' as const,
      dishName: '1 hộp sữa chua không đường + 1 quả chuối sứ chín',
      estimatedKcal: Math.round(targetKcal * 0.10),
      estimatedProtein: Math.round(minProtein * 0.10),
      estimatedCostVnd: 9000,
      budgetSavingTip: 'Chuối là siêu thực phẩm giàu kali chống chuột rút cơ bắp cho người tập với giá chỉ 15.000đ/nải.'
    }
  ];

  return {
    tdeeKcal,
    targetKcal,
    targetProteinGramsMin: minProtein,
    targetProteinGramsMax: maxProtein,
    calorieAdjustmentReason: reason,
    dailyMeals,
    disclaimer: 'Lưu ý: Mức calo, hàm lượng đạm và chi phí trên chỉ là ước tính tham khảo trên các nguyên liệu phổ biến tại Việt Nam. Cách chế biến và kích cỡ phần ăn thực tế sẽ ảnh hưởng đến năng lượng hấp thụ. Cần tham khảo chuyên gia dinh dưỡng khi có bệnh lý đặc thù.'
  };
}
