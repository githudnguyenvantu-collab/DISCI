import { Gender, HealthAssessment, HealthRecord, HealthStatusLevel } from '../../types';

export interface BmiResult {
  bmi: number;
  category: 'underweight' | 'normal' | 'overweight' | 'obese';
  categoryLabel: string;
  explanation: string;
}

/**
 * Tính toán chỉ số khối cơ thể (BMI)
 * Công thức: BMI = Cân nặng (kg) / [Chiều cao (m)]²
 * Lưu ý y tế: Chỉ số có tính tham khảo thể trạng, không dùng để chẩn đoán bệnh.
 */
export function calculateBmi(weightKg: number, heightCm: number): BmiResult {
  if (weightKg <= 0 || heightCm <= 0) {
    throw new Error('Cân nặng và chiều cao phải lớn hơn 0');
  }

  const heightM = heightCm / 100;
  const bmi = Math.round((weightKg / (heightM * heightM)) * 10) / 10;

  // Thang đo theo chuẩn IDI & WPRO cho người Châu Á
  let category: BmiResult['category'] = 'normal';
  let categoryLabel = 'Bình thường';
  let explanation = 'Thể trạng cân đối so với chiều cao.';

  if (bmi < 18.5) {
    category = 'underweight';
    categoryLabel = 'Thiếu cân';
    explanation = 'Chỉ số dưới ngưỡng tham khảo. Nên chú trọng dinh dưỡng và bài tập tăng cơ an toàn.';
  } else if (bmi >= 18.5 && bmi < 23.0) {
    category = 'normal';
    categoryLabel = 'Cân đối (Chuẩn Châu Á)';
    explanation = 'Chỉ số nằm trong khoảng tham khảo lý tưởng cho người trưởng thành.';
  } else if (bmi >= 23.0 && bmi < 25.0) {
    category = 'overweight';
    categoryLabel = 'Tiền béo phì / Thừa cân';
    explanation = 'Có xu hướng tích trữ mỡ thừa. Tập luyện đều đặn kết hợp thâm hụt calo nhẹ.';
  } else {
    category = 'obese';
    categoryLabel = 'Béo phì';
    explanation = 'Trên ngưỡng tham khảo. Khuyến nghị ưu tiên các bài tập ít áp lực lên khớp gối.';
  }

  return { bmi, category, categoryLabel, explanation };
}

/**
 * Tính toán TDEE (Total Daily Energy Expenditure) bằng công thức Mifflin-St Jeor
 * BMR Nam = 10 * kg + 6.25 * cm - 5 * tuổi + 5
 * BMR Nữ = 10 * kg + 6.25 * cm - 5 * tuổi - 161
 */
export function calculateTdee(
  weightKg: number,
  heightCm: number,
  age: number,
  gender: Gender,
  daysPerWeek: number
): { bmr: number; tdee: number; activityMultiplier: number; explanation: string } {
  if (weightKg <= 0 || heightCm <= 0 || age <= 0) {
    throw new Error('Dữ liệu cân nặng, chiều cao và tuổi phải hợp lệ');
  }

  let bmr = 10 * weightKg + 6.25 * heightCm - 5 * age;
  if (gender === 'male') {
    bmr += 5;
  } else if (gender === 'female') {
    bmr -= 161;
  } else {
    // Non-binary / other: trung bình
    bmr -= 78;
  }

  // Hệ số hoạt động thể chất dựa trên số buổi tập dự kiến
  let activityMultiplier = 1.2; // Ít vận động
  if (daysPerWeek >= 1 && daysPerWeek <= 2) {
    activityMultiplier = 1.375; // Vận động nhẹ
  } else if (daysPerWeek >= 3 && daysPerWeek <= 4) {
    activityMultiplier = 1.55; // Vận động vừa phải
  } else if (daysPerWeek >= 5) {
    activityMultiplier = 1.725; // Năng động
  }

  const tdee = Math.round(bmr * activityMultiplier);

  return {
    bmr: Math.round(bmr),
    tdee,
    activityMultiplier,
    explanation: `Ước tính dựa trên BMR (${Math.round(bmr)} kcal) và hệ số hoạt động thể chất x${activityMultiplier}.`
  };
}

/**
 * Đánh giá an toàn sức khỏe dựa trên các chỉ số tự nguyện và khuyến cáo bác sĩ.
 * Hệ thống hiển thị 3 cấp độ:
 * 1. good: Tiến bộ tốt, chưa ghi nhận yếu tố cần lưu ý.
 * 2. caution: Mức lưu ý, cần thận trọng, điều chỉnh bài tập nhẹ hơn.
 * 3. high_warning: Cảnh báo cao, dừng các bài tập nặng, hướng dẫn người dùng tìm tư vấn y tế.
 */
export function evaluateHealthSafety(
  healthRecord: HealthRecord | null | undefined,
  currentBmi?: number
): HealthAssessment {
  const disclaimer = 'Cảnh báo & Lưu ý: Các ngưỡng đánh giá dưới đây là cấu hình tham khảo do người dùng tự nguyện cung cấp, không phải kết luận chẩn đoán lâm sàng của bác sĩ. Luôn lắng nghe cơ thể và tham khảo ý kiến y tế khi có dấu hiệu bất thường.';

  if (!healthRecord) {
    return {
      status: 'good',
      statusLabel: 'Tiến độ tiêu chuẩn',
      summary: 'Chưa có thông tin sức khỏe mở rộng. Ứng dụng áp dụng lộ trình rèn luyện an toàn cho người mới.',
      warnings: [],
      cautions: ['Bạn chưa nhập dữ liệu khám sức khỏe. Chương trình sẽ khởi động từ mức độ vừa phải để đảm bảo an toàn.'],
      recommendations: ['Khởi động kỹ trước mỗi buổi tập', 'Bấm nút "Báo mệt/đau" nếu cảm thấy quá sức'],
      medicalDisclaimer: disclaimer,
      requiresDoctorClearance: false
    };
  }

  const warnings: string[] = [];
  const cautions: string[] = [];
  const recommendations: string[] = [];
  let status: HealthStatusLevel = 'good';
  let requiresDoctorClearance = false;

  // 1. Kiểm tra khuyến cáo của bác sĩ (Ưu tiên cao nhất)
  if (healthRecord.doctorExerciseRestrictions && healthRecord.doctorExerciseRestrictions.trim().length > 0) {
    cautions.push(`Khuyến cáo y khoa đã ghi nhận: "${healthRecord.doctorExerciseRestrictions}". Hệ thống sẽ ưu tiên áp dụng hạn chế này.`);
    recommendations.push('Tuân thủ nghiêm ngặt chỉ dẫn vận động của bác sĩ điều trị.');
  }

  if (healthRecord.doctorAllowedIntensity === 'low') {
    warnings.push('Bác sĩ chỉ định cường độ vận động thấp. Không được thực hiện các bài tập bật nhảy mạnh hoặc tạ nặng.');
    requiresDoctorClearance = true;
    status = 'high_warning';
  }

  // 2. Kiểm tra Huyết áp (mmHg)
  if (healthRecord.systolicBp && healthRecord.diastolicBp) {
    const s = healthRecord.systolicBp;
    const d = healthRecord.diastolicBp;

    if (s >= 160 || d >= 100) {
      warnings.push(`Huyết áp ${s}/${d} mmHg ở mức cảnh báo cao. Nguy cơ tăng áp lực tim mạch khi gắng sức.`);
      recommendations.push('Tạm hoãn các bài tập cường độ cao (HIIT, nín thở gồng tạ), cần tham vấn bác sĩ tim mạch.');
      status = 'high_warning';
      requiresDoctorClearance = true;
    } else if (s >= 140 || d >= 90) {
      cautions.push(`Huyết áp ${s}/${d} mmHg trên mức tối ưu. Cần khởi động chậm, tránh bài tập dốc ngược đầu.`);
      if (status !== 'high_warning') status = 'caution';
    } else if (s < 90 || d < 60) {
      cautions.push(`Huyết áp ${s}/${d} mmHg có dấu hiệu huyết áp thấp. Cần tránh đổi tư thế đột ngột từ nằm sang đứng.`);
      if (status !== 'high_warning') status = 'caution';
    }
  }

  // 3. Kiểm tra Nhịp tim lúc nghỉ (bpm)
  if (healthRecord.restingHeartRate) {
    const hr = healthRecord.restingHeartRate;
    if (hr > 100) {
      cautions.push(`Nhịp tim nghỉ ${hr} nhịp/phút cao hơn bình thường (nhịp tim nhanh). Tránh tập khi đang căng thẳng hoặc thiếu ngủ.`);
      if (status !== 'high_warning') status = 'caution';
    } else if (hr < 50) {
      cautions.push(`Nhịp tim nghỉ ${hr} nhịp/phút (thấp). Nếu không phải vận động viên sức bền, nên theo dõi thêm.`);
    }
  }

  // 4. Kiểm tra Đường huyết đói (mg/dL)
  if (healthRecord.fastingBloodGlucose) {
    const bg = healthRecord.fastingBloodGlucose;
    if (bg >= 126) {
      cautions.push(`Đường huyết đói ${bg} mg/dL cao hơn ngưỡng tham khảo thông thường. Không nên tập khi bụng quá đói.`);
      if (status !== 'high_warning') status = 'caution';
    }
  }

  // 5. Kiểm tra vấn đề xương khớp
  if (healthRecord.jointBoneIssues && healthRecord.jointBoneIssues.length > 0) {
    const jointList = healthRecord.jointBoneIssues.join(', ');
    cautions.push(`Ghi nhận tiền sử khớp/cột sống (${jointList}). Các bài tập nhảy (jump squat, burpee) sẽ được chuyển sang biến thể không tác động.`);
    recommendations.push('Ưu tiên các bài tập isometric (giữ tĩnh) và kiểm soát chuyển động chậm.');
  }

  // 6. Kiểm tra BMI nếu có
  if (currentBmi && currentBmi >= 30) {
    cautions.push(`Chỉ số BMI ${currentBmi} ở mức cần lưu ý giảm tải cho khớp gối và cổ chân.`);
    recommendations.push('Tập trung các bài tập nằm hoặc đứng vững chãi, giảm tối đa bật nhảy.');
  }

  let statusLabel = 'Tiến bộ tốt';
  let summary = 'Chưa ghi nhận yếu tố cần lưu ý. Bạn có thể tự tin tập luyện theo lịch trình.';

  if (status === 'high_warning') {
    statusLabel = 'Cảnh báo cao';
    summary = 'Phát hiện chỉ số ngoài ngưỡng tham khảo an toàn hoặc có chỉ định hạn chế nghiêm ngặt từ bác sĩ.';
  } else if (status === 'caution') {
    statusLabel = 'Mức lưu ý';
    summary = 'Có một số yếu tố cần thận trọng. Hệ thống đã tự động kích hoạt bộ lọc bài tập giảm áp lực.';
  }

  return {
    status,
    statusLabel,
    summary,
    warnings,
    cautions,
    recommendations: recommendations.length > 0 ? recommendations : ['Uống đủ nước', 'Khởi động 5 phút'],
    medicalDisclaimer: disclaimer,
    requiresDoctorClearance
  };
}
