import React, { useState } from 'react';
import {
  X,
  HeartPulse,
  Activity,
  FileText,
  Upload,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Plus,
  Minus,
  Info,
  ShieldCheck
} from 'lucide-react';
import { useAppStore } from '../../core/store/appStore';
import { HealthRecord } from '../../types';

interface HealthRecordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HealthRecordModal: React.FC<HealthRecordModalProps> = ({ isOpen, onClose }) => {
  const { healthRecord, saveHealthRecord, deleteHealthRecord, revokeHealthConsent, profile, updateProfile, addBodyMetric } = useAppStore();

  // Quick weight/height editing
  const [weight, setWeight] = useState(profile.weightKg);
  const [height, setHeight] = useState(profile.heightCm);

  // Voluntary Medical Exam Fields
  const [systolic, setSystolic] = useState<number | ''>(healthRecord?.systolicBp ?? '');
  const [diastolic, setDiastolic] = useState<number | ''>(healthRecord?.diastolicBp ?? '');
  const [restingHr, setRestingHr] = useState<number | ''>(healthRecord?.restingHeartRate ?? '');
  const [fastingGlucose, setFastingGlucose] = useState<number | ''>(healthRecord?.fastingBloodGlucose ?? '');
  const [doctorRestrictions, setDoctorRestrictions] = useState(healthRecord?.doctorExerciseRestrictions ?? '');
  const [facilityName, setFacilityName] = useState(healthRecord?.facilityName ?? '');
  const [medicalNotes, setMedicalNotes] = useState(healthRecord?.medicalNotes ?? '');
  const [consent, setConsent] = useState(healthRecord?.consentForWorkoutAdjustment ?? true);

  // Joint issues checklist
  const [jointIssues, setJointIssues] = useState<string[]>(healthRecord?.jointBoneIssues ?? []);

  // Simulated attachment
  const [fileName, setFileName] = useState<string | undefined>(healthRecord?.attachmentFileName);

  const [activeTab, setActiveTab] = useState<'quick' | 'medical'>('quick');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const toggleJoint = (joint: string) => {
    setJointIssues(prev =>
      prev.includes(joint) ? prev.filter(j => j !== joint) : [...prev, joint]
    );
  };

  const handleSaveAll = (e: React.FormEvent) => {
    e.preventDefault();

    // Cập nhật cân nặng / chiều cao cơ bản
    if (weight !== profile.weightKg || height !== profile.heightCm) {
      updateProfile({ weightKg: Number(weight), heightCm: Number(height) });
      addBodyMetric(Number(weight), Number(height), 'Cập nhật từ hồ sơ sức khỏe');
    }

    // Cập nhật thông tin y tế tự nguyện
    saveHealthRecord({
      systolicBp: systolic !== '' ? Number(systolic) : undefined,
      diastolicBp: diastolic !== '' ? Number(diastolic) : undefined,
      restingHeartRate: restingHr !== '' ? Number(restingHr) : undefined,
      fastingBloodGlucose: fastingGlucose !== '' ? Number(fastingGlucose) : undefined,
      jointBoneIssues: jointIssues,
      doctorExerciseRestrictions: doctorRestrictions.trim() || undefined,
      facilityName: facilityName.trim() || undefined,
      medicalNotes: medicalNotes.trim() || undefined,
      attachmentFileName: fileName,
      consentForWorkoutAdjustment: consent
    });

    setToastMessage('Đã lưu thông tin an toàn! Hệ thống đã tự động rà soát và điều chỉnh lịch tập phù hợp.');
    setTimeout(() => {
      setToastMessage(null);
      onClose();
    }, 1200);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
    }
  };

  const handleDeleteAllHealthData = () => {
    if (confirm('Bạn có chắc chắn muốn xóa toàn bộ hồ sơ khám sức khỏe? Ứng dụng sẽ chuyển về chương trình tiêu chuẩn và không lưu vết dữ liệu này.')) {
      deleteHealthRecord();
      setSystolic('');
      setDiastolic('');
      setRestingHr('');
      setFastingGlucose('');
      setDoctorRestrictions('');
      setFacilityName('');
      setMedicalNotes('');
      setFileName(undefined);
      setJointIssues([]);
      setToastMessage('Đã xóa toàn bộ dữ liệu khám bệnh.');
      setTimeout(() => {
        setToastMessage(null);
        onClose();
      }, 1000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-100 flex flex-col max-h-[92vh] overflow-hidden">
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-100 text-[#4A9DFF] flex items-center justify-center">
              <HeartPulse className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-[#18324B] text-base">Hồ Sơ Sức Khỏe & Thể Trạng</h3>
              <p className="text-[11px] text-slate-500 font-medium">Bảo mật • Tự nguyện • Không chẩn đoán</p>
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

        {/* Tab switch between Quick Metrics and Voluntary Medical Exam */}
        <div className="flex border-b border-slate-100 px-4 pt-2 bg-slate-50">
          <button
            onClick={() => setActiveTab('quick')}
            className={`py-2 px-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'quick'
                ? 'border-[#4A9DFF] text-[#4A9DFF]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Chỉ số cơ thể nhanh</span>
          </button>
          <button
            onClick={() => setActiveTab('medical')}
            className={`py-2 px-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'medical'
                ? 'border-[#4A9DFF] text-[#4A9DFF]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Khám sức khỏe (Tùy chọn)</span>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSaveAll} className="flex-1 overflow-y-auto p-5 space-y-4">
          {toastMessage && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-800 font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              <span>{toastMessage}</span>
            </div>
          )}

          {activeTab === 'quick' ? (
            /* Tab 1: Nhập chỉ số nhanh (Cân nặng, Chiều cao, Nhịp tim nghỉ) */
            <div className="space-y-4">
              <div className="p-3 bg-blue-50/70 rounded-2xl border border-blue-100 text-xs text-blue-900 flex items-start gap-2">
                <Info className="w-4 h-4 text-[#4A9DFF] flex-shrink-0 mt-0.5" />
                <span>
                  Chỉ số cân nặng và chiều cao được dùng để tính BMI và ước tính mức tiêu hao calo (TDEE).
                </span>
              </div>

              {/* Weight with +/- buttons */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#18324B] flex justify-between">
                  <span>Cân nặng hiện tại:</span>
                  <span className="text-[#4A9DFF] font-extrabold">{weight} kg</span>
                </label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setWeight(w => Math.max(Number(w) - 0.5, 30))}
                    className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#18324B] font-bold flex items-center justify-center transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <div className="relative flex-1">
                    <input
                      type="number"
                      step="0.1"
                      min="30"
                      max="200"
                      value={weight}
                      onChange={(e) => setWeight(Number(e.target.value))}
                      className="w-full text-center font-bold text-sm p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-[#4A9DFF]"
                    />
                    <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-medium">kg</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setWeight(w => Math.min(Number(w) + 0.5, 200))}
                    className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#18324B] font-bold flex items-center justify-center transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Height with +/- buttons */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#18324B] flex justify-between">
                  <span>Chiều cao:</span>
                  <span className="text-[#4A9DFF] font-extrabold">{height} cm</span>
                </label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setHeight(h => Math.max(Number(h) - 1, 100))}
                    className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#18324B] font-bold flex items-center justify-center transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <div className="relative flex-1">
                    <input
                      type="number"
                      min="100"
                      max="240"
                      value={height}
                      onChange={(e) => setHeight(Number(e.target.value))}
                      className="w-full text-center font-bold text-sm p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-[#4A9DFF]"
                    />
                    <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-medium">cm</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setHeight(h => Math.min(Number(h) + 1, 240))}
                    className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#18324B] font-bold flex items-center justify-center transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Resting heart rate */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#18324B]">Nhịp tim lúc nghỉ ngơi (tùy chọn):</label>
                <div className="relative">
                  <input
                    type="number"
                    placeholder="Ví dụ: 72"
                    min="40"
                    max="180"
                    value={restingHr}
                    onChange={(e) => setRestingHr(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-slate-50"
                  />
                  <span className="absolute right-3 top-2.5 text-xs text-slate-400">nhịp/phút (bpm)</span>
                </div>
                <p className="text-[10px] text-slate-400">Đo khi vừa ngủ dậy hoặc ngồi nghỉ ngơi yên tĩnh 5 phút.</p>
              </div>
            </div>
          ) : (
            /* Tab 2: Thông tin khám sức khỏe mở rộng (Không bắt buộc) */
            <div className="space-y-4">
              <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                <span>
                  Phần này hoàn toàn tự nguyện. Bạn có thể bỏ qua mà vẫn sử dụng đầy đủ các bài tập cơ bản của DISCI.
                </span>
              </div>

              {/* Huyết áp: Trình bày trực quan số trên / số dưới */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#18324B] block">Huyết áp (Tâm thu / Tâm trương):</label>
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <input
                      type="number"
                      placeholder="120"
                      min="70"
                      max="220"
                      value={systolic}
                      onChange={(e) => setSystolic(e.target.value === '' ? '' : Number(e.target.value))}
                      className="w-full text-center font-bold text-sm p-2.5 rounded-xl border border-slate-200 bg-slate-50"
                    />
                    <span className="text-[10px] text-slate-400 block text-center mt-0.5">Tâm thu (Số trên)</span>
                  </div>
                  <span className="text-lg font-bold text-slate-400">/</span>
                  <div className="relative flex-1">
                    <input
                      type="number"
                      placeholder="80"
                      min="40"
                      max="140"
                      value={diastolic}
                      onChange={(e) => setDiastolic(e.target.value === '' ? '' : Number(e.target.value))}
                      className="w-full text-center font-bold text-sm p-2.5 rounded-xl border border-slate-200 bg-slate-50"
                    />
                    <span className="text-[10px] text-slate-400 block text-center mt-0.5">Tâm trương (Số dưới)</span>
                  </div>
                  <span className="text-xs text-slate-500 font-medium">mmHg</span>
                </div>
              </div>

              {/* Đường huyết đói */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#18324B]">Đường huyết đói (nếu có):</label>
                <div className="relative">
                  <input
                    type="number"
                    placeholder="Ví dụ: 95"
                    step="0.1"
                    value={fastingGlucose}
                    onChange={(e) => setFastingGlucose(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-slate-50"
                  />
                  <span className="absolute right-3 top-2.5 text-xs text-slate-400">mg/dL</span>
                </div>
              </div>

              {/* Vấn đề xương khớp xác nhận */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#18324B] block">Vấn đề xương khớp đã được bác sĩ xác nhận:</label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {['Thoái hóa/Đau khớp gối', 'Đau cột sống thắt lưng', 'Viêm khớp vai', 'Cổ chân yếu/Trật khớp'].map(j => (
                    <button
                      key={j}
                      type="button"
                      onClick={() => toggleJoint(j)}
                      className={`p-2 rounded-xl border text-left font-semibold transition-all ${
                        jointIssues.includes(j)
                          ? 'bg-amber-100 border-amber-400 text-amber-900'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {jointIssues.includes(j) ? '✓ ' : '+ '}{j}
                    </button>
                  ))}
                </div>
              </div>

              {/* Khuyến cáo vận động của bác sĩ */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#18324B] block">
                  Khuyến cáo vận động cụ thể của bác sĩ (nếu có):
                </label>
                <textarea
                  rows={2}
                  placeholder="Ví dụ: Bác sĩ yêu cầu tránh bài tập gập gối quá 90 độ, hạn chế bật nhảy..."
                  value={doctorRestrictions}
                  onChange={(e) => setDoctorRestrictions(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-slate-50 leading-relaxed"
                />
                <p className="text-[10px] text-slate-400">
                  DISCI sẽ ưu tiên áp dụng hạn chế này lên trên mọi gợi ý chung của ứng dụng.
                </p>
              </div>

              {/* Nơi khám */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#18324B] block">Cơ sở khám / Bệnh viện:</label>
                <input
                  type="text"
                  placeholder="Ví dụ: Bệnh viện Đại học Y Dược TP.HCM"
                  value={facilityName}
                  onChange={(e) => setFacilityName(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-slate-50"
                />
              </div>

              {/* File Attachment */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#18324B] block">Đính kèm ảnh/PDF phiếu khám:</label>
                <div className="border border-dashed border-slate-300 rounded-2xl p-3 text-center bg-slate-50 hover:bg-slate-100 transition-colors relative">
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    onChange={handleFileChange}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  <div className="flex flex-col items-center justify-center gap-1">
                    <Upload className="w-5 h-5 text-[#4A9DFF]" />
                    <span className="text-xs font-bold text-slate-700">
                      {fileName ? `Đã chọn: ${fileName}` : 'Chọn ảnh hoặc tài liệu PDF từ máy'}
                    </span>
                    <span className="text-[10px] text-slate-400">Tệp được lưu cục bộ an toàn trên thiết bị của bạn</span>
                  </div>
                </div>
              </div>

              {/* Consent Management & Privacy */}
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <div className="flex items-start gap-2">
                  <input
                    type="checkbox"
                    id="consentCheck"
                    checked={consent}
                    onChange={(e) => setConsent(e.target.checked)}
                    className="mt-1 w-4 h-4 rounded text-[#4A9DFF] border-slate-300"
                  />
                  <label htmlFor="consentCheck" className="text-xs text-slate-700 leading-snug cursor-pointer">
                    <strong>Đồng ý sử dụng dữ liệu:</strong> Cho phép DISCI sử dụng các chỉ số sức khỏe trên để loại trừ các bài tập nguy hiểm và cá nhân hóa lịch tập an toàn.
                  </label>
                </div>
                <div className="flex items-center gap-1 text-[10px] text-slate-500 pt-1">
                  <Lock className="w-3.5 h-3.5 text-slate-400" />
                  <span>Dữ liệu không bao giờ bị chia sẻ ra ngoài hoặc lên bảng tin cộng đồng.</span>
                </div>
              </div>

              {healthRecord && (
                <div className="pt-2 flex justify-between items-center">
                  <button
                    type="button"
                    onClick={revokeHealthConsent}
                    className="text-xs text-amber-700 hover:underline font-semibold"
                  >
                    Rút lại sự đồng ý
                  </button>
                  <button
                    type="button"
                    onClick={handleDeleteAllHealthData}
                    className="text-xs text-red-600 hover:text-red-700 font-bold flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Xóa toàn bộ hồ sơ khám</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Action buttons */}
          <div className="pt-3 border-t border-slate-100 flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 border border-slate-200 text-slate-600 font-bold rounded-2xl text-xs hover:bg-slate-50"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="flex-1 py-3 bg-[#4A9DFF] hover:bg-[#3b8beb] text-white font-extrabold rounded-2xl text-xs shadow-md transition-colors"
            >
              Lưu Thông Tin
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
