import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Compass } from 'lucide-react';
import { useThemeLanguage } from '../context/ThemeLanguageContext';
import { preloadSiteImages } from '../utils/imagePreloader';

export const Preloader: React.FC = () => {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const { language } = useThemeLanguage();

  useEffect(() => {
    // Proactively preload lower section images while preloader is showing
    preloadSiteImages();

    // Lock scroll during preloading
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        const increment = prev < 50 ? Math.floor(Math.random() * 20) + 15 : Math.floor(Math.random() * 25) + 20;
        const next = prev + increment;
        return next > 100 ? 100 : next;
      });
    }, 45);

    // Failsafe timer so it NEVER hangs
    const safetyTimer = setTimeout(() => {
      setProgress(100);
    }, 650);

    return () => {
      clearInterval(interval);
      clearTimeout(safetyTimer);
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  useEffect(() => {
    if (progress >= 100) {
      const exitTimer = setTimeout(() => {
        setIsVisible(false);
        document.body.style.overflow = '';
      }, 250);
      return () => clearTimeout(exitTimer);
    }
  }, [progress]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="preloader"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            scale: 1.02,
            filter: 'blur(6px)',
            transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] },
          }}
          className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-[#0B0C0E] text-white select-none px-6"
        >
          {/* Subtle architectural blueprint grid in background */}
          <div
            className="absolute inset-0 opacity-[0.04] pointer-events-none"
            style={{
              backgroundImage:
                'radial-gradient(circle at 1px 1px, #ffffff 1px, transparent 0)',
              backgroundSize: '32px 32px',
            }}
          />

          <div className="relative z-10 w-full max-w-sm flex flex-col items-center text-center space-y-6">
            {/* Spinning Compass Icon */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
              className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-[#7EA2C4] shadow-xl"
            >
              <Compass className="w-7 h-7" />
            </motion.div>

            {/* Brand Title */}
            <div className="space-y-1.5">
              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="font-display font-bold text-2xl sm:text-3xl tracking-[0.2em] uppercase text-white"
              >
                ARCLINE ESTATE
              </motion.h1>
              <div className="font-mono text-[10px] tracking-[0.25em] text-[#7EA2C4] uppercase">
                {language === 'ru'
                  ? 'ИНЖЕНЕРНЫЙ ГЕНПОДРЯД // LOD-500'
                  : 'ARCHITECTURAL ENGINEERING // LOD-500'}
              </div>
            </div>

            {/* Progress Bar Container */}
            <div className="w-full space-y-2 pt-2">
              <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-[#5B7E9F] to-[#8EB7DC]"
                  style={{ width: `${progress}%` }}
                  transition={{ ease: 'easeOut', duration: 0.1 }}
                />
              </div>

              {/* Status and Percentage */}
              <div className="flex justify-between items-center text-[10px] font-mono text-stone-400 uppercase tracking-wider">
                <span>
                  {progress < 40
                    ? language === 'ru'
                      ? 'Инициализация BIM...'
                      : 'Loading BIM models...'
                    : progress < 80
                    ? language === 'ru'
                      ? 'Калибровка узлов...'
                      : 'Calibrating joinery...'
                    : language === 'ru'
                    ? 'Готово к просмотру'
                    : 'Ready'}
                </span>
                <span className="font-bold text-[#7EA2C4] tabular-nums">
                  {progress}%
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
