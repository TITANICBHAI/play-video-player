import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Play } from 'lucide-react';
import PhoneMockup from './components/PhoneMockup';

const SCENE_DURATIONS = [3000, 4000, 4000, 4000, 3000, 3000, 3000];

export default function App() {
  const [currentScene, setCurrentScene] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentScene((prev) => (prev + 1) % SCENE_DURATIONS.length);
    }, SCENE_DURATIONS[currentScene]);
    return () => clearTimeout(timer);
  }, [currentScene]);

  return (
    <div className="w-full h-screen bg-play-bg text-white overflow-hidden relative font-sans flex items-center justify-center">
      {/* Dynamic Background */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-play-bg to-play-card"
        animate={{
          opacity: currentScene === 0 || currentScene === 6 ? 0.3 : 0.8,
          scale: currentScene === 0 ? 1 : 1.1,
        }}
        transition={{ duration: 2, ease: "easeInOut" }}
      />
      
      {/* Background Orbs */}
      <motion.div 
        className="absolute w-[40vw] h-[40vw] rounded-full bg-play-accent/10 blur-[120px]"
        animate={{
          x: currentScene === 0 ? '-10vw' : '20vw',
          y: currentScene === 0 ? '10vh' : '-20vh',
          scale: currentScene === 6 ? 1.5 : 1,
        }}
        transition={{ duration: 4, ease: "easeInOut" }}
      />
      
      <motion.div 
        className="absolute w-[30vw] h-[30vw] rounded-full bg-play-highlight/5 blur-[100px]"
        animate={{
          x: currentScene === 0 ? '10vw' : '-20vw',
          y: currentScene === 0 ? '-10vh' : '20vh',
          opacity: currentScene >= 2 && currentScene <= 5 ? 0.8 : 0.2,
        }}
        transition={{ duration: 4, ease: "easeInOut" }}
      />

      {/* Main Content Layout */}
      <div className="relative z-10 w-full max-w-[1200px] px-12 flex items-center h-full">
        
        {/* Left Side Context (Text Callouts) */}
        <div className="flex-1 pr-12">
          <AnimatePresence mode="wait">
            {currentScene === 0 && (
              <motion.div key="s0"
                initial={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
                animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                exit={{ opacity: 0, scale: 1.1, filter: 'blur(10px)' }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col items-center justify-center h-full text-center translate-x-1/2"
              >
                <div className="flex flex-col items-center gap-6 mb-6">
                  <motion.div 
                    initial={{ rotate: -90, scale: 0 }}
                    animate={{ rotate: 0, scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.2 }}
                    className="w-24 h-24 rounded-3xl bg-play-accent flex items-center justify-center shadow-[0_0_40px_rgba(0,122,255,0.4)]"
                  >
                    <Play fill="white" size={48} className="ml-2" />
                  </motion.div>
                  <h1 className="text-8xl font-display font-bold tracking-tighter">Play</h1>
                </div>
                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.8 }}
                  className="text-3xl text-gray-400 font-medium"
                >
                  Your Videos. Your Rules.
                </motion.p>
              </motion.div>
            )}

            {currentScene === 1 && (
              <motion.div key="s1"
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 40 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="space-y-4"
              >
                <h2 className="text-6xl font-display font-bold leading-tight">Smart<br/>Library</h2>
                <div className="w-12 h-1 bg-play-accent rounded-full my-6" />
                <p className="text-2xl text-gray-300">Auto-detects your videos</p>
              </motion.div>
            )}

            {currentScene === 2 && (
              <motion.div key="s2"
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 40 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="space-y-4"
              >
                <h2 className="text-6xl font-display font-bold leading-tight">Double-tap<br/>to seek.</h2>
                <div className="w-12 h-1 bg-play-accent rounded-full my-6" />
                <p className="text-2xl text-gray-300">No fumbling.</p>
              </motion.div>
            )}

            {currentScene === 3 && (
              <motion.div key="s3"
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 40 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="space-y-4"
              >
                <h2 className="text-6xl font-display font-bold leading-tight">Swipe to<br/>control</h2>
                <div className="w-12 h-1 bg-play-accent rounded-full my-6" />
                <p className="text-2xl text-gray-300">Brightness &amp; Volume</p>
              </motion.div>
            )}

            {currentScene === 4 && (
              <motion.div key="s4"
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 40 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="space-y-4"
              >
                <h2 className="text-6xl font-display font-bold leading-tight">Load .SRT<br/>subtitles</h2>
                <div className="w-12 h-1 bg-play-accent rounded-full my-6" />
                <p className="text-2xl text-gray-300">Remembered forever</p>
              </motion.div>
            )}

            {currentScene === 5 && (
              <motion.div key="s5"
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 40 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="space-y-4"
              >
                <h2 className="text-6xl font-display font-bold leading-tight">Nerd stats,</h2>
                <div className="w-12 h-1 bg-play-accent rounded-full my-6" />
                <p className="text-2xl text-gray-300">when you want them</p>
              </motion.div>
            )}

            {currentScene === 6 && (
              <motion.div key="s6"
                initial={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
                animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                exit={{ opacity: 0, scale: 1.1, filter: 'blur(10px)' }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col items-center justify-center h-full text-center translate-x-1/2"
              >
                <div className="flex items-center justify-center gap-4 mb-8">
                  <div className="w-16 h-16 rounded-2xl bg-play-accent flex items-center justify-center shadow-[0_0_30px_rgba(0,122,255,0.4)]">
                    <Play fill="white" size={32} className="ml-1" />
                  </div>
                  <h1 className="text-6xl font-display font-bold tracking-tight">Play</h1>
                </div>
                <p className="text-4xl text-white font-medium mb-12">Free. Private. Powerful.</p>
                <div className="flex flex-col items-center">
                  <div className="w-8 h-[1px] bg-white/20 mb-4" />
                  <p className="text-sm text-gray-500 font-medium tracking-[0.2em] uppercase">TB Techs</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right Side Phone Mockup Container */}
        <div className="flex-1 flex justify-center items-center h-full">
          <PhoneMockup currentScene={currentScene} />
        </div>
      </div>
    </div>
  );
}