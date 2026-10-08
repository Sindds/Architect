import React, { useState } from 'react';
import { useThemeLanguage } from '../context/ThemeLanguageContext';
import { useSiteContent } from '../context/SiteContentContext';
import { RealCase } from '../types';
import { CheckCircle2, ArrowUpRight, ShieldCheck, Clock, Layers, Sparkles, Building, HardHat, FileCode } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { LazyImage } from './LazyImage';

export const RealCasesSection: React.FC = () => {
  const { language, t, formatCurrency, openContactModal } = useThemeLanguage();
  const { content } = useSiteContent();
  const cases = content.realCases;

  const [selectedCaseId, setSelectedCaseId] = useState<string>(cases[0].id);
  const [activeTab, setActiveTab] = useState<'overview' | 'construction' | 'blueprint' | 'highlights'>('overview');

  const currentCase = cases.find((c) => c.id === selectedCaseId) || cases[0];

  return (
    <section id="cases" className="py-20 sm:py-28 px-4 sm:px-6 md:px-8 max-w-[1500px] mx-auto w-full">
      {/* Section Header with smooth entrance and exit animations */}
      <motion.div
        initial={{ opacity: 0, y: 35 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.2 }}
        transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
        className="text-center max-w-3xl mx-auto mb-12 sm:mb-16 space-y-4"
      >
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#5B7E9F]/10 dark:bg-[#7EA2C4]/15 border border-[#5B7E9F]/20 text-[#5B7E9F] dark:text-[#7EA2C4] font-mono text-[10px] sm:text-xs uppercase tracking-wider">
          <Building className="w-3.5 h-3.5" />
          <span>{t.cases.sectionBadge}</span>
        </div>

        <h2 className="font-display font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl uppercase tracking-tight text-neutral-900 dark:text-white">
          {t.cases.title}
        </h2>

        <p className="text-sm sm:text-base text-stone-600 dark:text-stone-300 max-w-2xl mx-auto leading-relaxed">
          {t.cases.subtitle}
        </p>
      </motion.div>

      {/* Case Selector Pills */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.2 }}
        transition={{ duration: 0.75, delay: 0.1 }}
        className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar"
      >
        {cases.map((item) => (
          <button
            key={item.id}
            onClick={() => {
              setSelectedCaseId(item.id);
              setActiveTab('overview');
            }}
            className={`px-4 sm:px-5 py-2.5 rounded-full text-xs sm:text-sm font-display uppercase tracking-wider transition-all whitespace-nowrap shrink-0 ${
              selectedCaseId === item.id
                ? 'bg-[#111315] dark:bg-white text-white dark:text-[#111315] font-bold shadow-lg scale-105'
                : 'bg-stone-100 dark:bg-stone-800/80 text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700'
            }`}
          >
            {item.title[language]}
          </button>
        ))}
      </motion.div>

      {/* Main Active Case Showcase Bento */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentCase.id}
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -25 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 bg-stone-50 dark:bg-[#14171A] border border-stone-200 dark:border-stone-800 rounded-3xl p-5 sm:p-8 md:p-10 shadow-xl overflow-hidden"
        >
          {/* Left Column: Visual Media with Mode Tabs */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-5">
            {/* View Mode Tabs */}
            <div className="flex items-center gap-1.5 sm:gap-2 bg-stone-200/70 dark:bg-stone-800/70 p-1 sm:p-1.5 rounded-2xl max-w-full overflow-x-auto no-scrollbar">
              <button
                onClick={() => setActiveTab('overview')}
                className={`px-3 sm:px-4 py-1.5 rounded-xl text-xs font-mono uppercase transition whitespace-nowrap shrink-0 ${
                  activeTab === 'overview'
                    ? 'bg-white dark:bg-stone-900 text-neutral-900 dark:text-white font-bold shadow'
                    : 'text-stone-600 dark:text-stone-400 hover:text-black dark:hover:text-white'
                }`}
              >
                {t.cases.tabOverview}
              </button>
              <button
                onClick={() => setActiveTab('construction')}
                className={`px-3 sm:px-4 py-1.5 rounded-xl text-xs font-mono uppercase transition whitespace-nowrap shrink-0 ${
                  activeTab === 'construction'
                    ? 'bg-white dark:bg-stone-900 text-neutral-900 dark:text-white font-bold shadow'
                    : 'text-stone-600 dark:text-stone-400 hover:text-black dark:hover:text-white'
                }`}
              >
                {t.cases.tabConstruction}
              </button>
              <button
                onClick={() => setActiveTab('blueprint')}
                className={`px-3 sm:px-4 py-1.5 rounded-xl text-xs font-mono uppercase transition whitespace-nowrap shrink-0 ${
                  activeTab === 'blueprint'
                    ? 'bg-white dark:bg-stone-900 text-neutral-900 dark:text-white font-bold shadow'
                    : 'text-stone-600 dark:text-stone-400 hover:text-black dark:hover:text-white'
                }`}
              >
                {t.cases.tabBlueprint}
              </button>
              <button
                onClick={() => setActiveTab('highlights')}
                className={`px-3 sm:px-4 py-1.5 rounded-xl text-xs font-mono uppercase transition whitespace-nowrap shrink-0 ${
                  activeTab === 'highlights'
                    ? 'bg-white dark:bg-stone-900 text-neutral-900 dark:text-white font-bold shadow'
                    : 'text-stone-600 dark:text-stone-400 hover:text-black dark:hover:text-white'
                }`}
              >
                {t.cases.tabEconomics}
              </button>
            </div>

            {/* Media Display Area */}
            <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden border border-stone-200 dark:border-stone-800 bg-black/10">
              <AnimatePresence mode="wait">
                {activeTab === 'overview' && (
                  <div key="img-overview" className="relative w-full h-full">
                    <LazyImage
                      src={currentCase.finishedImage}
                      alt={`${currentCase.title[language]} — построенная резиденция ${currentCase.area} м² под ключ`}
                      wrapperClassName="w-full h-full"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-3 left-3 px-3 py-1.5 rounded-xl bg-black/75 backdrop-blur-md text-white font-mono text-[11px] border border-white/15 flex items-center gap-1.5 pointer-events-none">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{language === 'ru' ? 'Сданный объект // Под ключ' : 'Completed Project // Turnkey'}</span>
                    </div>
                  </div>
                )}

                {activeTab === 'construction' && (
                  <div key="img-construction" className="relative w-full h-full">
                    <LazyImage
                      src={currentCase.constructionImage}
                      alt={`${currentCase.title[language]} — монтаж несущего каркаса и контроль СМР`}
                      wrapperClassName="w-full h-full"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-3 left-3 px-3 py-1.5 rounded-xl bg-black/75 backdrop-blur-md text-white font-mono text-[11px] border border-white/15 flex items-center gap-1.5 pointer-events-none">
                      <HardHat className="w-3.5 h-3.5 text-amber-400" />
                      <span>{language === 'ru' ? `Стройплощадка: СМР ${currentCase.title[language]}` : `Active Site: ${currentCase.title[language]}`}</span>
                    </div>
                  </div>
                )}

                {activeTab === 'blueprint' && (
                  <div key="img-blueprint" className="relative w-full h-full">
                    <LazyImage
                      src={currentCase.blueprintImage}
                      alt={`${currentCase.title[language]} — рабочий BIM-проект и планировка помещений`}
                      wrapperClassName="w-full h-full"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-3 left-3 px-3 py-1.5 rounded-xl bg-black/75 backdrop-blur-md text-white font-mono text-[11px] border border-white/15 flex items-center gap-1.5 pointer-events-none">
                      <FileCode className="w-3.5 h-3.5 text-[#7EA2C4]" />
                      <span>{language === 'ru' ? `BIM-модель LOD-400/500: ${currentCase.title[language]}` : `BIM LOD-400/500: ${currentCase.title[language]}`}</span>
                    </div>
                  </div>
                )}

                {activeTab === 'highlights' && (
                  <motion.div
                    key="tab-highlights"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="w-full h-full p-6 sm:p-8 bg-neutral-900 text-white flex flex-col justify-between overflow-y-auto"
                  >
                    <div className="space-y-4">
                      <div className="font-mono text-xs text-[#7EA2C4] uppercase tracking-wider">
                        {currentCase.verifiedBadge[language]}
                      </div>
                      <h4 className="font-display font-bold text-xl uppercase">
                        Инженерные спецификации // BIM Specs
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                        {currentCase.keyMetrics.map((metric, i) => (
                          <div key={i} className="p-3.5 rounded-xl bg-white/5 border border-white/10">
                            <div className="font-mono text-[11px] text-stone-400 uppercase">
                              {metric.label[language]}
                            </div>
                            <div className="font-display font-bold text-base sm:text-lg text-white mt-1">
                              {metric.value}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="mt-4 p-4 rounded-xl bg-white/10 border border-white/15">
                      <div className="font-mono text-[11px] text-stone-300">
                        {t.cases.clientReviewQuote}:
                      </div>
                      <p className="italic text-sm text-stone-200 mt-1">
                        {currentCase.clientQuote[language]}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Status Badge */}
              <div className="absolute top-4 left-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/75 backdrop-blur-md border border-white/20 text-white font-mono text-[11px] uppercase tracking-wider">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>{currentCase.verifiedBadge[language]}</span>
              </div>
            </div>

            {/* Client Testimonial Card */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm">
              <p className="text-xs sm:text-sm text-stone-700 dark:text-stone-300 italic leading-relaxed">
                {currentCase.clientQuote[language]}
              </p>
            </div>
          </div>

          {/* Right Column: Case Data, Economics, Specs & Action */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div>
                <span className="font-mono text-xs text-[#5B7E9F] dark:text-[#7EA2C4] uppercase tracking-wider">
                  {currentCase.location[language]}
                </span>
                <h3 className="font-display font-bold text-2xl sm:text-3xl uppercase tracking-tight text-neutral-900 dark:text-white mt-1">
                  {currentCase.title[language]}
                </h3>
              </div>

              {/* Key Quick Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                <div className="p-3.5 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800">
                  <div className="font-mono text-[10px] text-stone-500 uppercase">{t.cases.labelArea}</div>
                  <div className="font-display font-bold text-lg sm:text-xl text-neutral-900 dark:text-white mt-0.5">
                    {currentCase.area} {t.cases.sqmUnit}
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800">
                  <div className="font-mono text-[10px] text-stone-500 uppercase">{t.cases.labelTimeline}</div>
                  <div className="font-display font-bold text-lg sm:text-xl text-neutral-900 dark:text-white mt-0.5">
                    {currentCase.timelineDays} {t.cases.daysUnit}
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 col-span-2 sm:col-span-1">
                  <div className="font-mono text-[10px] text-stone-500 uppercase">{t.cases.labelEnergy}</div>
                  <div className="font-display font-bold text-xs sm:text-sm text-emerald-600 dark:text-emerald-400 mt-1 truncate">
                    Passivhaus A++
                  </div>
                </div>
              </div>

              {/* Turnkey Actual Budget with Currency Conversion */}
              <div className="p-4 sm:p-5 rounded-2xl bg-neutral-900 text-white border border-neutral-800 shadow-md">
                <div className="font-mono text-[11px] text-stone-400 uppercase tracking-wider">
                  {t.cases.labelActualCost}
                </div>
                <div className="font-display font-bold text-2xl sm:text-3xl text-white mt-1">
                  {formatCurrency(currentCase.budgetRub, currentCase.budgetUsd)}
                </div>
                <div className="flex items-center gap-2 font-mono text-[11px] text-emerald-400 mt-2">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>{language === 'ru' ? 'Твердая смета без удорожания: 0 ₽ доплат' : 'Fixed contract guarantee: $0 added fees'}</span>
                </div>
              </div>

              {/* Engineering Highlights List */}
              <div className="space-y-2 pt-2">
                <div className="font-mono text-xs uppercase tracking-wider text-stone-500">
                  {language === 'ru' ? 'Инженерные узлы объекта:' : 'Constructive highlights:'}
                </div>
                <ul className="space-y-2 text-xs sm:text-sm text-stone-700 dark:text-stone-300">
                  {currentCase.engineeringHighlights[language].map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#5B7E9F] mt-2 shrink-0" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Action CTA */}
            <div className="pt-4 border-t border-stone-200 dark:border-stone-800 flex flex-col sm:flex-row gap-3">
              <button
                onClick={() =>
                  openContactModal(
                    `${language === 'ru' ? 'Кейс' : 'Case'}: ${currentCase.title[language]}`
                  )
                }
                className="flex-1 py-3.5 sm:py-4 px-6 rounded-full bg-[#111315] hover:bg-neutral-800 dark:bg-white dark:hover:bg-stone-100 text-white dark:text-[#111315] font-display font-bold text-xs uppercase tracking-wider transition-all duration-200 shadow-lg flex items-center justify-center gap-2 active:scale-95"
              >
                <span>{t.cases.btnCalculateSimilar}</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </section>
  );
};
