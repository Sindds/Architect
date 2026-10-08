import React from 'react';
import { useThemeLanguage } from '../context/ThemeLanguageContext';
import { useSiteContent } from '../context/SiteContentContext';
import { DynamicIcon } from './DynamicIcon';
import { motion } from 'motion/react';

export const EngineeringBento: React.FC = () => {
  const { language, t } = useThemeLanguage();
  const { content } = useSiteContent();

  const engineering = content.engineering;

  return (
    <section
      id="engineering"
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
            {engineering.sectionBadge[language]}
          </div>
          <div className="font-mono text-[10px] text-stone-500 dark:text-stone-400 mt-1 uppercase tracking-wider">
            {engineering.subtitleBadge}
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
            {engineering.title[language] || t.engineering.title}
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 max-w-2xl font-normal leading-relaxed">
            {engineering.subtitle[language] || t.engineering.subtitle}
          </p>
        </motion.div>
      </div>

      {/* 6-Card Architectural Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
        {engineering.pillars.map((pillar, idx) => (
          <motion.div
            key={pillar.id}
            id={`engineering-${pillar.id}`}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-30px' }}
            transition={{ duration: 0.5, delay: idx * 0.08 }}
            whileHover={{ y: -4 }}
            className="p-6 sm:p-8 rounded-3xl bg-stone-50 dark:bg-[#121519] border border-stone-200/80 dark:border-stone-800/80 hover:border-stone-400/80 dark:hover:border-stone-600/80 transition-colors flex flex-col justify-between group shadow-sm"
          >
            <div>
              <div className="flex items-center justify-between gap-4 mb-6">
                <span className="font-mono text-2xl font-bold text-stone-400 dark:text-stone-500 tracking-tight">
                  {pillar.number}
                </span>
                <div className="p-2.5 rounded-2xl bg-white dark:bg-stone-800/80 border border-stone-200/80 dark:border-stone-700/60 shadow-xs">
                  <DynamicIcon
                    name={pillar.iconName}
                    className="w-5 h-5 text-[#5B7E9F] dark:text-[#7EA2C4]"
                  />
                </div>
              </div>

              <h3 className="font-display font-bold text-lg sm:text-xl uppercase tracking-tight text-neutral-950 dark:text-white mb-2 leading-snug">
                {pillar.title[language]}
              </h3>

              <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed font-normal">
                {pillar.description[language]}
              </p>
            </div>

            {/* Metric pill */}
            <div className="mt-6 pt-4 border-t border-stone-200/70 dark:border-stone-800/80 flex items-center justify-between text-xs font-mono">
              <span className="text-stone-500 dark:text-stone-400 text-[11px] uppercase">
                {pillar.metricLabel ? pillar.metricLabel[language] : (language === 'ru' ? 'Спецификация:' : 'Tolerance:')}
              </span>
              <span className="font-semibold text-[#5B7E9F] dark:text-[#7EA2C4]">
                {pillar.metric}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
