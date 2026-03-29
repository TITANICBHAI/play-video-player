import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft, Search, Plus, Info, Settings, MoreVertical,
  Volume2, Sun, SkipForward, SkipBack, Pause, Maximize2,
  Captions, Airplay, Cast, Gauge, Zap, X, Film,
} from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
import AppIcon from './AppIcon';

export default function PhoneMockup({ phoneScene, sceneIndex }: { phoneScene: string; sceneIndex: number }) {
  return (
    <motion.div
      key={phoneScene}
      initial={{ x: 80, opacity: 0, rotateY: 15, scale: 0.92 }}
      animate={{ x: 0, opacity: 1, rotateY: 0, scale: 1, y: [0, -8, 0] }}
      exit={{ x: -60, opacity: 0, scale: 0.95 }}
      transition={{
        x: { type: 'spring', stiffness: 80, damping: 18 },
        y: { repeat: Infinity, duration: 5, ease: 'easeInOut', delay: 0.5 },
        opacity: { duration: 0.5 },
        rotateY: { type: 'spring', stiffness: 80, damping: 18 },
        scale: { type: 'spring', stiffness: 80, damping: 18 },
      }}
      className="relative w-[340px] h-[720px] rounded-[52px] border-[10px] border-neutral-800 shadow-[0_30px_80px_rgba(0,0,0,0.9),_0_0_60px_rgba(255,45,85,0.12)] overflow-hidden"
      style={{ perspective: '1000px', background: '#0A0A0A' }}
    >
      {/* Screen glare */}
      <div className="absolute inset-0 rounded-[42px] border border-white/8 pointer-events-none z-50" />
      <div className="absolute top-0 left-4 right-4 h-[1px] bg-gradient-to-r from-transparent via-white/15 to-transparent z-50" />
      {/* Notch */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120px] h-[28px] bg-neutral-800 rounded-b-3xl z-[60] flex items-center justify-center">
        <div className="w-14 h-3.5 bg-black rounded-full" />
      </div>

      <div className="w-full h-full relative overflow-hidden" style={{ background: '#0A0A0A' }}>
        <AnimatePresence mode="wait">
          {phoneScene === 'home' && <HomeScreen key="home" />}
          {phoneScene === 'doubletap' && <DoubleTapScene key="dt" />}
          {phoneScene === 'gestures' && <GestureScene key="gest" />}
          {phoneScene === 'smartsort' && <SmartSortScene key="ss" />}
          {phoneScene === 'stats' && <StatsScene key="stats" />}
          {phoneScene === 'subtitles' && <SubtitleScene key="sub" />}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

// ── Shared player background ──────────────────────────────────────────────────
function VideoBackground({ progress = 0.35 }: { progress?: number }) {
  return (
    <>
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-indigo-950 to-black" />
      <div className="absolute inset-0 opacity-20" style={{
        backgroundImage: 'radial-gradient(circle at 30% 40%, rgba(99,102,241,0.5) 0%, transparent 50%), radial-gradient(circle at 70% 70%, rgba(168,85,247,0.3) 0%, transparent 50%)'
      }} />
      {/* Cinematic bars */}
      <div className="absolute top-0 left-0 right-0 h-10 bg-black/70" />
      <div className="absolute bottom-0 left-0 right-0 h-10 bg-black/70" />
    </>
  );
}

// ── Player controls bar ───────────────────────────────────────────────────────
function PlayerControls({ currentTime = '02:48', totalTime = '12:04', progress = 0.35, showCC = false }) {
  return (
    <motion.div
      className="absolute bottom-0 left-0 right-0 pb-6 px-4 z-30"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      {/* Gradient behind controls */}
      <div className="absolute bottom-0 left-0 right-0 h-52 bg-gradient-to-t from-black/95 via-black/60 to-transparent pointer-events-none" />
      <div className="relative z-10 space-y-3 pb-2">
        {/* Progress bar */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-[10px] font-mono text-white/70">
            <span>{currentTime}</span>
            <span>{totalTime}</span>
          </div>
          <div className="w-full h-1.5 bg-white/20 rounded-full overflow-visible relative">
            <div className="absolute left-0 top-0 h-full bg-white/20 rounded-full" style={{ width: '55%' }} />
            <motion.div
              className="h-full bg-[#FF2D55] rounded-full absolute top-0 left-0"
              style={{ width: `${progress * 100}%` }}
              animate={{ width: `${(progress + 0.05) * 100}%` }}
              transition={{ duration: 8, ease: 'linear' }}
            />
            <motion.div
              className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-[0_0_8px_rgba(255,255,255,0.8)]"
              style={{ left: `${progress * 100}%` }}
              animate={{ left: `${(progress + 0.05) * 100}%` }}
              transition={{ duration: 8, ease: 'linear' }}
            />
          </div>
        </div>
        {/* Buttons */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Volume2 size={16} className="text-white/80" />
            <span className="text-[10px] text-white/60 font-medium">1.0×</span>
          </div>
          <div className="flex items-center gap-5">
            <SkipBack size={20} className="text-white/90" />
            <div className="w-12 h-12 rounded-full bg-white/10 border border-white/15 backdrop-blur-sm flex items-center justify-center">
              <Pause size={18} fill="white" className="text-white" />
            </div>
            <SkipForward size={20} className="text-white/90" />
          </div>
          <div className="flex items-center gap-3">
            {showCC && <Captions size={16} className="text-[#FF2D55]" />}
            <Maximize2 size={16} className="text-white/80" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ── Top bar ───────────────────────────────────────────────────────────────────
function PlayerTopBar({ title = 'Mountain_Trip.mp4', showCC = false, showInfo = false }) {
  return (
    <motion.div
      className="absolute top-0 left-0 right-0 pt-10 px-4 pb-6 z-30 flex items-center justify-between"
      style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.9) 0%, transparent 100%)' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2 }}
    >
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-full bg-black/40 border border-white/10 flex items-center justify-center">
          <ChevronLeft size={14} className="text-white" />
        </div>
        <div>
          <p className="text-[12px] font-semibold text-white truncate max-w-[160px]">{title}</p>
          <p className="text-[9px] text-white/50">Local File</p>
        </div>
      </div>
      <div className="flex items-center gap-2.5">
        {showCC && <Captions size={16} className="text-[#FF2D55]" />}
        <Airplay size={15} className="text-white/70" />
        {showInfo && <Info size={15} className="text-white/70" />}
        <Settings size={15} className="text-white/70" />
      </div>
    </motion.div>
  );
}

// ── HOME SCREEN ───────────────────────────────────────────────────────────────
function HomeScreen() {
  const videos = [
    { color: 'from-indigo-900 to-slate-900', icon: '🏔', title: 'Mountain_Trip.mp4', time: '12:04', res: '4K' },
    { color: 'from-emerald-900 to-teal-900', icon: '📚', title: 'Tutorial_Final_v3.mkv', time: '05:22', res: '1080p' },
    { color: 'from-rose-900 to-red-900', icon: '🎸', title: 'Concert_Night.mp4', time: '45:10', res: '1080p' },
    { color: 'from-amber-900 to-orange-900', icon: '🐕', title: 'Dog_Park_Sunday.mov', time: '02:15', res: '4K' },
    { color: 'from-cyan-900 to-blue-900', icon: '🚁', title: 'Drone_Footage.mp4', time: '18:30', res: '4K' },
  ];
  const categories = ['All', 'Recent', 'Action', 'Tutorial'];

  return (
    <motion.div
      initial={{ opacity: 0, filter: 'blur(12px)' }}
      animate={{ opacity: 1, filter: 'blur(0px)' }}
      exit={{ opacity: 0, filter: 'blur(12px)' }}
      transition={{ duration: 0.5 }}
      className="w-full h-full flex flex-col pt-10 overflow-hidden"
      style={{ background: '#0A0A0A' }}
    >
      {/* Header */}
      <div className="px-5 pt-4 pb-3">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-0.5">
            <span style={{ color: '#FF2D55', fontFamily: 'system-ui', fontWeight: 800, fontSize: 20, letterSpacing: 3 }}>PLA</span>
            <motion.span
              style={{ color: '#FF2D55', fontFamily: 'system-ui', fontWeight: 800, fontSize: 20, letterSpacing: 3 }}
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 0.8, repeat: Infinity, repeatDelay: 1.5 }}
            >Y</motion.span>
          </div>
          <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: '#FF2D55' }}>
            <Plus size={16} className="text-white" />
          </div>
        </div>
        {/* Search */}
        <div className="flex items-center gap-2 rounded-xl px-3 py-2.5 border" style={{ background: '#1C1C1C', borderColor: '#2A2A2A' }}>
          <Search size={13} style={{ color: 'rgba(255,255,255,0.5)' }} />
          <span className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>Search videos...</span>
        </div>
      </div>

      {/* Category pills */}
      <div className="px-5 pb-3 flex gap-2 overflow-hidden">
        {categories.map((cat, i) => (
          <motion.div
            key={cat}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 + i * 0.07 }}
            className="px-3 py-1.5 rounded-full text-[11px] font-semibold flex-shrink-0"
            style={{
              background: cat === 'All' ? '#FF2D55' : '#1C1C1C',
              color: cat === 'All' ? '#fff' : 'rgba(255,255,255,0.6)',
              border: cat === 'All' ? 'none' : '1px solid #2A2A2A',
            }}
          >{cat}</motion.div>
        ))}
      </div>

      {/* Video list */}
      <div className="flex-1 overflow-hidden px-5 space-y-3 relative">
        {videos.map((v, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 + i * 0.09, type: 'spring', stiffness: 120 }}
            className="w-full"
          >
            {/* Thumbnail */}
            <div className={`w-full rounded-2xl bg-gradient-to-br ${v.color} relative overflow-hidden`} style={{ height: 120 }}>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-4xl opacity-30">{v.icon}</span>
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-10 h-10 rounded-full bg-black/40 border border-white/20 flex items-center justify-center">
                  <div style={{ width: 0, height: 0, borderLeft: '10px solid white', borderTop: '6px solid transparent', borderBottom: '6px solid transparent', marginLeft: 2 }} />
                </div>
              </div>
              <div className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded-md text-[10px] font-bold text-white" style={{ background: 'rgba(0,0,0,0.8)' }}>{v.time}</div>
              <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded-md text-[9px] font-bold text-white" style={{ background: 'rgba(255,45,85,0.85)' }}>{v.res}</div>
            </div>
            {/* Info row */}
            <div className="flex items-center gap-2 mt-2 px-0.5">
              <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(255,45,85,0.2)' }}>
                <Film size={12} style={{ color: '#FF2D55' }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-white truncate">{v.title}</p>
                <p className="text-[10px]" style={{ color: 'rgba(255,255,255,0.45)' }}>Local File</p>
              </div>
              <MoreVertical size={14} style={{ color: 'rgba(255,255,255,0.3)' }} />
            </div>
          </motion.div>
        ))}
        <div className="absolute bottom-0 left-0 right-0 h-20" style={{ background: 'linear-gradient(to top, #0A0A0A, transparent)' }} />
      </div>

      {/* Bottom tab bar */}
      <div className="px-6 py-3 flex items-center justify-around border-t" style={{ borderColor: '#1A1A1A', background: '#0A0A0A' }}>
        {[
          { icon: '🏠', label: 'Home', active: true },
          { icon: '📚', label: 'Library', active: false },
          { icon: '⚙️', label: 'Settings', active: false },
        ].map(t => (
          <div key={t.label} className="flex flex-col items-center gap-0.5">
            <span className="text-base">{t.icon}</span>
            <span className="text-[9px] font-medium" style={{ color: t.active ? '#FF2D55' : 'rgba(255,255,255,0.4)' }}>{t.label}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

// ── DOUBLE-TAP SEEK ───────────────────────────────────────────────────────────
function DoubleTapScene() {
  const [tapSide, setTapSide] = useState<'left' | 'right' | null>(null);
  const [progress, setProgress] = useState(0.28);

  useEffect(() => {
    const seq = async () => {
      await delay(700);
      setTapSide('right');
      setProgress(p => Math.min(p + 0.1, 1));
      await delay(900);
      setTapSide(null);
      await delay(600);
      setTapSide('right');
      setProgress(p => Math.min(p + 0.1, 1));
      await delay(900);
      setTapSide(null);
      await delay(800);
      setTapSide('left');
      setProgress(p => Math.max(p - 0.1, 0));
      await delay(900);
      setTapSide(null);
    };
    const interval = setInterval(seq, 4500);
    seq();
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.02 }}
      transition={{ duration: 0.5 }}
      className="w-full h-full relative"
    >
      <VideoBackground progress={progress} />
      <PlayerTopBar title="Concert_Night.mp4" />

      {/* Double-tap zones */}
      <AnimatePresence>
        {tapSide === 'right' && (
          <motion.div
            key="right"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute right-0 top-0 bottom-0 w-1/2 flex items-center justify-center z-20"
          >
            <div className="absolute right-0 top-0 bottom-0 w-full rounded-l-full" style={{ background: 'rgba(255,255,255,0.06)' }} />
            <motion.div
              animate={{ scale: [1, 1.6, 2], opacity: [0.8, 0.5, 0] }}
              transition={{ duration: 0.7, times: [0, 0.5, 1] }}
              className="absolute w-24 h-24 rounded-full border-2"
              style={{ borderColor: 'rgba(255,255,255,0.4)' }}
            />
            <motion.div
              animate={{ scale: [0.8, 1.3, 1.8], opacity: [1, 0.6, 0] }}
              transition={{ duration: 0.7, times: [0, 0.5, 1], delay: 0.1 }}
              className="absolute w-24 h-24 rounded-full border"
              style={{ borderColor: 'rgba(255,45,85,0.5)' }}
            />
            <div className="flex flex-col items-center gap-1 z-10">
              <SkipForward size={28} className="text-white" fill="white" />
              <span className="text-sm font-bold text-white drop-shadow-lg">+10s</span>
            </div>
          </motion.div>
        )}
        {tapSide === 'left' && (
          <motion.div
            key="left"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute left-0 top-0 bottom-0 w-1/2 flex items-center justify-center z-20"
          >
            <div className="absolute left-0 top-0 bottom-0 w-full rounded-r-full" style={{ background: 'rgba(255,255,255,0.06)' }} />
            <motion.div
              animate={{ scale: [1, 1.6, 2], opacity: [0.8, 0.5, 0] }}
              transition={{ duration: 0.7, times: [0, 0.5, 1] }}
              className="absolute w-24 h-24 rounded-full border-2"
              style={{ borderColor: 'rgba(255,255,255,0.4)' }}
            />
            <div className="flex flex-col items-center gap-1 z-10">
              <SkipBack size={28} className="text-white" fill="white" />
              <span className="text-sm font-bold text-white drop-shadow-lg">-10s</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Finger cursor */}
      <TapFinger side={tapSide} />
      <PlayerControls progress={progress} currentTime="04:12" totalTime="45:10" />
    </motion.div>
  );
}

// ── GESTURE SCENE ─────────────────────────────────────────────────────────────
function GestureScene() {
  const [brightPct, setBrightPct] = useState(0.4);
  const [volPct, setVolPct] = useState(0.55);

  useEffect(() => {
    let dir = 1;
    const t = setInterval(() => {
      setBrightPct(p => {
        const next = p + dir * 0.025;
        if (next > 0.92 || next < 0.12) dir *= -1;
        return Math.max(0.08, Math.min(0.95, next));
      });
      setVolPct(p => {
        const next = p + dir * 0.02;
        return Math.max(0.1, Math.min(0.95, next));
      });
    }, 80);
    return () => clearInterval(t);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.02 }}
      transition={{ duration: 0.5 }}
      className="w-full h-full relative"
    >
      <VideoBackground />
      <PlayerTopBar title="Drone_Footage.mp4" />

      {/* Brightness slider (left) */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.4 }}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-11 rounded-2xl flex flex-col items-center py-3 gap-2 z-30"
        style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.12)', height: 160 }}
      >
        <Sun size={14} className="text-white flex-shrink-0" />
        <div className="relative w-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.1)', flex: 1 }}>
          <motion.div
            className="w-full rounded-full absolute bottom-0 left-0 right-0"
            style={{ background: 'white' }}
            animate={{ height: `${brightPct * 100}%` }}
            transition={{ duration: 0.1 }}
          />
        </div>
        <span className="text-[9px] font-bold text-white">{Math.round(brightPct * 100)}%</span>
      </motion.div>

      {/* Volume slider (right) */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5 }}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-11 rounded-2xl flex flex-col items-center py-3 gap-2 z-30"
        style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.12)', height: 160 }}
      >
        <Volume2 size={14} style={{ color: '#FF2D55' }} className="flex-shrink-0" />
        <div className="relative w-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.1)', flex: 1 }}>
          <motion.div
            className="w-full rounded-full absolute bottom-0 left-0 right-0"
            style={{ background: '#FF2D55', boxShadow: '0 0 8px rgba(255,45,85,0.6)' }}
            animate={{ height: `${volPct * 100}%` }}
            transition={{ duration: 0.1 }}
          />
        </div>
        <span className="text-[9px] font-bold" style={{ color: '#FF2D55' }}>{Math.round(volPct * 100)}%</span>
      </motion.div>

      {/* Swipe hint */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="absolute left-1/2 -translate-x-1/2 z-30"
        style={{ top: '45%' }}
      >
        <div className="flex flex-col items-center gap-1.5">
          <div className="px-3 py-1.5 rounded-xl text-[11px] font-semibold text-white" style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)' }}>
            Swipe up/down
          </div>
        </div>
      </motion.div>

      <PlayerControls currentTime="03:20" totalTime="18:30" progress={0.31} />
    </motion.div>
  );
}

// ── SMART SORT SCENE ──────────────────────────────────────────────────────────
function SmartSortScene() {
  const sorts = ['All', 'Long Videos', 'Recent', '4K Only', '🤖 AI Sort'];
  const [activePill, setActivePill] = useState(1);

  useEffect(() => {
    let idx = 1;
    const t = setInterval(() => {
      idx = idx >= sorts.length - 1 ? 1 : idx + 1;
      setActivePill(idx);
    }, 1500);
    return () => clearInterval(t);
  }, []);

  const videos = [
    { color: 'from-indigo-900 to-slate-900', title: 'Mountain_Trip.mp4', time: '12:04', res: '4K' },
    { color: 'from-rose-900 to-red-900', title: 'Concert_Night.mp4', time: '45:10', res: '1080p' },
    { color: 'from-cyan-900 to-blue-900', title: 'Drone_Footage.mp4', time: '18:30', res: '4K' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, filter: 'blur(12px)' }}
      animate={{ opacity: 1, filter: 'blur(0px)' }}
      exit={{ opacity: 0, filter: 'blur(12px)' }}
      transition={{ duration: 0.5 }}
      className="w-full h-full flex flex-col pt-10"
      style={{ background: '#0A0A0A' }}
    >
      {/* Header */}
      <div className="px-5 pt-4 pb-3">
        <div className="flex items-center justify-between mb-1">
          <span className="text-base font-bold text-white">Library</span>
          <div className="flex gap-2">
            <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center">
              <Plus size={13} className="text-white" />
            </div>
          </div>
        </div>
        <p className="text-[10px] mb-3" style={{ color: 'rgba(255,255,255,0.4)' }}>Smart Sort — filter your collection your way</p>

        {/* Sort pills */}
        <div className="flex gap-2 overflow-hidden flex-wrap gap-y-2">
          {sorts.map((s, i) => (
            <motion.div
              key={s}
              animate={{
                background: i === activePill ? '#FF2D55' : '#1C1C1C',
                color: i === activePill ? '#fff' : 'rgba(255,255,255,0.55)',
                scale: i === activePill ? 1.05 : 1,
              }}
              transition={{ duration: 0.25 }}
              className="px-3 py-1.5 rounded-full text-[10px] font-semibold"
              style={{ border: i === activePill ? 'none' : '1px solid #2A2A2A' }}
            >{s}</motion.div>
          ))}
        </div>
      </div>

      {/* Script preview */}
      <AnimatePresence>
        {activePill === sorts.length - 1 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mx-5 mb-3 rounded-xl overflow-hidden"
            style={{ background: '#141414', border: '1px solid #2A2A2A' }}
          >
            <div className="px-3 py-2">
              <p className="text-[9px] font-mono" style={{ color: '#FF2D55' }}>// AI-generated sort script</p>
              <p className="text-[9px] font-mono mt-1" style={{ color: 'rgba(255,255,255,0.7)' }}>videos.filter(v {'=> v'}.durationSecs {'>'} 600</p>
              <p className="text-[9px] font-mono" style={{ color: 'rgba(255,255,255,0.7)' }}>&& v.width {'=='} 3840)</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filtered video list */}
      <div className="flex-1 overflow-hidden px-5 space-y-2.5 relative">
        {videos.slice(0, activePill === 1 ? 2 : activePill === 4 ? 2 : 3).map((v, i) => (
          <motion.div
            key={`${activePill}-${i}`}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.07 }}
            className="flex gap-3 items-center p-2.5 rounded-xl"
            style={{ background: '#141414', border: '1px solid #1A1A1A' }}
          >
            <div className={`w-16 h-10 rounded-lg bg-gradient-to-br ${v.color} flex items-center justify-center flex-shrink-0 relative`}>
              <div style={{ width: 0, height: 0, borderLeft: '8px solid rgba(255,255,255,0.8)', borderTop: '5px solid transparent', borderBottom: '5px solid transparent', marginLeft: 1 }} />
              <div className="absolute bottom-1 right-1 text-[7px] font-bold text-white bg-black/70 px-1 rounded">{v.time}</div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[11px] font-semibold text-white truncate">{v.title}</p>
              <p className="text-[9px]" style={{ color: '#FF2D55' }}>{v.res}</p>
            </div>
          </motion.div>
        ))}
        <div className="absolute bottom-0 left-0 right-0 h-16" style={{ background: 'linear-gradient(to top, #0A0A0A, transparent)' }} />
      </div>
    </motion.div>
  );
}

// ── STATS SCENE ───────────────────────────────────────────────────────────────
function StatsScene() {
  const stats = [
    { section: 'FILE', rows: [
      { label: 'Title', value: 'Mountain_Trip.mp4', mono: false },
      { label: 'File Size', value: '1.87 GB', mono: true },
      { label: 'Format', value: 'video/mp4', mono: true },
    ]},
    { section: 'VIDEO', rows: [
      { label: 'Resolution', value: '3840 × 2160', mono: true },
      { label: 'Aspect Ratio', value: '16:9', mono: true },
      { label: 'Frame Rate', value: '60.00 fps', mono: true, accent: false },
      { label: 'Bitrate', value: '42.3 Mbps', mono: true },
      { label: 'Decoder', value: 'HW (MediaCodec)', mono: true, green: true },
    ]},
    { section: 'PLAYBACK', rows: [
      { label: 'Position', value: '04:12 / 12:04', mono: true },
      { label: 'Speed', value: '1.5×', mono: true },
      { label: 'Audio', value: 'AAC Stereo', mono: true },
    ]},
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.02 }}
      transition={{ duration: 0.5 }}
      className="w-full h-full relative"
    >
      <VideoBackground />
      <PlayerTopBar title="Mountain_Trip.mp4" showInfo />

      {/* Stats sheet */}
      <motion.div
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', damping: 22, stiffness: 180, delay: 0.3 }}
        className="absolute inset-x-3 rounded-2xl overflow-hidden z-40"
        style={{
          top: 70, bottom: 24,
          background: 'rgba(14,14,14,0.96)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.1)',
        }}
      >
        {/* Sheet header */}
        <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
          <div className="flex items-center gap-2">
            <Gauge size={14} style={{ color: '#FF2D55' }} />
            <span className="text-[12px] font-bold text-white tracking-widest uppercase">Video Info</span>
          </div>
          <X size={14} style={{ color: 'rgba(255,255,255,0.5)' }} />
        </div>

        {/* Stats content */}
        <div className="overflow-y-auto px-4 py-2" style={{ maxHeight: 'calc(100% - 48px)' }}>
          {stats.map((section, si) => (
            <div key={si}>
              <p className="text-[8px] font-bold tracking-[0.15em] mt-3 mb-1.5" style={{ color: 'rgba(255,255,255,0.3)' }}>
                {section.section}
              </p>
              {section.rows.map((row, ri) => (
                <motion.div
                  key={ri}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + si * 0.1 + ri * 0.05 }}
                  className="flex justify-between items-center py-1.5 border-b"
                  style={{ borderColor: 'rgba(255,255,255,0.04)' }}
                >
                  <span className="text-[10px]" style={{ color: 'rgba(255,255,255,0.45)' }}>{row.label}</span>
                  <span
                    className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${row.mono ? 'font-mono' : ''}`}
                    style={{
                      color: row.green ? '#34d399' : 'rgba(255,255,255,0.9)',
                      background: row.green ? 'rgba(52,211,153,0.12)' : 'rgba(255,255,255,0.06)',
                    }}
                  >
                    {row.value}
                  </span>
                </motion.div>
              ))}
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── SUBTITLE SCENE ────────────────────────────────────────────────────────────
function SubtitleScene() {
  const lines = [
    'She knew it was over',
    'from the moment it began.',
    'But she stayed anyway.',
  ];
  const [lineIdx, setLineIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setLineIdx(p => (p + 1) % lines.length), 2000);
    return () => clearInterval(t);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.02 }}
      transition={{ duration: 0.5 }}
      className="w-full h-full relative"
    >
      <VideoBackground />
      <PlayerTopBar title="Concert_Night.mp4" showCC />

      {/* CC active badge */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4 }}
        className="absolute top-16 right-4 z-30 flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl"
        style={{ background: 'rgba(255,45,85,0.2)', border: '1px solid rgba(255,45,85,0.4)', backdropFilter: 'blur(8px)' }}
      >
        <Captions size={11} style={{ color: '#FF2D55' }} />
        <span className="text-[9px] font-semibold" style={{ color: '#FF2D55' }}>CC Active</span>
      </motion.div>

      {/* Subtitle overlay */}
      <div className="absolute bottom-32 left-0 right-0 flex justify-center px-6 z-30">
        <AnimatePresence mode="wait">
          <motion.div
            key={lineIdx}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.35 }}
            className="text-center px-4 py-2 rounded-xl"
            style={{ background: 'rgba(0,0,0,0.82)', backdropFilter: 'blur(8px)' }}
          >
            <span className="text-sm font-semibold text-white leading-relaxed" style={{ textShadow: '0 1px 4px rgba(0,0,0,0.9)' }}>
              {lines[lineIdx]}
            </span>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* "Saved" badge */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.6 }}
        className="absolute top-16 left-4 z-30 flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl"
        style={{ background: 'rgba(52,211,153,0.15)', border: '1px solid rgba(52,211,153,0.3)' }}
      >
        <span className="text-[9px] font-semibold" style={{ color: '#34d399' }}>✓ Saved forever</span>
      </motion.div>

      <PlayerControls currentTime="18:44" totalTime="45:10" progress={0.42} showCC />
    </motion.div>
  );
}

// ── Tap finger cursor ─────────────────────────────────────────────────────────
function TapFinger({ side }: { side: 'left' | 'right' | null }) {
  if (!side) return null;
  return (
    <motion.div
      className="absolute z-50 pointer-events-none"
      style={{ top: '45%', [side]: '20%' }}
      initial={{ scale: 0.5, opacity: 0 }}
      animate={{ scale: [0.8, 0.65, 0.8], opacity: [0, 1, 0] }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <div className="w-7 h-7 rounded-full bg-white/80 border-2 border-white shadow-[0_4px_16px_rgba(0,0,0,0.5)]" />
    </motion.div>
  );
}

function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
