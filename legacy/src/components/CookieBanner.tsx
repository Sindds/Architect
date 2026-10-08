import React, { useState, useEffect } from 'react';
import { useThemeLanguage } from '../context/ThemeLanguageContext';
import { Cookie, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const CookieBanner: React.FC = () => {
  const { language, t, openPrivacyModal } = useThemeLanguage();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('arcline_cookie_consent');
    if (!consent) {
      const timer = setTimeout(() => setVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('arcline_cookie_consent', 'accepted');
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.aside
          aria-label="Cookie consent"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 30 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-50 p-4 sm:p-5 rounded-2xl bg-white/95 dark:bg-[#14171A]/95 backdrop-blur-xl border border-stone-200 dark:border-stone-800 shadow-2xl flex flex-col gap-3"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-2.5 sm:gap-3">
              <Cookie className="w-5 h-5 text-[#5B7E9F] shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="text-xs text-stone-700 dark:text-stone-300 leading-relaxed pr-2">
                  {t.privacy.cookieText}{' '}
                  <button
                    onClick={openPrivacyModal}
                    className="underline hover:text-[#5B7E9F] transition"
                  >
                    {t.privacy.cookiePolicyLink}
                  </button>
                </p>
              </div>
            </div>
            <button
              onClick={handleAccept}
              className="p-1 rounded-full text-stone-400 hover:text-stone-700 dark:hover:text-white transition shrink-0"
              aria-label="Close cookie banner"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="flex items-center justify-end gap-2 pt-1">
            <button
              onClick={handleAccept}
              className="px-4 py-1.5 rounded-full bg-[#111315] dark:bg-white text-white dark:text-[#111315] text-xs font-display font-bold uppercase tracking-wider"
            >
              {t.privacy.cookieAccept}
            </button>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
};
