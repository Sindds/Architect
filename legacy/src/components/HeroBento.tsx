import React from 'react';
import { useThemeLanguage } from '../context/ThemeLanguageContext';
import { useSiteContent } from '../context/SiteContentContext';
import { ArrowUpRight } from 'lucide-react';
import { motion } from 'motion/react';

export const HeroBento: React.FC = () => {
  const { language, t } = useThemeLanguage();
  const { content } = useSiteContent();

  const hero = content.hero;

  return (
    <section
      id="hero"
      className="p-2 sm:p-4 md:p-6 pb-0 max-w-[1600px] mx-auto w-full overflow-hidden"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full min-h-[90vh] sm:min-h-[93vh] rounded-[24px] sm:rounded-[36px] overflow-hidden flex flex-col justify-end p-5 sm:p-8 md:p-12 lg:p-14 pt-24 sm:pt-28 md:pt-32 bg-[#0A0B0D] text-white shadow-2xl border border-white/10"
      >
        {/* Background Image with Architectural Lighting */}
        <motion.img
          key={hero.backgroundImage}
          initial={{ scale: 1.08, opacity: 0.4 }}
          animate={{ scale: 1.02, opacity: 0.65 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          src={hero.backgroundImage}
          alt="ARCLINE ESTATE — премиальная фахверковая вилла с панорамным остеклением Guardian Glass"
          loading="eager"
          decoding="sync"
          fetchPriority="high"
          referrerPolicy="no-referrer"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/60 pointer-events-none z-0" />

        {/* Giant Architectural Watermark */}
        <motion.div
          aria-hidden="true"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 0.35, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="hero-watermark absolute bottom-28 sm:bottom-20 md:bottom-24 left-4 sm:left-8 md:left-12 uppercase select-none pointer-events-none font-display font-bold leading-none -tracking-[0.05em] z-0"
        >
          {hero.watermarkText || 'ARCLINE ESTATE'}
        </motion.div>

        {/* Bottom Hero Content: Editorial Headline + Actions + Stat Cards */}
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-end justify-between gap-8 sm:gap-12 mt-auto pt-12 sm:pt-20">
          {/* Left Column: Title & Action CTA */}
          <div className="max-w-3xl space-y-4 sm:space-y-6">
            <motion.h1
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="font-display font-normal text-2xl sm:text-4xl md:text-5xl lg:text-[3.8rem] xl:text-[4.2rem] uppercase tracking-tight text-white leading-[1.06] break-words"
            >
              {hero.title[language] || t.hero.title}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35 }}
              className="text-xs sm:text-sm md:text-base text-zinc-300 max-w-xl font-normal leading-relaxed"
            >
              {hero.subtitle[language] || t.hero.subtitle}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.45 }}
              className="flex flex-wrap items-center gap-3 sm:gap-4 pt-2"
            >
              <motion.a
                href="#calculator"
                id="hero-calc-cta"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-3 px-6 sm:px-8 py-3.5 sm:py-4 rounded-full bg-white text-[#111315] hover:bg-zinc-100 font-display font-bold text-xs sm:text-sm uppercase tracking-wider transition-colors duration-200 shadow-2xl group"
              >
                <span>{hero.ctaCalculateText[language] || t.hero.ctaCalculate}</span>
                <div className="w-7 h-7 rounded-full bg-[#111315] text-white flex items-center justify-center transition-transform group-hover:translate-x-0.5">
                  <ArrowUpRight className="w-4 h-4" />
                </div>
              </motion.a>

              <motion.a
                href="#projects"
                id="hero-portfolio-cta"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-2 px-5 sm:px-6 py-3.5 sm:py-4 rounded-full bg-white/15 hover:bg-white/25 backdrop-blur-md border border-white/20 text-white font-display font-semibold text-xs sm:text-sm uppercase tracking-wider transition-colors"
              >
                <span>{hero.ctaCatalogText[language] || t.hero.ctaCatalog}</span>
              </motion.a>
            </motion.div>
          </div>

          {/* Right Column: Architectural Frosted Glass Stat Cards */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 sm:gap-4 shrink-0 w-full sm:w-auto lg:min-w-[240px]">
            {hero.stats.slice(0, 2).map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: 25 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.5 + idx * 0.1 }}
                whileHover={{ y: -3 }}
                className="p-4 sm:p-5 rounded-2xl bg-black/40 backdrop-blur-xl border border-white/15 text-white flex-1 sm:flex-none transition-shadow"
              >
                <div className="font-display font-bold text-2xl sm:text-3xl lg:text-4xl text-white tracking-tight">
                  {stat.number}
                </div>
                <div className="font-mono text-[10px] sm:text-[11px] uppercase text-zinc-300 tracking-wider mt-1 leading-snug">
                  {stat.label[language]}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
};
