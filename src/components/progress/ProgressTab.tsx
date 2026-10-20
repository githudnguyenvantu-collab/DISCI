import React, { useState } from 'react';
import {
  TrendingUp,
  Calendar,
  Clock,
  Flame,
  Plus,
  FileDown,
  ChevronRight,
  Activity,
  Heart,
  Award
} from 'lucide-react';
import { useAppStore } from '../../core/store/appStore';
import { calculateBmi } from '../../core/health/metrics';
import { PdfReportModal } from './PdfReportModal';

export const ProgressTab: React.FC = () => {
  const { profile, bodyMetrics, sessionLogs, dailyCheckIns, addBodyMetric, achievements } = useAppStore();

  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
  const [isAddMetricOpen, setIsAddMetricOpen] = useState(false);
  const [newWeight, setNewWeight] = useState(profile.weightKg);
  const [newNote, setNewNote] = useState('');
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'all'>('month');

  const currentBmi = calculateBmi(profile.weightKg, profile.heightCm);

  // Filter metrics
  const sortedMetrics = [...bodyMetrics].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // Calculations
  const completedWorkoutsCount = sessionLogs.length;
  const totalWorkoutMinutes = sessionLogs.reduce((sum, log) => sum + log.actualDurationMinutes, 0);
  const avgMinutesPerWorkout = completedWorkoutsCount > 0 ? Math.round(totalWorkoutMinutes / completedWorkoutsCount) : 0;

  // Weight min and max for chart scale
  const weights = sortedMetrics.map(m => m.weightKg);
  const minWeight = weights.length > 0 ? Math.min(...weights) - 1 : 60;
  const maxWeight = weights.length > 0 ? Math.max(...weights) + 1 : 70;
  const rangeWeight = Math.max(maxWeight - minWeight, 2);

  const handleSaveMetric = (e: React.FormEvent) => {
    e.preventDefault();
    addBodyMetric(Number(newWeight), profile.heightCm, newNote.trim() || undefined);
    setIsAddMetricOpen(false);
    setNewNote('');
  };

  return (
    <div className="pb-24 pt-2 px-4 max-w-md mx-auto space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pt-1">
        <div>
          <h1 className="text-xl font-extrabold text-[#18324B] tracking-tight">Tiến Độ Rèn Luyện</h1>
          <p className="text-xs text-slate-500 font-medium">Theo dõi thể trạng và tính kiên trì theo thời gian</p>
        </div>

        <button
          onClick={() => setIsPdfModalOpen(true)}
          className="text-xs bg-white border border-[#4A9DFF] text-[#4A9DFF] font-bold px-3 py-1.5 rounded-xl hover:bg-blue-50 transition-colors flex items-center gap-1 shadow-2xs"
        >
          <FileDown className="w-3.5 h-3.5" />
          <span>Xuất PDF</span>
        </button>
      </div>

      {/* Top 3 Metric Summary Cards */}
      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="bg-white p-3 rounded-2xl border border-[#8ECAFF]/40 shadow-2xs">
          <span className="text-[10px] text-slate-500 font-medium block">Số buổi tập</span>
          <span className="text-lg font-black text-[#4A9DFF]">{completedWorkoutsCount}</span>
          <span className="text-[10px] text-slate-400 block font-medium">buổi xong</span>
        </div>

        <div className="bg-white p-3 rounded-2xl border border-[#8ECAFF]/40 shadow-2xs">
          <span className="text-[10px] text-slate-500 font-medium block">Tổng thời lượng</span>
          <span className="text-lg font-black text-[#18324B]">{totalWorkoutMinutes}</span>
          <span className="text-[10px] text-slate-400 block font-medium">phút tập</span>
        </div>

        <div className="bg-white p-3 rounded-2xl border border-[#8ECAFF]/40 shadow-2xs">
          <span className="text-[10px] text-slate-500 font-medium block">Cân nặng</span>
          <span className="text-lg font-black text-[#18324B]">{profile.weightKg}</span>
          <span className="text-[10px] text-emerald-600 block font-bold">BMI {currentBmi.bmi}</span>
        </div>
      </div>

      {/* Weight Tracking Chart */}
      <div className="bg-white rounded-3xl p-5 border border-[#8ECAFF]/40 shadow-xs space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-[#4A9DFF]" />
            <h3 className="text-xs font-bold text-[#18324B]">Biểu Đồ Xu Hướng Cân Nặng (kg)</h3>
          </div>
          <button
            onClick={() => setIsAddMetricOpen(true)}
            className="text-[11px] font-bold text-[#4A9DFF] hover:underline flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" /> Ghi số đo
          </button>
        </div>

        {sortedMetrics.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-400">
            Chưa có lịch sử cân nặng. Bấm "+ Ghi số đo" để bắt đầu theo dõi.
          </div>
        ) : (
          <div className="space-y-2">
            {/* SVG Visual Chart */}
            <div className="h-36 w-full pt-4 pb-2 px-1 relative flex items-end justify-between">
              {/* Reference Grid lines */}
              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-20">
                <div className="border-b border-dashed border-slate-400 w-full"></div>
                <div className="border-b border-dashed border-slate-400 w-full"></div>
                <div className="border-b border-dashed border-slate-400 w-full"></div>
              </div>

              {/* Data points */}
              {sortedMetrics.map((m, idx) => {
                const heightPercent = Math.min(
                  Math.max(((m.weightKg - minWeight) / rangeWeight) * 80 + 10, 10),
                  95
                );
                return (
                  <div key={m.id} className="relative z-10 flex flex-col items-center flex-1 group">
                    <span className="text-[10px] font-extrabold text-[#18324B] mb-1 group-hover:scale-110 transition-transform">
                      {m.weightKg}
                    </span>
                    <div
                      className="w-3 sm:w-4 rounded-t-lg bg-gradient-to-t from-[#4A9DFF] to-[#8ECAFF] shadow-xs group-hover:from-blue-600 transition-colors"
                      style={{ height: `${heightPercent}%` }}
                    ></div>
                    <span className="text-[9px] text-slate-400 mt-1 font-medium whitespace-nowrap">
                      {m.date.slice(5)}
                    </span>
                  </div>
                );
              })}
            </div>
            <p className="text-[10px] text-slate-400 text-center italic">
              * Biến động cân nặng ngắn hạn chịu ảnh hưởng của lượng nước, không kết luận vội về tiến trình.
            </p>
          </div>
        )}
      </div>

      {/* Workout Sessions History Table */}
      <div className="bg-white rounded-3xl p-5 border border-[#8ECAFF]/40 shadow-xs space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#4A9DFF]" />
            <h3 className="text-xs font-bold text-[#18324B]">Lịch Sử Buổi Tập Gần Đây</h3>
          </div>
          <span className="text-[11px] text-slate-400 font-semibold">{sessionLogs.length} ghi nhận</span>
        </div>

        {sessionLogs.length === 0 ? (
          <div className="py-6 text-center text-xs text-slate-400">
            Chưa có buổi tập nào được ghi nhận. Hãy hoàn thành buổi tập đầu tiên trong mục Lịch tập!
          </div>
        ) : (
          <div className="space-y-2">
            {sessionLogs.slice(0, 5).map(log => (
              <div
                key={log.id}
                className="p-3 bg-[#F4F9FF]/70 rounded-2xl border border-blue-100 flex items-center justify-between text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#18324B]">
                      Buổi tập Thứ {log.dayOfWeek === 7 ? 'CN' : log.dayOfWeek + 1}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">{log.date}</span>
                    {log.painReported && (
                      <span className="text-[9px] bg-red-100 text-red-700 font-bold px-1.5 py-0.2 rounded">
                        Có báo đau
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Thời lượng: {log.actualDurationMinutes} phút • Độ khó: {log.difficultyRating}/5 • Cảm giác: {log.fatigueLevel === 'good' ? 'Khỏe khoắn' : 'Mệt mỏi'}
                  </p>
                  {log.notes && (
                    <p className="text-[10px] text-slate-600 italic mt-0.5">"{log.notes}"</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Badges and Achievements */}
      <div className="bg-white rounded-3xl p-5 border border-[#8ECAFF]/40 shadow-xs space-y-3">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
          <Award className="w-4 h-4 text-amber-500" />
          <h3 className="text-xs font-bold text-[#18324B]">Huy Hiệu & Thành Tích</h3>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          {achievements.map(ach => (
            <div
              key={ach.id}
              className={`p-3 rounded-2xl border flex items-center gap-2.5 transition-all ${
                ach.isUnlocked
                  ? 'bg-amber-50/70 border-amber-200 text-amber-950'
                  : 'bg-slate-50 border-slate-200 text-slate-400 opacity-60'
              }`}
            >
              <span className="text-2xl flex-shrink-0">{ach.icon}</span>
              <div>
                <span className="text-xs font-extrabold block leading-tight">{ach.title}</span>
                <span className="text-[10px] text-slate-500 block leading-tight mt-0.5">{ach.description}</span>
                {ach.isUnlocked && ach.unlockedAt && (
                  <span className="text-[8px] text-amber-700 font-bold block mt-1">Đạt: {ach.unlockedAt.slice(0, 10)}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Metric Modal */}
      {isAddMetricOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xs w-full p-5 shadow-2xl border border-slate-100 space-y-4">
            <h3 className="font-bold text-[#18324B] text-base">Ghi Nhận Cân Nặng Mới</h3>
            <form onSubmit={handleSaveMetric} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Cân nặng (kg):</label>
                <input
                  type="number"
                  step="0.1"
                  min="30"
                  max="200"
                  value={newWeight}
                  onChange={(e) => setNewWeight(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl border border-slate-200 font-bold text-sm bg-slate-50 text-center"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Ghi chú (tùy chọn):</label>
                <input
                  type="text"
                  placeholder="Ví dụ: Cân vào buổi sáng sau thức dậy..."
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddMetricOpen(false)}
                  className="flex-1 py-2.5 border border-slate-200 text-slate-600 rounded-xl font-bold"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#4A9DFF] text-white rounded-xl font-bold shadow-xs hover:bg-[#3b8beb]"
                >
                  Lưu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Pdf Report Modal */}
      <PdfReportModal isOpen={isPdfModalOpen} onClose={() => setIsPdfModalOpen(false)} />
    </div>
  );
};
