import React, { useState } from 'react';
import { useThemeLanguage } from '../context/ThemeLanguageContext';
import { FAQ_ITEMS } from '../data/landingData';
import { Plus, Minus, HelpCircle, PhoneCall, ArrowUpRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const FaqBento: React.FC = () => {
  const { language, t, openContactModal } = useThemeLanguage();
  const [openId, setOpenId] = useState<string | null>('faq-1');

  const toggleItem = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section
      id="faq"
      className="w-full py-16 sm:py-24 px-4 sm:px-6 md:px-8 max-w-7xl mx-auto border-t border-stone-200/80 dark:border-stone-800/80"
    >
      {/* 12-Col Section Header */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start mb-12 sm:mb-16">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-3"
        >
          <div className="inline-block font-mono text-xs uppercase tracking-widest text-[#5B7E9F] dark:text-[#7EA2C4] font-semibold">
            {language === 'ru' ? 'FAQ // ОТВЕТЫ' : 'FAQ // TECHNICAL'}
          </div>
          <div className="font-mono text-[10px] text-stone-500 dark:text-stone-400 mt-1 uppercase tracking-wider">
            {language === 'ru' ? 'ЭКСПЕРТИЗА БЮРО' : 'EXPERT ADVICE'}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.65, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-9 space-y-3"
        >
          <h2 className="font-display font-normal text-2xl sm:text-4xl lg:text-5xl uppercase tracking-tight leading-[1.1] text-neutral-950 dark:text-white">
            {t.faq.title}
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 max-w-2xl font-normal leading-relaxed">
            {t.faq.subtitle}
          </p>
        </motion.div>
      </div>

      {/* Bento Grid: Left Consultation Box + Right Accordions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
        
        {/* Left Side Bento Card (4 cols) */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-4 p-6 sm:p-8 rounded-3xl bg-[#111315] text-white border border-stone-800 shadow-xl space-y-6"
        >
          <div className="w-12 h-12 rounded-2xl bg-white/10 text-[#7EA2C4] flex items-center justify-center">
            <HelpCircle className="w-6 h-6" />
          </div>

          <div>
            <span className="font-mono text-xs uppercase tracking-wider text-[#7EA2C4] font-bold block mb-1">
              {t.faq.hotlineTitle}
            </span>
            <h3 className="font-display font-bold text-xl sm:text-2xl uppercase tracking-tight leading-snug">
              {t.faq.hotlineHeading}
            </h3>
            <p className="text-xs text-stone-300 mt-2 leading-relaxed">
              {t.faq.hotlineDesc}
            </p>
          </div>

          <div className="pt-4 border-t border-white/15 space-y-3">
            <a
              href="tel:+74958904412"
              className="flex items-center gap-2.5 font-mono text-sm font-bold text-white hover:text-[#7EA2C4] transition"
            >
              <PhoneCall className="w-4 h-4 text-[#7EA2C4]" />
              <span>+7 (495) 890-44-12</span>
            </a>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.96 }}
              onClick={() =>
                openContactModal(
                  language === 'ru'
                    ? 'Вопрос главному конструктору'
                    : 'Inquiry for Chief Structural Engineer'
                )
              }
              className="w-full py-3.5 rounded-full bg-white text-[#111315] hover:bg-zinc-100 font-display font-bold text-xs uppercase tracking-wider transition shadow-sm flex items-center justify-center gap-2"
            >
              <span>{t.faq.engineerBtn}</span>
              <ArrowUpRight className="w-4 h-4" />
            </motion.button>
          </div>
        </motion.div>

        {/* Right Side Accordion List (8 cols) */}
        <div className="lg:col-span-8 space-y-3">
          {FAQ_ITEMS.map((item, idx) => {
            const isOpen = openId === item.id;
            return (
              <motion.div
                key={item.id}
                id={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-20px' }}
                transition={{ duration: 0.45, delay: idx * 0.05 }}
                className={`p-6 rounded-3xl border transition-all duration-200 cursor-pointer ${
                  isOpen
                    ? 'bg-white dark:bg-[#121519] border-[#5B7E9F] shadow-md ring-1 ring-[#5B7E9F]/30'
                    : 'bg-stone-50 dark:bg-stone-900/40 border-stone-200/80 dark:border-stone-800/80 hover:border-stone-300 dark:hover:border-stone-700'
                }`}
                onClick={() => toggleItem(item.id)}
              >
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <span className="font-mono text-[10px] uppercase font-bold text-[#5B7E9F] dark:text-[#7EA2C4] tracking-wider block mb-1">
                      {item.category[language]}
                    </span>
                    <h3 className="font-display font-bold text-sm sm:text-base text-neutral-900 dark:text-white uppercase leading-snug">
                      {item.question[language]}
                    </h3>
                  </div>

                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.25 }}
                    className="w-8 h-8 rounded-full border border-stone-300 dark:border-stone-700 flex items-center justify-center shrink-0 text-stone-600 dark:text-stone-300"
                  >
                    {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  </motion.div>
                </div>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <div className="pt-4 mt-4 border-t border-stone-200/80 dark:border-stone-800/80 text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed font-normal">
                        {item.answer[language]}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
