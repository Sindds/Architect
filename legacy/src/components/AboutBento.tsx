import React from 'react';
import { useThemeLanguage } from '../context/ThemeLanguageContext';
import { useSiteContent } from '../context/SiteContentContext';
import { DynamicIcon } from './DynamicIcon';
import { motion } from 'motion/react';

export const AboutBento: React.FC = () => {
  const { language } = useThemeLanguage();
  const { content } = useSiteContent();

  const about = content.about;

  return (
    <section id="about" className="w-full py-16 sm:py-24 px-4 sm:px-6 md:px-8 max-w-7xl mx-auto">
      {/* 12-Column Architectural Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left Column (3 cols): Monospace Section Marker */}
        <motion.div
          initial={{ opacity: 0, x: -25 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: false, amount: 0.15 }}
          transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
          className="lg:col-span-3"
        >
          <div className="inline-block font-mono text-xs uppercase tracking-widest text-[#5B7E9F] dark:text-[#7EA2C4] font-semibold">
            {about.sectionBadge[language]}
          </div>
          <div className="font-mono text-[10px] text-stone-500 dark:text-stone-400 mt-1 uppercase tracking-wider">
            {about.established}
          </div>
        </motion.div>

        {/* Right Column (9 cols): Manifesto & Specifications */}
        <div className="lg:col-span-9 space-y-8 sm:space-y-12">
          {/* Main Architectural Manifesto */}
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.15 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="font-display font-normal text-2xl sm:text-4xl lg:text-5xl xl:text-6xl uppercase tracking-tight leading-[1.08] text-neutral-950 dark:text-white break-words"
          >
            {about.manifestoTitle[language]}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.15 }}
            transition={{ duration: 0.85, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="text-xs sm:text-sm md:text-base text-stone-600 dark:text-stone-400 max-w-3xl font-normal leading-relaxed"
          >
            {about.description[language]}
          </motion.p>

          {/* Key Metrics Row with Hairline Dividers */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.15 }}
            transition={{ duration: 0.9, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 pt-8 border-t border-stone-200 dark:border-stone-800"
          >
            {about.metrics.map((m, idx) => (
              <div key={idx} className="space-y-1">
                <div
                  className={`font-display font-bold text-3xl sm:text-4xl lg:text-5xl tracking-tight ${
                    idx === 3
                      ? 'text-[#5B7E9F] dark:text-[#7EA2C4]'
                      : 'text-neutral-950 dark:text-white'
                  }`}
                >
                  {m.number}
                </div>
                <div className="text-[10px] sm:text-xs font-mono uppercase text-stone-500 dark:text-stone-400 leading-snug">
                  {m.label[language]}
                </div>
              </div>
            ))}
          </motion.div>

          {/* Architectural Bento Sub-Cards with Dynamic Icons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
            {about.subCards.map((card, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.15 }}
                transition={{ duration: 0.85, delay: 0.2 + idx * 0.08, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -3 }}
                className="p-5 sm:p-6 rounded-2xl bg-stone-50 dark:bg-[#121519] border border-stone-200/80 dark:border-stone-800/80 space-y-2 transition-shadow"
              >
                <div className="flex items-center gap-2 text-[#5B7E9F] dark:text-[#7EA2C4] font-mono text-xs uppercase font-bold">
                  <DynamicIcon name={card.icon} className="w-4 h-4" />
                  <span>{card.title}</span>
                </div>
                <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed font-sans">
                  {card.text[language]}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
