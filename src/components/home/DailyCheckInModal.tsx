import React, { useState } from 'react';
import { X, Moon, Activity, Zap, CheckCircle2, AlertTriangle, Stethoscope } from 'lucide-react';
import { useAppStore } from '../../core/store/appStore';

interface DailyCheckInModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DailyCheckInModal: React.FC<DailyCheckInModalProps> = ({ isOpen, onClose }) => {
  const { recordDailyCheckIn, dailyCheckIns } = useAppStore();

  const [sleep, setSleep] = useState<'sufficient' | 'insufficient'>('sufficient');
  const [pain, setPain] = useState<'none' | 'light' | 'severe'>('none');
  const [painArea, setPainArea] = useState<string>('Khớp gối');
  const [fatigue, setFatigue] = useState<'okay' | 'tired'>('okay');
  const [submittedMessage, setSubmittedMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    recordDailyCheckIn({
      sleepHoursStatus: sleep,
      musclePainStatus: pain,
      painArea: pain !== 'none' ? painArea : undefined,
      fatigueStatus: fatigue
    });

    let msg = 'Đã ghi nhận! Cơ thể bạn đang ở trạng thái tốt để tập luyện bình thường.';
    if (pain === 'severe') {
      msg = 'Lưu ý y tế: Bạn đang có triệu chứng đau nhiều. DISCI khuyến nghị bạn nghỉ ngơi hôm nay và tham khảo ý kiến bác sĩ nếu cơn đau kéo dài. Buổi tập đã tự động chuyển sang chế độ phục hồi nhẹ.';
    } else if (fatigue === 'tired' || sleep === 'insufficient') {
      msg = 'Ghi nhận mệt mỏi/thiếu ngủ: DISCI đã tự động giảm 20% cường độ buổi tập hôm nay để bạn không bị quá tải.';
    }
    setSubmittedMessage(msg);
  };

  const todayStr = new Date().toISOString().split('T')[0];
  const alreadyCheckedInToday = dailyCheckIns.some(c => c.date === todayStr);

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-sm w-full p-5 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-blue-100 text-[#4A9DFF] flex items-center justify-center">
              <Activity className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-[#18324B] text-base">Check-in Thể Trạng Hôm Nay</h3>
              <p className="text-xs text-slate-500">3 câu hỏi nhanh dưới 30 giây</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            aria-label="Đóng"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submittedMessage ? (
          <div className="py-6 text-center space-y-4">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-[#18324B]">Hoàn tất Check-in</h4>
            <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-2xl border border-slate-200">
              {submittedMessage}
            </p>
            <button
              onClick={() => {
                setSubmittedMessage(null);
                onClose();
              }}
              className="w-full py-2.5 bg-[#4A9DFF] hover:bg-[#3b8beb] text-white font-bold rounded-xl text-sm transition-colors shadow-sm"
            >
              Tiếp tục
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="py-4 space-y-5">
            {alreadyCheckedInToday && (
              <div className="p-2.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                <span>Hôm nay bạn đã check-in. Bạn có thể cập nhật lại nếu thể trạng thay đổi.</span>
              </div>
            )}

            {/* Câu 1: Giấc ngủ */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#18324B] flex items-center gap-1.5">
                <Moon className="w-4 h-4 text-indigo-500" />
                <span>1. Giấc ngủ đêm qua của bạn:</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setSleep('sufficient')}
                  className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                    sleep === 'sufficient'
                      ? 'bg-[#8ECAFF]/20 border-[#4A9DFF] text-[#18324B] shadow-xs'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span>😴 Đủ (≥ 7 tiếng)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSleep('insufficient')}
                  className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                    sleep === 'insufficient'
                      ? 'bg-amber-100 border-amber-400 text-amber-900 shadow-xs'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span>🥱 Ít (&lt; 7 tiếng)</span>
                </button>
              </div>
            </div>

            {/* Câu 2: Đau nhức cơ khớp */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#18324B] flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                <span>2. Đau nhức cơ bắp / khớp:</span>
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setPain('none')}
                  className={`py-2 px-1 rounded-xl border text-xs font-semibold text-center transition-all ${
                    pain === 'none'
                      ? 'bg-emerald-50 border-emerald-400 text-emerald-800'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  Không
                </button>
                <button
                  type="button"
                  onClick={() => setPain('light')}
                  className={`py-2 px-1 rounded-xl border text-xs font-semibold text-center transition-all ${
                    pain === 'light'
                      ? 'bg-amber-50 border-amber-400 text-amber-800'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  Nhẹ (mỏi cơ)
                </button>
                <button
                  type="button"
                  onClick={() => setPain('severe')}
                  className={`py-2 px-1 rounded-xl border text-xs font-semibold text-center transition-all ${
                    pain === 'severe'
                      ? 'bg-red-50 border-red-400 text-red-800'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  Nhiều (đau nhói)
                </button>
              </div>

              {pain !== 'none' && (
                <div className="pt-1.5">
                  <label className="text-[11px] text-slate-600 block mb-1">Vị trí đau nhức:</label>
                  <select
                    value={painArea}
                    onChange={(e) => setPainArea(e.target.value)}
                    className="w-full text-xs p-2 rounded-xl border border-slate-200 bg-slate-50 text-[#18324B]"
                  >
                    <option value="Khớp gối">Khớp gối</option>
                    <option value="Lưng dưới / Cột sống">Lưng dưới / Cột sống</option>
                    <option value="Khớp vai">Khớp vai</option>
                    <option value="Cổ chân / Bắp chân">Cổ chân / Bắp chân</option>
                    <option value="Khác">Cơ toàn thân</option>
                  </select>
                </div>
              )}
            </div>

            {/* Câu 3: Mệt mỏi */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#18324B] flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-[#4A9DFF]" />
                <span>3. Mức độ mệt mỏi nói chung:</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setFatigue('okay')}
                  className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                    fatigue === 'okay'
                      ? 'bg-[#8ECAFF]/20 border-[#4A9DFF] text-[#18324B]'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span>⚡ Khỏe / Ổn định</span>
                </button>
                <button
                  type="button"
                  onClick={() => setFatigue('tired')}
                  className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                    fatigue === 'tired'
                      ? 'bg-amber-100 border-amber-400 text-amber-900'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span>🔋 Khá mệt mỏi</span>
                </button>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-500 flex items-start gap-1.5">
              <Stethoscope className="w-3.5 h-3.5 text-slate-400 flex-shrink-0 mt-0.5" />
              <span>Chỉ số check-in phục vụ điều chỉnh thể lượng bài tập, không thay thế chẩn đoán y tế.</span>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 border border-slate-200 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-100 transition-colors"
              >
                Bỏ qua
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 bg-[#4A9DFF] hover:bg-[#3b8beb] text-white rounded-xl text-xs font-bold transition-colors shadow-sm"
              >
                Lưu Thể Trạng
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
