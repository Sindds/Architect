import React from 'react';
import { useThemeLanguage } from '../context/ThemeLanguageContext';
import { ROADMAP_STEPS } from '../data/landingData';
import { FileText } from 'lucide-react';
import { motion } from 'motion/react';

export const RoadmapBento: React.FC = () => {
  const { language, t } = useThemeLanguage();

  return (
    <section
      id="roadmap"
      className="w-full py-16 sm:py-24 px-4 sm:px-6 md:px-8 max-w-7xl mx-auto border-t border-stone-200/80 dark:border-stone-800/80"
    >
      {/* 12-Col Section Header */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start mb-12 sm:mb-16">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.5 }}
          className="lg:col-span-3"
        >
          <div className="inline-block font-mono text-xs uppercase tracking-widest text-[#5B7E9F] dark:text-[#7EA2C4] font-semibold">
            {language === 'ru' ? '5 ЭТАПОВ // ROADMAP' : 'CONSTRUCTION TIMELINE'}
          </div>
          <div className="font-mono text-[10px] text-stone-500 dark:text-stone-400 mt-1 uppercase tracking-wider">
            STRICT SCHEDULE & ESCROW
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.6 }}
          className="lg:col-span-9 space-y-3"
        >
          <h2 className="font-display font-normal text-2xl sm:text-4xl lg:text-5xl uppercase tracking-tight leading-[1.1] text-neutral-950 dark:text-white">
            {t.roadmap.title}
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 max-w-2xl font-normal leading-relaxed">
            {t.roadmap.subtitle}
          </p>
        </motion.div>
      </div>

      {/* 5-Stage Architectural Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {ROADMAP_STEPS.map((s, idx) => {
          const isFinal = idx === 4;
          return (
            <motion.div
              key={s.step}
              id={`roadmap-step-${s.step}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ duration: 0.45, delay: idx * 0.09 }}
              whileHover={{ y: -4 }}
              className={`p-6 rounded-3xl flex flex-col justify-between transition-shadow ${
                isFinal
                  ? 'bg-[#111315] text-white border-2 border-[#5B7E9F] shadow-xl sm:col-span-2 lg:col-span-1'
                  : 'bg-stone-50 dark:bg-[#121519] text-neutral-900 dark:text-white border border-stone-200/80 dark:border-stone-800/80 shadow-xs'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span
                    className={`font-mono text-2xl font-bold tracking-tight ${
                      isFinal ? 'text-[#7EA2C4]' : 'text-stone-400 dark:text-stone-500'
                    }`}
                  >
                    {s.step}
                  </span>
                  <span
                    className={`text-[11px] font-mono px-2 py-0.5 rounded-full ${
                      isFinal
                        ? 'bg-white/10 text-stone-300'
                        : 'bg-stone-200/80 dark:bg-stone-800 text-stone-600 dark:text-stone-400'
                    }`}
                  >
                    {s.days}
                  </span>
                </div>

                <h3 className="font-display font-bold text-base uppercase mb-2 leading-snug">
                  {s.title[language]}
                </h3>

                <p
                  className={`text-xs leading-relaxed ${
                    isFinal ? 'text-stone-300' : 'text-stone-600 dark:text-stone-400'
                  }`}
                >
                  {s.desc[language]}
                </p>
              </div>

              {/* Deliverable Result */}
              <div
                className={`mt-6 pt-4 border-t text-[11px] font-mono ${
                  isFinal
                    ? 'border-white/15 text-[#7EA2C4]'
                    : 'border-stone-200/80 dark:border-stone-800 text-stone-500 dark:text-stone-400'
                }`}
              >
                <div className="flex items-center gap-1.5 font-bold mb-1">
                  <FileText className="w-3.5 h-3.5" />
                  <span>{t.roadmap.deliverableLabel}</span>
                </div>
                <p className="text-[10px] leading-tight text-neutral-800 dark:text-stone-300 font-sans">
                  {s.deliverable[language]}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};
