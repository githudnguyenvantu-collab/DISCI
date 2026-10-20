import React, { useEffect, useState } from 'react';
import { Flame, Sparkles, Trophy, Award, Zap, PartyPopper } from 'lucide-react';
import confetti from 'canvas-confetti';
import { StreakInfo } from '../../core/workout/streak';

interface StreakCelebrationCardProps {
  streakInfo: StreakInfo;
}

export const StreakCelebrationCard: React.FC<StreakCelebrationCardProps> = ({ streakInfo }) => {
  const [hasTriggeredAuto, setHasTriggeredAuto] = useState(false);
  const [pulseActive, setPulseActive] = useState(true);

  // Trigger confetti burst
  const fireConfetti = () => {
    // Left burst
    confetti({
      particleCount: 40,
      angle: 60,
      spread: 55,
      origin: { x: 0.1, y: 0.7 },
      colors: ['#8ECAFF', '#4A9DFF', '#F59E0B', '#10B981', '#FF6B6B', '#FFD700']
    });

    // Right burst
    confetti({
      particleCount: 40,
      angle: 120,
      spread: 55,
      origin: { x: 0.9, y: 0.7 },
      colors: ['#8ECAFF', '#4A9DFF', '#F59E0B', '#10B981', '#FF6B6B', '#FFD700']
    });

    // Center star burst
    setTimeout(() => {
      confetti({
        particleCount: 30,
        spread: 80,
        origin: { y: 0.6 },
        shapes: ['circle', 'square'],
        colors: ['#4A9DFF', '#F59E0B', '#10B981', '#8ECAFF']
      });
    }, 200);

    // Play subtle celebratory web audio tone
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.15); // A5
      gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.4);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.4);
    } catch {
      // Audio fallback silent
    }
  };

  // Auto fire confetti on first mount if user has a streak milestone
  useEffect(() => {
    if (!hasTriggeredAuto && streakInfo.currentStreak > 0) {
      const timer = setTimeout(() => {
        fireConfetti();
        setHasTriggeredAuto(true);
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [streakInfo.currentStreak, hasTriggeredAuto]);

  const streakDays = Math.max(streakInfo.currentStreak, 1);
  const nextTarget = streakInfo.nextMilestone;
  const progressPercent = Math.min(Math.round((streakDays / nextTarget) * 100), 100);

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-amber-500 via-orange-500 to-amber-600 rounded-3xl p-5 text-white shadow-xl border border-amber-300/40">
      {/* Decorative animated background elements */}
      <div className="absolute -right-8 -top-8 w-32 h-32 bg-yellow-300/20 rounded-full blur-2xl pointer-events-none"></div>
      <div className="absolute -left-6 -bottom-6 w-28 h-28 bg-orange-700/30 rounded-full blur-xl pointer-events-none"></div>

      {/* Top Banner Tag */}
      <div className="flex items-center justify-between mb-3 relative z-10">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-[11px] font-black tracking-wide uppercase shadow-2xs border border-white/20">
          <Sparkles className="w-3.5 h-3.5 text-yellow-200 fill-yellow-200 animate-spin" style={{ animationDuration: '6s' }} />
          <span>Chuỗi Phong Độ DISCI</span>
        </span>

        <button
          onClick={fireConfetti}
          className="px-2.5 py-1 rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur-sm text-[11px] font-bold flex items-center gap-1 transition-all active:scale-95 shadow-2xs border border-white/20"
          title="Bắn pháo hoa ăn mừng"
        >
          <PartyPopper className="w-3.5 h-3.5 text-yellow-200" />
          <span>Bắn pháo hoa</span>
        </button>
      </div>

      {/* Main Streak Counter and Pulse Flame */}
      <div className="flex items-center gap-4 relative z-10 py-1">
        {/* Pulsating Multi-Ring Flame Icon */}
        <div className="relative flex items-center justify-center flex-shrink-0">
          {/* Outer Pulse Ring */}
          <div className="absolute w-16 h-16 rounded-3xl bg-yellow-300/30 animate-ping opacity-60"></div>
          {/* Middle Glowing Ring */}
          <div className="absolute w-14 h-14 rounded-2xl bg-white/30 backdrop-blur-sm animate-pulse"></div>
          {/* Inner Flame Badge */}
          <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-yellow-300 to-amber-100 text-amber-700 flex items-center justify-center shadow-lg relative z-10">
            <Flame className="w-7 h-7 text-amber-600 fill-amber-500 animate-bounce" style={{ animationDuration: '2s' }} />
          </div>
        </div>

        {/* Counter & Title */}
        <div className="flex-1">
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-black tracking-tight drop-shadow-sm">
              {streakDays}
            </span>
            <span className="text-base font-extrabold text-amber-100">
              ngày liên tiếp
            </span>
          </div>
          <div className="flex items-center gap-1.5 mt-0.5">
            <Trophy className="w-3.5 h-3.5 text-yellow-200 fill-yellow-300 flex-shrink-0" />
            <span className="text-xs font-bold text-yellow-100 tracking-tight">
              {streakInfo.streakTitle}
            </span>
          </div>
        </div>
      </div>

      {/* Milestone Motivation Message */}
      <div className="mt-3 bg-black/15 backdrop-blur-md p-3 rounded-2xl border border-white/15 text-xs text-amber-50 leading-relaxed relative z-10">
        <p className="font-medium">
          {streakInfo.milestoneMessage}
        </p>
      </div>

      {/* Milestone Progress Bar */}
      <div className="mt-3 pt-2 border-t border-white/20 relative z-10">
        <div className="flex justify-between items-center text-[10px] text-amber-100 font-bold mb-1">
          <span>Tiến độ mốc tiếp theo ({nextTarget} ngày):</span>
          <span>{streakDays}/{nextTarget} ngày ({progressPercent}%)</span>
        </div>
        <div className="w-full bg-black/20 rounded-full h-2 overflow-hidden p-0.5">
          <div
            className="bg-gradient-to-r from-yellow-300 to-amber-200 h-1.5 rounded-full transition-all duration-700 shadow-xs"
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>

        {/* Milestones chips */}
        <div className="flex justify-between text-[9px] text-amber-200 font-bold mt-1.5 px-0.5">
          <span className={streakDays >= 3 ? 'text-yellow-200 font-black' : 'opacity-60'}>3 ngày ✓</span>
          <span className={streakDays >= 7 ? 'text-yellow-200 font-black' : 'opacity-60'}>7 ngày 🔥</span>
          <span className={streakDays >= 14 ? 'text-yellow-200 font-black' : 'opacity-60'}>14 ngày ⚡</span>
          <span className={streakDays >= 30 ? 'text-yellow-200 font-black' : 'opacity-60'}>30 ngày 🏆</span>
        </div>
      </div>
    </div>
  );
};
