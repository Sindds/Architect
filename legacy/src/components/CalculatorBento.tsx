import React, { useState, useMemo } from 'react';
import { useThemeLanguage } from '../context/ThemeLanguageContext';
import {
  Sparkles,
  ArrowRight,
  Clock,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface CalculatorBentoProps {
  initialArea?: number;
  initialStyle?: string;
}

export const CalculatorBento: React.FC<CalculatorBentoProps> = ({
  initialArea = 350,
  initialStyle = 'fachwerk',
}) => {
  const { language, t, openContactModal, formatCurrency, currency } = useThemeLanguage();

  const [activeTab, setActiveTab] = useState<'config' | 'quiz'>('config');

  // Configurator state
  const [area, setArea] = useState<number>(initialArea);
  const [terraceArea, setTerraceArea] = useState<number>(50);
  const [style, setStyle] = useState<string>(initialStyle);
  const [tier, setTier] = useState<'contour' | 'whitebox' | 'allinclusive'>('whitebox');
  const [addSmartHome, setAddSmartHome] = useState<boolean>(true);
  const [addSpa, setAddSpa] = useState<boolean>(false);
  const [addGeothermal, setAddGeothermal] = useState<boolean>(false);

  // Quiz state
  const [quizStep, setQuizStep] = useState<number>(1);
  const [quizAnswers, setQuizAnswers] = useState<{
    areaRange: string;
    material: string;
    timing: string;
    landStatus: string;
  }>({
    areaRange: '250-400',
    material: 'timber',
    timing: 'spring2026',
    landStatus: 'owned',
  });

  // Calculate live cost
  const calculation = useMemo(() => {
    let basePerM2 = 72000;
    if (style === 'monolith') basePerM2 = 82000;
    if (style === 'minimal') basePerM2 = 76000;
    if (style === 'chalet') basePerM2 = 78000;

    let tierMultiplier = 1.0;
    if (tier === 'contour') tierMultiplier = 0.78;
    if (tier === 'allinclusive') tierMultiplier = 1.48;

    const houseCost = area * basePerM2 * tierMultiplier;
    const terraceCost = terraceArea * 28000;
    const smartHomeCost = addSmartHome ? 1250000 : 0;
    const spaCost = addSpa ? 2400000 : 0;
    const geothermalCost = addGeothermal ? 1850000 : 0;

    const totalRub = Math.round(
      houseCost + terraceCost + smartHomeCost + spaCost + geothermalCost
    );
    const totalUsd = Math.round(totalRub / 91.5);
    const durationDays = Math.round(90 + (area / 100) * 18);

    return {
      totalRub,
      totalUsd,
      durationDays,
      perM2Rub: Math.round(totalRub / area),
      perM2Usd: Math.round(totalUsd / area),
    };
  }, [area, terraceArea, style, tier, addSmartHome, addSpa, addGeothermal]);

  const handleLockEstimate = () => {
    const styleLabel =
      t.calculator.styles[style as keyof typeof t.calculator.styles] || style;
    const formattedPrice = formatCurrency(calculation.totalRub, calculation.totalUsd);
    const formattedPerM2 = formatCurrency(calculation.perM2Rub, calculation.perM2Usd);

    const note =
      language === 'ru'
        ? `Конфигуратор: ${area} м² (терраса ${terraceArea} м²), стиль: ${styleLabel}, смета: ${formattedPrice} (~${formattedPerM2}/м²)`
        : `Configurator estimate: ${area} m² (deck ${terraceArea} m²), style: ${styleLabel}, estimate: ${formattedPrice} (~${formattedPerM2}/m²)`;

    openContactModal(note);
  };

  const handleQuizNext = () => {
    if (quizStep < 4) {
      setQuizStep(quizStep + 1);
    } else {
      const formattedPrice = formatCurrency(calculation.totalRub, calculation.totalUsd);
      const note =
        language === 'ru'
          ? `Квиз-конфигуратор: площадь ${quizAnswers.areaRange} м², технология: ${quizAnswers.material}, участок: ${quizAnswers.landStatus}, смета: ${formattedPrice}`
          : `Quiz configurator: area ${quizAnswers.areaRange} m², technology: ${quizAnswers.material}, land: ${quizAnswers.landStatus}, estimate: ${formattedPrice}`;
      openContactModal(note);
    }
  };

  return (
    <section
      id="calculator"
      className="w-full py-16 sm:py-24 px-4 sm:px-6 md:px-8 max-w-7xl mx-auto border-t border-stone-200/80 dark:border-stone-800/80"
    >
      {/* 12-Col Section Header with smooth entrance/exit animation */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start mb-10 sm:mb-14">
        <motion.div
          initial={{ opacity: 0, x: -25 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: false, amount: 0.15 }}
          transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
          className="lg:col-span-3"
        >
          <div className="inline-block font-mono text-xs uppercase tracking-widest text-[#5B7E9F] dark:text-[#7EA2C4] font-semibold">
            {language === 'ru' ? 'КОНФИГУРАТОР // CONFIGURATOR' : 'CONFIGURATOR // BIM'}
          </div>
          <div className="font-mono text-[10px] text-stone-500 dark:text-stone-400 mt-1 uppercase tracking-wider">
            {language === 'ru' ? 'ФИКСИРОВАННАЯ СМЕТА' : 'FIXED-PRICE CONTRACT'}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.15 }}
          transition={{ duration: 0.85, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="lg:col-span-9 space-y-3"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="font-display font-normal text-2xl sm:text-4xl lg:text-5xl uppercase tracking-tight leading-[1.1] text-neutral-950 dark:text-white">
              {t.calculator.title}
            </h2>

            {/* Mode Switcher */}
            <div className="inline-flex p-1 rounded-full bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shrink-0 shadow-xs">
              <button
                onClick={() => setActiveTab('config')}
                className={`px-4 py-2 rounded-full text-xs font-mono font-medium transition duration-200 ${
                  activeTab === 'config'
                    ? 'bg-[#111315] text-white dark:bg-white dark:text-[#111315] shadow-sm'
                    : 'text-stone-600 dark:text-stone-400 hover:text-black dark:hover:text-white'
                }`}
              >
                {t.calculator.tabInstant}
              </button>
              <button
                onClick={() => setActiveTab('quiz')}
                className={`px-4 py-2 rounded-full text-xs font-mono font-medium transition duration-200 ${
                  activeTab === 'quiz'
                    ? 'bg-[#111315] text-white dark:bg-white dark:text-[#111315] shadow-sm'
                    : 'text-stone-600 dark:text-stone-400 hover:text-black dark:hover:text-white'
                }`}
              >
                {t.calculator.tabWizard}
              </button>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 max-w-2xl font-normal leading-relaxed">
            {t.calculator.subtitle}
          </p>
        </motion.div>
      </div>

      {/* Main Architectural Estimator Card with Expressive Entrance */}
      <motion.div
        initial={{ opacity: 0, y: 35 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.15 }}
        transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
        className="p-4 sm:p-8 lg:p-12 rounded-[24px] sm:rounded-[36px] bg-stone-50 dark:bg-[#121519] border border-stone-200/80 dark:border-stone-800/80 shadow-xl"
      >
        <AnimatePresence mode="wait">
          {activeTab === 'config' ? (
            /* Tab 1: Interactive Configurator */
            <motion.div
              key="config-tab"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start"
            >
              {/* Left Controls (7 cols) */}
              <div className="lg:col-span-7 space-y-8">
                {/* Slider: Living Area */}
                <div className="space-y-3">
                  <div className="flex justify-between items-baseline">
                    <label className="font-mono text-xs uppercase font-bold text-neutral-900 dark:text-white tracking-wider">
                      {t.calculator.livingArea}:
                    </label>
                    <span className="font-display font-bold text-2xl text-[#5B7E9F] dark:text-[#7EA2C4]">
                      {area}{' '}
                      <span className="text-xs font-normal text-stone-500">
                        {t.calculator.m2}
                      </span>
                    </span>
                  </div>
                  <input
                    type="range"
                    min={180}
                    max={850}
                    step={10}
                    value={area}
                    onChange={(e) => setArea(Number(e.target.value))}
                    className="w-full h-2 bg-stone-200 dark:bg-stone-800 rounded-lg appearance-none cursor-pointer accent-[#5B7E9F]"
                  />
                  <div className="flex justify-between text-[10px] font-mono text-stone-500">
                    <span>180 {t.calculator.m2}</span>
                    <span>450 {t.calculator.m2}</span>
                    <span>850 {t.calculator.m2}</span>
                  </div>
                </div>

                {/* Slider: Covered Terrace */}
                <div className="space-y-3">
                  <div className="flex justify-between items-baseline">
                    <label className="font-mono text-xs uppercase font-bold text-neutral-900 dark:text-white tracking-wider">
                      {t.calculator.terraceArea}:
                    </label>
                    <span className="font-display font-bold text-2xl text-[#5B7E9F] dark:text-[#7EA2C4]">
                      {terraceArea}{' '}
                      <span className="text-xs font-normal text-stone-500">
                        {t.calculator.m2}
                      </span>
                    </span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={250}
                    step={10}
                    value={terraceArea}
                    onChange={(e) => setTerraceArea(Number(e.target.value))}
                    className="w-full h-2 bg-stone-200 dark:bg-stone-800 rounded-lg appearance-none cursor-pointer accent-[#5B7E9F]"
                  />
                  <div className="flex justify-between text-[10px] font-mono text-stone-500">
                    <span>0 {t.calculator.m2}</span>
                    <span>120 {t.calculator.m2}</span>
                    <span>250 {t.calculator.m2}</span>
                  </div>
                </div>

                {/* Architectural Style Selector */}
                <div className="space-y-3">
                  <label className="font-mono text-xs uppercase font-bold text-neutral-900 dark:text-white tracking-wider block">
                    {t.calculator.archStyle}:
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {[
                      { id: 'fachwerk', label: t.calculator.styles.fachwerk },
                      { id: 'minimal', label: t.calculator.styles.minimal },
                      { id: 'monolith', label: t.calculator.styles.monolith },
                      { id: 'chalet', label: t.calculator.styles.chalet },
                    ].map((s) => (
                      <motion.button
                        key={s.id}
                        type="button"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.96 }}
                        onClick={() => setStyle(s.id)}
                        className={`py-2.5 px-3 rounded-2xl text-xs font-mono font-medium transition-all ${
                          style === s.id
                            ? 'bg-[#111315] text-white dark:bg-white dark:text-[#111315] shadow-md'
                            : 'bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-300 hover:border-stone-400'
                        }`}
                      >
                        {s.label}
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Package Tier */}
                <div className="space-y-3">
                  <label className="font-mono text-xs uppercase font-bold text-neutral-900 dark:text-white tracking-wider block">
                    {t.calculator.packageTier}:
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    {[
                      {
                        id: 'contour',
                        label: t.calculator.tiers.contour.label,
                        desc: t.calculator.tiers.contour.desc,
                      },
                      {
                        id: 'whitebox',
                        label: t.calculator.tiers.whitebox.label,
                        desc: t.calculator.tiers.whitebox.desc,
                      },
                      {
                        id: 'allinclusive',
                        label: t.calculator.tiers.allinclusive.label,
                        desc: t.calculator.tiers.allinclusive.desc,
                      },
                    ].map((p) => (
                      <motion.button
                        key={p.id}
                        type="button"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => setTier(p.id as any)}
                        className={`p-3.5 rounded-2xl text-left border transition-all ${
                          tier === p.id
                            ? 'border-[#5B7E9F] bg-white dark:bg-stone-900 shadow-md ring-1 ring-[#5B7E9F]/40'
                            : 'border-stone-200 dark:border-stone-800 bg-white/60 dark:bg-stone-900/40 hover:border-stone-400'
                        }`}
                      >
                        <div className="font-display font-bold text-xs uppercase text-neutral-900 dark:text-white">
                          {p.label}
                        </div>
                        <div className="text-[10px] font-mono text-stone-500 mt-1">
                          {p.desc}
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Premium Add-on Checkboxes */}
                <div className="space-y-3 pt-2">
                  <label className="font-mono text-xs uppercase font-bold text-neutral-900 dark:text-white tracking-wider block">
                    {t.calculator.extraOptions}:
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    <label className="flex items-center gap-2.5 p-3 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 cursor-pointer text-xs font-mono select-none hover:border-stone-400 transition">
                      <input
                        type="checkbox"
                        checked={addSmartHome}
                        onChange={(e) => setAddSmartHome(e.target.checked)}
                        className="rounded accent-[#5B7E9F] w-4 h-4"
                      />
                      <span className="text-neutral-900 dark:text-white">
                        {t.calculator.addons.smartHome}
                      </span>
                    </label>

                    <label className="flex items-center gap-2.5 p-3 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 cursor-pointer text-xs font-mono select-none hover:border-stone-400 transition">
                      <input
                        type="checkbox"
                        checked={addSpa}
                        onChange={(e) => setAddSpa(e.target.checked)}
                        className="rounded accent-[#5B7E9F] w-4 h-4"
                      />
                      <span className="text-neutral-900 dark:text-white">
                        {t.calculator.addons.spa}
                      </span>
                    </label>

                    <label className="flex items-center gap-2.5 p-3 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 cursor-pointer text-xs font-mono select-none hover:border-stone-400 transition">
                      <input
                        type="checkbox"
                        checked={addGeothermal}
                        onChange={(e) => setAddGeothermal(e.target.checked)}
                        className="rounded accent-[#5B7E9F] w-4 h-4"
                      />
                      <span className="text-neutral-900 dark:text-white">
                        {t.calculator.addons.geothermal}
                      </span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Right Summary (5 cols) */}
              <div className="lg:col-span-5 p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#0E1012] border border-stone-200 dark:border-stone-800 shadow-2xl space-y-6">
                <div>
                  <span className="font-mono text-xs uppercase tracking-wider text-[#5B7E9F] dark:text-[#7EA2C4] font-bold block mb-1">
                    {t.calculator.preliminaryEstimate}
                  </span>
                  <motion.div
                    key={`${currency}-${calculation.totalRub}`}
                    initial={{ scale: 0.94, opacity: 0.8 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    className="font-display font-bold text-3xl sm:text-4xl text-neutral-950 dark:text-white tracking-tight"
                  >
                    {formatCurrency(calculation.totalRub, calculation.totalUsd)}
                  </motion.div>
                  <div className="text-xs font-mono text-stone-500 mt-1">
                    {language === 'ru'
                      ? `~${formatCurrency(calculation.perM2Rub, calculation.perM2Usd)}/м² ${t.calculator.m2}`
                      : `~${formatCurrency(calculation.perM2Rub, calculation.perM2Usd)}/m² living space`}
                  </div>
                </div>

                {/* Estimate Details */}
                <div className="space-y-3 pt-4 border-t border-stone-200 dark:border-stone-800 text-xs font-mono">
                  <div className="flex justify-between py-1">
                    <span className="text-stone-500">{t.calculator.estTimeline}:</span>
                    <span className="font-bold text-neutral-900 dark:text-white flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-[#5B7E9F]" />
                      {calculation.durationDays} {t.calculator.timelineDays}
                    </span>
                  </div>

                  <div className="flex justify-between py-1">
                    <span className="text-stone-500">{t.calculator.thermalEnvelope}:</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">
                      Passivhaus A++
                    </span>
                  </div>

                  <div className="flex justify-between py-1">
                    <span className="text-stone-500">{t.calculator.hiddenFees}:</span>
                    <span className="font-bold text-neutral-900 dark:text-white flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#5B7E9F]" />
                      {t.calculator.hiddenFeesValue}
                    </span>
                  </div>
                </div>

                {/* Bonus Voucher Callout */}
                <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800 text-xs space-y-1">
                  <div className="flex items-center gap-1.5 font-bold font-mono text-neutral-900 dark:text-white">
                    <Sparkles className="w-4 h-4 text-[#5B7E9F]" />
                    <span>{t.calculator.voucherTitle}</span>
                  </div>
                  <p className="text-[11px] text-stone-500 leading-relaxed">
                    {t.calculator.voucherDesc}
                  </p>
                </div>

                {/* Submit CTA Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={handleLockEstimate}
                  className="w-full py-4 rounded-full bg-[#111315] hover:bg-neutral-800 text-white dark:bg-white dark:hover:bg-stone-200 dark:text-[#111315] font-display font-bold text-xs uppercase tracking-wider transition shadow-lg flex items-center justify-center gap-2"
                >
                  <span>{t.calculator.lockEstimateBtn}</span>
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              </div>
            </motion.div>
          ) : (
            /* Tab 2: 4-Step Interactive Quiz */
            <motion.div
              key="quiz-tab"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="max-w-3xl mx-auto space-y-8"
            >
              <div className="flex items-center justify-between border-b border-stone-200 dark:border-stone-800 pb-4">
                <div>
                  <span className="font-mono text-xs text-[#5B7E9F] uppercase font-bold">
                    {t.calculator.stepCounter.replace('{step}', String(quizStep))}
                  </span>
                  <h3 className="font-display font-bold text-xl text-neutral-950 dark:text-white uppercase mt-1">
                    {quizStep === 1 && t.calculator.wizardTitle1}
                    {quizStep === 2 && t.calculator.wizardTitle2}
                    {quizStep === 3 && t.calculator.wizardTitle3}
                    {quizStep === 4 && t.calculator.wizardTitle4}
                  </h3>
                </div>
                <span className="font-mono text-xs text-stone-500">
                  {language === 'ru' ? 'Бонус: 150 000 ₽' : 'Bonus: $1,600'}
                </span>
              </div>

              {/* Quiz Options Animated Steps */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={quizStep}
                  initial={{ opacity: 0, x: 25 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -25 }}
                  transition={{ duration: 0.3 }}
                  className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                >
                  {quizStep === 1 &&
                    t.calculator.quizAnswers.step1.map((opt) => (
                      <motion.button
                        key={opt.id}
                        type="button"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => setQuizAnswers({ ...quizAnswers, areaRange: opt.id })}
                        className={`p-5 rounded-2xl border text-left transition ${
                          quizAnswers.areaRange === opt.id
                            ? 'border-[#5B7E9F] bg-white dark:bg-stone-900 shadow-md ring-1 ring-[#5B7E9F]/50'
                            : 'border-stone-200 dark:border-stone-800 hover:border-stone-400'
                        }`}
                      >
                        <div className="font-display font-bold text-sm uppercase text-neutral-900 dark:text-white">
                          {opt.label}
                        </div>
                        <div className="text-xs text-stone-500 font-sans mt-1">{opt.desc}</div>
                      </motion.button>
                    ))}

                  {quizStep === 2 &&
                    t.calculator.quizAnswers.step2.map((opt) => (
                      <motion.button
                        key={opt.id}
                        type="button"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => setQuizAnswers({ ...quizAnswers, material: opt.id })}
                        className={`p-5 rounded-2xl border text-left transition ${
                          quizAnswers.material === opt.id
                            ? 'border-[#5B7E9F] bg-white dark:bg-stone-900 shadow-md ring-1 ring-[#5B7E9F]/50'
                            : 'border-stone-200 dark:border-stone-800 hover:border-stone-400'
                        }`}
                      >
                        <div className="font-display font-bold text-sm uppercase text-neutral-900 dark:text-white">
                          {opt.label}
                        </div>
                        <div className="text-xs text-stone-500 font-sans mt-1">{opt.desc}</div>
                      </motion.button>
                    ))}

                  {quizStep === 3 &&
                    t.calculator.quizAnswers.step3.map((opt) => (
                      <motion.button
                        key={opt.id}
                        type="button"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => setQuizAnswers({ ...quizAnswers, timing: opt.id })}
                        className={`p-5 rounded-2xl border text-left transition ${
                          quizAnswers.timing === opt.id
                            ? 'border-[#5B7E9F] bg-white dark:bg-stone-900 shadow-md ring-1 ring-[#5B7E9F]/50'
                            : 'border-stone-200 dark:border-stone-800 hover:border-stone-400'
                        }`}
                      >
                        <div className="font-display font-bold text-sm uppercase text-neutral-900 dark:text-white">
                          {opt.label}
                        </div>
                        <div className="text-xs text-stone-500 font-sans mt-1">{opt.desc}</div>
                      </motion.button>
                    ))}

                  {quizStep === 4 &&
                    t.calculator.quizAnswers.step4.map((opt) => (
                      <motion.button
                        key={opt.id}
                        type="button"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => setQuizAnswers({ ...quizAnswers, landStatus: opt.id })}
                        className={`p-5 rounded-2xl border text-left transition ${
                          quizAnswers.landStatus === opt.id
                            ? 'border-[#5B7E9F] bg-white dark:bg-stone-900 shadow-md ring-1 ring-[#5B7E9F]/50'
                            : 'border-stone-200 dark:border-stone-800 hover:border-stone-400'
                        }`}
                      >
                        <div className="font-display font-bold text-sm uppercase text-neutral-900 dark:text-white">
                          {opt.label}
                        </div>
                        <div className="text-xs text-stone-500 font-sans mt-1">{opt.desc}</div>
                      </motion.button>
                    ))}
                </motion.div>
              </AnimatePresence>

              {/* Quiz Navigation Buttons */}
              <div className="flex items-center justify-between pt-6 border-t border-stone-200 dark:border-stone-800">
                <button
                  type="button"
                  disabled={quizStep === 1}
                  onClick={() => setQuizStep(quizStep - 1)}
                  className={`px-6 py-3 rounded-full text-xs font-mono uppercase transition ${
                    quizStep === 1
                      ? 'opacity-30 cursor-not-allowed text-stone-400'
                      : 'hover:bg-stone-200 dark:hover:bg-stone-800 text-neutral-900 dark:text-white'
                  }`}
                >
                  {t.calculator.btnBack}
                </button>

                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={handleQuizNext}
                  className="px-8 py-3.5 rounded-full bg-[#111315] text-white hover:bg-neutral-800 dark:bg-white dark:text-[#111315] dark:hover:bg-stone-200 font-display font-bold text-xs uppercase tracking-wider shadow-md flex items-center gap-2"
                >
                  <span>
                    {quizStep < 4 ? t.calculator.btnNext : t.calculator.btnSubmit}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </section>
  );
};
