import React, { useState } from 'react';
import {
  Play,
  Calendar,
  Activity,
  Flame,
  VolumeX,
  Volume2,
  ChevronRight,
  ShieldCheck,
  AlertTriangle,
  HeartPulse,
  Info,
  CheckCircle2
} from 'lucide-react';
import { useAppStore } from '../../core/store/appStore';
import { calculateBmi, evaluateHealthSafety } from '../../core/health/metrics';
import { HealthBadge } from '../common/HealthBadge';
import { DailyCheckInModal } from './DailyCheckInModal';
import { generateNutritionPlan } from '../../core/nutrition/planner';
import { calculateTdee } from '../../core/health/metrics';

interface HomeTabProps {
  onStartWorkout: (dayOfWeek: number) => void;
  onNavigateToSchedule: () => void;
  onNavigateToHealthRecord: () => void;
  onNavigateToShop: () => void;
}

export const HomeTab: React.FC<HomeTabProps> = ({
  onStartWorkout,
  onNavigateToSchedule,
  onNavigateToHealthRecord
}) => {
  const { profile, currentPlan, healthRecord, updateProfile, dailyCheckIns, sessionLogs } = useAppStore();
  const [isCheckInOpen, setIsCheckInOpen] = useState(false);

  // BMI calculations
  const bmiInfo = calculateBmi(profile.weightKg, profile.heightCm);

  // Health safety evaluation
  const safetyAssessment = evaluateHealthSafety(healthRecord, bmiInfo.bmi);

  // Calculate today's day of week: Sunday = 7, Monday = 1, ...
  const jsDay = new Date().getDay();
  const todayDayOfWeek = jsDay === 0 ? 7 : jsDay;

  const todayPlan = currentPlan?.days.find(d => d.dayOfWeek === todayDayOfWeek);

  const todayStr = new Date().toISOString().split('T')[0];
  const todayCheckIn = dailyCheckIns.find(c => c.date === todayStr);

  // TDEE & Nutrition
  const tdeeResult = calculateTdee(
    profile.weightKg,
    profile.heightCm,
    profile.age,
    profile.gender,
    profile.daysPerWeek
  );
  const nutritionPlan = generateNutritionPlan(tdeeResult.tdee, profile.weightKg, profile.goal);

  // Streak calculation
  const completedCount = sessionLogs.length;

  return (
    <div className="pb-24 pt-2 px-4 max-w-md mx-auto space-y-4">
      {/* User Greeting & Streak Header */}
      <div className="flex items-center justify-between pt-1">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold">
            <span>Chào mừng trở lại</span>
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></span>
          </div>
          <h1 className="text-xl font-extrabold text-[#18324B] tracking-tight">{profile.name}</h1>
        </div>
        <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-2xl shadow-xs">
          <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
          <div className="text-right">
            <span className="text-xs font-bold text-amber-900 block leading-none">{completedCount} buổi</span>
            <span className="text-[9px] text-amber-700 font-medium">đã hoàn thành</span>
          </div>
        </div>
      </div>

      {/* Safety Alert Banner */}
      <div
        onClick={onNavigateToHealthRecord}
        className={`p-3.5 rounded-2xl border cursor-pointer transition-all hover:shadow-md ${
          safetyAssessment.status === 'high_warning'
            ? 'bg-red-50 border-red-200 text-red-900'
            : safetyAssessment.status === 'caution'
            ? 'bg-amber-50 border-amber-200 text-amber-900'
            : 'bg-white border-[#8ECAFF]/50 text-[#18324B] shadow-xs'
        }`}
      >
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <HealthBadge status={safetyAssessment.status} label={safetyAssessment.statusLabel} />
            {healthRecord?.doctorExerciseRestrictions && (
              <span className="text-[10px] bg-indigo-100 text-indigo-700 font-semibold px-2 py-0.5 rounded-full">
                Theo y lệnh bác sĩ
              </span>
            )}
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 flex-shrink-0" />
        </div>
        <p className="text-xs mt-2 font-medium leading-relaxed">
          {safetyAssessment.summary}
        </p>
        {safetyAssessment.cautions.length > 0 && (
          <p className="text-[11px] mt-1 text-slate-500 line-clamp-1 italic">
            • {safetyAssessment.cautions[0]}
          </p>
        )}
      </div>

      {/* Today's Workout Card */}
      <div className="bg-gradient-to-br from-[#4A9DFF] to-[#2B79DC] rounded-3xl p-5 text-white shadow-lg relative overflow-hidden">
        <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-white/10 rounded-full blur-xl pointer-events-none"></div>

        <div className="flex items-center justify-between text-xs font-medium text-blue-100 mb-2">
          <span className="bg-white/20 backdrop-blur-md px-2.5 py-0.5 rounded-full font-bold">
            {todayPlan?.dayName || 'Hôm nay'}
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            {profile.goal === 'muscle_gain' ? 'Mục tiêu: Tăng cơ' : profile.goal === 'fat_loss' ? 'Mục tiêu: Giảm mỡ' : 'Rèn luyện sức khỏe'}
          </span>
        </div>

        <h2 className="text-xl font-extrabold tracking-tight mb-1">
          {todayPlan?.targetFocus || 'Buổi tập toàn thân'}
        </h2>

        <p className="text-xs text-blue-100 mb-4">
          {todayPlan?.isRestDay
            ? 'Hôm nay là ngày nghỉ ngơi phục hồi. Hãy đi dạo nhẹ nhàng hoặc giãn cơ.'
            : `${todayPlan?.exercises.length || 0} bài tập • Dự kiến ${todayPlan?.estimatedMinutes || 30} phút • Khởi động & Giãn cơ`}
        </p>

        <div className="flex items-center gap-2">
          {todayPlan?.isRestDay ? (
            <button
              onClick={onNavigateToSchedule}
              className="flex-1 py-2.5 bg-white text-[#18324B] font-bold rounded-2xl text-xs flex items-center justify-center gap-2 shadow-sm hover:bg-slate-50 transition-all active:scale-95"
            >
              Xem Lịch Cả Tuần
            </button>
          ) : (
            <>
              <button
                onClick={() => onStartWorkout(todayDayOfWeek)}
                className="flex-1 py-3 bg-white text-[#2B79DC] font-extrabold rounded-2xl text-xs flex items-center justify-center gap-2 shadow-md hover:bg-slate-50 transition-all active:scale-95"
              >
                <Play className="w-4 h-4 fill-[#2B79DC]" />
                Bắt Đầu Buổi Tập Ngay
              </button>
              <button
                onClick={onNavigateToSchedule}
                className="p-3 bg-white/20 hover:bg-white/30 rounded-2xl text-white transition-colors"
                title="Xem chi tiết các bài tập"
                aria-label="Xem chi tiết bài tập"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Quick Check-in & Dormitory Mode Row */}
      <div className="grid grid-cols-2 gap-3">
        {/* Daily Check-in Card */}
        <div
          onClick={() => setIsCheckInOpen(true)}
          className="bg-white p-4 rounded-3xl border border-[#8ECAFF]/40 shadow-xs cursor-pointer hover:border-[#4A9DFF] transition-all flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#4A9DFF] flex items-center justify-center">
                <Activity className="w-4 h-4" />
              </div>
              {todayCheckIn ? (
                <span className="text-[10px] bg-emerald-100 text-emerald-700 font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Đã xong
                </span>
              ) : (
                <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-full">
                  Chưa check-in
                </span>
              )}
            </div>
            <h3 className="text-xs font-bold text-[#18324B]">Check-in Thể Trạng</h3>
            <p className="text-[11px] text-slate-500 mt-1 leading-snug">
              {todayCheckIn ? todayCheckIn.actionTaken : '3 câu hỏi: Giấc ngủ, Đau mỏi, Mệt'}
            </p>
          </div>
          <span className="text-[11px] text-[#4A9DFF] font-bold mt-3 inline-flex items-center gap-1">
            {todayCheckIn ? 'Cập nhật lại' : 'Bắt đầu'} &rarr;
          </span>
        </div>

        {/* Dormitory Mode Card */}
        <div
          onClick={() => updateProfile({ quietDormitoryMode: !profile.quietDormitoryMode })}
          className={`p-4 rounded-3xl border shadow-xs cursor-pointer transition-all flex flex-col justify-between ${
            profile.quietDormitoryMode
              ? 'bg-amber-50/60 border-amber-300'
              : 'bg-white border-[#8ECAFF]/40 hover:border-slate-300'
          }`}
        >
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                profile.quietDormitoryMode ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-500'
              }`}>
                {profile.quietDormitoryMode ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                profile.quietDormitoryMode ? 'bg-amber-200 text-amber-900' : 'bg-slate-100 text-slate-600'
              }`}>
                {profile.quietDormitoryMode ? 'ĐANG BẬT' : 'ĐANG TẮT'}
              </span>
            </div>
            <h3 className="text-xs font-bold text-[#18324B]">Chế Độ Ký Túc Xá</h3>
            <p className="text-[11px] text-slate-500 mt-1 leading-snug">
              Ít ồn, không bật nhảy, không làm rung sàn phòng trọ.
            </p>
          </div>
          <span className="text-[11px] font-bold mt-3 text-amber-700">
            {profile.quietDormitoryMode ? 'Nhấn để tắt' : 'Nhấn để bật'} &rarr;
          </span>
        </div>
      </div>

      {/* Body Metrics Summary Card */}
      <div className="bg-white rounded-3xl p-4 border border-[#8ECAFF]/40 shadow-xs space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <div className="flex items-center gap-2">
            <HeartPulse className="w-4 h-4 text-[#4A9DFF]" />
            <span className="text-xs font-bold text-[#18324B]">Chỉ Số Cơ Thể & Thể Trạng</span>
          </div>
          <button
            onClick={onNavigateToHealthRecord}
            className="text-[11px] font-bold text-[#4A9DFF] hover:underline"
          >
            Sửa chỉ số
          </button>
        </div>

        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="bg-[#F4F9FF] p-2.5 rounded-2xl">
            <span className="text-[10px] text-slate-500 block font-medium">Cân nặng</span>
            <span className="text-base font-extrabold text-[#18324B]">{profile.weightKg}</span>
            <span className="text-[10px] text-slate-500 ml-0.5">kg</span>
          </div>

          <div className="bg-[#F4F9FF] p-2.5 rounded-2xl">
            <span className="text-[10px] text-slate-500 block font-medium">Chiều cao</span>
            <span className="text-base font-extrabold text-[#18324B]">{profile.heightCm}</span>
            <span className="text-[10px] text-slate-500 ml-0.5">cm</span>
          </div>

          <div className="bg-[#F4F9FF] p-2.5 rounded-2xl">
            <span className="text-[10px] text-slate-500 block font-medium">BMI</span>
            <span className="text-base font-extrabold text-[#18324B]">{bmiInfo.bmi}</span>
            <span className="text-[9px] block text-emerald-600 font-bold">{bmiInfo.categoryLabel}</span>
          </div>
        </div>

        <div className="flex items-start gap-1.5 text-[11px] text-slate-500 bg-slate-50 p-2.5 rounded-xl border border-slate-200/60">
          <Info className="w-3.5 h-3.5 text-slate-400 flex-shrink-0 mt-0.5" />
          <span>{bmiInfo.explanation} (BMI tính theo công thức WPRO Châu Á: kg/m²).</span>
        </div>
      </div>

      {/* Vietnamese Nutrition Highlight for Students */}
      <div className="bg-white rounded-3xl p-4 border border-[#8ECAFF]/40 shadow-xs space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-[#18324B] flex items-center gap-1.5">
            <span>🥗 Gợi Ý Dinh Dưỡng Tiết Kiệm</span>
          </span>
          <span className="text-[10px] bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded-md border border-emerald-200">
            ~{tdeeResult.tdee} kcal/ngày
          </span>
        </div>
        <p className="text-xs text-slate-600 leading-relaxed">
          {nutritionPlan.calorieAdjustmentReason} Mục tiêu đạm: <strong>{nutritionPlan.targetProteinGramsMin} - {nutritionPlan.targetProteinGramsMax}g</strong>/ngày.
        </p>
        <div className="bg-[#F4F9FF] p-2.5 rounded-2xl border border-blue-100 text-[11px] text-slate-700">
          <span className="font-bold text-[#18324B] block mb-1">💡 Mẹo mua đồ cho sinh viên:</span>
          {nutritionPlan.dailyMeals[1].budgetSavingTip}
        </div>
      </div>

      {/* Daily Check-in Modal */}
      <DailyCheckInModal isOpen={isCheckInOpen} onClose={() => setIsCheckInOpen(false)} />
    </div>
  );
};
