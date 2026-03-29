import { useState, useEffect, useCallback, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import PhoneMockup from './components/PhoneMockup';
import AppIcon from './components/AppIcon';

const SCENES = [
  {
    duration: 2800,
    headline: 'Play.',
    sub: 'Finally. A video player worth loving.',
    speech: 'Play. Finally. A video player worth loving.',
    phoneScene: 'intro',
  },
  {
    duration: 4200,
    headline: 'Your library.\nGorgeous.',
    sub: 'Every video on your device. Auto-detected.',
    speech: 'Your library. Gorgeous. Every video on your device — auto-detected instantly.',
    phoneScene: 'home',
  },
  {
    duration: 3800,
    headline: 'Double-tap.\nFly ahead.',
    sub: 'Skip ±10 seconds. Both sides. Lightning fast.',
    speech: 'Double tap. Fly ahead. Skip ten seconds in either direction — lightning fast.',
    phoneScene: 'doubletap',
  },
  {
    duration: 4000,
    headline: 'Swipe.\nControl it all.',
    sub: 'Left = Brightness. Right = Volume. No buttons.',
    speech: 'Swipe. Control it all. Left for brightness. Right for volume. Zero buttons needed.',
    phoneScene: 'gestures',
  },
  {
    duration: 4200,
    headline: 'Smart Sort.\nYour rules.',
    sub: 'Filter with JavaScript — or just ask ChatGPT.',
    speech: 'Smart Sort. Your rules. Filter your videos with JavaScript — or just ask ChatGPT to write it for you.',
    phoneScene: 'smartsort',
  },
  {
    duration: 4500,
    headline: 'Power stats.\nRight here.',
    sub: 'Hardware decoded. 60fps. Every technical detail.',
    speech: 'Power stats. Right here. Hardware decoded. Sixty frames per second. Every single technical detail, at a glance.',
    phoneScene: 'stats',
  },
  {
    duration: 3800,
    headline: 'Subtitles.\nSaved forever.',
    sub: 'Drop in a .SRT file once. Never again.',
    speech: 'Subtitles. Saved forever. Drop in an S.R.T. file once — we remember it every time you play.',
    phoneScene: 'subtitles',
  },
  {
    duration: 3500,
    headline: 'Free.\nPrivate.\nBeautiful.',
    sub: 'No ads. No tracking. Just Play.',
    speech: 'Free. Private. Beautiful. No ads. No tracking. Download Play — it is completely free.',
    phoneScene: 'outro',
  },
];

function useSpeech() {
  const speak = useCallback((text: string) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.rate = 1.13;
    utter.pitch = 1.08;
    utter.volume = 1;
    const voices = window.speechSynthesis.getVoices();
    const preferred = voices.find(v =>
      v.name.includes('Google') && v.lang.startsWith('en')
    ) || voices.find(v => v.lang.startsWith('en'));
    if (preferred) utter.voice = preferred;
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
      speak(SCENES[0].speech);
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
      {/* Ambient background blobs */}
      <motion.div
        className="absolute w-[50vw] h-[50vw] rounded-full bg-play-accent/10 blur-[160px] pointer-events-none"
        animate={{ x: isCentered ? '0vw' : '-15vw', y: isCentered ? '-10vh' : '5vh' }}
        transition={{ duration: 3, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute w-[35vw] h-[35vw] rounded-full bg-blue-900/20 blur-[130px] pointer-events-none"
        animate={{ x: isCentered ? '10vw' : '20vw', y: isCentered ? '10vh' : '-5vh' }}
        transition={{ duration: 3, ease: 'easeInOut' }}
      />

      {/* Splash screen */}
      <AnimatePresence>
        {!started && (
          <motion.div
            key="splash"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.05, filter: 'blur(20px)' }}
            transition={{ duration: 0.7 }}
            className="absolute inset-0 z-50 flex flex-col items-center justify-center gap-12 bg-play-bg"
          >
            <motion.div
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 180, damping: 20, delay: 0.2 }}
              className="flex flex-col items-center gap-6"
            >
              <AppIcon size={120} />
              <h1 className="text-8xl font-display font-bold tracking-tighter">Play</h1>
              <p className="text-2xl text-gray-400 font-medium tracking-wide">Your Videos. Your Rules.</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col items-center gap-4"
            >
              <div className="flex gap-4">
                <button
                  onClick={() => startDemo(true)}
                  className="flex items-center gap-3 px-8 py-4 bg-play-accent hover:bg-play-accent/90 text-white font-bold text-xl rounded-2xl shadow-[0_0_40px_rgba(255,45,85,0.4)] transition-all hover:scale-105 active:scale-95"
                >
                  <span>🔊</span> Play with Sound
                </button>
                <button
                  onClick={() => startDemo(false)}
                  className="flex items-center gap-3 px-8 py-4 bg-white/10 hover:bg-white/15 text-white font-semibold text-xl rounded-2xl border border-white/20 transition-all hover:scale-105 active:scale-95"
                >
                  🔇 Silent Mode
                </button>
              </div>
              <p className="text-sm text-gray-600">Click "Play with Sound" for the full experience</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main demo content */}
      {started && (
        <div className={`relative z-10 w-full max-w-[1280px] px-12 flex items-center h-full ${isCentered ? 'justify-center' : ''}`}>
          {/* Text side */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`text-${currentScene}`}
              initial={{ opacity: 0, x: -40, filter: 'blur(8px)' }}
              animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, x: 30, filter: 'blur(8px)' }}
              transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              className={`${isCentered ? 'text-center flex flex-col items-center' : ''} flex-1 pr-8`}
            >
              {isCentered ? (
                <>
                  {scene.phoneScene === 'intro' && (
                    <motion.div
                      initial={{ rotate: -15, scale: 0.5, opacity: 0 }}
                      animate={{ rotate: 0, scale: 1, opacity: 1 }}
                      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                      className="mb-6"
                    >
                      <AppIcon size={110} />
                    </motion.div>
                  )}
                  <h1 className="text-[88px] font-display font-bold tracking-tighter leading-none mb-6 whitespace-pre-line">
                    {scene.headline}
                  </h1>
                  <p className="text-3xl text-gray-400 font-medium">{scene.sub}</p>
                  {scene.phoneScene === 'outro' && (
                    <motion.div
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8 }}
                      className="mt-10 flex flex-col items-center gap-3"
                    >
                      <div className="h-[1px] w-24 bg-white/20 mb-2" />
                      <p className="text-sm text-gray-600 font-semibold tracking-[0.2em] uppercase">by TB Techs · Free Download</p>
                    </motion.div>
                  )}
                </>
              ) : (
                <>
                  <h2 className="text-[72px] font-display font-bold leading-none tracking-tight mb-6 whitespace-pre-line">
                    {scene.headline}
                  </h2>
                  <motion.div
                    className="w-14 h-1.5 bg-play-accent rounded-full mb-7"
                    initial={{ scaleX: 0, originX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                  />
                  <p className="text-2xl text-gray-300 font-medium leading-relaxed">
                    {scene.sub}
                  </p>

                  {/* Scene badges */}
                  <motion.div
                    className="mt-10 flex flex-wrap gap-3"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    {scene.phoneScene === 'home' && (
                      <>
                        <Badge icon="📱" text="Auto-scans device" />
                        <Badge icon="📁" text="Import any file" />
                        <Badge icon="🔍" text="Instant search" />
                      </>
                    )}
                    {scene.phoneScene === 'doubletap' && (
                      <>
                        <Badge icon="👆" text="Double-tap left/right" />
                        <Badge icon="⚡" text="Instant seek" />
                        <Badge icon="📳" text="Haptic feedback" />
                      </>
                    )}
                    {scene.phoneScene === 'gestures' && (
                      <>
                        <Badge icon="🌤" text="Swipe left: Brightness" />
                        <Badge icon="🔊" text="Swipe right: Volume" />
                        <Badge icon="🤌" text="Pinch to fill" />
                      </>
                    )}
                    {scene.phoneScene === 'smartsort' && (
                      <>
                        <Badge icon="✏️" text="Write JS filters" />
                        <Badge icon="🤖" text="AI-generated sorts" />
                        <Badge icon="💾" text="Saved forever" />
                      </>
                    )}
                    {scene.phoneScene === 'stats' && (
                      <>
                        <Badge icon="⚙️" text="Hardware decoded" />
                        <Badge icon="🎬" text="60fps detection" />
                        <Badge icon="📊" text="Live bitrate" />
                      </>
                    )}
                    {scene.phoneScene === 'subtitles' && (
                      <>
                        <Badge icon="📝" text=".SRT support" />
                        <Badge icon="🔁" text="Auto-restored" />
                        <Badge icon="👁" text="Toggle instantly" />
                      </>
                    )}
                  </motion.div>
                </>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Phone side */}
          {!isCentered && (
            <div className="flex-1 flex justify-center items-center h-full">
              <PhoneMockup phoneScene={scene.phoneScene} sceneIndex={currentScene} />
            </div>
          )}
        </div>
      )}

      {/* Scene progress dots */}
      {started && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-40">
          {SCENES.map((_, i) => (
            <motion.div
              key={i}
              className="h-1.5 rounded-full bg-white/20"
              animate={{ width: i === currentScene ? 28 : 8, backgroundColor: i === currentScene ? '#FF2D55' : 'rgba(255,255,255,0.2)' }}
              transition={{ duration: 0.3 }}
            />
          ))}
        </div>
      )}

      {/* Sound indicator */}
      {started && (
        <div className="absolute top-6 right-8 text-xs text-gray-600 font-medium z-40">
          {soundEnabled ? '🔊 Sound on' : '🔇 Silent'}
        </div>
      )}
    </div>
  );
}

function Badge({ icon, text }: { icon: string; text: string }) {
  return (
    <div className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full text-sm text-gray-300 font-medium">
      <span>{icon}</span>
      <span>{text}</span>
    </div>
  );
}
