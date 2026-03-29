import { useState, useEffect, useCallback, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import PhoneMockup from './components/PhoneMockup';
import AppIcon from './components/AppIcon';

function CastTV() {
  return (
    <motion.div
      initial={{ opacity: 0, x: 40, scale: 0.88 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 30, scale: 0.9 }}
      transition={{ type: 'spring', stiffness: 90, damping: 18, delay: 1.2 }}
      className="flex flex-col items-center gap-2"
    >
      {/* TV screen */}
      <div
        className="relative rounded-2xl overflow-hidden"
        style={{ width: 320, height: 190, background: '#0a0a0a', border: '4px solid #2a2a2a', boxShadow: '0 20px 50px rgba(0,0,0,0.7), 0 0 60px rgba(255,45,85,0.08)' }}
      >
        {/* Playing content on TV */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8, duration: 0.6 }}
          className="absolute inset-0 bg-gradient-to-br from-indigo-950 via-slate-900 to-black"
        />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.0, duration: 0.5 }}
          className="absolute inset-0 flex flex-col"
        >
          {/* TV top bar */}
          <div className="flex items-center justify-between px-4 pt-3 pb-2" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.8), transparent)' }}>
            <div>
              <p className="text-white text-xs font-semibold">Mountain_Trip.mp4</p>
              <p className="text-[10px]" style={{ color: 'rgba(255,255,255,0.45)' }}>Now Playing</p>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-green-400 shadow-[0_0_6px_rgba(74,222,128,0.8)]" />
              <span className="text-[10px] text-green-400 font-semibold">CASTING</span>
            </div>
          </div>
          {/* Progress bar on TV */}
          <div className="absolute bottom-0 left-0 right-0 pb-3 px-4" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.9), transparent)' }}>
            <div className="flex justify-between text-[9px] font-mono mb-1.5" style={{ color: 'rgba(255,255,255,0.6)' }}>
              <span>01:24</span><span>12:04</span>
            </div>
            <div className="w-full h-1 rounded-full" style={{ background: 'rgba(255,255,255,0.2)' }}>
              <motion.div
                className="h-full rounded-full"
                style={{ background: '#FF2D55', width: '12%' }}
                animate={{ width: '22%' }}
                transition={{ duration: 8, ease: 'linear', delay: 2 }}
              />
            </div>
          </div>
        </motion.div>

        {/* Cast connecting overlay */}
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ delay: 1.6, duration: 0.6 }}
          className="absolute inset-0 flex flex-col items-center justify-center gap-2"
          style={{ background: 'rgba(10,10,10,0.95)' }}
        >
          <motion.div
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1.2, repeat: Infinity }}
          >
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
              <path d="M1 18C1 16.4087 1.63214 14.8826 2.75736 13.7574C3.88258 12.6321 5.4087 12 7 12" stroke="#FF2D55" strokeWidth="2" strokeLinecap="round" />
              <path d="M1 14C1 13.4747 1.10346 12.9546 1.30448 12.4693C1.5055 11.984 1.80014 11.5431 2.17157 11.1716C2.54301 10.8002 2.98396 10.5055 3.46927 10.3045C3.95457 10.1035 4.47471 10 5 10" stroke="#FF2D55" strokeWidth="2" strokeLinecap="round" />
              <path d="M1 10V6C1 5.46957 1.21071 4.96086 1.58579 4.58579C1.96086 4.21071 2.46957 4 3 4H21C21.5304 4 22.0391 4.21071 22.4142 4.58579C22.7893 4.96086 23 5.46957 23 6V18C23 18.5304 22.7893 19.0391 22.4142 19.4142C22.0391 19.7893 21.5304 20 21 20H10" stroke="#FF2D55" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="3" cy="20" r="2" fill="#FF2D55" />
            </svg>
          </motion.div>
          <p className="text-xs font-semibold" style={{ color: 'rgba(255,255,255,0.6)' }}>Connecting...</p>
        </motion.div>
      </div>

      {/* TV stand */}
      <div className="flex flex-col items-center">
        <div style={{ width: 40, height: 20, background: '#1a1a1a', borderRadius: '0 0 4px 4px' }} />
        <div style={{ width: 80, height: 5, background: '#222', borderRadius: 4 }} />
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.2 }}
        className="flex items-center gap-1.5 mt-1"
      >
        <div className="w-1.5 h-1.5 rounded-full bg-green-400 shadow-[0_0_6px_rgba(74,222,128,0.7)]" />
        <span className="text-xs font-semibold text-green-400">Playing on Living Room TV</span>
      </motion.div>
    </motion.div>
  );
}

const SCENES = [
  {
    duration: 2800,
    headline: 'Play.',
    sub: 'A video player worth loving.',
    speech: 'Introducing... Play.',
    phoneScene: 'intro',
  },
  {
    duration: 4200,
    headline: 'Your library.\nGorgeous.',
    sub: 'Every video on your device. Auto-detected.',
    speech: 'Every video on your device — automatically detected, beautifully organized.',
    phoneScene: 'home',
    badges: ['📱 Auto-scans device', '📁 Import any file', '🔍 Instant search'],
  },
  {
    duration: 5000,
    headline: 'One tap.\nOn the big screen.',
    sub: 'Cast to your TV instantly. No cables.',
    speech: 'Tap cast. Your video jumps straight to the TV. No cables. No setup. Just works.',
    phoneScene: 'chromecast',
    badges: ['📺 Chromecast support', '📶 Same Wi-Fi', '▶ Seamless handoff'],
  },
  {
    duration: 4500,
    headline: 'Hardware\ndecoded.',
    sub: '4K. 60fps. Zero stutter. Your GPU does the work.',
    speech: 'Hardware decoding. Silky smooth playback, even at 4K, sixty frames per second. Your phone\'s GPU handles everything.',
    phoneScene: 'stats',
    badges: ['⚙️ GPU accelerated', '🎬 4K 60fps', '🔋 Saves battery'],
  },
  {
    duration: 4200,
    headline: 'Smart Sort.\nYour rules.',
    sub: 'Filter your library with code — or ask AI.',
    speech: 'Smart Sort. Filter your entire collection with a single line of code — or just ask AI to write it for you.',
    phoneScene: 'smartsort',
    badges: ['✏️ Write JS filters', '🤖 AI-generated', '💾 Saved forever'],
  },
  {
    duration: 3800,
    headline: 'Subtitles.\nSaved forever.',
    sub: 'Load a .SRT file once. Never touch it again.',
    speech: 'Load a subtitle file once. Play remembers it every single time you open that video.',
    phoneScene: 'subtitles',
    badges: ['📝 .SRT support', '🔁 Auto-restored', '👁 Toggle instantly'],
  },
  {
    duration: 4000,
    headline: 'Free.\nPrivate.\nBeautiful.',
    sub: 'No ads. No tracking. Just Play.',
    speech: 'Play. Free. Private. Beautiful. Download it — it will cost you nothing.',
    phoneScene: 'outro',
  },
];

function pickBestVoice(): SpeechSynthesisVoice | null {
  const voices = window.speechSynthesis.getVoices();
  if (!voices.length) return null;
  const preferred = [
    'Google UK English Female',
    'Google UK English Male',
    'Microsoft Zira Desktop',
    'Microsoft David Desktop',
    'Karen',
    'Daniel',
    'Samantha',
  ];
  for (const name of preferred) {
    const v = voices.find(v => v.name === name);
    if (v) return v;
  }
  return voices.find(v => v.lang.startsWith('en')) ?? null;
}

function useSpeech() {
  const voiceRef = useRef<SpeechSynthesisVoice | null>(null);

  useEffect(() => {
    const load = () => { voiceRef.current = pickBestVoice(); };
    load();
    window.speechSynthesis.onvoiceschanged = load;
  }, []);

  const speak = useCallback((text: string) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.rate = 0.92;
    utter.pitch = 0.96;
    utter.volume = 1;
    const voice = voiceRef.current ?? pickBestVoice();
    if (voice) utter.voice = voice;
    window.speechSynthesis.speak(utter);
  }, []);

  return speak;
}

export default function App() {
  const [started, setStarted] = useState(false);
  const [currentScene, setCurrentScene] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const speak = useSpeech();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const startDemo = useCallback((withSound: boolean) => {
    setStarted(true);
    setSoundEnabled(withSound);
    if (withSound) {
      window.speechSynthesis.getVoices();
      setTimeout(() => speak(SCENES[0].speech), 300);
    }
  }, [speak]);

  useEffect(() => {
    if (!started) return;
    timerRef.current = setTimeout(() => {
      setCurrentScene(prev => {
        const next = (prev + 1) % SCENES.length;
        if (soundEnabled) speak(SCENES[next].speech);
        return next;
      });
    }, SCENES[currentScene].duration);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [started, currentScene, soundEnabled, speak]);

  const scene = SCENES[currentScene];
  const isCentered = scene.phoneScene === 'intro' || scene.phoneScene === 'outro';

  return (
    <div className="w-full h-screen bg-play-bg text-white overflow-hidden relative font-sans flex items-center justify-center">
      {/* Background blobs */}
      <motion.div
        className="absolute w-[55vw] h-[55vw] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(255,45,85,0.08) 0%, transparent 70%)', filter: 'blur(60px)' }}
        animate={{ x: isCentered ? '0vw' : '-12vw', y: isCentered ? '-8vh' : '4vh' }}
        transition={{ duration: 3.5, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute w-[40vw] h-[40vw] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(80,100,200,0.07) 0%, transparent 70%)', filter: 'blur(80px)' }}
        animate={{ x: isCentered ? '8vw' : '18vw', y: isCentered ? '10vh' : '-6vh' }}
        transition={{ duration: 3.5, ease: 'easeInOut' }}
      />

      {/* Splash */}
      <AnimatePresence>
        {!started && (
          <motion.div
            key="splash"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.04, filter: 'blur(18px)' }}
            transition={{ duration: 0.65 }}
            className="absolute inset-0 z-50 flex flex-col items-center justify-center gap-12 bg-play-bg"
          >
            <motion.div
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 22, delay: 0.15 }}
              className="flex flex-col items-center gap-5"
            >
              <AppIcon size={110} />
              <h1 className="text-8xl font-display font-bold tracking-tighter">Play</h1>
              <p className="text-2xl text-gray-400 font-medium">Your Videos. Your Rules.</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55 }}
              className="flex flex-col items-center gap-3"
            >
              <div className="flex gap-4">
                <button
                  onClick={() => startDemo(true)}
                  className="flex items-center gap-3 px-8 py-4 bg-play-accent hover:opacity-90 text-white font-bold text-xl rounded-2xl shadow-[0_0_40px_rgba(255,45,85,0.35)] transition-all hover:scale-[1.03] active:scale-95"
                >
                  🔊 Play with Sound
                </button>
                <button
                  onClick={() => startDemo(false)}
                  className="flex items-center gap-3 px-8 py-4 text-white font-semibold text-xl rounded-2xl transition-all hover:scale-[1.03] active:scale-95"
                  style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)' }}
                >
                  🔇 Silent
                </button>
              </div>
              <p className="text-sm text-gray-600">"Play with Sound" for the full experience — screen record this tab</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Demo */}
      {started && (
        <div className={`relative z-10 w-full max-w-[1280px] px-14 flex items-center h-full ${isCentered ? 'justify-center' : ''}`}>
          <AnimatePresence mode="wait">
            <motion.div
              key={`text-${currentScene}`}
              initial={{ opacity: 0, x: -36, filter: 'blur(6px)' }}
              animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, x: 28, filter: 'blur(6px)' }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className={`flex-1 ${isCentered ? 'text-center flex flex-col items-center' : 'pr-10'}`}
            >
              {isCentered ? (
                <>
                  {scene.phoneScene === 'intro' && (
                    <motion.div
                      initial={{ rotate: -12, scale: 0.5, opacity: 0 }}
                      animate={{ rotate: 0, scale: 1, opacity: 1 }}
                      transition={{ type: 'spring', stiffness: 200, damping: 22 }}
                      className="mb-6"
                    >
                      <AppIcon size={100} />
                    </motion.div>
                  )}
                  <h1 className="text-[90px] font-display font-bold tracking-tighter leading-none mb-5 whitespace-pre-line">
                    {scene.headline}
                  </h1>
                  <p className="text-3xl text-gray-400 font-medium">{scene.sub}</p>
                  {scene.phoneScene === 'outro' && (
                    <motion.div
                      initial={{ opacity: 0, y: 14 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.9 }}
                      className="mt-10 flex flex-col items-center gap-2"
                    >
                      <div className="h-px w-20 bg-white/15 mb-1" />
                      <p className="text-xs text-gray-600 font-semibold tracking-[0.22em] uppercase">by TB Techs · Free Download</p>
                    </motion.div>
                  )}
                </>
              ) : (
                <>
                  <h2 className="text-[68px] font-display font-bold leading-none tracking-tight mb-6 whitespace-pre-line">
                    {scene.headline}
                  </h2>
                  <motion.div
                    className="w-14 h-1.5 bg-play-accent rounded-full mb-6"
                    initial={{ scaleX: 0, originX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.45, delay: 0.28 }}
                  />
                  <p className="text-[22px] text-gray-300 font-medium leading-relaxed mb-8">
                    {scene.sub}
                  </p>
                  {scene.badges && (
                    <motion.div
                      className="flex flex-wrap gap-3"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.48 }}
                    >
                      {scene.badges.map(b => (
                        <div
                          key={b}
                          className="flex items-center gap-2 px-4 py-2 rounded-full text-sm text-gray-300 font-medium"
                          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.09)' }}
                        >
                          {b}
                        </div>
                      ))}
                    </motion.div>
                  )}
                </>
              )}
            </motion.div>
          </AnimatePresence>

          {!isCentered && (
            <div className="flex-1 flex justify-center items-center h-full gap-8">
              <PhoneMockup phoneScene={scene.phoneScene} />
              {scene.phoneScene === 'chromecast' && <CastTV />}
            </div>
          )}
        </div>
      )}

      {/* Progress dots */}
      {started && (
        <div className="absolute bottom-7 left-1/2 -translate-x-1/2 flex gap-2 z-40">
          {SCENES.map((_, i) => (
            <motion.div
              key={i}
              className="h-1.5 rounded-full"
              animate={{
                width: i === currentScene ? 26 : 7,
                background: i === currentScene ? '#FF2D55' : 'rgba(255,255,255,0.18)',
              }}
              transition={{ duration: 0.28 }}
            />
          ))}
        </div>
      )}

      {started && (
        <div className="absolute top-5 right-7 text-[11px] text-gray-700 font-medium z-40 tracking-wide">
          {soundEnabled ? '🔊' : '🔇'}
        </div>
      )}
    </div>
  );
}
