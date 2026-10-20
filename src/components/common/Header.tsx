import React from 'react';
import { Wifi, WifiOff, RefreshCw, Bell, VolumeX, Moon } from 'lucide-react';
import { useAppStore } from '../../core/store/appStore';

interface HeaderProps {
  onOpenNotifications?: () => void;
  onOpenCheckIn?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenNotifications }) => {
  const { syncStatus, triggerManualSync, profile, updateProfile } = useAppStore();

  const toggleDorm = () => {
    updateProfile({ quietDormitoryMode: !profile.quietDormitoryMode });
  };

  return (
    <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-[#8ECAFF]/30 px-4 py-2.5">
      <div className="max-w-md mx-auto flex items-center justify-between">
        {/* Logo & Brand */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#4A9DFF] to-[#8ECAFF] flex items-center justify-center text-white font-extrabold text-base shadow-sm">
            D
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-lg tracking-tight text-[#18324B]">DISCI</span>
              <span className="text-[10px] bg-[#8ECAFF]/30 text-[#18324B] px-1.5 py-0.5 rounded font-bold uppercase">
                FitHome
              </span>
            </div>
            <p className="text-[10px] text-slate-500 font-medium">Tập tại nhà • Tiết kiệm • An toàn</p>
          </div>
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-2">
          {/* Quick Quiet Dormitory Mode Toggle */}
          <button
            onClick={toggleDorm}
            className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold border transition-all ${
              profile.quietDormitoryMode
                ? 'bg-amber-500 text-white border-amber-600 shadow-sm'
                : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
            }`}
            title="Chế độ ký túc xá: Giảm tiếng ồn, triệt tiêu bài bật nhảy"
          >
            {profile.quietDormitoryMode ? (
              <>
                <VolumeX className="w-3.5 h-3.5 text-white" />
                <span className="hidden sm:inline">Ký túc xá</span>
              </>
            ) : (
              <>
                <Moon className="w-3.5 h-3.5 text-slate-500" />
                <span className="hidden sm:inline">Êm ái</span>
              </>
            )}
          </button>

          {/* Sync status */}
          <button
            onClick={triggerManualSync}
            className="flex items-center text-xs text-slate-500 hover:text-slate-700 bg-slate-50 px-1.5 py-1 rounded border border-slate-200"
            title={syncStatus === 'synced' ? 'Dữ liệu đã đồng bộ an toàn' : 'Đang đồng bộ hoặc ngoại tuyến'}
          >
            {syncStatus === 'synced' ? (
              <Wifi className="w-3.5 h-3.5 text-emerald-500" />
            ) : syncStatus === 'offline' ? (
              <WifiOff className="w-3.5 h-3.5 text-red-500" />
            ) : (
              <RefreshCw className="w-3.5 h-3.5 text-amber-500 animate-spin" />
            )}
          </button>

          {/* Notifications */}
          <button
            onClick={onOpenNotifications}
            className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors relative"
            aria-label="Thông báo"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-[#4A9DFF] rounded-full"></span>
          </button>
        </div>
      </div>
    </header>
  );
};
