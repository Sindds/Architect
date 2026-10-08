import React, { useEffect, useState } from 'react';
import { useThemeLanguage } from '../context/ThemeLanguageContext';
import { ArrowUp, Calculator } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const FloatingActions: React.FC = () => {
  const { language, t, openContactModal } = useThemeLanguage();
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 350);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <aside
      aria-label="Quick Actions"
      className="fixed bottom-6 right-4 sm:right-6 z-40 flex flex-col items-end gap-3 pointer-events-none"
    >
      {/* 1. Fast Estimate / Contact Manager CTA Button */}
      <motion.button
        type="button"
        initial={{ opacity: 0, scale: 0.85, x: 20 }}
        animate={{ opacity: 1, scale: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.8 }}
        whileHover={{ scale: 1.05, y: -2 }}
        whileTap={{ scale: 0.95 }}
        onClick={() =>
          openContactModal(
            language === 'ru'
              ? 'Быстрая кнопка: Заказать расчет'
              : 'Floating button: Get an estimate'
          )
        }
        className="pointer-events-auto flex items-center gap-2 sm:gap-2.5 px-3.5 sm:px-5 py-2.5 sm:py-3.5 rounded-full bg-[#111315] hover:bg-neutral-800 text-white dark:bg-white dark:hover:bg-stone-200 dark:text-[#111315] font-display font-bold text-xs uppercase tracking-wider shadow-2xl border border-white/15 dark:border-stone-800 group"
      >
        <div className="relative">
          <Calculator className="w-4 h-4 text-[#5B7E9F] group-hover:rotate-12 transition-transform duration-200" />
          <span className="absolute -top-1 -right-1 flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
        </div>
        <span className="hidden sm:inline font-semibold">{t.floating.orderEstimate}</span>
        <span className="sm:hidden font-semibold">{language === 'ru' ? 'Расчет' : 'Estimate'}</span>
      </motion.button>

      {/* 2. Scroll to Top Button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            type="button"
            initial={{ opacity: 0, scale: 0.7, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.7, y: 15 }}
            transition={{ duration: 0.25 }}
            whileHover={{ scale: 1.1, y: -2 }}
            whileTap={{ scale: 0.9 }}
            onClick={scrollToTop}
            title={t.floating.scrollTop}
            aria-label={t.floating.scrollTop}
            className="pointer-events-auto w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white dark:bg-[#181B1F] text-neutral-900 dark:text-white border border-stone-200 dark:border-stone-800 shadow-xl flex items-center justify-center hover:bg-stone-100 dark:hover:bg-stone-800 transition"
          >
            <ArrowUp className="w-4 h-4 sm:w-5 sm:h-5 text-[#5B7E9F]" />
          </motion.button>
        )}
      </AnimatePresence>
    </aside>
  );
};
