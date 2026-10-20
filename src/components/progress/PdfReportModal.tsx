import React, { useState } from 'react';
import { X, FileDown, Printer, ShieldCheck, CheckSquare, Square, Calendar, HeartPulse, User } from 'lucide-react';
import { useAppStore } from '../../core/store/appStore';
import { calculateBmi, evaluateHealthSafety } from '../../core/health/metrics';

interface PdfReportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PdfReportModal: React.FC<PdfReportModalProps> = ({ isOpen, onClose }) => {
  const { profile, bodyMetrics, healthRecord, sessionLogs, dailyCheckIns } = useAppStore();

  // Selective export checkboxes
  const [includeProfile, setIncludeProfile] = useState(true);
  const [includeWeightBmi, setIncludeWeightBmi] = useState(true);
  const [includeWorkoutStats, setIncludeWorkoutStats] = useState(true);
  const [includeCheckIns, setIncludeCheckIns] = useState(false);
  const [includeMedicalVitals, setIncludeMedicalVitals] = useState(false); // Default false for privacy

  const [reportDateRange, setReportDateRange] = useState<'30_days' | '90_days' | 'all'>('30_days');

  if (!isOpen) return null;

  const currentBmi = calculateBmi(profile.weightKg, profile.heightCm);
  const safetyAssessment = evaluateHealthSafety(healthRecord, currentBmi.bmi);

  const totalWorkoutMinutes = sessionLogs.reduce((sum, l) => sum + l.actualDurationMinutes, 0);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-100 flex flex-col max-h-[92vh] overflow-hidden">
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-100 text-[#4A9DFF] flex items-center justify-center">
              <FileDown className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-[#18324B] text-base">Xem Trước & Xuất Báo Cáo DISCI</h3>
              <p className="text-[11px] text-slate-500 font-medium">Báo cáo thể chất & sức khỏe dành cho Bác sĩ / HLV</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            aria-label="Đóng"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content & Options */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {/* Selective inclusion controls */}
          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
            <span className="text-xs font-bold text-[#18324B] block">Chọn dữ liệu đưa vào báo cáo:</span>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeProfile}
                  onChange={e => setIncludeProfile(e.target.checked)}
                  className="rounded text-[#4A9DFF]"
                />
                <span>Hồ sơ & Mục tiêu</span>
              </label>

              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeWeightBmi}
                  onChange={e => setIncludeWeightBmi(e.target.checked)}
                  className="rounded text-[#4A9DFF]"
                />
                <span>Tiến trình Cân nặng / BMI</span>
              </label>

              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeWorkoutStats}
                  onChange={e => setIncludeWorkoutStats(e.target.checked)}
                  className="rounded text-[#4A9DFF]"
                />
                <span>Lịch sử & Số buổi tập</span>
              </label>

              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeCheckIns}
                  onChange={e => setIncludeCheckIns(e.target.checked)}
                  className="rounded text-[#4A9DFF]"
                />
                <span>Nhật ký đau mỏi Check-in</span>
              </label>

              <label className="flex items-center gap-1.5 cursor-pointer col-span-2">
                <input
                  type="checkbox"
                  checked={includeMedicalVitals}
                  onChange={e => setIncludeMedicalVitals(e.target.checked)}
                  className="rounded text-[#4A9DFF]"
                />
                <span className="font-semibold text-amber-900">
                  Huyết áp, Nhịp tim & Khuyến cáo bác sĩ (Dữ liệu nhạy cảm)
                </span>
              </label>
            </div>
          </div>

          {/* Printable Preview Sheet */}
          <div className="p-5 bg-white border border-slate-300 rounded-2xl shadow-inner text-slate-800 space-y-4 print:p-0 print:border-none print:shadow-none text-xs">
            {/* Report Header */}
            <div className="border-b-2 border-[#18324B] pb-3 flex justify-between items-start">
              <div>
                <span className="text-lg font-black text-[#18324B] tracking-tight">DISCI FitHome</span>
                <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Báo cáo sức khỏe & thể chất định kỳ</p>
              </div>
              <div className="text-right text-[10px] text-slate-500">
                <p>Ngày tạo: <strong>{new Date().toLocaleDateString('vi-VN')}</strong></p>
                <p>Mã hồ sơ: <strong>{profile.id}</strong></p>
              </div>
            </div>

            {/* Profile info */}
            {includeProfile && (
              <div className="grid grid-cols-2 gap-2 bg-[#F4F9FF] p-3 rounded-xl border border-blue-100">
                <div>
                  <span className="text-[10px] text-slate-500 block">Họ và tên:</span>
                  <span className="font-bold text-[#18324B]">{profile.name}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">Tuổi / Giới tính:</span>
                  <span className="font-bold text-[#18324B]">{profile.age} tuổi • {profile.gender === 'male' ? 'Nam' : profile.gender === 'female' ? 'Nữ' : 'Khác'}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">Mục tiêu rèn luyện:</span>
                  <span className="font-bold text-[#4A9DFF]">
                    {profile.goal === 'muscle_gain' ? 'Tăng cơ' : profile.goal === 'fat_loss' ? 'Giảm mỡ' : 'Sức khỏe chung'}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">Môi trường / Chế độ:</span>
                  <span className="font-bold text-[#18324B]">
                    {profile.quietDormitoryMode ? 'Chế độ ký túc xá (ít ồn)' : 'Tập tại nhà'}
                  </span>
                </div>
              </div>
            )}

            {/* Body Metrics & BMI */}
            {includeWeightBmi && (
              <div className="space-y-1.5">
                <h4 className="font-bold text-[#18324B] border-b border-slate-200 pb-1">1. Chỉ số Nhân trắc học & BMI</h4>
                <div className="grid grid-cols-3 gap-2 text-center py-1">
                  <div className="border border-slate-200 rounded-lg p-2">
                    <span className="text-[10px] text-slate-500 block">Chiều cao</span>
                    <strong className="text-sm">{profile.heightCm} cm</strong>
                  </div>
                  <div className="border border-slate-200 rounded-lg p-2">
                    <span className="text-[10px] text-slate-500 block">Cân nặng</span>
                    <strong className="text-sm">{profile.weightKg} kg</strong>
                  </div>
                  <div className="border border-slate-200 rounded-lg p-2">
                    <span className="text-[10px] text-slate-500 block">BMI (Châu Á)</span>
                    <strong className="text-sm">{currentBmi.bmi} ({currentBmi.categoryLabel})</strong>
                  </div>
                </div>
                <p className="text-[10px] text-slate-500 italic">{currentBmi.explanation}</p>
              </div>
            )}

            {/* Workout session statistics */}
            {includeWorkoutStats && (
              <div className="space-y-1.5">
                <h4 className="font-bold text-[#18324B] border-b border-slate-200 pb-1">2. Tiến độ & Lịch sử Tập luyện</h4>
                <div className="grid grid-cols-2 gap-2 text-center py-1">
                  <div className="border border-slate-200 rounded-lg p-2">
                    <span className="text-[10px] text-slate-500 block">Số buổi hoàn thành</span>
                    <strong className="text-sm text-[#4A9DFF]">{sessionLogs.length} buổi</strong>
                  </div>
                  <div className="border border-slate-200 rounded-lg p-2">
                    <span className="text-[10px] text-slate-500 block">Tổng thời lượng tập</span>
                    <strong className="text-sm">{totalWorkoutMinutes} phút</strong>
                  </div>
                </div>
              </div>
            )}

            {/* Medical vitals & Doctor restrictions if selected */}
            {includeMedicalVitals && healthRecord && (
              <div className="space-y-1.5 bg-amber-50/50 p-3 rounded-xl border border-amber-200">
                <h4 className="font-bold text-amber-950 border-b border-amber-200 pb-1 flex items-center gap-1.5">
                  <HeartPulse className="w-3.5 h-3.5 text-amber-600" />
                  <span>3. Chỉ số Sức Khỏe & Khuyến Cáo Bác Sĩ</span>
                </h4>
                <div className="grid grid-cols-2 gap-2 py-1">
                  <div>
                    <span className="text-[10px] text-slate-500 block">Huyết áp:</span>
                    <strong>{healthRecord.systolicBp ? `${healthRecord.systolicBp}/${healthRecord.diastolicBp} mmHg` : 'Chưa ghi nhận'}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">Nhịp tim nghỉ:</span>
                    <strong>{healthRecord.restingHeartRate ? `${healthRecord.restingHeartRate} bpm` : 'Chưa ghi nhận'}</strong>
                  </div>
                </div>
                {healthRecord.doctorExerciseRestrictions && (
                  <div className="mt-1">
                    <span className="text-[10px] text-slate-500 block font-bold">Khuyến cáo bác sĩ:</span>
                    <p className="text-[11px] text-amber-900 bg-white/80 p-2 rounded border border-amber-200">
                      "{healthRecord.doctorExerciseRestrictions}"
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Check-in Recovery Trend if selected */}
            {includeCheckIns && dailyCheckIns.length > 0 && (
              <div className="space-y-1.5">
                <h4 className="font-bold text-[#18324B] border-b border-slate-200 pb-1">4. Lịch Sử Check-in Thể Trạng</h4>
                <ul className="space-y-1 text-[10px] text-slate-600">
                  {dailyCheckIns.slice(0, 4).map(ci => (
                    <li key={ci.id} className="flex justify-between border-b border-slate-100 pb-0.5">
                      <span>{ci.date}: Ngủ {ci.sleepHoursStatus === 'sufficient' ? 'Đủ' : 'Ít'} • Đau mỏi {ci.musclePainStatus === 'none' ? 'Không' : ci.musclePainStatus}</span>
                      <span className="italic">{ci.actionTaken}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Mandatory Medical Disclaimer */}
            <div className="p-2.5 bg-slate-100 rounded-xl text-[10px] text-slate-500 leading-relaxed">
              <strong>Tuyên bố miễn trừ trách nhiệm y tế:</strong> Báo cáo này tổng hợp dữ liệu do người dùng tự nguyện ghi nhận trên ứng dụng DISCI nhằm hỗ trợ theo dõi thói quen vận động. Ứng dụng không đưa ra kết luận chẩn đoán bệnh tật hay phác đồ điều trị. Bác sĩ hoặc chuyên gia phục hồi chức năng là người có thẩm quyền quyết định chỉ định y khoa.
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-5 py-3 border-t border-slate-100 flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 py-3 border border-slate-200 text-slate-600 font-bold rounded-2xl text-xs hover:bg-slate-50"
          >
            Đóng
          </button>
          <button
            onClick={handlePrint}
            className="flex-1 py-3 bg-[#4A9DFF] hover:bg-[#3b8beb] text-white font-extrabold rounded-2xl text-xs shadow-md transition-colors flex items-center justify-center gap-1.5"
          >
            <Printer className="w-4 h-4" />
            <span>In / Xuất Bản PDF</span>
          </button>
        </div>
      </div>
    </div>
  );
};
