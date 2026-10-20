import React, { useState, useEffect } from 'react';
import {
  X,
  Play,
  Pause,
  SkipForward,
  AlertOctagon,
  Clock,
  CheckCircle2,
  Volume2,
  Heart,
  ChevronRight,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';
import { useAppStore } from '../../core/store/appStore';
import { getExerciseById } from '../../data/exercises';
import { WorkoutDayPlan } from '../../types';

interface WorkoutSessionModalProps {
  dayPlan: WorkoutDayPlan;
  onClose: () => void;
  onFinishSession: () => void;
}

export const WorkoutSessionModal: React.FC<WorkoutSessionModalProps> = ({
  dayPlan,
  onClose,
  onFinishSession
}) => {
  const { logCompletedSession } = useAppStore();

  const [currentExIndex, setCurrentExIndex] = useState(0);
  const [currentSet, setCurrentSet] = useState(1);
  const [totalTimerSeconds, setTotalTimerSeconds] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Rest state
  const [isResting, setIsResting] = useState(false);
  const [restSecondsRemaining, setRestSecondsRemaining] = useState(45);

  // Pain emergency stop state
  const [painReportTriggered, setPainReportTriggered] = useState(false);
  const [painLocation, setPainLocation] = useState('Khớp gối');
  const [painSeverity, setPainSeverity] = useState<'light' | 'severe'>('severe');

  // Post-workout evaluation state
  const [isCompletingSummary, setIsCompletingSummary] = useState(false);
  const [difficultyRating, setDifficultyRating] = useState<1 | 2 | 3 | 4 | 5>(3);
  const [fatigueLevel, setFatigueLevel] = useState<'good' | 'tired' | 'exhausted'>('good');
  const [userNotes, setUserNotes] = useState('');

  const currentExerciseItem = dayPlan.exercises[currentExIndex];
  const currentExercise = currentExerciseItem ? getExerciseById(currentExerciseItem.exerciseId) : null;
  const totalSets = currentExerciseItem ? currentExerciseItem.sets : 3;

  // Workout duration timer
  useEffect(() => {
    if (isPaused || isCompletingSummary || painReportTriggered) return;
    const interval = setInterval(() => {
      setTotalTimerSeconds(s => s + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isPaused, isCompletingSummary, painReportTriggered]);

  // Rest countdown timer
  useEffect(() => {
    if (!isResting || isPaused || painReportTriggered) return;
    if (restSecondsRemaining <= 0) {
      setIsResting(false);
      return;
    }
    const interval = setInterval(() => {
      setRestSecondsRemaining(r => r - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isResting, isPaused, restSecondsRemaining, painReportTriggered]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleCompleteSet = () => {
    if (currentSet < totalSets) {
      // Sang hiệp tiếp theo trong bài hiện tại
      setCurrentSet(s => s + 1);
      setRestSecondsRemaining(currentExerciseItem?.restSeconds || 45);
      setIsResting(true);
    } else {
      // Hoàn thành hết hiệp của bài hiện tại
      if (currentExIndex < dayPlan.exercises.length - 1) {
        setCurrentExIndex(idx => idx + 1);
        setCurrentSet(1);
        setRestSecondsRemaining(currentExerciseItem?.restSeconds || 60);
        setIsResting(true);
      } else {
        // Đã hoàn thành toàn bộ bài tập!
        setIsCompletingSummary(true);
      }
    }
  };

  const handleSkipExercise = () => {
    if (currentExIndex < dayPlan.exercises.length - 1) {
      setCurrentExIndex(idx => idx + 1);
      setCurrentSet(1);
      setIsResting(false);
    } else {
      setIsCompletingSummary(true);
    }
  };

  const handleSaveAndExit = () => {
    const actualMinutes = Math.max(Math.round(totalTimerSeconds / 60), 1);
    logCompletedSession({
      planId: dayPlan.id,
      dayOfWeek: dayPlan.dayOfWeek,
      date: new Date().toISOString().split('T')[0],
      actualDurationMinutes: actualMinutes,
      difficultyRating,
      painReported: painReportTriggered,
      painLocation: painReportTriggered ? painLocation : undefined,
      painSeverity: painReportTriggered ? painSeverity : undefined,
      fatigueLevel,
      notes: userNotes,
      completedExercisesCount: painReportTriggered ? currentExIndex : dayPlan.exercises.length,
      totalExercisesCount: dayPlan.exercises.length
    });
    onFinishSession();
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#18324B]/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[95vh]">
        {/* Top bar with timer & controls */}
        <div className="px-5 py-3.5 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse"></div>
            <span className="text-xs font-mono font-bold tracking-wider">{formatTime(totalTimerSeconds)}</span>
          </div>

          <div className="text-center">
            <span className="text-[11px] text-slate-400 block uppercase tracking-wider font-bold">
              {dayPlan.targetFocus}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPaused(!isPaused)}
              className="p-1.5 rounded-lg bg-slate-800 text-white hover:bg-slate-700 transition-colors"
              title={isPaused ? 'Tiếp tục' : 'Tạm dừng'}
              aria-label={isPaused ? 'Tiếp tục' : 'Tạm dừng'}
            >
              {isPaused ? <Play className="w-4 h-4 fill-white" /> : <Pause className="w-4 h-4" />}
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
              aria-label="Thoát buổi tập"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Pain Emergency Stop View */}
        {painReportTriggered ? (
          <div className="p-6 overflow-y-auto space-y-4">
            <div className="w-14 h-14 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center mx-auto shadow-sm">
              <ShieldAlert className="w-8 h-8" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="font-extrabold text-red-600 text-lg">Đã Tạm Dừng Buổi Tập An Toàn</h3>
              <p className="text-xs text-slate-600 leading-relaxed max-w-sm mx-auto">
                DISCI ưu tiên sự an toàn cơ thể lên hàng đầu. Cơn đau nhói bất thường là tín hiệu cơ bắp hoặc khớp đang bị quá tải. Tuyệt đối không được gượng ép tiếp tục!
              </p>
            </div>

            <div className="bg-red-50 border border-red-200 p-4 rounded-2xl space-y-2 text-xs text-red-950">
              <span className="font-bold block text-red-900">Khuyến nghị xử lý tức thời:</span>
              <ul className="list-disc list-inside space-y-1 text-[11px] text-red-800">
                <li>Ngồi hoặc nằm thư giãn, không cử động mạnh vùng bị đau.</li>
                <li>Uống một ngụm nước nhỏ, thở sâu điều hòa nhịp tim.</li>
                <li>Nếu đau nhói khớp hoặc sưng nóng, có thể chườm lạnh trong 15 phút.</li>
                <li>Nếu cơn đau kéo dài hoặc lan tỏa, hãy đến cơ sở y tế chuyên khoa thăm khám.</li>
              </ul>
            </div>

            <div className="space-y-3 pt-1 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Vị trí đau vừa gặp:</label>
                <select
                  value={painLocation}
                  onChange={(e) => setPainLocation(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-[#18324B]"
                >
                  <option value="Khớp gối">Khớp gối</option>
                  <option value="Cột sống thắt lưng">Cột sống thắt lưng</option>
                  <option value="Khớp vai">Khớp vai</option>
                  <option value="Cổ tay">Cổ tay</option>
                  <option value="Căng cứng cơ quá mức">Căng cứng cơ quá mức</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Mức độ đau:</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setPainSeverity('light')}
                    className={`py-2 rounded-xl border font-bold text-xs ${
                      painSeverity === 'light' ? 'bg-amber-100 border-amber-400 text-amber-900' : 'border-slate-200 text-slate-600'
                    }`}
                  >
                    Đau vừa / Mỏi khớp
                  </button>
                  <button
                    type="button"
                    onClick={() => setPainSeverity('severe')}
                    className={`py-2 rounded-xl border font-bold text-xs ${
                      painSeverity === 'severe' ? 'bg-red-100 border-red-400 text-red-900' : 'border-slate-200 text-slate-600'
                    }`}
                  >
                    Đau nhói nhiều
                  </button>
                </div>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setPainReportTriggered(false)}
                className="py-2.5 px-3 border border-slate-200 text-slate-600 rounded-xl font-bold text-xs hover:bg-slate-50"
              >
                Tập lại nếu đỡ
              </button>
              <button
                onClick={handleSaveAndExit}
                className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold text-xs transition-colors shadow-sm"
              >
                Kết Thúc Buổi Tập & Ghi Nhận
              </button>
            </div>
          </div>
        ) : isCompletingSummary ? (
          /* Post-Workout Fast Evaluation Screen (< 1 minute) */
          <div className="p-6 overflow-y-auto space-y-4">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="text-center space-y-0.5">
              <h3 className="font-extrabold text-[#18324B] text-lg">Chúc Mừng Bạn Đã Hoàn Thành!</h3>
              <p className="text-xs text-slate-500">
                Thời gian thực tế: <strong>{Math.max(Math.round(totalTimerSeconds / 60), 1)} phút</strong>
              </p>
            </div>

            <div className="space-y-4 pt-1 text-xs">
              {/* Difficulty Rating */}
              <div>
                <label className="font-bold text-[#18324B] block mb-1.5">1. Đánh giá độ khó buổi tập hôm nay:</label>
                <div className="grid grid-cols-5 gap-1.5">
                  {[1, 2, 3, 4, 5].map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setDifficultyRating(lvl as any)}
                      className={`py-2 rounded-xl border text-center font-bold transition-all ${
                        difficultyRating === lvl
                          ? 'bg-[#4A9DFF] text-white border-[#4A9DFF] shadow-xs'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
                <div className="flex justify-between text-[10px] text-slate-400 mt-1 px-1">
                  <span>1 (Rất nhẹ)</span>
                  <span>3 (Vừa sức)</span>
                  <span>5 (Quá tải)</span>
                </div>
              </div>

              {/* Fatigue */}
              <div>
                <label className="font-bold text-[#18324B] block mb-1.5">2. Cảm giác mệt mỏi sau tập:</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setFatigueLevel('good')}
                    className={`py-2 rounded-xl border text-center font-semibold text-xs ${
                      fatigueLevel === 'good' ? 'bg-emerald-50 border-emerald-400 text-emerald-800' : 'border-slate-200 text-slate-600'
                    }`}
                  >
                    Khỏe khoắn
                  </button>
                  <button
                    type="button"
                    onClick={() => setFatigueLevel('tired')}
                    className={`py-2 rounded-xl border text-center font-semibold text-xs ${
                      fatigueLevel === 'tired' ? 'bg-amber-50 border-amber-400 text-amber-800' : 'border-slate-200 text-slate-600'
                    }`}
                  >
                    Mệt vừa
                  </button>
                  <button
                    type="button"
                    onClick={() => setFatigueLevel('exhausted')}
                    className={`py-2 rounded-xl border text-center font-semibold text-xs ${
                      fatigueLevel === 'exhausted' ? 'bg-red-50 border-red-400 text-red-800' : 'border-slate-200 text-slate-600'
                    }`}
                  >
                    Kiệt sức
                  </button>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="font-bold text-[#18324B] block mb-1">Ghi chú ngắn (tùy chọn):</label>
                <input
                  type="text"
                  placeholder="Ví dụ: Hiệp cuối chống đẩy hơi mỏi tay..."
                  value={userNotes}
                  onChange={(e) => setUserNotes(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs bg-slate-50"
                  maxLength={100}
                />
              </div>
            </div>

            <button
              onClick={handleSaveAndExit}
              className="w-full py-3 bg-[#4A9DFF] hover:bg-[#3b8beb] text-white font-extrabold rounded-2xl text-xs transition-colors shadow-md mt-2 flex items-center justify-center gap-1.5"
            >
              <span>Lưu Lịch Sử & Hoàn Thành</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          /* Active Workout Step-by-Step Flow */
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {/* Progress bar */}
            <div>
              <div className="flex items-center justify-between text-xs text-slate-500 mb-1 font-semibold">
                <span>
                  Động tác {currentExIndex + 1}/{dayPlan.exercises.length}
                </span>
                <span>
                  Hiệp {currentSet}/{totalSets}
                </span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-[#4A9DFF] h-2 rounded-full transition-all duration-300"
                  style={{
                    width: `${((currentExIndex * totalSets + currentSet) / (dayPlan.exercises.length * totalSets)) * 100}%`
                  }}
                ></div>
              </div>
            </div>

            {/* Rest Countdown Screen if resting */}
            {isResting ? (
              <div className="py-8 bg-blue-50/80 rounded-3xl border border-blue-200 text-center space-y-3">
                <span className="text-xs font-bold text-blue-900 block uppercase tracking-wider">
                  Thời Gian Nghỉ Phục Hồi
                </span>
                <div className="text-5xl font-mono font-extrabold text-[#4A9DFF]">
                  {restSecondsRemaining}s
                </div>
                <p className="text-xs text-slate-600 max-w-xs mx-auto px-4">
                  Thả lỏng cơ bắp, hít thở sâu, uống một ngụm nước nhỏ.
                </p>
                <div className="flex justify-center gap-2 pt-2">
                  <button
                    onClick={() => setRestSecondsRemaining(r => r + 15)}
                    className="px-3 py-1.5 rounded-xl bg-white border border-blue-200 text-xs font-bold text-blue-800 shadow-2xs hover:bg-blue-50"
                  >
                    +15 giây
                  </button>
                  <button
                    onClick={() => setIsResting(false)}
                    className="px-4 py-1.5 rounded-xl bg-[#4A9DFF] text-white text-xs font-bold shadow-xs hover:bg-[#3b8beb]"
                  >
                    Bỏ qua nghỉ &rarr;
                  </button>
                </div>
              </div>
            ) : (
              /* Exercise Details */
              <div className="space-y-4">
                <div className="text-center py-2">
                  <h2 className="text-lg font-extrabold text-[#18324B] leading-tight">
                    {currentExercise?.name}
                  </h2>
                  <div className="inline-flex items-center gap-2 mt-2 px-3 py-1 bg-[#8ECAFF]/20 rounded-full text-xs font-bold text-[#18324B]">
                    {currentExerciseItem?.reps ? (
                      <span>Thực hiện: {currentExerciseItem.reps} lần</span>
                    ) : (
                      <span>Thời lượng: {currentExerciseItem?.durationSeconds} giây</span>
                    )}
                  </div>
                </div>

                {/* Instructions Snippet */}
                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80 space-y-2 text-xs text-slate-700">
                  <span className="font-bold text-[#18324B] block">Lưu ý tư thế:</span>
                  <p className="text-[11px] leading-relaxed">
                    <strong>Bắt đầu:</strong> {currentExercise?.startingPosture}
                  </p>
                  <p className="text-[11px] leading-relaxed">
                    <strong>Hoàn thành:</strong> {currentExercise?.finishingPosture}
                  </p>
                </div>

                {/* Set completion button */}
                <button
                  onClick={handleCompleteSet}
                  className="w-full py-4 bg-[#4A9DFF] hover:bg-[#3b8beb] active:scale-98 text-white font-extrabold rounded-2xl text-sm flex items-center justify-center gap-2 shadow-lg transition-all"
                >
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Xong Hiệp {currentSet}/{totalSets}</span>
                </button>

                <div className="flex items-center justify-between pt-1">
                  <button
                    onClick={handleSkipExercise}
                    className="text-xs text-slate-500 hover:text-slate-700 font-semibold flex items-center gap-1"
                  >
                    <SkipForward className="w-3.5 h-3.5" />
                    <span>Bỏ qua động tác này</span>
                  </button>

                  {/* Pain Emergency Button */}
                  <button
                    onClick={() => setPainReportTriggered(true)}
                    className="text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-xl border border-red-200 flex items-center gap-1 transition-colors"
                  >
                    <AlertOctagon className="w-3.5 h-3.5 text-red-600" />
                    <span>Báo đau / Dừng khẩn cấp</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
