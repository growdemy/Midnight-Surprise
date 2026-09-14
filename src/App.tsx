import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause } from 'lucide-react';
import BirthdayCarousel from './components/BirthdayCarousel';
import DraggablePolaroids from './components/DraggablePolaroids';

export default function App() {
  const [status, setStatus] = useState<'27' | 'burning' | '28'>('27');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(70); // 1:10 in seconds
  const totalDuration = 197; // 3:17 in seconds
  const [animationComplete, setAnimationComplete] = useState(false);

  const [timeStats, setTimeStats] = useState({
    years: 27,
    days: 0,
    clock: '',
  });

  const albumImages = [
    'https://i.ibb.co/BHZrYNzN/Whats-App-Image-2026-09-14-at-5-11-15-PM.jpg',
    'https://i.ibb.co/hxnP1z8r/Whats-App-Image-2026-09-14-at-5-11-15-PM-1.jpg',
    'https://i.ibb.co/PskxPWbN/Whats-App-Image-2026-09-14-at-5-07-55-PM.jpg',
    'https://i.ibb.co/RGLDSjV3/Whats-App-Image-2026-09-14-at-5-07-55-PM-1.jpg',
    'https://i.ibb.co/sJwFbP49/Whats-App-Image-2026-09-14-at-5-07-54-PM.jpg',
    'https://i.ibb.co/KpPR7x8d/Whats-App-Image-2026-09-14-at-5-07-54-PM-1.jpg',
  ];
  const [currentAlbumImageIndex, setCurrentAlbumImageIndex] = useState(0);

  useEffect(() => {
    const albumTimer = setInterval(() => {
      setCurrentAlbumImageIndex((prev) => (prev + 1) % albumImages.length);
    }, 3000);
    return () => clearInterval(albumTimer);
  }, []);

  // Calculate age from 15/09/1998 and live clock
  useEffect(() => {
    const updateStats = () => {
      const birth = new Date(1998, 8, 15); // Sept 15, 1998
      const now = new Date();
      let years = now.getFullYear() - birth.getFullYear();
      const m = now.getMonth() - birth.getMonth();
      if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) {
        years--;
      }

      const lastBirthday = new Date(
        now.getFullYear() + (m < 0 || (m === 0 && now.getDate() < birth.getDate()) ? -1 : 0),
        8,
        15
      );
      const diffTime = Math.abs(now.getTime() - lastBirthday.getTime());
      const days = Math.floor(diffTime / (1000 * 60 * 60 * 24));

      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');

      setTimeStats({
        years,
        days,
        clock: `${hours}:${minutes}:${seconds}`,
      });
    };

    updateStats();
    const timer = setInterval(updateStats, 1000);
    return () => clearInterval(timer);
  }, []);

  // Simulated music progress when playing
  const audioRef = React.useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch((err) => console.log('Audio play error:', err));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);

  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime((prev) => (prev >= totalDuration ? 0 : prev + 1));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${String(secs).padStart(2, '0')}`;
  };

  const handleClick = () => {
    if (status === '27') {
      setStatus('burning');
      setTimeout(() => {
        setStatus('28');
        setIsPlaying(true); // auto play music when 28 appears
        setTimeout(() => {
          setAnimationComplete(true);
        }, 1200); // 1.2s for 28 entrance animation completion
      }, 1500);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white relative selection:bg-orange-500 selection:text-white">
      <audio ref={audioRef} src="https://advisory-sapphire-toe4kt6z.edgeone.dev/" loop preload="auto" />
      {/* Hero Section */}
      <div className="h-screen w-full flex items-center justify-center relative overflow-hidden p-6">
        {/* Background image fade in when burning or 28 */}
        <AnimatePresence>
          {(status === 'burning' || status === '28') && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.5 }}
              className="absolute inset-0 pointer-events-none overflow-hidden z-0"
            >
              <motion.div
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.5, ease: 'easeOut' }}
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage: `url('https://images.pexels.com/photos/33156220/pexels-photo-33156220.jpeg')`,
                }}
              />
              {/* Subtle dark gradient overlay */}
              <div className="absolute inset-0 bg-black/40 backdrop-brightness-90" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Center Number Display */}
        <div className="flex items-center justify-center relative z-10 w-full">
          <AnimatePresence mode="wait">
            {status === '27' && (
              <motion.div
                key="27"
                initial={{ scale: 3, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                onClick={handleClick}
                className="text-[26vw] sm:text-[18rem] md:text-[22rem] font-bold tracking-tight leading-none select-none flex items-center justify-center cursor-pointer text-white drop-shadow-2xl hover:scale-105 transition-transform"
              >
                <span>27</span>
              </motion.div>
            )}

            {status === 'burning' && (
              <motion.div
                key="burning"
                initial={{ scale: 1, opacity: 1 }}
                animate={{
                  scale: [1, 1.05, 1.08],
                  opacity: [1, 0.8, 0.3, 0],
                  filter: ['blur(0px)', 'blur(1px)', 'blur(3px)', 'blur(6px)'],
                }}
                transition={{ duration: 1.5, ease: 'easeOut' }}
                className="text-[26vw] sm:text-[18rem] md:text-[22rem] font-bold tracking-tight leading-none select-none flex items-center justify-center relative text-orange-500"
              >
                {/* Ember particles */}
                <div className="absolute inset-0 pointer-events-none overflow-visible z-20 flex items-center justify-center">
                  {[...Array(25)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{
                        x: (Math.random() - 0.5) * 180,
                        y: 40,
                        scale: Math.random() * 0.8 + 0.3,
                        opacity: 1,
                      }}
                      animate={{
                        y: -160 - Math.random() * 90,
                        x: (Math.random() - 0.5) * 220,
                        opacity: [1, 0.7, 0],
                        scale: [Math.random() * 0.8 + 0.3, 0.1],
                      }}
                      transition={{
                        duration: 0.6 + Math.random() * 0.8,
                        ease: 'easeOut',
                      }}
                      className="absolute w-3 h-3 rounded-full bg-gradient-to-t from-red-600 via-orange-500 to-yellow-300 shadow-[0_0_12px_#ff4500]"
                    />
                  ))}
                </div>
                <span className="bg-gradient-to-t from-red-600 via-orange-500 to-yellow-300 bg-clip-text text-transparent [filter:drop-shadow(0_0_20px_#ff4500)]">
                  27
                </span>
              </motion.div>
            )}

            {status === '28' && (
              <motion.div
                key="28"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                className="text-[26vw] sm:text-[18rem] md:text-[22rem] font-bold tracking-tight leading-none select-none flex items-center justify-center relative text-white drop-shadow-[0_10px_30px_rgba(0,0,0,0.9)]"
              >
                <span>28</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Bottom Bar: Glassmorphism Music Player & Real-time Stats */}
        <div className="absolute bottom-6 left-6 right-6 max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between z-10 gap-4 pointer-events-none">
          <div className="hidden sm:block w-32" />

          {/* Glassmorphism Music Player */}
          <AnimatePresence>
            {status === '28' && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.3, ease: 'easeOut' }}
                className="bg-black/30 backdrop-blur-xl border border-white/15 rounded-2xl p-3 flex items-center gap-4 text-white w-full max-w-sm shadow-2xl pointer-events-auto"
              >
                <div className="relative w-12 h-12 rounded-xl overflow-hidden shadow-md flex-shrink-0 bg-neutral-800">
                  <AnimatePresence>
                    <motion.img
                      key={currentAlbumImageIndex}
                      src={albumImages[currentAlbumImageIndex]}
                      alt="Album cover"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.8 }}
                      className="absolute inset-0 w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </AnimatePresence>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="text-xs font-semibold tracking-wide text-white truncate">
                      𝑳𝒐𝒗𝒆 𝑫𝒆𝒏🫀
                    </h4>
                    <span className="text-[10px] text-neutral-400 font-mono">
                      {formatTime(currentTime)} / {formatTime(totalDuration)}
                    </span>
                  </div>
                  <p className="text-[10px] uppercase tracking-widest text-neutral-400 mb-2">
                    Birthday Playlist
                  </p>

                  <div className="w-full bg-white/20 h-1 rounded-full overflow-hidden cursor-pointer">
                    <div
                      className="bg-white h-full transition-all duration-300 rounded-full"
                      style={{ width: `${(currentTime / totalDuration) * 100}%` }}
                    />
                  </div>
                </div>

                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 active:scale-95 transition-transform shadow-lg flex-shrink-0 cursor-pointer"
                  aria-label={isPlaying ? 'Pause' : 'Play'}
                >
                  {isPlaying ? (
                    <Pause className="w-4 h-4 fill-current" />
                  ) : (
                    <Play className="w-4 h-4 fill-current translate-x-0.5" />
                  )}
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Real-time calculated age & clock */}
          <AnimatePresence>
            {status === '28' && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.3, ease: 'easeOut' }}
                className="text-xs font-mono tracking-widest text-neutral-400 flex items-center gap-2 pointer-events-auto"
              >
                <span>{timeStats.years}Y</span>
                <span>•</span>
                <span>{timeStats.days}D</span>
                <span>•</span>
                <span>{timeStats.clock}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Birthday Carousel Section Below Hero (Appears when number 28 appeared & animation completed) */}
      <AnimatePresence>
        {animationComplete && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: 'easeOut' }}
          >
            <BirthdayCarousel />
            <DraggablePolaroids />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
