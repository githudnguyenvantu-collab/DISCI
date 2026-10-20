import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, ShieldCheck, Zap, Gauge, Sparkles } from 'lucide-react';
import { getExercisePostureGuide, PosturePhase } from '../../core/workout/postureGuide';

interface ExerciseAnimationVisualizerProps {
  exerciseId: string;
  autoPlay?: boolean;
  className?: string;
}

export const ExerciseAnimationVisualizer: React.FC<ExerciseAnimationVisualizerProps> = ({
  exerciseId,
  autoPlay = true,
  className = ''
}) => {
  const guide = getExercisePostureGuide(exerciseId);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [speed, setSpeed] = useState<1 | 0.5>(1); // 1x chuẩn, 0.5x chậm
  const [activePhaseIndex, setActivePhaseIndex] = useState<number>(0);
  const [animationTick, setAnimationTick] = useState<number>(0);

  // Animation frame loop
  useEffect(() => {
    if (!isPlaying) return;
    const intervalTime = speed === 1 ? 1600 : 2600;
    const interval = setInterval(() => {
      setAnimationTick(t => (t + 1) % 100);
      setActivePhaseIndex(prev => (prev + 1) % guide.phases.length);
    }, intervalTime);
    return () => clearInterval(interval);
  }, [isPlaying, speed, guide.phases.length]);

  const currentPhase: PosturePhase = guide.phases[activePhaseIndex] || guide.phases[0];

  // Helper renderers for dynamic exercise silhouette postures
  const renderPostureFigure = () => {
    // Phase 0: Start, Phase 1: In motion / bottom, Phase 2: Peak
    const isBottom = activePhaseIndex === 1;
    const isPeak = activePhaseIndex === 2;

    if (exerciseId.includes('squat')) {
      return (
        <svg viewBox="0 0 240 180" className="w-full h-40 transition-all duration-700">
          {/* Ground line */}
          <line x1="20" y1="165" x2="220" y2="165" stroke="#CBD5E1" strokeWidth="2.5" strokeDasharray="4 4" />

          {isBottom ? (
            /* Squat Deep Position (90 degree) */
            <g className="transition-all duration-700 animate-in fade-in">
              {/* Head */}
              <circle cx="100" cy="55" r="12" fill="#18324B" />
              {/* Torso tilted 45 deg */}
              <line x1="100" y1="67" x2="115" y2="112" stroke="#18324B" strokeWidth="10" strokeLinecap="round" />
              {/* Thigh (horizontal 90 deg) */}
              <line x1="115" y1="112" x2="155" y2="112" stroke="#4A9DFF" strokeWidth="12" strokeLinecap="round" />
              {/* Shin (vertical) */}
              <line x1="155" y1="112" x2="150" y2="165" stroke="#18324B" strokeWidth="10" strokeLinecap="round" />
              {/* Foot */}
              <line x1="145" y1="165" x2="168" y2="165" stroke="#18324B" strokeWidth="6" strokeLinecap="round" />
              {/* Arms reaching forward for balance */}
              <line x1="102" y1="75" x2="70" y2="85" stroke="#8ECAFF" strokeWidth="7" strokeLinecap="round" />

              {/* 90 deg angle indicator arc */}
              <circle cx="155" cy="112" r="16" fill="none" stroke="#F59E0B" strokeWidth="2" strokeDasharray="3 3" />
              <text x="175" y="112" fill="#D97706" fontSize="10" fontWeight="bold">90°</text>

              {/* Muscle glow tag */}
              <rect x="75" y="125" width="85" height="18" rx="6" fill="#F59E0B" opacity="0.9" />
              <text x="117" y="137" fill="#FFFFFF" fontSize="9" fontWeight="bold" textAnchor="middle">
                Đùi song song sàn
              </text>
            </g>
          ) : (
            /* Standing / Peak Squeeze */
            <g className="transition-all duration-700 animate-in fade-in">
              {/* Head */}
              <circle cx="120" cy="35" r="12" fill="#18324B" />
              {/* Torso straight */}
              <line x1="120" y1="47" x2="120" y2="105" stroke="#18324B" strokeWidth="10" strokeLinecap="round" />
              {/* Arms down / hands clasped */}
              <line x1="120" y1="58" x2="108" y2="92" stroke="#8ECAFF" strokeWidth="7" strokeLinecap="round" />
              {/* Thighs */}
              <line x1="120" y1="105" x2="120" y2="135" stroke="#4A9DFF" strokeWidth="11" strokeLinecap="round" />
              {/* Shins */}
              <line x1="120" y1="135" x2="120" y2="165" stroke="#18324B" strokeWidth="10" strokeLinecap="round" />
              {/* Feet */}
              <line x1="115" y1="165" x2="132" y2="165" stroke="#18324B" strokeWidth="6" strokeLinecap="round" />

              {/* Squeeze indicator */}
              <rect x="78" y="100" width="84" height="18" rx="6" fill="#10B981" opacity="0.9" />
              <text x="120" y="112" fill="#FFFFFF" fontSize="9" fontWeight="bold" textAnchor="middle">
                Siết cơ mông ở đỉnh
              </text>
            </g>
          )}
        </svg>
      );
    }

    if (exerciseId.includes('pushup')) {
      return (
        <svg viewBox="0 0 240 180" className="w-full h-40 transition-all duration-700">
          <line x1="20" y1="165" x2="220" y2="165" stroke="#CBD5E1" strokeWidth="2.5" strokeDasharray="4 4" />

          {isBottom ? (
            /* Bottom Pushup Position */
            <g className="transition-all duration-700 animate-in fade-in">
              {/* Head */}
              <circle cx="70" cy="132" r="10" fill="#18324B" />
              {/* Body parallel to floor 5cm */}
              <line x1="78" y1="136" x2="175" y2="148" stroke="#4A9DFF" strokeWidth="10" strokeLinecap="round" />
              {/* Elbow bent 45 deg */}
              <line x1="90" y1="138" x2="100" y2="120" stroke="#F59E0B" strokeWidth="7" strokeLinecap="round" />
              <line x1="100" y1="120" x2="100" y2="165" stroke="#18324B" strokeWidth="8" strokeLinecap="round" />
              {/* Feet toes */}
              <circle cx="178" cy="160" r="4" fill="#18324B" />

              {/* Angle cue */}
              <rect x="70" y="98" width="95" height="18" rx="6" fill="#4A9DFF" opacity="0.9" />
              <text x="117" y="110" fill="#FFFFFF" fontSize="9" fontWeight="bold" textAnchor="middle">
                Khuỷu 45° • Ngực cách sàn 5cm
              </text>
            </g>
          ) : (
            /* High Plank Pushup Position */
            <g className="transition-all duration-700 animate-in fade-in">
              {/* Head */}
              <circle cx="70" cy="85" r="10" fill="#18324B" />
              {/* Straight incline spine */}
              <line x1="78" y1="92" x2="175" y2="148" stroke="#18324B" strokeWidth="10" strokeLinecap="round" />
              {/* Straight arms */}
              <line x1="92" y1="98" x2="92" y2="165" stroke="#4A9DFF" strokeWidth="8" strokeLinecap="round" />
              {/* Feet */}
              <circle cx="178" cy="160" r="4" fill="#18324B" />

              <rect x="80" y="65" width="90" height="18" rx="6" fill="#10B981" opacity="0.9" />
              <text x="125" y="77" fill="#FFFFFF" fontSize="9" fontWeight="bold" textAnchor="middle">
                Toàn thân thẳng 1 trục
              </text>
            </g>
          )}
        </svg>
      );
    }

    if (exerciseId.includes('plank')) {
      return (
        <svg viewBox="0 0 240 180" className="w-full h-40 transition-all duration-700">
          <line x1="20" y1="165" x2="220" y2="165" stroke="#CBD5E1" strokeWidth="2.5" strokeDasharray="4 4" />

          {/* Low Forearm Plank */}
          <g className="transition-all duration-700 animate-in fade-in">
            {/* Head */}
            <circle cx="65" cy="115" r="10" fill="#18324B" />
            {/* Upper arm vertical under shoulder 90 deg */}
            <line x1="80" y1="120" x2="80" y2="155" stroke="#18324B" strokeWidth="8" strokeLinecap="round" />
            {/* Forearm on ground */}
            <line x1="80" y1="155" x2="60" y2="155" stroke="#18324B" strokeWidth="7" strokeLinecap="round" />
            {/* Spine perfectly horizontal line */}
            <line x1="80" y1="120" x2="175" y2="135" stroke="#4A9DFF" strokeWidth="10" strokeLinecap="round" />
            {/* Legs and feet */}
            <line x1="175" y1="135" x2="185" y2="160" stroke="#18324B" strokeWidth="9" strokeLinecap="round" />

            {/* Glowing core indicator */}
            <circle cx="120" cy="126" r="15" fill="#F59E0B" opacity="0.3" className="animate-ping" />
            <circle cx="120" cy="126" r="9" fill="#F59E0B" />

            <rect x="75" y="85" width="105" height="18" rx="6" fill="#F59E0B" opacity="0.95" />
            <text x="127" y="97" fill="#FFFFFF" fontSize="9" fontWeight="bold" textAnchor="middle">
              Gồng cơ bụng sâu (Core 180°)
            </text>
          </g>
        </svg>
      );
    }

    if (exerciseId.includes('bridge')) {
      return (
        <svg viewBox="0 0 240 180" className="w-full h-40 transition-all duration-700">
          <line x1="20" y1="165" x2="220" y2="165" stroke="#CBD5E1" strokeWidth="2.5" strokeDasharray="4 4" />

          {isBottom ? (
            /* Glute Bridge Peak Thrust */
            <g className="transition-all duration-700 animate-in fade-in">
              {/* Head on ground */}
              <circle cx="170" cy="155" r="10" fill="#18324B" />
              {/* Torso lifted up in bridge */}
              <line x1="165" y1="155" x2="115" y2="115" stroke="#4A9DFF" strokeWidth="11" strokeLinecap="round" />
              {/* Thigh down to knees 90 deg */}
              <line x1="115" y1="115" x2="75" y2="130" stroke="#F59E0B" strokeWidth="11" strokeLinecap="round" />
              {/* Shins to ground */}
              <line x1="75" y1="130" x2="75" y2="165" stroke="#18324B" strokeWidth="9" strokeLinecap="round" />
              {/* Feet flat */}
              <line x1="68" y1="165" x2="85" y2="165" stroke="#18324B" strokeWidth="6" strokeLinecap="round" />

              <rect x="80" y="80" width="100" height="18" rx="6" fill="#10B981" opacity="0.95" />
              <text x="130" y="92" fill="#FFFFFF" fontSize="9" fontWeight="bold" textAnchor="middle">
                Đỉnh: Gối - Hông - Vai thẳng hàng
              </text>
            </g>
          ) : (
            /* Starting Lying Flat */
            <g className="transition-all duration-700 animate-in fade-in">
              {/* Head */}
              <circle cx="170" cy="155" r="10" fill="#18324B" />
              {/* Torso on floor */}
              <line x1="165" y1="155" x2="115" y2="155" stroke="#18324B" strokeWidth="10" strokeLinecap="round" />
              {/* Knees bent */}
              <line x1="115" y1="155" x2="85" y2="130" stroke="#4A9DFF" strokeWidth="9" strokeLinecap="round" />
              <line x1="85" y1="130" x2="75" y2="165" stroke="#18324B" strokeWidth="8" strokeLinecap="round" />

              <rect x="85" y="105" width="85" height="18" rx="6" fill="#4A9DFF" opacity="0.9" />
              <text x="127" y="117" fill="#FFFFFF" fontSize="9" fontWeight="bold" textAnchor="middle">
                Lưng dưới dán chặt sàn
              </text>
            </g>
          )}
        </svg>
      );
    }

    if (exerciseId.includes('bird_dog')) {
      return (
        <svg viewBox="0 0 240 180" className="w-full h-40 transition-all duration-700">
          <line x1="20" y1="165" x2="220" y2="165" stroke="#CBD5E1" strokeWidth="2.5" strokeDasharray="4 4" />

          {isBottom ? (
            /* Bird dog extended arm & opposite leg */
            <g className="transition-all duration-700 animate-in fade-in">
              <circle cx="95" cy="115" r="10" fill="#18324B" />
              {/* Arm extended forward */}
              <line x1="95" y1="115" x2="45" y2="115" stroke="#F59E0B" strokeWidth="7" strokeLinecap="round" />
              {/* Torso */}
              <line x1="95" y1="120" x2="145" y2="120" stroke="#4A9DFF" strokeWidth="10" strokeLinecap="round" />
              {/* Supporting arm */}
              <line x1="105" y1="120" x2="105" y2="165" stroke="#18324B" strokeWidth="8" strokeLinecap="round" />
              {/* Extended opposite leg */}
              <line x1="145" y1="120" x2="195" y2="120" stroke="#F59E0B" strokeWidth="8" strokeLinecap="round" />
              {/* Supporting knee */}
              <line x1="140" y1="120" x2="140" y2="165" stroke="#18324B" strokeWidth="8" strokeLinecap="round" />

              <rect x="75" y="75" width="105" height="18" rx="6" fill="#4A9DFF" opacity="0.95" />
              <text x="127" y="87" fill="#FFFFFF" fontSize="9" fontWeight="bold" textAnchor="middle">
                Vươn thẳng trục 180° • Giữ thăng bằng
              </text>
            </g>
          ) : (
            /* Tabletop 4 points */
            <g className="transition-all duration-700 animate-in fade-in">
              <circle cx="85" cy="115" r="10" fill="#18324B" />
              <line x1="85" y1="120" x2="145" y2="120" stroke="#18324B" strokeWidth="10" strokeLinecap="round" />
              <line x1="95" y1="120" x2="95" y2="165" stroke="#4A9DFF" strokeWidth="8" strokeLinecap="round" />
              <line x1="140" y1="120" x2="140" y2="165" stroke="#4A9DFF" strokeWidth="8" strokeLinecap="round" />

              <rect x="85" y="80" width="85" height="18" rx="6" fill="#10B981" opacity="0.9" />
              <text x="127" y="92" fill="#FFFFFF" fontSize="9" fontWeight="bold" textAnchor="middle">
                Góc gối & hông 90°
              </text>
            </g>
          )}
        </svg>
      );
    }

    if (exerciseId.includes('wall_sit')) {
      return (
        <svg viewBox="0 0 240 180" className="w-full h-40 transition-all duration-700">
          {/* Wall vertical line */}
          <line x1="60" y1="20" x2="60" y2="165" stroke="#94A3B8" strokeWidth="4" />
          <line x1="20" y1="165" x2="220" y2="165" stroke="#CBD5E1" strokeWidth="2.5" strokeDasharray="4 4" />

          {/* Wall sit posture */}
          <g className="transition-all duration-700 animate-in fade-in">
            {/* Head against wall */}
            <circle cx="75" cy="60" r="11" fill="#18324B" />
            {/* Back vertical against wall */}
            <line x1="72" y1="72" x2="72" y2="115" stroke="#4A9DFF" strokeWidth="12" strokeLinecap="round" />
            {/* Thighs horizontal 90 deg */}
            <line x1="72" y1="115" x2="125" y2="115" stroke="#F59E0B" strokeWidth="12" strokeLinecap="round" />
            {/* Shins vertical 90 deg */}
            <line x1="125" y1="115" x2="125" y2="165" stroke="#18324B" strokeWidth="10" strokeLinecap="round" />
            {/* Feet */}
            <line x1="120" y1="165" x2="142" y2="165" stroke="#18324B" strokeWidth="6" strokeLinecap="round" />

            <circle cx="125" cy="115" r="14" fill="none" stroke="#F59E0B" strokeWidth="2" strokeDasharray="3 3" />
            <text x="145" y="115" fill="#D97706" fontSize="10" fontWeight="bold">90°</text>

            <rect x="85" y="40" width="100" height="18" rx="6" fill="#10B981" opacity="0.95" />
            <text x="135" y="52" fill="#FFFFFF" fontSize="9" fontWeight="bold" textAnchor="middle">
              Gối vuông góc • Tĩnh lặng êm ái
            </text>
          </g>
        </svg>
      );
    }

    // Default dynamic posture (Marching, Step Jacks, Burpee, Dead bug...)
    return (
      <svg viewBox="0 0 240 180" className="w-full h-40 transition-all duration-700">
        <line x1="20" y1="165" x2="220" y2="165" stroke="#CBD5E1" strokeWidth="2.5" strokeDasharray="4 4" />

        <g className="transition-all duration-700 animate-in fade-in">
          {/* Head */}
          <circle cx="120" cy="40" r="12" fill="#18324B" />
          {/* Torso */}
          <line x1="120" y1="52" x2="120" y2="108" stroke="#18324B" strokeWidth="10" strokeLinecap="round" />
          {/* Alternating legs */}
          {isBottom ? (
            <>
              {/* Lifted high knee */}
              <line x1="120" y1="108" x2="95" y2="115" stroke="#4A9DFF" strokeWidth="10" strokeLinecap="round" />
              <line x1="95" y1="115" x2="95" y2="145" stroke="#4A9DFF" strokeWidth="9" strokeLinecap="round" />
              {/* Standing leg */}
              <line x1="120" y1="108" x2="125" y2="165" stroke="#18324B" strokeWidth="10" strokeLinecap="round" />
              {/* Arms swing */}
              <line x1="120" y1="65" x2="145" y2="85" stroke="#8ECAFF" strokeWidth="7" strokeLinecap="round" />
              <rect x="75" y="80" width="100" height="18" rx="6" fill="#4A9DFF" opacity="0.9" />
              <text x="125" y="92" fill="#FFFFFF" fontSize="9" fontWeight="bold" textAnchor="middle">
                Nâng gối 90° có kiểm soát
              </text>
            </>
          ) : (
            <>
              {/* Standing straight */}
              <line x1="120" y1="108" x2="115" y2="165" stroke="#18324B" strokeWidth="10" strokeLinecap="round" />
              <line x1="120" y1="108" x2="125" y2="165" stroke="#18324B" strokeWidth="10" strokeLinecap="round" />
              {/* Arms down */}
              <line x1="120" y1="65" x2="110" y2="95" stroke="#8ECAFF" strokeWidth="7" strokeLinecap="round" />
              <rect x="80" y="80" width="90" height="18" rx="6" fill="#10B981" opacity="0.9" />
              <text x="125" y="92" fill="#FFFFFF" fontSize="9" fontWeight="bold" textAnchor="middle">
                Tiếp đất êm không tiếng ồn
              </text>
            </>
          )}
        </g>
      </svg>
    );
  };

  return (
    <div className={`bg-gradient-to-b from-blue-50/70 to-white rounded-3xl p-4 border border-[#8ECAFF]/50 shadow-2xs space-y-3 ${className}`}>
      {/* Top Controls Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
          <span className="text-[11px] font-extrabold text-[#18324B] uppercase tracking-wider flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-[#4A9DFF]" />
            Hoạt Ảnh Hướng Dẫn Tư Thế
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Speed Toggle */}
          <button
            type="button"
            onClick={() => setSpeed(s => (s === 1 ? 0.5 : 1))}
            className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 flex items-center gap-1 shadow-2xs"
            title="Đổi tốc độ hoạt ảnh"
          >
            <Gauge className="w-3 h-3 text-[#4A9DFF]" />
            <span>{speed}x {speed === 0.5 ? '(Chậm)' : ''}</span>
          </button>

          {/* Play/Pause Button */}
          <button
            type="button"
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-1 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 shadow-2xs"
            title={isPlaying ? 'Tạm dừng hoạt ảnh' : 'Tiếp tục chạy'}
            aria-label={isPlaying ? 'Tạm dừng hoạt ảnh' : 'Chạy hoạt ảnh'}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
          </button>
        </div>
      </div>

      {/* Animation Canvas Box */}
      <div className="relative bg-white rounded-2xl p-2 border border-slate-200/80 shadow-inner flex items-center justify-center overflow-hidden">
        {renderPostureFigure()}
      </div>

      {/* Interactive Phase Steps Selector */}
      <div className="space-y-1.5">
        <div className="flex gap-1.5">
          {guide.phases.map((p, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setActivePhaseIndex(idx);
                setIsPlaying(false);
              }}
              className={`flex-1 py-1.5 px-2 rounded-xl text-[10px] font-bold text-center border transition-all ${
                activePhaseIndex === idx
                  ? 'bg-[#4A9DFF] text-white border-[#4A9DFF] shadow-2xs'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {p.phaseName}
            </button>
          ))}
        </div>

        {/* Current Phase Details Box */}
        <div className="bg-[#F4F9FF] p-2.5 rounded-xl border border-blue-100 text-[11px] text-slate-700 space-y-1">
          <p className="font-semibold text-[#18324B] leading-snug">
            {currentPhase.description}
          </p>
          <div className="flex flex-wrap items-center gap-2 pt-0.5 text-[10px]">
            <span className="text-amber-800 font-bold bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-amber-600" />
              {currentPhase.jointAngleNote}
            </span>
            <span className="text-emerald-800 font-bold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 flex items-center gap-1">
              <Zap className="w-3 h-3 text-emerald-600" />
              {currentPhase.activeMuscle}
            </span>
          </div>
        </div>
      </div>

      {/* Rhythm / Cadence Guidance */}
      <div className="p-2 bg-slate-50 rounded-xl border border-slate-200/80 text-[10px] text-slate-500 flex items-center justify-between">
        <span><strong>Nhịp thở & tốc độ chuẩn:</strong> {guide.rhythmCadence}</span>
      </div>
    </div>
  );
};
