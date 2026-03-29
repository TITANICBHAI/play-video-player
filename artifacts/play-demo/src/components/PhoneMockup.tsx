import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft, Search, Plus, Info, Settings, MoreVertical,
  Volume2, Gauge, X, Film, Captions, Pause, SkipForward, SkipBack,
  Maximize2, Cast,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import AppIcon from './AppIcon';

export default function PhoneMockup({ phoneScene }: { phoneScene: string }) {
  return (
    <motion.div
      key={phoneScene}
      initial={{ x: 60, opacity: 0, rotateY: 12, scale: 0.93 }}
      animate={{ x: 0, opacity: 1, rotateY: 0, scale: 1, y: [0, -7, 0] }}
      exit={{ x: -50, opacity: 0, scale: 0.95 }}
      transition={{
        x: { type: 'spring', stiffness: 80, damping: 18 },
        y: { repeat: Infinity, duration: 5, ease: 'easeInOut', delay: 0.6 },
        opacity: { duration: 0.45 },
        rotateY: { type: 'spring', stiffness: 80, damping: 18 },
        scale: { type: 'spring', stiffness: 80, damping: 18 },
      }}
      className="relative rounded-[52px] border-[10px] border-neutral-800 overflow-hidden"
      style={{
        width: 310, height: 660,
        background: '#0A0A0A',
        boxShadow: '0 30px 80px rgba(0,0,0,0.9), 0 0 50px rgba(255,45,85,0.1)',
        perspective: '1000px',
      }}
    >
      {/* Glare */}
      <div className="absolute inset-0 rounded-[42px] border border-white/8 pointer-events-none z-50" />
      <div className="absolute top-0 left-4 right-4 h-px z-50" style={{ background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.12), transparent)' }} />
      {/* Notch */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 z-[60] flex items-center justify-center" style={{ width: 110, height: 26, background: '#171717', borderRadius: '0 0 18px 18px' }}>
        <div style={{ width: 50, height: 12, background: '#0a0a0a', borderRadius: 8 }} />
      </div>

      <div className="w-full h-full overflow-hidden" style={{ background: '#0A0A0A' }}>
        <AnimatePresence mode="wait">
          {phoneScene === 'home' && <HomeScreen key="home" />}
          {phoneScene === 'chromecast' && <ChromecastScene key="cast" />}
          {phoneScene === 'stats' && <StatsScene key="stats" />}
          {phoneScene === 'smartsort' && <SmartSortScene key="ss" />}
          {phoneScene === 'subtitles' && <SubtitleScene key="sub" />}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

// ── VIDEO BACKGROUND ─────────────────────────────────────────────────────────
function VideoBackground() {
  return (
    <>
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-indigo-950 to-black" />
      <div
        className="absolute inset-0"
        style={{ background: 'radial-gradient(ellipse at 35% 40%, rgba(99,102,241,0.35) 0%, transparent 55%)' }}
      />
    </>
  );
}

// ── PLAYER TOP BAR ──────────────────────────────────────────────────────────
function PlayerTopBar({ title = 'Mountain_Trip.mp4', castActive = false, ccActive = false, showInfo = false }) {
  return (
    <motion.div
      className="absolute top-0 left-0 right-0 pt-8 px-4 pb-5 z-30 flex items-center justify-between"
      style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.88) 0%, transparent 100%)' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2 }}
    >
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-full bg-black/40 border border-white/10 flex items-center justify-center">
          <ChevronLeft size={13} className="text-white" />
        </div>
        <div>
          <p className="text-[11px] font-semibold text-white truncate" style={{ maxWidth: 150 }}>{title}</p>
          <p className="text-[9px]" style={{ color: 'rgba(255,255,255,0.45)' }}>Local File</p>
        </div>
      </div>
      <div className="flex items-center gap-2.5">
        {ccActive && <Captions size={15} style={{ color: '#FF2D55' }} />}
        {showInfo && <Info size={14} style={{ color: 'rgba(255,255,255,0.7)' }} />}
        <Cast size={15} style={{ color: castActive ? '#FF2D55' : 'rgba(255,255,255,0.65)' }} />
        <Settings size={14} style={{ color: 'rgba(255,255,255,0.65)' }} />
      </div>
    </motion.div>
  );
}

// ── PLAYER CONTROLS BAR ─────────────────────────────────────────────────────
function PlayerControls({ progress = 0.32, currentTime = '02:48', totalTime = '12:04' }) {
  return (
    <motion.div
      className="absolute bottom-0 left-0 right-0 pb-5 px-4 z-30"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3 }}
    >
      <div className="absolute bottom-0 left-0 right-0 h-48" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, transparent 100%)' }} />
      <div className="relative z-10 space-y-2.5">
        <div className="space-y-1.5">
          <div className="flex justify-between font-mono text-[10px]" style={{ color: 'rgba(255,255,255,0.65)' }}>
            <span>{currentTime}</span><span>{totalTime}</span>
          </div>
          <div className="relative w-full h-1.5 rounded-full overflow-visible" style={{ background: 'rgba(255,255,255,0.18)' }}>
            <div className="absolute left-0 top-0 h-full rounded-full" style={{ width: '52%', background: 'rgba(255,255,255,0.15)' }} />
            <motion.div
              className="absolute top-0 left-0 h-full rounded-full"
              style={{ background: '#FF2D55', width: `${progress * 100}%` }}
              animate={{ width: `${(progress + 0.06) * 100}%` }}
              transition={{ duration: 8, ease: 'linear' }}
            />
            <motion.div
              className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full shadow-[0_0_8px_rgba(255,255,255,0.7)]"
              style={{ left: `${progress * 100}%`, background: 'white' }}
              animate={{ left: `${(progress + 0.06) * 100}%` }}
              transition={{ duration: 8, ease: 'linear' }}
            />
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Volume2 size={14} style={{ color: 'rgba(255,255,255,0.75)' }} />
            <span className="text-[9px] font-medium" style={{ color: 'rgba(255,255,255,0.5)' }}>1.0×</span>
          </div>
          <div className="flex items-center gap-4">
            <SkipBack size={18} style={{ color: 'rgba(255,255,255,0.85)' }} />
            <div className="w-11 h-11 rounded-full border border-white/15 flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(8px)' }}>
              <Pause size={16} fill="white" className="text-white" />
            </div>
            <SkipForward size={18} style={{ color: 'rgba(255,255,255,0.85)' }} />
          </div>
          <Maximize2 size={14} style={{ color: 'rgba(255,255,255,0.75)' }} />
        </div>
      </div>
    </motion.div>
  );
}

// ── HOME SCREEN ─────────────────────────────────────────────────────────────
function HomeScreen() {
  const videos = [
    { gradient: 'from-indigo-900 to-slate-900', emoji: '🏔', title: 'Mountain_Trip.mp4', time: '12:04', badge: '4K' },
    { gradient: 'from-emerald-900 to-teal-900', emoji: '📚', title: 'Tutorial_Final_v3.mkv', time: '05:22', badge: '1080p' },
    { gradient: 'from-rose-900 to-red-900', emoji: '🎸', title: 'Concert_Night.mp4', time: '45:10', badge: '1080p' },
    { gradient: 'from-amber-900 to-orange-900', emoji: '🐕', title: 'Dog_Park_Sunday.mov', time: '02:15', badge: '4K' },
    { gradient: 'from-cyan-900 to-blue-900', emoji: '🚁', title: 'Drone_Footage.mp4', time: '18:30', badge: '4K' },
  ];
  const cats = ['All', 'Recent', 'Action', 'Tutorial'];

  return (
    <motion.div
      initial={{ opacity: 0, filter: 'blur(12px)' }}
      animate={{ opacity: 1, filter: 'blur(0px)' }}
      exit={{ opacity: 0, filter: 'blur(12px)' }}
      transition={{ duration: 0.45 }}
      className="w-full h-full flex flex-col pt-9"
      style={{ background: '#0A0A0A' }}
    >
      <div className="px-4 pt-3 pb-2">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-0.5">
            {['P','L','A'].map((l, i) => (
              <span key={i} style={{ color: '#FF2D55', fontWeight: 800, fontSize: 18, letterSpacing: 3 }}>{l}</span>
            ))}
            <motion.span
              style={{ color: '#FF2D55', fontWeight: 800, fontSize: 18, letterSpacing: 3 }}
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 0.9, repeat: Infinity, repeatDelay: 1.8 }}
            >Y</motion.span>
          </div>
          <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: '#FF2D55' }}>
            <Plus size={14} className="text-white" />
          </div>
        </div>
        <div className="flex items-center gap-2 rounded-xl px-3 py-2 border" style={{ background: '#1C1C1C', borderColor: '#2A2A2A' }}>
          <Search size={12} style={{ color: 'rgba(255,255,255,0.4)' }} />
          <span className="text-[11px]" style={{ color: 'rgba(255,255,255,0.28)' }}>Search videos...</span>
        </div>
      </div>
      <div className="px-4 pb-2 flex gap-2">
        {cats.map((c, i) => (
          <motion.div
            key={c}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.08 + i * 0.06 }}
            className="px-3 py-1.5 rounded-full text-[10px] font-bold flex-shrink-0"
            style={{
              background: c === 'All' ? '#FF2D55' : '#1C1C1C',
              color: c === 'All' ? '#fff' : 'rgba(255,255,255,0.55)',
              border: c === 'All' ? 'none' : '1px solid #2A2A2A',
            }}
          >{c}</motion.div>
        ))}
      </div>
      <div className="flex-1 overflow-hidden px-4 space-y-2.5 relative">
        {videos.map((v, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12 + i * 0.08, type: 'spring', stiffness: 120 }}
          >
            <div className={`w-full rounded-xl bg-gradient-to-br ${v.gradient} relative overflow-hidden`} style={{ height: 90 }}>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-3xl opacity-25">{v.emoji}</span>
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-8 h-8 rounded-full bg-black/40 border border-white/20 flex items-center justify-center">
                  <div style={{ width: 0, height: 0, borderLeft: '8px solid white', borderTop: '5px solid transparent', borderBottom: '5px solid transparent', marginLeft: 2 }} />
                </div>
              </div>
              <div className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded text-[9px] font-bold text-white" style={{ background: 'rgba(0,0,0,0.8)' }}>{v.time}</div>
              <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded text-[8px] font-bold text-white" style={{ background: 'rgba(255,45,85,0.9)' }}>{v.badge}</div>
            </div>
            <div className="flex items-center gap-2 mt-1.5 px-0.5">
              <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(255,45,85,0.18)' }}>
                <Film size={10} style={{ color: '#FF2D55' }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-semibold text-white truncate">{v.title}</p>
              </div>
              <MoreVertical size={12} style={{ color: 'rgba(255,255,255,0.3)' }} />
            </div>
          </motion.div>
        ))}
        <div className="absolute bottom-0 left-0 right-0 h-14" style={{ background: 'linear-gradient(to top, #0A0A0A, transparent)' }} />
      </div>
    </motion.div>
  );
}

// ── CHROMECAST SCENE ─────────────────────────────────────────────────────────
function ChromecastScene() {
  const [phase, setPhase] = useState<'idle' | 'tapping' | 'connecting' | 'casting'>('idle');

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('tapping'), 800);
    const t2 = setTimeout(() => setPhase('connecting'), 1400);
    const t3 = setTimeout(() => setPhase('casting'), 2800);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.02 }}
      transition={{ duration: 0.45 }}
      className="w-full h-full relative"
    >
      <VideoBackground />
      <PlayerTopBar title="Mountain_Trip.mp4" castActive={phase === 'casting'} />

      {/* Cast tap animation */}
      <AnimatePresence>
        {phase === 'tapping' && (
          <motion.div
            key="tap"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: [0, 1, 0], scale: [0.5, 1.8, 2.5] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="absolute z-50 rounded-full border-2"
            style={{ width: 32, height: 32, top: 30, right: 56, borderColor: '#FF2D55', background: 'rgba(255,45,85,0.15)' }}
          />
        )}
      </AnimatePresence>

      {/* Connecting overlay */}
      <AnimatePresence>
        {phase === 'connecting' && (
          <motion.div
            key="conn"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.35 }}
            className="absolute inset-x-5 rounded-2xl z-40 px-4 py-3 flex flex-col items-center gap-2"
            style={{ top: '30%', background: 'rgba(14,14,14,0.92)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.1)' }}
          >
            <div className="flex items-center gap-2.5">
              <motion.div
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                <Cast size={18} style={{ color: '#FF2D55' }} />
              </motion.div>
              <span className="text-sm font-semibold text-white">Finding devices...</span>
            </div>
            <div className="w-full space-y-2">
              {['Living Room TV', 'Bedroom TV'].map((device, i) => (
                <motion.div
                  key={device}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + i * 0.2 }}
                  className="flex items-center justify-between px-3 py-2 rounded-xl"
                  style={{ background: i === 0 ? 'rgba(255,45,85,0.15)' : 'rgba(255,255,255,0.05)', border: i === 0 ? '1px solid rgba(255,45,85,0.3)' : '1px solid rgba(255,255,255,0.06)' }}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.08)' }}>
                      <span className="text-[10px]">📺</span>
                    </div>
                    <span className="text-[11px] font-medium text-white">{device}</span>
                  </div>
                  {i === 0 && <span className="text-[9px] font-semibold" style={{ color: '#FF2D55' }}>SELECT</span>}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Casting active state */}
      <AnimatePresence>
        {phase === 'casting' && (
          <motion.div
            key="active"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ type: 'spring', damping: 20 }}
            className="absolute z-40 px-4 py-3 rounded-2xl flex flex-col items-center gap-1.5"
            style={{
              left: 16, right: 16, top: '35%',
              background: 'rgba(14,14,14,0.9)',
              backdropFilter: 'blur(16px)',
              border: '1px solid rgba(255,45,85,0.25)',
            }}
          >
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.9)]" />
              <span className="text-[11px] font-bold text-green-400 tracking-wide">NOW CASTING</span>
            </div>
            <p className="text-xs font-semibold text-white">Living Room TV</p>
            <p className="text-[10px]" style={{ color: 'rgba(255,255,255,0.45)' }}>Video continues on your TV</p>
            <div className="flex gap-2 mt-1">
              <div className="px-3 py-1.5 rounded-full text-[10px] font-semibold text-white" style={{ background: 'rgba(255,255,255,0.1)' }}>Pause</div>
              <div className="px-3 py-1.5 rounded-full text-[10px] font-semibold" style={{ background: 'rgba(255,45,85,0.2)', color: '#FF2D55' }}>Stop Cast</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <PlayerControls progress={0.14} currentTime="01:24" totalTime="12:04" />
    </motion.div>
  );
}

// ── STATS SCENE ─────────────────────────────────────────────────────────────
function StatsScene() {
  const sections = [
    {
      label: 'FILE',
      rows: [
        { k: 'Title', v: 'Mountain_Trip.mp4' },
        { k: 'File Size', v: '1.87 GB', mono: true },
        { k: 'Format', v: 'video/mp4', mono: true },
      ]
    },
    {
      label: 'VIDEO',
      rows: [
        { k: 'Resolution', v: '3840 × 2160', mono: true },
        { k: 'Frame Rate', v: '60.00 fps', mono: true },
        { k: 'Bitrate', v: '42.3 Mbps', mono: true },
        { k: 'Decoder', v: 'HW (MediaCodec)', mono: true, green: true },
      ]
    },
    {
      label: 'PLAYBACK',
      rows: [
        { k: 'Position', v: '04:12 / 12:04', mono: true },
        { k: 'Speed', v: '1.5×', mono: true },
        { k: 'Audio', v: 'AAC Stereo', mono: true },
      ]
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.02 }}
      transition={{ duration: 0.45 }}
      className="w-full h-full relative"
    >
      <VideoBackground />
      <PlayerTopBar title="Mountain_Trip.mp4" showInfo />

      {/* Stats sheet */}
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', damping: 22, stiffness: 200, delay: 0.3 }}
        className="absolute inset-x-3 rounded-2xl overflow-hidden z-40"
        style={{
          top: 65, bottom: 20,
          background: 'rgba(12,12,12,0.97)',
          backdropFilter: 'blur(24px)',
          border: '1px solid rgba(255,255,255,0.1)',
        }}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: 'rgba(255,255,255,0.07)' }}>
          <div className="flex items-center gap-2">
            <Gauge size={13} style={{ color: '#FF2D55' }} />
            <span className="text-[11px] font-bold text-white tracking-widest uppercase">Video Info</span>
          </div>
          <X size={13} style={{ color: 'rgba(255,255,255,0.45)' }} />
        </div>

        <div className="overflow-y-auto px-4 py-1" style={{ maxHeight: 'calc(100% - 46px)' }}>
          {sections.map((section, si) => (
            <div key={si}>
              <p className="text-[8px] font-bold tracking-[0.14em] mt-3 mb-1.5" style={{ color: 'rgba(255,255,255,0.28)' }}>
                {section.label}
              </p>
              {section.rows.map((row, ri) => (
                <motion.div
                  key={ri}
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.35 + si * 0.1 + ri * 0.05 }}
                  className="flex justify-between items-center py-1.5 border-b"
                  style={{ borderColor: 'rgba(255,255,255,0.04)' }}
                >
                  <span className="text-[10px]" style={{ color: 'rgba(255,255,255,0.42)' }}>{row.k}</span>
                  <span
                    className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${row.mono ? 'font-mono' : ''}`}
                    style={{
                      color: row.green ? '#34d399' : 'rgba(255,255,255,0.88)',
                      background: row.green ? 'rgba(52,211,153,0.12)' : 'rgba(255,255,255,0.06)',
                    }}
                  >{row.v}</span>
                </motion.div>
              ))}
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── SMART SORT SCENE ─────────────────────────────────────────────────────────
function SmartSortScene() {
  const pills = ['All', 'Long Videos', 'Recent', '4K Only', '🤖 AI Sort'];
  const [active, setActive] = useState(1);

  useEffect(() => {
    let i = 1;
    const t = setInterval(() => {
      i = i >= pills.length - 1 ? 1 : i + 1;
      setActive(i);
    }, 1400);
    return () => clearInterval(t);
  }, []);

  const videos = [
    { gradient: 'from-indigo-900 to-slate-900', title: 'Mountain_Trip.mp4', time: '12:04', badge: '4K' },
    { gradient: 'from-rose-900 to-red-900', title: 'Concert_Night.mp4', time: '45:10', badge: '1080p' },
    { gradient: 'from-cyan-900 to-blue-900', title: 'Drone_Footage.mp4', time: '18:30', badge: '4K' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, filter: 'blur(12px)' }}
      animate={{ opacity: 1, filter: 'blur(0px)' }}
      exit={{ opacity: 0, filter: 'blur(12px)' }}
      transition={{ duration: 0.45 }}
      className="w-full h-full flex flex-col pt-9"
      style={{ background: '#0A0A0A' }}
    >
      <div className="px-4 pt-3 pb-2">
        <div className="flex items-center justify-between mb-0.5">
          <span className="text-sm font-bold text-white">Library</span>
          <Plus size={16} style={{ color: 'rgba(255,255,255,0.5)' }} />
        </div>
        <p className="text-[9px] mb-3" style={{ color: 'rgba(255,255,255,0.35)' }}>Smart Sort — your rules, your filters</p>
        <div className="flex flex-wrap gap-1.5 gap-y-1.5">
          {pills.map((p, i) => (
            <motion.div
              key={p}
              animate={{
                background: i === active ? '#FF2D55' : '#1C1C1C',
                color: i === active ? '#fff' : 'rgba(255,255,255,0.5)',
                scale: i === active ? 1.04 : 1,
              }}
              transition={{ duration: 0.22 }}
              className="px-2.5 py-1 rounded-full text-[9px] font-bold"
              style={{ border: i === active ? 'none' : '1px solid #2A2A2A' }}
            >{p}</motion.div>
          ))}
        </div>
      </div>

      {/* Script preview when AI sort */}
      <AnimatePresence>
        {active === pills.length - 1 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mx-4 mb-2 rounded-xl overflow-hidden"
            style={{ background: '#141414', border: '1px solid #2A2A2A' }}
          >
            <div className="px-3 py-2">
              <p className="text-[8px] font-mono" style={{ color: '#FF2D55' }}>// AI-generated sort</p>
              <p className="text-[8px] font-mono" style={{ color: 'rgba(255,255,255,0.65)' }}>{'videos.filter(v => v.durationSecs > 600'}</p>
              <p className="text-[8px] font-mono" style={{ color: 'rgba(255,255,255,0.65)' }}>{'  && v.width === 3840)'}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex-1 overflow-hidden px-4 space-y-2 relative">
        {videos.slice(0, active === 1 ? 2 : 3).map((v, i) => (
          <motion.div
            key={`${active}-${i}`}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.06 }}
            className="flex gap-3 items-center p-2.5 rounded-xl"
            style={{ background: '#141414', border: '1px solid #1A1A1A' }}
          >
            <div className={`w-14 h-9 rounded-lg bg-gradient-to-br ${v.gradient} flex items-center justify-center flex-shrink-0 relative`}>
              <div style={{ width: 0, height: 0, borderLeft: '7px solid rgba(255,255,255,0.8)', borderTop: '4px solid transparent', borderBottom: '4px solid transparent', marginLeft: 1 }} />
              <div className="absolute bottom-1 right-1 text-[7px] font-bold text-white bg-black/70 px-0.5 rounded">{v.time}</div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-semibold text-white truncate">{v.title}</p>
              <p className="text-[9px]" style={{ color: '#FF2D55' }}>{v.badge}</p>
            </div>
          </motion.div>
        ))}
        <div className="absolute bottom-0 left-0 right-0 h-12" style={{ background: 'linear-gradient(to top, #0A0A0A, transparent)' }} />
      </div>
    </motion.div>
  );
}

// ── SUBTITLE SCENE ───────────────────────────────────────────────────────────
function SubtitleScene() {
  const lines = [
    'She knew it was over',
    'from the moment it began.',
    'But she stayed anyway.',
  ];
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setIdx(p => (p + 1) % lines.length), 1900);
    return () => clearInterval(t);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.02 }}
      transition={{ duration: 0.45 }}
      className="w-full h-full relative"
    >
      <VideoBackground />
      <PlayerTopBar title="Concert_Night.mp4" ccActive />

      {/* CC Active badge */}
      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4 }}
        className="absolute top-14 right-3 z-30 flex items-center gap-1.5 px-2 py-1 rounded-lg"
        style={{ background: 'rgba(255,45,85,0.18)', border: '1px solid rgba(255,45,85,0.35)' }}
      >
        <Captions size={10} style={{ color: '#FF2D55' }} />
        <span className="text-[8px] font-bold" style={{ color: '#FF2D55' }}>CC ON</span>
      </motion.div>

      {/* Saved badge */}
      <motion.div
        initial={{ opacity: 0, x: -14 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.6 }}
        className="absolute top-14 left-3 z-30 flex items-center gap-1 px-2 py-1 rounded-lg"
        style={{ background: 'rgba(52,211,153,0.14)', border: '1px solid rgba(52,211,153,0.28)' }}
      >
        <span className="text-[8px] font-bold" style={{ color: '#34d399' }}>✓ Saved forever</span>
      </motion.div>

      {/* Subtitle overlay */}
      <div className="absolute bottom-28 left-0 right-0 flex justify-center px-5 z-30">
        <AnimatePresence mode="wait">
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.3 }}
            className="text-center px-3 py-1.5 rounded-xl"
            style={{ background: 'rgba(0,0,0,0.82)' }}
          >
            <span className="text-[13px] font-semibold text-white" style={{ textShadow: '0 1px 4px rgba(0,0,0,0.9)' }}>
              {lines[idx]}
            </span>
          </motion.div>
        </AnimatePresence>
      </div>

      <PlayerControls progress={0.4} currentTime="18:44" totalTime="45:10" />
    </motion.div>
  );
}
