import React from 'react';
import { X, CheckCircle, AlertOctagon, HelpCircle, VolumeX, ShieldCheck } from 'lucide-react';
import { getExerciseById } from '../../data/exercises';

interface ExerciseDetailModalProps {
  exerciseId: string | null;
  onClose: () => void;
  onSubstitute?: (exerciseId: string) => void;
}

export const ExerciseDetailModal: React.FC<ExerciseDetailModalProps> = ({
  exerciseId,
  onClose,
  onSubstitute
}) => {
  if (!exerciseId) return null;
  const exercise = getExerciseById(exerciseId);
  if (!exercise) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-sm w-full p-5 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between pb-2 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-1.5 mb-1">
              {exercise.isQuietDormFriendly ? (
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                  <VolumeX className="w-3 h-3" /> Ít ồn ký túc xá
                </span>
              ) : (
                <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-full">
                  ⚠️ Có tiếng ồn / Bật nhảy
                </span>
              )}
              <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded-full">
                {exercise.impactLevel === 'low' ? 'Tác động thấp' : 'Tác động cao'}
              </span>
            </div>
            <h3 className="font-extrabold text-[#18324B] text-base leading-snug">{exercise.name}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            aria-label="Đóng"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Target Muscles */}
        <div>
          <span className="text-xs font-bold text-slate-500 block mb-1">Nhóm cơ tác động chính:</span>
          <div className="flex flex-wrap gap-1.5">
            {exercise.targetMuscles.map((m, i) => (
              <span key={i} className="text-xs bg-[#F4F9FF] text-[#18324B] font-semibold px-2.5 py-1 rounded-xl border border-blue-100">
                {m}
              </span>
            ))}
          </div>
        </div>

        {/* Postures */}
        <div className="space-y-2 bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80 text-xs text-slate-700">
          <div>
            <span className="font-bold text-[#18324B] block">Tư thế bắt đầu:</span>
            <p className="mt-0.5 leading-relaxed">{exercise.startingPosture}</p>
          </div>
          <div className="pt-2 border-t border-slate-200">
            <span className="font-bold text-[#18324B] block">Tư thế kết thúc & Điểm siết cơ:</span>
            <p className="mt-0.5 leading-relaxed">{exercise.finishingPosture}</p>
          </div>
        </div>

        {/* Step-by-step instructions */}
        <div className="space-y-2">
          <span className="text-xs font-bold text-[#18324B] block">Hướng dẫn thực hiện từng bước:</span>
          <div className="space-y-2">
            {exercise.instructions.map((step, idx) => (
              <div key={idx} className="flex items-start gap-2 text-xs text-slate-600 leading-relaxed">
                <span className="w-5 h-5 rounded-full bg-[#8ECAFF]/30 text-[#18324B] font-bold text-[11px] flex items-center justify-center flex-shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <span>{step}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Common Mistakes */}
        {exercise.commonMistakes.length > 0 && (
          <div className="p-3 bg-red-50 rounded-2xl border border-red-100 text-xs text-red-900 space-y-1">
            <span className="font-bold flex items-center gap-1 text-red-700">
              <AlertOctagon className="w-3.5 h-3.5" /> Lỗi sai thường gặp cần tránh:
            </span>
            <ul className="list-disc list-inside space-y-0.5 text-[11px] text-red-800">
              {exercise.commonMistakes.map((mis, i) => (
                <li key={i}>{mis}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Difficulty Adjustments */}
        <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-100 text-xs text-emerald-900 space-y-1.5">
          <span className="font-bold flex items-center gap-1 text-emerald-800">
            <HelpCircle className="w-3.5 h-3.5" /> Điều chỉnh độ khó:
          </span>
          <div className="text-[11px] space-y-1">
            <p><strong className="text-emerald-950">Dễ hơn:</strong> {exercise.difficultyAdjustments.easier}</p>
            <p><strong className="text-emerald-950">Khó hơn:</strong> {exercise.difficultyAdjustments.harder}</p>
          </div>
        </div>

        {/* Substitute button */}
        {onSubstitute && (
          <div className="pt-2">
            <button
              onClick={() => onSubstitute(exercise.id)}
              className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-[#18324B] font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              <ShieldCheck className="w-4 h-4 text-[#4A9DFF]" />
              Tìm Động Tác Thay Thế An Toàn Hơn
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
