import React, { useState } from 'react';
import { useThemeLanguage } from '../context/ThemeLanguageContext';
import { Compass, ArrowLeft, Send, CheckCircle2, Phone, Globe, Sun, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const NotFoundPage: React.FC = () => {
  const { language, toggleLanguage, activeTheme, toggleTheme, t, navigateTo } = useThemeLanguage();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedArea, setSelectedArea] = useState('350');
  const [selectedStyle, setSelectedStyle] = useState('fachwerk');
  const [messenger, setMessenger] = useState<'telegram' | 'whatsapp' | 'call'>('telegram');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 700);
  };

  return (
    <div className="min-h-screen bg-stone-100 dark:bg-[#0B0C0E] text-neutral-900 dark:text-white flex flex-col justify-between selection:bg-[#5B7E9F] selection:text-white">
      {/* Top Bar Navigation */}
      <header className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 flex items-center justify-between">
        <button
          onClick={() => navigateTo('home')}
          className="flex items-center gap-3 text-left group"
        >
          <div className="w-10 h-10 rounded-2xl bg-[#111315] text-white dark:bg-white dark:text-[#111315] flex items-center justify-center font-bold shadow-md transition group-hover:scale-105">
            <Compass className="w-5 h-5 text-[#5B7E9F]" />
          </div>
          <div>
            <span className="font-display font-bold text-lg uppercase tracking-wider block leading-tight">
              {t.nav.brand}
            </span>
            <span className="font-mono text-[9px] tracking-widest text-stone-500 uppercase block">
              {t.nav.tagline}
            </span>
          </div>
        </button>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-xs font-mono font-semibold hover:border-stone-400 transition shadow-xs"
            aria-label="Toggle language"
          >
            <Globe className="w-3.5 h-3.5 text-[#5B7E9F]" />
            <span className="uppercase">{language}</span>
          </button>

          <button
            onClick={toggleTheme}
            className="p-2 rounded-full bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-xs hover:border-stone-400 transition shadow-xs"
            aria-label="Toggle theme"
          >
            {activeTheme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-[#5B7E9F]" />
            )}
          </button>

          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => navigateTo('home')}
            className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#111315] text-white hover:bg-neutral-800 dark:bg-white dark:text-[#111315] dark:hover:bg-stone-200 font-display font-bold text-xs uppercase tracking-wider shadow-sm transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{t.notFound.backHome}</span>
          </motion.button>
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12 flex-1 flex flex-col justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: 404 Presentation */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-5 space-y-6"
          >
            <div className="inline-block px-3 py-1 rounded-full bg-[#5B7E9F]/15 border border-[#5B7E9F]/30 text-[#5B7E9F] dark:text-[#7EA2C4] font-mono text-xs uppercase font-bold tracking-widest">
              {t.notFound.badge}
            </div>

            <h1 className="font-display font-bold text-6xl sm:text-7xl lg:text-8xl text-neutral-950 dark:text-white leading-none tracking-tight">
              404
            </h1>

            <h2 className="font-display font-bold text-2xl sm:text-3xl uppercase tracking-tight text-neutral-900 dark:text-white leading-snug">
              {t.notFound.title}
            </h2>

            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 leading-relaxed font-normal">
              {t.notFound.desc}
            </p>

            <div className="pt-2">
              <motion.button
                whileTap={{ scale: 0.96 }}
                whileHover={{ x: -4 }}
                onClick={() => navigateTo('home')}
                className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-full bg-[#111315] text-white hover:bg-neutral-800 dark:bg-white dark:text-[#111315] dark:hover:bg-stone-200 font-display font-bold text-xs uppercase tracking-wider shadow-md transition"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>{t.notFound.backHome}</span>
              </motion.button>
            </div>

            <div className="pt-6 border-t border-stone-200 dark:border-stone-800 flex items-center gap-3 text-xs font-mono text-stone-500">
              <Phone className="w-4 h-4 text-[#5B7E9F]" />
              <a href="tel:+74958904412" className="hover:text-black dark:hover:text-white font-bold">
                +7 (495) 890-44-12
              </a>
              <span>•</span>
              <span>vip@arcline-estate.ru</span>
            </div>
          </motion.div>

          {/* Right Column: Interactive Order Request Form */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="lg:col-span-7 bg-white dark:bg-[#121519] border border-stone-200 dark:border-stone-800 rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden"
          >
            <div className="mb-6 space-y-1">
              <span className="font-mono text-xs uppercase tracking-wider text-[#5B7E9F] dark:text-[#7EA2C4] font-bold">
                {language === 'ru' ? 'СВЯЗЬ С БЮРО // ORDER' : 'VIP ESTIMATE INQUIRY'}
              </span>
              <h3 className="font-display font-bold text-xl sm:text-2xl text-neutral-950 dark:text-white uppercase">
                {t.notFound.formTitle}
              </h3>
              <p className="text-xs text-stone-600 dark:text-stone-400 font-normal">
                {t.notFound.formSubtitle}
              </p>
            </div>

            <AnimatePresence mode="wait">
              {!isSubmitted ? (
                <motion.form
                  key="order-form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleSubmit}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono uppercase text-stone-500 mb-1">
                        {t.notFound.labelName} *
                      </label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder={t.modal.namePlaceholder}
                        className="w-full px-4 py-3 rounded-2xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900 text-sm focus:outline-none focus:border-[#5B7E9F] text-neutral-900 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono uppercase text-stone-500 mb-1">
                        {t.notFound.labelPhone} *
                      </label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder={t.modal.phonePlaceholder}
                        className="w-full px-4 py-3 rounded-2xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900 text-sm focus:outline-none focus:border-[#5B7E9F] text-neutral-900 dark:text-white"
                      />
                    </div>
                  </div>

                  {/* Area selector */}
                  <div>
                    <label className="block text-xs font-mono uppercase text-stone-500 mb-1.5">
                      {t.notFound.labelArea}
                    </label>
                    <div className="grid grid-cols-4 gap-2 text-xs">
                      {['200', '350', '500', '700+'].map((a) => (
                        <button
                          key={a}
                          type="button"
                          onClick={() => setSelectedArea(a)}
                          className={`py-2 px-2 rounded-xl border text-center font-mono transition ${
                            selectedArea === a
                              ? 'border-[#5B7E9F] bg-stone-100 dark:bg-stone-900 text-[#5B7E9F] dark:text-[#7EA2C4] font-bold'
                              : 'border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400 hover:border-stone-400'
                          }`}
                        >
                          {a} {t.calculator.m2}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Style selector */}
                  <div>
                    <label className="block text-xs font-mono uppercase text-stone-500 mb-1.5">
                      {t.notFound.labelStyle}
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                      {[
                        { id: 'fachwerk', label: t.calculator.styles.fachwerk },
                        { id: 'minimal', label: t.calculator.styles.minimal },
                        { id: 'monolith', label: t.calculator.styles.monolith },
                        { id: 'chalet', label: t.calculator.styles.chalet },
                      ].map((s) => (
                        <button
                          key={s.id}
                          type="button"
                          onClick={() => setSelectedStyle(s.id)}
                          className={`py-2 px-2 rounded-xl border text-center font-mono transition truncate ${
                            selectedStyle === s.id
                              ? 'border-[#5B7E9F] bg-stone-100 dark:bg-stone-900 text-[#5B7E9F] dark:text-[#7EA2C4] font-bold'
                              : 'border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400 hover:border-stone-400'
                          }`}
                        >
                          {s.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Preferred Messenger */}
                  <div>
                    <label className="block text-xs font-mono uppercase text-stone-500 mb-1.5">
                      {t.modal.preferredMessenger}
                    </label>
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      {[
                        { id: 'telegram', label: t.modal.telegram },
                        { id: 'whatsapp', label: t.modal.whatsapp },
                        { id: 'call', label: t.modal.call },
                      ].map((m) => (
                        <button
                          key={m.id}
                          type="button"
                          onClick={() => setMessenger(m.id as any)}
                          className={`py-2 px-3 rounded-xl border text-center font-mono transition ${
                            messenger === m.id
                              ? 'border-[#5B7E9F] bg-stone-100 dark:bg-stone-900 text-[#5B7E9F] dark:text-[#7EA2C4] font-bold'
                              : 'border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400 hover:border-stone-400'
                          }`}
                        >
                          {m.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Notes / Wishes */}
                  <div>
                    <label className="block text-xs font-mono uppercase text-stone-500 mb-1">
                      {t.notFound.labelNotes}
                    </label>
                    <textarea
                      rows={2}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder={
                        language === 'ru'
                          ? 'Участок на Новой Риге, 25 соток, видовой уклон...'
                          : 'Plot location, elevation preferences, requested features...'
                      }
                      className="w-full px-4 py-2.5 rounded-2xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900 text-xs focus:outline-none focus:border-[#5B7E9F] text-neutral-900 dark:text-white resize-none"
                    />
                  </div>

                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    whileTap={{ scale: 0.97 }}
                    className="w-full py-4 rounded-full bg-[#111315] hover:bg-neutral-800 text-white dark:bg-white dark:hover:bg-stone-200 dark:text-[#111315] font-display font-bold text-xs uppercase tracking-wider transition shadow-md flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <span>{t.notFound.submitting}</span>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>{t.notFound.btnSubmit}</span>
                      </>
                    )}
                  </motion.button>
                </motion.form>
              ) : (
                <motion.div
                  key="success-order"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-12 text-center space-y-4"
                >
                  <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h4 className="font-display font-bold text-2xl uppercase text-neutral-950 dark:text-white">
                    {t.notFound.successTitle}
                  </h4>
                  <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 max-w-sm mx-auto leading-relaxed">
                    {t.notFound.successDesc}
                  </p>
                  <div className="p-3 rounded-2xl bg-stone-100 dark:bg-stone-900 font-mono text-xs text-stone-600 dark:text-stone-300">
                    {phone} • {selectedArea} {t.calculator.m2} • {messenger.toUpperCase()}
                  </div>
                  <div className="pt-4">
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() => navigateTo('home')}
                      className="px-8 py-3 rounded-full bg-[#111315] dark:bg-white text-white dark:text-[#111315] text-xs font-display font-bold uppercase tracking-wider"
                    >
                      {t.notFound.backHome}
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

        </div>
      </main>

      {/* Footer Strip */}
      <footer className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 border-t border-stone-200 dark:border-stone-800 text-xs font-mono text-stone-500 flex flex-col sm:flex-row items-center justify-between gap-2">
        <span>© 2026 ARCLINE ESTATE</span>
        <button onClick={() => navigateTo('home')} className="hover:text-black dark:hover:text-white underline">
          {t.notFound.backHome}
        </button>
      </footer>
    </div>
  );
};
