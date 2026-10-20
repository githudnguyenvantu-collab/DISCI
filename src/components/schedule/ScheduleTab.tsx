import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  Play,
  CheckCircle2,
  RefreshCw,
  VolumeX,
  Volume2,
  ChevronRight,
  Sparkles,
  ArrowRightLeft,
  Flame,
  Info
} from 'lucide-react';
import { useAppStore } from '../../core/store/appStore';
import { getExerciseById, EXERCISE_DATABASE } from '../../data/exercises';
import { ExerciseDetailModal } from './ExerciseDetailModal';
import { substituteExercise } from '../../core/workout/scheduler';

interface ScheduleTabProps {
  onStartWorkout: (dayOfWeek: number) => void;
}

export const ScheduleTab: React.FC<ScheduleTabProps> = ({ onStartWorkout }) => {
  const { currentPlan, toggleDayComplete, substituteDayExercise, profile, updateProfile, createNewPlan } = useAppStore();

  const jsDay = new Date().getDay();
  const todayDayOfWeek = jsDay === 0 ? 7 : jsDay;
  const [selectedDay, setSelectedDay] = useState<number>(todayDayOfWeek);
  const [inspectExerciseId, setInspectExerciseId] = useState<string | null>(null);
  const [isEditingGoalModalOpen, setIsEditingGoalModalOpen] = useState(false);

  if (!currentPlan) {
    return (
      <div className="pb-24 pt-6 px-4 max-w-md mx-auto text-center space-y-4">
        <p className="text-sm text-slate-500">Chưa có lịch tập.</p>
        <button
          onClick={() => createNewPlan()}
          className="px-4 py-2 bg-[#4A9DFF] text-white font-bold rounded-xl text-xs"
        >
          Tạo Lịch Tập Mới
        </button>
      </div>
    );
  }

  const activeDayPlan = currentPlan.days.find(d => d.dayOfWeek === selectedDay) || currentPlan.days[0];

  const handleToggleDormMode = () => {
    updateProfile({ quietDormitoryMode: !profile.quietDormitoryMode });
  };

  const handleQuickSubstitute = (index: number, currentExId: string) => {
    const alt = substituteExercise(currentExId, profile.quietDormitoryMode ? 'quiet_mode' : 'too_hard');
    if (alt) {
      substituteDayExercise(selectedDay, index, alt.exerciseId);
    }
  };

  return (
    <div className="pb-24 pt-2 px-4 max-w-md mx-auto space-y-4">
      {/* Header and Controls */}
      <div className="flex items-center justify-between pt-1">
        <div>
          <h1 className="text-xl font-extrabold text-[#18324B] tracking-tight">Lịch Tập Tuần DISCI</h1>
          <p className="text-xs text-slate-500 font-medium">Cá nhân hóa theo mục tiêu và không gian</p>
        </div>

        <button
          onClick={() => setIsEditingGoalModalOpen(true)}
          className="text-xs bg-[#F4F9FF] border border-[#8ECAFF] text-[#18324B] font-bold px-3 py-1.5 rounded-xl hover:bg-[#8ECAFF]/20 transition-colors flex items-center gap-1 shadow-2xs"
        >
          <RefreshCw className="w-3.5 h-3.5 text-[#4A9DFF]" />
          <span>Tạo lại</span>
        </button>
      </div>

      {/* Week Selector Chips */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 pt-0.5 no-scrollbar">
        {currentPlan.days.map(d => {
          const isSelected = d.dayOfWeek === selectedDay;
          const isToday = d.dayOfWeek === todayDayOfWeek;
          return (
            <button
              key={d.id}
              onClick={() => setSelectedDay(d.dayOfWeek)}
              className={`flex-1 min-w-[50px] py-2 px-1 rounded-2xl border text-center transition-all ${
                isSelected
                  ? 'bg-[#4A9DFF] text-white border-[#4A9DFF] shadow-sm'
                  : d.completed
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  : d.isRestDay
                  ? 'bg-slate-100 text-slate-400 border-slate-200'
                  : 'bg-white text-[#18324B] border-slate-200 hover:border-[#8ECAFF]'
              }`}
            >
              <span className="text-[10px] font-bold block uppercase tracking-tighter">
                {d.dayOfWeek === 1 ? 'T2' : d.dayOfWeek === 2 ? 'T3' : d.dayOfWeek === 3 ? 'T4' : d.dayOfWeek === 4 ? 'T5' : d.dayOfWeek === 5 ? 'T6' : d.dayOfWeek === 6 ? 'T7' : 'CN'}
              </span>
              <div className="mt-1 flex justify-center items-center h-4">
                {d.completed ? (
                  <CheckCircle2 className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-emerald-600'}`} />
                ) : d.isRestDay ? (
                  <span className={`text-[9px] font-bold ${isSelected ? 'text-blue-100' : 'text-slate-400'}`}>Nghỉ</span>
                ) : (
                  <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-white' : 'bg-[#4A9DFF]'}`}></span>
                )}
              </div>
              {isToday && (
                <span className={`text-[8px] font-extrabold uppercase mt-0.5 block ${isSelected ? 'text-blue-100' : 'text-[#4A9DFF]'}`}>
                  Hôm nay
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Dormitory Mode Alert Banner */}
      <div className="bg-white rounded-2xl p-3 border border-[#8ECAFF]/50 shadow-2xs flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
            profile.quietDormitoryMode ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-600'
          }`}>
            {profile.quietDormitoryMode ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </div>
          <div>
            <span className="text-xs font-bold text-[#18324B] block">Chế độ ký túc xá (Không nhảy, ít ồn)</span>
            <span className="text-[10px] text-slate-500">
              {profile.quietDormitoryMode ? 'Đang bật: Tự động đổi bài bật nhảy sang bài yên tĩnh' : 'Đang tắt: Bài tập bình thường'}
            </span>
          </div>
        </div>
        <button
          onClick={handleToggleDormMode}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors ${
            profile.quietDormitoryMode
              ? 'bg-amber-500 text-white border-amber-600'
              : 'bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200'
          }`}
        >
          {profile.quietDormitoryMode ? 'Tắt' : 'Bật'}
        </button>
      </div>

      {/* Selected Day View Card */}
      <div className="bg-white rounded-3xl p-5 border border-[#8ECAFF]/40 shadow-xs space-y-4">
        <div className="flex items-start justify-between border-b border-slate-100 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-extrabold text-[#18324B]">{activeDayPlan.dayName}</span>
              {activeDayPlan.completed && (
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Đã hoàn thành
                </span>
              )}
            </div>
            <h2 className="text-sm font-bold text-[#4A9DFF] mt-0.5">{activeDayPlan.targetFocus}</h2>
          </div>

          {!activeDayPlan.isRestDay && (
            <div className="text-right">
              <span className="text-xs font-bold text-slate-700 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                ~{activeDayPlan.estimatedMinutes} phút
              </span>
              <span className="text-[10px] text-slate-400 font-medium">{activeDayPlan.exercises.length} động tác</span>
            </div>
          )}
        </div>

        {activeDayPlan.isRestDay ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-12 h-12 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto text-xl">
              🌿
            </div>
            <h3 className="font-bold text-[#18324B] text-sm">Ngày Nghỉ Phục Hồi Tích Cực</h3>
            <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
              Cơ bắp phát triển trong lúc nghỉ ngơi và ngủ đủ giấc. Bạn có thể đi bộ nhẹ nhàng 20 phút hoặc giãn cơ tĩnh.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Warmup Routine */}
            <div className="p-3 bg-blue-50/60 rounded-2xl border border-blue-100 text-xs text-blue-950 flex items-start gap-2">
              <Flame className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block text-blue-900">Khởi động ({activeDayPlan.warmupMinutes} phút):</span>
                <p className="text-[11px] text-blue-800 mt-0.5 leading-relaxed">{activeDayPlan.warmupNotes}</p>
              </div>
            </div>

            {/* Exercises List */}
            <div className="space-y-2.5">
              <span className="text-xs font-bold text-[#18324B] block">Danh sách bài tập chính:</span>
              {activeDayPlan.exercises.map((item, idx) => {
                const ex = getExerciseById(item.exerciseId);
                if (!ex) return null;

                return (
                  <div
                    key={idx}
                    className="p-3 bg-[#F4F9FF]/70 rounded-2xl border border-[#8ECAFF]/40 hover:border-[#4A9DFF] transition-all flex items-center justify-between gap-3 group"
                  >
                    <div
                      onClick={() => setInspectExerciseId(ex.id)}
                      className="flex-1 cursor-pointer"
                    >
                      <div className="flex items-center gap-1.5">
                        <span className="w-5 h-5 rounded-md bg-[#8ECAFF]/40 text-[#18324B] font-bold text-[10px] flex items-center justify-center">
                          {idx + 1}
                        </span>
                        <h4 className="text-xs font-bold text-[#18324B] hover:text-[#4A9DFF] transition-colors leading-snug">
                          {ex.name}
                        </h4>
                      </div>

                      <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-500 pl-6">
                        <span className="font-semibold text-slate-700">
                          {item.sets} hiệp x {item.reps ? `${item.reps} lần` : `${item.durationSeconds} giây`}
                        </span>
                        <span>•</span>
                        <span>Nghỉ {item.restSeconds}s</span>
                        {ex.isQuietDormFriendly && (
                          <span className="text-[9px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded">
                            Ít ồn
                          </span>
                        )}
                        {item.isAlternative && (
                          <span className="text-[9px] bg-indigo-100 text-indigo-800 font-bold px-1.5 py-0.2 rounded">
                            Đã đổi
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleQuickSubstitute(idx, ex.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-[#4A9DFF] hover:bg-white transition-colors"
                        title="Đổi bài tập an toàn hơn / ít ồn"
                        aria-label="Đổi bài tập"
                      >
                        <ArrowRightLeft className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setInspectExerciseId(ex.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-white transition-colors"
                        title="Xem hướng dẫn chi tiết"
                        aria-label="Xem hướng dẫn"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Cooldown Routine */}
            <div className="p-3 bg-emerald-50/60 rounded-2xl border border-emerald-100 text-xs text-emerald-950 flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block text-emerald-900">Giãn cơ kết thúc ({activeDayPlan.cooldownMinutes} phút):</span>
                <p className="text-[11px] text-emerald-800 mt-0.5 leading-relaxed">{activeDayPlan.cooldownNotes}</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex gap-2">
              <button
                onClick={() => toggleDayComplete(selectedDay)}
                className={`py-3 px-3 rounded-2xl text-xs font-bold border transition-colors flex items-center justify-center gap-1.5 ${
                  activeDayPlan.completed
                    ? 'bg-emerald-100 border-emerald-300 text-emerald-800'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{activeDayPlan.completed ? 'Đã xong' : 'Đánh dấu xong'}</span>
              </button>

              <button
                onClick={() => onStartWorkout(selectedDay)}
                className="flex-1 py-3 bg-[#4A9DFF] hover:bg-[#3b8beb] text-white rounded-2xl text-xs font-extrabold flex items-center justify-center gap-2 shadow-md transition-all active:scale-98"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>Bắt Đầu Tập Buổi Này</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Exercise Detail Modal */}
      <ExerciseDetailModal
        exerciseId={inspectExerciseId}
        onClose={() => setInspectExerciseId(null)}
        onSubstitute={(exId) => {
          const idx = activeDayPlan.exercises.findIndex(e => e.exerciseId === exId);
          if (idx !== -1) {
            handleQuickSubstitute(idx, exId);
            setInspectExerciseId(null);
          }
        }}
      />

      {/* Editing Plan Modal */}
      {isEditingGoalModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-5 shadow-2xl border border-slate-100 space-y-4">
            <h3 className="font-bold text-[#18324B] text-base">Cấu Hình Lại Lịch Tập Tuần</h3>
            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Mục tiêu:</label>
                <select
                  value={profile.goal}
                  onChange={(e) => updateProfile({ goal: e.target.value as any })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-[#18324B]"
                >
                  <option value="muscle_gain">Tăng cơ (Muscle Gain)</option>
                  <option value="fat_loss">Giảm mỡ (Fat Loss)</option>
                  <option value="endurance">Tăng sức bền (Endurance)</option>
                  <option value="general_health">Nâng cao sức khỏe chung</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Số buổi tập mỗi tuần:</label>
                <div className="grid grid-cols-4 gap-2">
                  {[2, 3, 4, 5].map(days => (
                    <button
                      key={days}
                      onClick={() => updateProfile({ daysPerWeek: days })}
                      className={`py-2 rounded-xl border font-bold text-center ${
                        profile.daysPerWeek === days
                          ? 'bg-[#4A9DFF] text-white border-[#4A9DFF]'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {days} buổi
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Thời lượng mỗi buổi:</label>
                <div className="grid grid-cols-3 gap-2">
                  {[20, 30, 45].map(mins => (
                    <button
                      key={mins}
                      onClick={() => updateProfile({ durationMinutes: mins })}
                      className={`py-2 rounded-xl border font-bold text-center ${
                        profile.durationMinutes === mins
                          ? 'bg-[#4A9DFF] text-white border-[#4A9DFF]'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {mins} phút
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-2 flex gap-2">
              <button
                onClick={() => setIsEditingGoalModalOpen(false)}
                className="flex-1 py-2.5 border border-slate-200 text-slate-600 rounded-xl font-bold text-xs"
              >
                Hủy
              </button>
              <button
                onClick={() => {
                  createNewPlan();
                  setIsEditingGoalModalOpen(false);
                }}
                className="flex-1 py-2.5 bg-[#4A9DFF] text-white rounded-xl font-bold text-xs shadow-sm hover:bg-[#3b8beb]"
              >
                Tạo Lại Ngay
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
