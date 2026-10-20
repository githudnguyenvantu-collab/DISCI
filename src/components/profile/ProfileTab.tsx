import React, { useState } from 'react';
import {
  User,
  Settings,
  Bell,
  Lock,
  Download,
  Trash2,
  RefreshCw,
  VolumeX,
  ShieldCheck,
  CheckCircle2,
  Info,
  LogOut,
  HeartPulse,
  Database
} from 'lucide-react';
import { useAppStore } from '../../core/store/appStore';
import { EquipmentOption, FitnessGoal, Gender, WorkoutEnvironment } from '../../types';
import { calculateWorkoutStreak } from '../../core/workout/streak';
import { StreakCelebrationCard } from './StreakCelebrationCard';

interface ProfileTabProps {
  onOpenHealthRecord: () => void;
}

export const ProfileTab: React.FC<ProfileTabProps> = ({ onOpenHealthRecord }) => {
  const {
    profile,
    updateProfile,
    notifications,
    updateNotifications,
    syncStatus,
    triggerManualSync,
    exportDataJson,
    resetAllData,
    sessionLogs
  } = useAppStore();

  const [name, setName] = useState(profile.name);
  const [age, setAge] = useState(profile.age);
  const [gender, setGender] = useState<Gender>(profile.gender);
  const [goal, setGoal] = useState<FitnessGoal>(profile.goal);
  const [environment, setEnvironment] = useState<WorkoutEnvironment>(profile.environment);
  const [equipment, setEquipment] = useState<EquipmentOption[]>(profile.equipment);
  const [reminderTime, setReminderTime] = useState(notifications.reminderTime);
  const [workoutReminder, setWorkoutReminder] = useState(notifications.workoutReminder);
  const [isSavedMessage, setIsSavedMessage] = useState(false);

  const toggleEquipment = (eq: EquipmentOption) => {
    setEquipment(prev =>
      prev.includes(eq) ? prev.filter(e => e !== eq) : [...prev, eq]
    );
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name: name.trim(),
      age: Number(age),
      gender,
      goal,
      environment,
      equipment
    });
    updateNotifications({
      reminderTime,
      workoutReminder
    });
    setIsSavedMessage(true);
    setTimeout(() => setIsSavedMessage(false), 2000);
  };

  const handleExportData = () => {
    const jsonStr = exportDataJson();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `DISCI_Export_Data_${profile.name.replace(/\s+/g, '_')}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleResetData = () => {
    if (confirm('CẢNH BÁO: Hành động này sẽ xóa toàn bộ lịch sử tập luyện, đơn hàng và hồ sơ sức khỏe trên máy của bạn. Bạn có chắc chắn muốn đặt lại?')) {
      resetAllData();
      alert('Đã đặt lại dữ liệu ứng dụng về trạng thái mặc định.');
    }
  };

  const streakInfo = calculateWorkoutStreak(sessionLogs.map(l => l.date));

  return (
    <div className="pb-24 pt-2 px-4 max-w-md mx-auto space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pt-1">
        <div>
          <h1 className="text-xl font-extrabold text-[#18324B] tracking-tight">Cá Nhân & Cài Đặt</h1>
          <p className="text-xs text-slate-500 font-medium">Hồ sơ người dùng • Quyền riêng tư • Thiết bị</p>
        </div>

        <button
          onClick={onOpenHealthRecord}
          className="text-xs bg-[#F4F9FF] border border-[#4A9DFF] text-[#4A9DFF] font-bold px-3 py-1.5 rounded-xl hover:bg-blue-50 transition-colors flex items-center gap-1 shadow-2xs"
        >
          <HeartPulse className="w-3.5 h-3.5" />
          <span>Hồ sơ y tế</span>
        </button>
      </div>

      {/* Streak Celebration Banner & Pulse Animation */}
      <StreakCelebrationCard streakInfo={streakInfo} />

      {isSavedMessage && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-800 font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <span>Đã lưu thành công thông tin hồ sơ và cài đặt nhắc nhở!</span>
        </div>
      )}

      {/* Profile Form Card */}
      <form onSubmit={handleSaveProfile} className="bg-white rounded-3xl p-5 border border-[#8ECAFF]/40 shadow-xs space-y-4 text-xs">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#4A9DFF] to-[#8ECAFF] text-white font-black text-xl flex items-center justify-center shadow-xs">
            {profile.name.charAt(0)}
          </div>
          <div>
            <h3 className="font-extrabold text-[#18324B] text-sm">{profile.name}</h3>
            <span className="text-[10px] text-slate-400">Tham gia từ {profile.createdAt.slice(0, 10)}</span>
          </div>
        </div>

        {/* Name and Age */}
        <div className="grid grid-cols-2 gap-2.5">
          <div>
            <label className="font-bold text-slate-700 block mb-1">Họ và tên:</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-medium text-xs"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Tuổi (năm sinh):</label>
            <input
              type="number"
              min="14"
              max="99"
              required
              value={age}
              onChange={(e) => setAge(Number(e.target.value))}
              className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-medium text-xs text-center"
            />
          </div>
        </div>

        {/* Gender with medical explanation */}
        <div>
          <label className="font-bold text-slate-700 block mb-1">
            Giới tính sinh học (cần cho công thức ước tính TDEE & BMR):
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'male', label: 'Nam' },
              { id: 'female', label: 'Nữ' },
              { id: 'other', label: 'Khác' }
            ].map(g => (
              <button
                key={g.id}
                type="button"
                onClick={() => setGender(g.id as Gender)}
                className={`py-2 rounded-xl border font-bold text-center transition-all ${
                  gender === g.id
                    ? 'bg-[#4A9DFF] text-white border-[#4A9DFF]'
                    : 'border-slate-200 text-slate-600 bg-slate-50 hover:bg-slate-100'
                }`}
              >
                {g.label}
              </button>
            ))}
          </div>
        </div>

        {/* Goal */}
        <div>
          <label className="font-bold text-slate-700 block mb-1">Mục tiêu rèn luyện thể chất:</label>
          <select
            value={goal}
            onChange={(e) => setGoal(e.target.value as FitnessGoal)}
            className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-medium text-xs"
          >
            <option value="muscle_gain">Tăng cơ (Muscle Gain)</option>
            <option value="fat_loss">Giảm mỡ (Fat Loss)</option>
            <option value="endurance">Tăng sức bền (Endurance)</option>
            <option value="general_health">Nâng cao sức khỏe chung</option>
          </select>
        </div>

        {/* Environment */}
        <div>
          <label className="font-bold text-slate-700 block mb-1">Môi trường tập luyện chính:</label>
          <div className="grid grid-cols-2 gap-2">
            {[
              { id: 'home', label: '🏠 Tại nhà / Phòng riêng' },
              { id: 'dormitory', label: '🏢 Ký túc xá (ít không gian)' },
              { id: 'outdoor', label: '🌳 Ngoài trời / Công viên' },
              { id: 'gym', label: '🏋️ Phòng gym' }
            ].map(env => (
              <button
                key={env.id}
                type="button"
                onClick={() => setEnvironment(env.id as WorkoutEnvironment)}
                className={`py-2 px-2 rounded-xl border font-semibold text-left text-[11px] transition-all ${
                  environment === env.id
                    ? 'bg-blue-50 border-[#4A9DFF] text-[#18324B] font-bold'
                    : 'border-slate-200 text-slate-600 bg-slate-50 hover:bg-slate-100'
                }`}
              >
                {env.label}
              </button>
            ))}
          </div>
        </div>

        {/* Available Equipment */}
        <div>
          <label className="font-bold text-slate-700 block mb-1">Dụng cụ hiện có:</label>
          <div className="grid grid-cols-2 gap-2">
            {[
              { id: 'none', label: 'Không có dụng cụ (Tay không)' },
              { id: 'resistance_band', label: 'Dây kháng lực (Miniband)' },
              { id: 'dumbbells', label: 'Tạ tay (Dumbbells)' },
              { id: 'pullup_bar', label: 'Xà đơn' }
            ].map(eq => (
              <button
                key={eq.id}
                type="button"
                onClick={() => toggleEquipment(eq.id as EquipmentOption)}
                className={`p-2 rounded-xl border text-left text-[11px] font-semibold transition-all ${
                  equipment.includes(eq.id as EquipmentOption)
                    ? 'bg-emerald-50 border-emerald-400 text-emerald-900 font-bold'
                    : 'border-slate-200 text-slate-600 bg-slate-50'
                }`}
              >
                {equipment.includes(eq.id as EquipmentOption) ? '✓ ' : '+ '}{eq.label}
              </button>
            ))}
          </div>
        </div>

        {/* Notification settings */}
        <div className="pt-2 border-t border-slate-100 space-y-2">
          <span className="font-bold text-[#18324B] block flex items-center gap-1.5">
            <Bell className="w-3.5 h-3.5 text-[#4A9DFF]" />
            <span>Thông báo & Nhắc lịch tập:</span>
          </span>

          <div className="flex items-center justify-between">
            <label className="text-slate-600 text-xs">Bật thông báo nhắc tập mỗi ngày:</label>
            <input
              type="checkbox"
              checked={workoutReminder}
              onChange={(e) => setWorkoutReminder(e.target.checked)}
              className="w-4 h-4 rounded text-[#4A9DFF]"
            />
          </div>

          <div className="flex items-center justify-between">
            <label className="text-slate-600 text-xs">Giờ nhắc hàng ngày:</label>
            <input
              type="time"
              value={reminderTime}
              onChange={(e) => setReminderTime(e.target.value)}
              className="p-1.5 rounded-lg border border-slate-200 bg-slate-50 text-xs font-bold"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-[#4A9DFF] hover:bg-[#3b8beb] text-white font-extrabold rounded-2xl text-xs transition-colors shadow-md mt-2"
        >
          Lưu Thay Đổi Hồ Sơ
        </button>
      </form>

      {/* Offline Storage & Privacy Management */}
      <div className="bg-white rounded-3xl p-5 border border-[#8ECAFF]/40 shadow-xs space-y-3 text-xs">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
          <Database className="w-4 h-4 text-[#4A9DFF]" />
          <h3 className="font-bold text-[#18324B]">Quản Trị Dữ Liệu & Quyền Riêng Tư</h3>
        </div>

        <div className="flex items-center justify-between text-slate-600">
          <span>Trạng thái kết nối máy chủ:</span>
          <span className="font-bold text-emerald-600 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> {syncStatus === 'synced' ? 'Đã đồng bộ' : 'Đang xử lý'}
          </span>
        </div>

        <p className="text-[11px] text-slate-500 leading-relaxed">
          DISCI lưu trữ an toàn các thông tin tập luyện trên thiết bị của bạn. Bạn có toàn quyền trích xuất file JSON hoặc xóa hoàn toàn dấu vết dữ liệu bất cứ lúc nào.
        </p>

        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            onClick={handleExportData}
            className="p-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl font-bold text-slate-700 flex items-center justify-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-[#4A9DFF]" />
            <span>Xuất file JSON</span>
          </button>

          <button
            onClick={triggerManualSync}
            className="p-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl font-bold text-slate-700 flex items-center justify-center gap-1.5 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5 text-emerald-600" />
            <span>Đồng bộ ngay</span>
          </button>
        </div>

        <div className="pt-2 border-t border-slate-100 flex justify-between items-center">
          <span className="text-[11px] text-slate-400">Phiên bản 1.0.0 (MVP)</span>
          <button
            onClick={handleResetData}
            className="text-xs text-red-600 hover:text-red-700 font-bold flex items-center gap-1"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Xóa sạch dữ liệu ứng dụng</span>
          </button>
        </div>
      </div>
    </div>
  );
};
