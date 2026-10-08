import React, { useState } from 'react';
import { useThemeLanguage } from '../context/ThemeLanguageContext';
import { useSiteContent } from '../context/SiteContentContext';
import { VillaProject } from '../types';
import {
  Calculator,
  FileText,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { LazyImage } from './LazyImage';

interface ProjectsBentoProps {
  onSelectVillaForCalculator?: (area: number, style: string) => void;
}

export const ProjectsBento: React.FC<ProjectsBentoProps> = ({ onSelectVillaForCalculator }) => {
  const { language, t, openContactModal, formatCurrency } = useThemeLanguage();
  const { content } = useSiteContent();
  const villas = content.villas;

  const [activeFilter, setActiveFilter] = useState<string>('fachwerk');
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [activePhotoType, setActivePhotoType] = useState<'main' | 'secondary'>('main');

  const filteredProjects = villas.filter((p) => p.style === activeFilter);
  const activeProjects = filteredProjects.length > 0 ? filteredProjects : villas;

  const safeIdx = currentIdx % (activeProjects.length || 1);
  const currentVilla: VillaProject = activeProjects[safeIdx] || villas[0];

  const handleCalculateClick = () => {
    if (onSelectVillaForCalculator) {
      onSelectVillaForCalculator(currentVilla.area, currentVilla.style);
    }
    const calcElement = document.getElementById('calculator');
    if (calcElement) {
      calcElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      id="projects"
      className="w-full py-16 sm:py-24 px-4 sm:px-6 md:px-8 max-w-7xl mx-auto border-t border-stone-200/80 dark:border-stone-800/80"
    >
      {/* 12-Col Header with Slider Arrows */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-end mb-10 sm:mb-14">
        <motion.div
          initial={{ opacity: 0, x: -25 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: false, amount: 0.15 }}
          transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
          className="lg:col-span-3"
        >
          <div className="inline-block font-mono text-xs uppercase tracking-widest text-[#5B7E9F] dark:text-[#7EA2C4] font-semibold">
            {language === 'ru' ? 'РЕЗИДЕНЦИИ // АРХИТЕКТУРА' : 'RESIDENCES // ARCHITECTURE'}
          </div>
          <div className="font-mono text-[10px] text-stone-500 dark:text-stone-400 mt-1 uppercase tracking-wider">
            PASSIVHAUS BIM DESIGNS
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.15 }}
          transition={{ duration: 0.85, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="lg:col-span-9"
        >
          <h2 className="font-display font-normal text-2xl sm:text-4xl lg:text-5xl uppercase tracking-tight leading-[1.1] text-neutral-950 dark:text-white">
            {t.projects.title}
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 mt-2 font-normal leading-relaxed">
            {t.projects.subtitle}
          </p>
        </motion.div>
      </div>

      {/* Style Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 mb-8 sm:mb-10">
        {[
          { id: 'fachwerk', label: t.projects.filterFachwerk },
          { id: 'minimal', label: t.projects.filterMinimal },
          { id: 'monolith', label: t.projects.filterMonolith },
          { id: 'chalet', label: t.projects.filterChalet },
        ].map((tab) => (
          <motion.button
            key={tab.id}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setActiveFilter(tab.id);
              setCurrentIdx(0);
              setActivePhotoType('main');
            }}
            className={`px-5 py-2.5 rounded-full text-xs font-mono font-medium uppercase tracking-wider whitespace-nowrap transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 ${
              activeFilter === tab.id
                ? 'bg-[#111315] text-white dark:bg-white dark:text-[#111315] shadow-md hover:shadow-lg font-bold'
                : 'bg-stone-100 dark:bg-stone-900 text-stone-600 dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-stone-800 hover:text-neutral-900 dark:hover:text-white hover:shadow-sm'
            }`}
          >
            {tab.label}
          </motion.button>
        ))}
      </div>

      {/* Bento Showcase Container (12 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left (7 cols): Large Architectural Photography */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative rounded-3xl overflow-hidden aspect-[4/3] sm:aspect-[16/10] bg-stone-950 border border-stone-200 dark:border-stone-800 shadow-lg group">
            <LazyImage
              key={`${currentVilla.id}-${activePhotoType}`}
              src={
                activePhotoType === 'main'
                  ? currentVilla.mainImage
                  : currentVilla.secondaryImage
              }
              alt={currentVilla.name}
              priority={true}
              wrapperClassName="w-full h-full"
              className="w-full h-full object-cover object-center"
            />

            {/* Gradient & Tags Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 pointer-events-none" />

            <div className="absolute top-4 left-4 flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white font-mono text-[10px] sm:text-xs uppercase font-semibold">
                {currentVilla.styleName[language]}
              </span>
              <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/20 text-white font-mono text-[10px] sm:text-xs">
                {currentVilla.area} {t.calculator.m2}
              </span>
            </div>

            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white">
              <div className="font-display font-bold text-lg sm:text-2xl uppercase tracking-tight drop-shadow-md">
                {currentVilla.name}
              </div>
              <span className="font-mono text-xs text-stone-300">
                {currentVilla.durationDays} {language === 'ru' ? 'дней' : 'days'}
              </span>
            </div>
          </div>

          {/* Photo Switcher Strip */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setActivePhotoType('main')}
              className={`p-2 sm:p-2.5 rounded-2xl border text-left flex items-center gap-3 transition ${
                activePhotoType === 'main'
                  ? 'border-[#5B7E9F] bg-stone-100 dark:bg-stone-900 shadow-xs'
                  : 'border-stone-200 dark:border-stone-800 bg-white dark:bg-[#121519]'
              }`}
            >
              <LazyImage
                src={currentVilla.mainImage}
                alt={`${currentVilla.name} — экстерьер и панорамные фасады`}
                wrapperClassName="w-12 h-10 rounded-lg shrink-0"
                className="w-12 h-10 rounded-lg object-cover"
              />
              <div>
                <span className="font-mono text-[11px] font-bold block text-neutral-900 dark:text-white uppercase">
                  {language === 'ru' ? 'Экстерьер' : 'Exterior'}
                </span>
                <span className="text-[10px] text-stone-500 font-mono">
                  {language === 'ru' ? 'Фасады & Остекление' : 'Facades & Glazing'}
                </span>
              </div>
            </button>

            <button
              onClick={() => setActivePhotoType('secondary')}
              className={`p-2 sm:p-2.5 rounded-2xl border text-left flex items-center gap-3 transition ${
                activePhotoType === 'secondary'
                  ? 'border-[#5B7E9F] bg-stone-100 dark:bg-stone-900 shadow-xs'
                  : 'border-stone-200 dark:border-stone-800 bg-white dark:bg-[#121519]'
              }`}
            >
              <LazyImage
                src={currentVilla.secondaryImage}
                alt={`${currentVilla.name} — интерьер и панорамная гостиная`}
                wrapperClassName="w-12 h-10 rounded-lg shrink-0"
                className="w-12 h-10 rounded-lg object-cover"
              />
              <div>
                <span className="font-mono text-[11px] font-bold block text-neutral-900 dark:text-white uppercase">
                  {language === 'ru' ? 'Интерьер & Гостиная' : 'Interior & Living'}
                </span>
                <span className="text-[10px] text-stone-500 font-mono">
                  {language === 'ru' ? 'Второй свет & Камин' : 'Volume & Hearth'}
                </span>
              </div>
            </button>
          </div>
        </div>

        {/* Right (5 cols): Specifications & Direct Calculator Action */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentVilla.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="lg:col-span-5 p-6 sm:p-8 rounded-3xl bg-stone-50 dark:bg-[#121519] border border-stone-200/80 dark:border-stone-800/80 space-y-6"
          >
            <div>
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-xs text-[#5B7E9F] dark:text-[#7EA2C4] font-bold uppercase tracking-wider">
                  {currentVilla.styleName[language]}
                </span>
                <span className="font-mono text-xs text-stone-500">
                  LOD-500 BIM Model
                </span>
              </div>
              <h3 className="font-display font-bold text-2xl sm:text-3xl uppercase tracking-tight text-neutral-950 dark:text-white mt-1">
                {currentVilla.name}
              </h3>
              <p className="text-xs text-stone-600 dark:text-stone-400 mt-2 leading-relaxed">
                {currentVilla.tagline[language]}
              </p>
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-3 gap-2 py-3 border-y border-stone-200 dark:border-stone-800 text-center">
              <div>
                <div className="font-mono text-base sm:text-lg font-bold text-neutral-900 dark:text-white">
                  {currentVilla.area} м²
                </div>
                <div className="text-[10px] font-mono uppercase text-stone-500">Площадь</div>
              </div>
              <div>
                <div className="font-mono text-base sm:text-lg font-bold text-neutral-900 dark:text-white">
                  {currentVilla.bedrooms} / {currentVilla.bathrooms}
                </div>
                <div className="text-[10px] font-mono uppercase text-stone-500">Спальни/С/У</div>
              </div>
              <div>
                <div className="font-mono text-base sm:text-lg font-bold text-neutral-900 dark:text-white">
                  {currentVilla.durationDays} дн.
                </div>
                <div className="text-[10px] font-mono uppercase text-stone-500">Срок сборки</div>
              </div>
            </div>

            {/* Hairline Specification Rows */}
            <div className="space-y-2.5 text-xs font-mono">
              <div className="flex justify-between py-1.5 border-b border-stone-200/70 dark:border-stone-800/70 gap-4">
                <span className="text-stone-500 shrink-0">
                  {language === 'ru' ? 'Фундамент:' : 'Foundation:'}
                </span>
                <span className="text-right text-neutral-900 dark:text-white font-sans text-xs">
                  {currentVilla.specs[language].foundation}
                </span>
              </div>

              <div className="flex justify-between py-1.5 border-b border-stone-200/70 dark:border-stone-800/70 gap-4">
                <span className="text-stone-500 shrink-0">
                  {language === 'ru' ? 'Остекление:' : 'Glazing:'}
                </span>
                <span className="text-right text-neutral-900 dark:text-white font-sans text-xs">
                  {currentVilla.specs[language].glazing}
                </span>
              </div>

              <div className="flex justify-between py-1.5 border-b border-stone-200/70 dark:border-stone-800/70 gap-4">
                <span className="text-stone-500 shrink-0">
                  {language === 'ru' ? 'Брус / Каркас:' : 'Engineered Timber:'}
                </span>
                <span className="text-right text-neutral-900 dark:text-white font-sans text-xs">
                  {currentVilla.specs[language].timber}
                </span>
              </div>

              <div className="flex justify-between py-1.5 border-b border-stone-200/70 dark:border-stone-800/70 gap-4">
                <span className="text-stone-500 shrink-0">
                  {language === 'ru' ? 'Энергокласс:' : 'Energy rating:'}
                </span>
                <span className="text-right text-[#5B7E9F] dark:text-[#7EA2C4] font-semibold text-xs">
                  {currentVilla.specs[language].energyRating}
                </span>
              </div>
            </div>

            {/* Price & Action Buttons */}
            <div className="pt-2 space-y-3">
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-[10px] font-mono uppercase text-stone-500 block">
                    {t.projects.priceEst}
                  </span>
                  <span className="font-display font-bold text-2xl text-neutral-950 dark:text-white">
                    {formatCurrency(currentVilla.priceRub, currentVilla.priceUsd)}
                  </span>
                </div>
                <span className="text-xs font-mono text-stone-500">
                  {`~${formatCurrency(
                    Math.round(currentVilla.priceRub / currentVilla.area),
                    Math.round(currentVilla.priceUsd / currentVilla.area)
                  )}/m²`}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={handleCalculateClick}
                  className="w-full py-3.5 px-4 rounded-full bg-[#111315] hover:bg-neutral-800 text-white dark:bg-white dark:hover:bg-stone-200 dark:text-[#111315] font-display font-bold text-xs uppercase tracking-wider transition flex items-center justify-center gap-2 shadow-sm"
                >
                  <Calculator className="w-4 h-4 text-[#5B7E9F]" />
                  <span>{language === 'ru' ? 'Рассчитать виллу' : 'Calculate Villa'}</span>
                </motion.button>

                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() =>
                    openContactModal(
                      language === 'ru'
                        ? `Запрос BIM-проекта и спецификации: ${currentVilla.name}`
                        : `BIM specification & blueprint dossier request: ${currentVilla.name}`
                    )
                  }
                  className="w-full py-3.5 px-4 rounded-full border border-stone-300 dark:border-stone-700 hover:border-neutral-900 dark:hover:border-white text-neutral-900 dark:text-white font-display font-bold text-xs uppercase tracking-wider transition flex items-center justify-center gap-2"
                >
                  <FileText className="w-4 h-4 text-stone-500" />
                  <span>{language === 'ru' ? 'BIM-спецификация PDF' : 'BIM PDF Spec'}</span>
                </motion.button>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

      </div>
    </section>
  );
};
