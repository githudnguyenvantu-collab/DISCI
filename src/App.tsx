import React, { useState } from 'react';
import { AppStoreProvider, useAppStore } from './core/store/appStore';
import { Header } from './components/common/Header';
import { BottomNav, TabType } from './components/common/BottomNav';
import { HomeTab } from './components/home/HomeTab';
import { ScheduleTab } from './components/schedule/ScheduleTab';
import { CommunityTab } from './components/community/CommunityTab';
import { ProgressTab } from './components/progress/ProgressTab';
import { ShopTab } from './components/shop/ShopTab';
import { ProfileTab } from './components/profile/ProfileTab';
import { WorkoutSessionModal } from './components/workout/WorkoutSessionModal';
import { HealthRecordModal } from './components/health/HealthRecordModal';
import { Bell, Smartphone, Monitor } from 'lucide-react';

const MainAppContent: React.FC = () => {
  const { currentPlan } = useAppStore();
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [activeWorkoutDay, setActiveWorkoutDay] = useState<number | null>(null);
  const [isHealthRecordOpen, setIsHealthRecordOpen] = useState(false);
  const [showNotificationToast, setShowNotificationToast] = useState(false);
  const [isPhoneFrame, setIsPhoneFrame] = useState(false);

  // Find day plan for active workout
  const activeDayPlan = activeWorkoutDay !== null && currentPlan
    ? currentPlan.days.find(d => d.dayOfWeek === activeWorkoutDay)
    : null;

  return (
    <div className={`min-h-screen bg-[#F4F9FF] text-[#18324B] flex flex-col items-center ${isPhoneFrame ? 'py-4 px-2' : ''}`}>
      {/* Top toolbar on larger screens to toggle between full mobile view and phone mockup frame */}
      <div className="w-full max-w-md hidden md:flex items-center justify-between pb-2 text-xs text-slate-500 px-2">
        <span className="font-semibold text-slate-600">📱 DISCI - Giao diện ứng dụng di động</span>
        <button
          onClick={() => setIsPhoneFrame(!isPhoneFrame)}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 shadow-2xs transition-colors font-medium"
        >
          {isPhoneFrame ? <Monitor className="w-3.5 h-3.5" /> : <Smartphone className="w-3.5 h-3.5" />}
          <span>{isPhoneFrame ? 'Toàn màn hình' : 'Khung điện thoại'}</span>
        </button>
      </div>

      {/* Main app shell */}
      <div
        className={`w-full max-w-md bg-[#F4F9FF] min-h-screen relative flex flex-col ${
          isPhoneFrame ? 'rounded-[40px] shadow-2xl border-[8px] border-slate-800 overflow-hidden' : ''
        }`}
      >
        {/* Header */}
        <Header
          onOpenNotifications={() => setShowNotificationToast(true)}
          onOpenCheckIn={() => setActiveTab('home')}
        />

        {/* Notification Toast Alert */}
        {showNotificationToast && (
          <div className="fixed top-14 left-1/2 -translate-x-1/2 z-50 bg-[#18324B] text-white px-4 py-3 rounded-2xl shadow-xl border border-slate-700 text-xs flex items-center justify-between gap-3 max-w-sm w-[90%] animate-in fade-in slide-in-from-top-4 duration-200">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-[#8ECAFF] flex-shrink-0" />
              <div>
                <p className="font-bold">Lịch tập DISCI hôm nay</p>
                <p className="text-[11px] text-slate-300">Đã đến khung giờ tập lý tưởng! Hãy dành 30 phút rèn luyện.</p>
              </div>
            </div>
            <button
              onClick={() => setShowNotificationToast(false)}
              className="text-slate-400 hover:text-white text-xs font-bold px-2 py-1 rounded"
            >
              Đóng
            </button>
          </div>
        )}

        {/* Tab Views */}
        <main className="flex-1">
          {activeTab === 'home' && (
            <HomeTab
              onStartWorkout={(day) => setActiveWorkoutDay(day)}
              onNavigateToSchedule={() => setActiveTab('schedule')}
              onNavigateToHealthRecord={() => setIsHealthRecordOpen(true)}
              onNavigateToShop={() => setActiveTab('shop')}
            />
          )}

          {activeTab === 'schedule' && (
            <ScheduleTab
              onStartWorkout={(day) => setActiveWorkoutDay(day)}
            />
          )}

          {activeTab === 'community' && (
            <CommunityTab />
          )}

          {activeTab === 'progress' && (
            <ProgressTab />
          )}

          {activeTab === 'shop' && (
            <ShopTab />
          )}

          {activeTab === 'profile' && (
            <ProfileTab
              onOpenHealthRecord={() => setIsHealthRecordOpen(true)}
            />
          )}
        </main>

        {/* Bottom Navigation */}
        <BottomNav
          activeTab={activeTab}
          onChangeTab={(tab) => setActiveTab(tab)}
        />

        {/* Active Workout Session Modal */}
        {activeDayPlan && (
          <WorkoutSessionModal
            dayPlan={activeDayPlan}
            onClose={() => setActiveWorkoutDay(null)}
            onFinishSession={() => {
              setActiveWorkoutDay(null);
              setActiveTab('progress');
            }}
          />
        )}

        {/* Voluntary Health Record Modal */}
        <HealthRecordModal
          isOpen={isHealthRecordOpen}
          onClose={() => setIsHealthRecordOpen(false)}
        />
      </div>
    </div>
  );
};

export default function App() {
  return (
    <AppStoreProvider>
      <MainAppContent />
    </AppStoreProvider>
  );
}
