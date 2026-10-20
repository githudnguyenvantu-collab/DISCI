import React from 'react';
import { Home, Calendar, TrendingUp, ShoppingBag, User, Users } from 'lucide-react';
import { useAppStore } from '../../core/store/appStore';

export type TabType = 'home' | 'schedule' | 'community' | 'progress' | 'shop' | 'profile';

interface BottomNavProps {
  activeTab: TabType;
  onChangeTab: (tab: TabType) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onChangeTab }) => {
  const { cart } = useAppStore();
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const navItems: { id: TabType; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'home', label: 'Trang chủ', icon: Home },
    { id: 'schedule', label: 'Lịch tập', icon: Calendar },
    { id: 'community', label: 'Cộng đồng', icon: Users },
    { id: 'progress', label: 'Tiến độ', icon: TrendingUp },
    { id: 'shop', label: 'Sản phẩm', icon: ShoppingBag },
    { id: 'profile', label: 'Cá nhân', icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-[#8ECAFF]/40 shadow-lg safe-bottom">
      <div className="max-w-md mx-auto px-2 py-1.5 flex items-center justify-between">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onChangeTab(item.id)}
              className={`relative flex flex-col items-center justify-center flex-1 py-1 px-1 transition-all duration-150 rounded-xl ${
                isActive ? 'text-[#4A9DFF]' : 'text-slate-500 hover:text-slate-800'
              }`}
              aria-label={item.label}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110 stroke-[2.4]' : 'stroke-[1.8]'}`} />
                {item.id === 'shop' && cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-2 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center ring-2 ring-white">
                    {cartItemCount > 9 ? '9+' : cartItemCount}
                  </span>
                )}
              </div>
              <span className={`text-[10px] mt-1 font-medium tracking-tight ${isActive ? 'font-bold text-[#18324B]' : 'text-slate-500'}`}>
                {item.label}
              </span>
              {isActive && (
                <div className="w-4 h-1 bg-[#4A9DFF] rounded-full mt-0.5"></div>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
