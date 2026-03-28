import { motion, AnimatePresence } from 'framer-motion';
import { Play, Settings, MoreVertical, Volume2, Sun, Info, SkipForward, SkipBack, Pause } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function PhoneMockup({ currentScene }: { currentScene: number }) {
  const isVisible = currentScene > 0 && currentScene < 6;

  return (
    <motion.div
      initial={{ x: '50vw', opacity: 0, rotateY: 20, scale: 0.9 }}
      animate={{
        x: isVisible ? '0vw' : '50vw',
        y: isVisible ? [0, -10, 0] : 0,
        opacity: isVisible ? 1 : 0,
        rotateY: isVisible ? 0 : 20,
        scale: isVisible ? 1 : 0.9,
      }}
      transition={{
        x: { type: 'spring', stiffness: 70, damping: 20 },
        y: { repeat: Infinity, duration: 6, ease: 'easeInOut' },
        opacity: { duration: 0.6 },
        rotateY: { type: 'spring', stiffness: 70, damping: 20 },
        scale: { type: 'spring', stiffness: 70, damping: 20 }
      }}
      className="relative w-[340px] h-[720px] bg-black rounded-[56px] border-[10px] border-neutral-900 shadow-[0_20px_60px_rgba(0,0,0,0.8),_0_0_80px_rgba(0,122,255,0.15)] overflow-hidden"
      style={{ perspective: '1000px' }}
    >
      <div className="absolute inset-0 rounded-[46px] border border-white/10 pointer-events-none z-50"></div>
      <div className="absolute top-0 left-4 right-4 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent z-50"></div>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120px] h-[30px] bg-neutral-900 rounded-b-3xl z-[60] flex items-center justify-center">
        <div className="w-16 h-4 bg-black rounded-full shadow-inner flex items-center justify-end px-2">
          <div className="w-2 h-2 rounded-full bg-white/10 border border-white/5"></div>
        </div>
      </div>
      <div className="w-full h-full relative bg-play-bg">
        <AnimatePresence mode="wait">
          {currentScene === 1 && <LibraryScreen key="lib" />}
          {currentScene >= 2 && currentScene <= 5 && <PlayerScreen key="player" currentScene={currentScene} />}
        </AnimatePresence>
        <TapCursor currentScene={currentScene} />
      </div>
    </motion.div>
  );
}

function LibraryScreen() {
  const thumbnails = [
    { color: 'bg-gradient-to-br from-indigo-900 to-slate-900', title: 'Mountain_Trip.mp4', time: '12:04' },
    { color: 'bg-gradient-to-br from-emerald-900 to-teal-900', title: 'Tutorial_v2.mkv', time: '05:22' },
    { color: 'bg-gradient-to-br from-rose-900 to-red-900', title: 'Concert_Night.mp4', time: '45:10' },
    { color: 'bg-gradient-to-br from-amber-900 to-orange-900', title: 'Dog_Park.mov', time: '02:15' },
    { color: 'bg-gradient-to-br from-cyan-900 to-blue-900', title: 'Drone_Footage.mp4', time: '18:30' },
    { color: 'bg-gradient-to-br from-fuchsia-900 to-pink-900', title: 'Birthday_Party.mp4', time: '10:00' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, filter: 'blur(10px)' }}
      animate={{ opacity: 1, filter: 'blur(0px)' }}
      exit={{ opacity: 0, filter: 'blur(10px)' }}
      transition={{ duration: 0.5 }}
      className="w-full h-full flex flex-col p-5 pt-14"
    >
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-play-accent flex items-center justify-center">
            <Play size={16} fill="white" className="ml-0.5" />
          </div>
          <span className="font-display font-bold text-xl tracking-tight">Play</span>
        </div>
        <Settings size={22} className="text-gray-400" />
      </div>
      <div className="space-y-4 overflow-hidden flex-1 relative">
        {thumbnails.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 + i * 0.1, type: 'spring', stiffness: 100 }}
            className="flex items-center gap-4 p-3 rounded-2xl bg-play-card/50 border border-white/5"
          >
            <div className={`w-[100px] h-[64px] rounded-xl ${item.color} relative overflow-hidden shadow-inner`}>
              <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
                <Play size={20} fill="white" className="opacity-70" />
              </div>
              <span className="absolute bottom-1.5 right-1.5 text-[10px] font-medium bg-black/70 px-1.5 py-0.5 rounded-md backdrop-blur-sm">{item.time}</span>
            </div>
            <div className="flex-1">
              <h4 className="text-[15px] font-medium text-white mb-1 truncate">{item.title}</h4>
              <p className="text-xs text-gray-500">1080p • 60fps</p>
            </div>
            <MoreVertical size={18} className="text-gray-600" />
          </motion.div>
        ))}
        <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-play-bg to-transparent pointer-events-none" />
      </div>
    </motion.div>
  );
}

function PlayerScreen({ currentScene }: { currentScene: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.5 }}
      className="w-full h-full relative bg-black flex items-center justify-center overflow-hidden"
    >
      <motion.div
        className="absolute inset-[-50%] bg-gradient-to-tr from-indigo-950 via-slate-900 to-black"
        animate={{ rotate: 360, scale: [1, 1.1, 1] }}
        transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
      >
        <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, white 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      </motion.div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-transparent to-black/80" />
      <motion.div
        className="absolute inset-0 flex flex-col justify-between p-5 pt-12 z-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <div className="flex justify-between items-center text-white drop-shadow-lg">
          <span className="text-[15px] font-medium tracking-wide">Mountain_Trip.mp4</span>
          <MoreVertical size={22} />
        </div>
        <div className="flex justify-center items-center gap-8 mb-4">
          <SkipBack size={28} className="text-white drop-shadow-lg opacity-80" />
          <div className="w-20 h-20 rounded-full bg-black/40 backdrop-blur-xl border border-white/10 flex items-center justify-center shadow-2xl">
            <Pause size={32} fill="white" />
          </div>
          <SkipForward size={28} className="text-white drop-shadow-lg opacity-80" />
        </div>
        <div className="space-y-3 pb-6">
          <div className="flex justify-between text-[11px] text-white/80 font-mono tracking-wider drop-shadow-md">
            <span>04:12</span>
            <span>12:04</span>
          </div>
          <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden backdrop-blur-sm">
            <motion.div
              className="h-full bg-play-accent rounded-full relative"
              initial={{ width: '30%' }}
              animate={{ width: currentScene >= 2 ? '40%' : '30%' }}
              transition={{ duration: 12, ease: 'linear' }}
            >
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
            </motion.div>
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {currentScene === 2 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, filter: 'blur(10px)' }} className="absolute right-0 top-0 bottom-0 w-32 flex items-center justify-center z-30">
            <motion.div
              animate={{ opacity: [0, 1, 0], scale: [0.8, 1.2, 1.5] }}
              transition={{ duration: 0.8, repeat: Infinity, repeatDelay: 1.2 }}
              className="w-24 h-24 rounded-full bg-white/10 flex flex-col items-center justify-center backdrop-blur-sm border border-white/20"
            >
              <SkipForward size={24} className="text-white" />
              <span className="text-[11px] font-bold mt-1 text-white">+10s</span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {currentScene === 3 && (
          <>
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="absolute left-5 top-1/2 -translate-y-1/2 w-10 h-40 bg-black/60 backdrop-blur-xl rounded-full flex flex-col items-center py-3 border border-white/10 z-30">
              <Sun size={16} className="text-white mb-2" />
              <div className="flex-1 w-2 bg-white/10 rounded-full flex flex-col justify-end overflow-hidden">
                <motion.div className="w-full bg-white rounded-full" initial={{ height: '30%' }} animate={{ height: '80%' }} transition={{ duration: 1.5, ease: 'easeInOut', repeat: Infinity, repeatType: 'reverse' }} />
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="absolute right-5 top-1/2 -translate-y-1/2 w-10 h-40 bg-black/60 backdrop-blur-xl rounded-full flex flex-col items-center py-3 border border-white/10 z-30">
              <Volume2 size={16} className="text-white mb-2" />
              <div className="flex-1 w-2 bg-white/10 rounded-full flex flex-col justify-end overflow-hidden">
                <motion.div className="w-full bg-play-accent rounded-full shadow-[0_0_10px_rgba(0,122,255,0.8)]" initial={{ height: '40%' }} animate={{ height: '90%' }} transition={{ duration: 1.5, delay: 0.5, ease: 'easeInOut', repeat: Infinity, repeatType: 'reverse' }} />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {currentScene === 4 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="absolute bottom-28 left-0 w-full flex justify-center z-30">
            <div className="bg-black/80 backdrop-blur-md px-4 py-2 rounded-xl text-center max-w-[85%] border border-white/5 shadow-2xl">
              <p className="text-[15px] font-medium text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">Look at that view...</p>
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="text-[13px] text-yellow-400 font-medium mt-0.5 drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">It's breathtaking.</motion.p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {currentScene === 5 && (
          <motion.div initial={{ opacity: 0, scale: 0.9, y: -20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ type: 'spring', damping: 20 }} className="absolute top-20 right-5 bg-black/85 backdrop-blur-xl border border-white/10 rounded-2xl p-4 w-56 shadow-[0_20px_40px_rgba(0,0,0,0.5)] z-40">
            <div className="flex items-center gap-2 mb-3 border-b border-white/10 pb-3">
              <Info size={16} className="text-play-accent" />
              <span className="text-[13px] font-bold text-white tracking-wide uppercase">Playback Stats</span>
            </div>
            <div className="space-y-2 text-[11px] font-mono text-gray-400">
              <div className="flex justify-between items-center"><span className="text-gray-500">Resolution</span><span className="text-white bg-white/10 px-1.5 py-0.5 rounded">1920x1080</span></div>
              <div className="flex justify-between items-center"><span className="text-gray-500">Framerate</span><span className="text-white">60.00 fps</span></div>
              <div className="flex justify-between items-center"><span className="text-gray-500">Bitrate</span><span className="text-white">8.2 Mbps</span></div>
              <div className="flex justify-between items-center"><span className="text-gray-500">Decoder</span><span className="text-emerald-400 bg-emerald-400/10 px-1.5 py-0.5 rounded">HW (MediaCodec)</span></div>
              <div className="flex justify-between items-center"><span className="text-gray-500">Audio</span><span className="text-white">AAC Stereo</span></div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function TapCursor({ currentScene }: { currentScene: number }) {
  const positions: Record<number, { x: number; y: number; tapping?: boolean; swipe?: string }> = {
    1: { x: 170, y: 170, tapping: true },
    2: { x: 260, y: 360, tapping: true },
    3: { x: 60, y: 450, swipe: 'up' },
    4: { x: -100, y: -100 },
    5: { x: -100, y: -100 },
  };

  const pos = positions[currentScene] || { x: -100, y: -100 };
  const [isTapping, setIsTapping] = useState(false);
  const [swipeOffset, setSwipeOffset] = useState(0);

  useEffect(() => {
    setIsTapping(false);
    setSwipeOffset(0);

    if (pos.tapping) {
      const t = setInterval(() => {
        setIsTapping(true);
        setTimeout(() => setIsTapping(false), 400);
      }, 2000);
      return () => clearInterval(t);
    }
    if (pos.swipe) {
      const t = setInterval(() => {
        setSwipeOffset(0);
        setIsTapping(true);
        setTimeout(() => {
          setSwipeOffset(-120);
          setTimeout(() => setIsTapping(false), 800);
        }, 300);
      }, 2500);
      return () => clearInterval(t);
    }
  }, [currentScene, pos.tapping, pos.swipe]);

  if (pos.x < 0) return null;

  return (
    <motion.div
      className="absolute z-[100] pointer-events-none"
      animate={{ x: pos.x, y: pos.y + swipeOffset }}
      transition={{ x: { type: 'spring', stiffness: 80, damping: 15 }, y: { duration: pos.swipe ? 0.8 : 0.5, ease: 'easeOut' } }}
    >
      <motion.div
        className="w-6 h-6 bg-white/90 backdrop-blur-sm rounded-full shadow-[0_4px_12px_rgba(0,0,0,0.4)] border-2 border-white"
        animate={{ scale: isTapping ? 0.7 : 1 }}
        transition={{ duration: 0.15 }}
      />
      <AnimatePresence>
        {isTapping && (
          <motion.div
            initial={{ opacity: 1, scale: 1 }}
            animate={{ opacity: 0, scale: 3.5 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="absolute top-0 left-0 w-6 h-6 border-2 border-play-accent rounded-full bg-play-accent/20"
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
