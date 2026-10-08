import React, { useState, useEffect } from 'react';
import { useThemeLanguage } from '../context/ThemeLanguageContext';
import { useSiteContent } from '../context/SiteContentContext';
import { DynamicIcon } from './DynamicIcon';
import { Compass, Menu, X, Phone, ArrowUpRight, Sun, Moon, Globe, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Currency } from '../types';

export const Navbar: React.FC = () => {
  const {
    language,
    toggleLanguage,
    activeTheme,
    toggleTheme,
    currency,
    setCurrency,
    t,
    openContactModal,
    openAppointmentModal,
  } = useThemeLanguage();
  const { content } = useSiteContent();
  const brand = content.brand;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currencyMenuOpen, setCurrencyMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '#cases', label: t.nav.cases || (language === 'ru' ? 'Кейсы' : 'Cases') },
    { href: '#projects', label: t.nav.projects },
    { href: '#calculator', label: t.nav.calculator, highlight: true },
    { href: '#team', label: t.nav.team || (language === 'ru' ? 'Команда' : 'Team') },
    { href: '#reviews', label: t.nav.reviews || (language === 'ru' ? 'Отзывы' : 'Reviews') },
  ];

  const currencies: Currency[] = ['RUB', 'USD', 'EUR', 'AED'];

  const handleLinkClick = () => {
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* Floating Capsule Header */}
      <header
        id="main-header"
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 pointer-events-none ${
          scrolled
            ? 'py-2 sm:py-3 px-2 sm:px-4 md:px-6'
            : 'py-2.5 sm:py-4 px-2 sm:px-5 md:px-7'
        }`}
      >
        <div
          className={`max-w-[1500px] mx-auto flex items-center justify-between gap-1.5 sm:gap-2 lg:gap-3 pointer-events-auto rounded-full px-2.5 sm:px-5 py-1.5 sm:py-2.5 transition-all duration-300 shadow-xl overflow-visible ${
            scrolled
              ? 'bg-white/95 dark:bg-[#0C0E10]/95 backdrop-blur-xl border border-stone-200/80 dark:border-stone-800/80 text-neutral-900 dark:text-white'
              : 'bg-black/55 backdrop-blur-md border border-white/15 text-white'
          }`}
        >
          {/* Brand Logo */}
          <a
            href="#"
            className="flex items-center gap-1.5 sm:gap-2.5 group focus:outline-none shrink-0"
            aria-label="Arcline Estate"
          >
            <div
              className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center font-display font-bold transition-all ${
                scrolled
                  ? 'bg-[#111315] dark:bg-white text-white dark:text-[#111315]'
                  : 'bg-white text-[#111315]'
              }`}
            >
              <DynamicIcon name={brand.logoIcon || 'Compass'} className="w-4 h-4 text-[#5B7E9F]" />
            </div>
            <div className="shrink-0">
              <span className="font-display font-bold text-xs sm:text-sm tracking-wider uppercase block leading-tight whitespace-nowrap">
                {brand.name || t.nav.brand}
              </span>
              <span
                className={`font-mono text-[7px] sm:text-[8px] tracking-widest uppercase hidden sm:block leading-none whitespace-nowrap ${
                  scrolled ? 'text-stone-500 dark:text-stone-400' : 'text-white/70'
                }`}
              >
                {brand.tagline[language] || t.nav.tagline}
              </span>
            </div>
          </a>

          {/* Desktop Navigation Links with Anti-Clipping whitespace-nowrap */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-1.5 text-xs font-medium shrink-0">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={`px-2.5 xl:px-3 py-1.5 rounded-full transition-all duration-200 whitespace-nowrap shrink-0 text-[11px] xl:text-xs ${
                  link.highlight
                    ? scrolled
                      ? 'bg-[#111315] text-white dark:bg-white dark:text-[#111315] font-semibold'
                      : 'bg-white text-[#111315] font-semibold'
                    : scrolled
                    ? 'text-stone-700 dark:text-stone-300 hover:text-black dark:hover:text-white hover:bg-stone-100 dark:hover:bg-stone-800/60'
                    : 'text-white/85 hover:text-white hover:bg-white/15'
                }`}
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Right Action Tools: Currency, Language, Theme & CTAs */}
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            {/* Currency Switcher (Hidden on small mobile, accessible in mobile drawer) */}
            <div className="relative hidden md:block">
              <button
                onClick={() => setCurrencyMenuOpen(!currencyMenuOpen)}
                className={`px-2 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-mono font-bold transition whitespace-nowrap shrink-0 ${
                  scrolled
                    ? 'bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 hover:bg-stone-200 dark:hover:bg-stone-700'
                    : 'bg-white/15 hover:bg-white/25 text-white'
                }`}
                title="Select Currency"
                aria-label="Change currency"
              >
                {currency}
              </button>

              <AnimatePresence>
                {currencyMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-2 w-28 bg-white dark:bg-[#14171A] border border-stone-200 dark:border-stone-800 rounded-xl shadow-2xl p-1 z-50 overflow-hidden"
                  >
                    {currencies.map((curr) => (
                      <button
                        key={curr}
                        onClick={() => {
                          setCurrency(curr);
                          setCurrencyMenuOpen(false);
                        }}
                        className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-mono transition flex items-center justify-between ${
                          currency === curr
                            ? 'bg-[#5B7E9F] text-white font-bold'
                            : 'text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'
                        }`}
                      >
                        <span>{curr}</span>
                        <span className="text-[10px] opacity-75">
                          {curr === 'RUB' ? '₽' : curr === 'USD' ? '$' : curr === 'EUR' ? '€' : 'AED'}
                        </span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Language Switch */}
            <button
              onClick={toggleLanguage}
              className={`flex items-center gap-1 px-2 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-mono font-bold transition whitespace-nowrap shrink-0 ${
                scrolled
                  ? 'bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 hover:bg-stone-200 dark:hover:bg-stone-700'
                  : 'bg-white/15 hover:bg-white/25 text-white'
              }`}
              title="Switch Language (RU / EN)"
              aria-label="Toggle language"
            >
              <Globe className="w-3 h-3 text-[#5B7E9F] dark:text-[#7EA2C4]" />
              <span className="uppercase text-[10px] sm:text-[11px] leading-none">{language}</span>
            </button>

            {/* Theme Switch (Always visible on mobile & desktop) */}
            <button
              onClick={toggleTheme}
              className={`inline-flex items-center justify-center p-1.5 sm:p-2 rounded-full text-xs transition shrink-0 min-w-[32px] min-h-[32px] sm:min-w-[36px] sm:min-h-[36px] ${
                scrolled
                  ? 'bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 hover:bg-stone-200 dark:hover:bg-stone-700'
                  : 'bg-white/15 hover:bg-white/25 text-white'
              }`}
              title={
                activeTheme === 'dark'
                  ? (language === 'ru' ? 'Включить светлую тему' : 'Switch to light theme')
                  : (language === 'ru' ? 'Включить темную тему' : 'Switch to dark theme')
              }
              aria-label="Toggle dark/light theme"
            >
              {activeTheme === 'dark' ? (
                <Sun className="w-3.5 h-3.5 text-amber-400" />
              ) : (
                <Moon className="w-3.5 h-3.5 text-[#5B7E9F] dark:text-[#7EA2C4]" />
              )}
            </button>

            {/* Call button (ultra wide desktop) */}
            <a
              href={`tel:${brand.phone.replace(/[^+\d]/g, '')}`}
              className={`hidden 2xl:flex items-center gap-1.5 text-xs font-mono font-medium px-2.5 py-1.5 rounded-full transition whitespace-nowrap shrink-0 ${
                scrolled
                  ? 'text-stone-700 dark:text-stone-300 hover:text-black dark:hover:text-white'
                  : 'text-white/90 hover:text-white'
              }`}
            >
              <Phone className="w-3.5 h-3.5 text-[#5B7E9F]" />
              <span className="whitespace-nowrap">{brand.phone}</span>
            </a>

            {/* Appointment Booking Button (Desktop) */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.02 }}
              onClick={openAppointmentModal}
              className={`hidden xl:inline-flex items-center gap-1.5 px-3 py-1.5 sm:py-2 rounded-full text-[11px] font-display font-bold uppercase tracking-wider transition whitespace-nowrap shrink-0 ${
                scrolled
                  ? 'bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-900 dark:text-white'
                  : 'bg-white/20 hover:bg-white/30 text-white border border-white/25'
              }`}
              title={t.nav.bookVisit || (language === 'ru' ? 'Записаться в шоурум' : 'Book Showroom')}
            >
              <Calendar className="w-3 h-3 text-[#5B7E9F]" />
              <span className="whitespace-nowrap">
                {language === 'ru' ? 'Шоурум' : 'Showroom'}
              </span>
            </motion.button>

            {/* Primary Consultation Action Button - Perfectly proportioned on PC and mobile */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.03 }}
              onClick={() =>
                openContactModal(
                  language === 'ru' ? 'Шапка: Консультация' : 'Header: Consultation'
                )
              }
              className={`inline-flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-full text-[10px] sm:text-xs font-display font-bold uppercase tracking-wider transition-all duration-200 shadow-md whitespace-nowrap shrink-0 ${
                scrolled
                  ? 'bg-[#111315] hover:bg-neutral-800 text-white dark:bg-white dark:hover:bg-stone-200 dark:text-[#111315]'
                  : 'bg-white hover:bg-stone-100 text-[#111315]'
              }`}
            >
              <span className="hidden sm:inline whitespace-nowrap">{t.nav.consultation}</span>
              <span className="sm:hidden whitespace-nowrap">{language === 'ru' ? 'Связь' : 'Call'}</span>
              <ArrowUpRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
            </motion.button>

            {/* Mobile Menu Trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`lg:hidden p-1.5 sm:p-2 rounded-full transition min-w-[34px] min-h-[34px] sm:min-w-[40px] sm:min-h-[40px] flex items-center justify-center shrink-0 z-10 ${
                scrolled
                  ? 'bg-stone-100 dark:bg-stone-800 text-neutral-900 dark:text-white'
                  : 'bg-white/15 text-white'
              }`}
              aria-label="Open mobile menu"
            >
              {mobileMenuOpen ? <X className="w-4 h-4 sm:w-5 sm:h-5" /> : <Menu className="w-4 h-4 sm:w-5 sm:h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="fixed inset-0 z-40 bg-black/85 backdrop-blur-2xl lg:hidden flex flex-col justify-between p-6 pt-24 overflow-y-auto"
            onClick={() => setMobileMenuOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.25 }}
              className="space-y-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-white/15 pb-4">
                <span className="font-mono text-xs text-stone-400 uppercase tracking-widest whitespace-nowrap">
                  Навигация // Navigation
                </span>
                <div className="flex items-center gap-2">
                  <div className="flex rounded-lg overflow-hidden border border-white/20">
                    {currencies.map((curr) => (
                      <button
                        key={curr}
                        onClick={() => setCurrency(curr)}
                        className={`px-2 py-1 text-[11px] font-mono uppercase ${
                          currency === curr ? 'bg-white text-black font-bold' : 'bg-white/10 text-white'
                        }`}
                      >
                        {curr}
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={toggleLanguage}
                    className="px-2.5 py-1 rounded-full bg-white/15 text-white font-mono text-xs uppercase"
                  >
                    {language.toUpperCase()}
                  </button>
                  <button
                    onClick={toggleTheme}
                    className="p-1.5 rounded-full bg-white/15 text-white text-xs"
                  >
                    {activeTheme === 'dark' ? (
                      <Sun className="w-4 h-4 text-amber-400" />
                    ) : (
                      <Moon className="w-4 h-4 text-sky-400" />
                    )}
                  </button>
                </div>
              </div>

              <nav className="flex flex-col gap-2">
                {navLinks.map((link, idx) => (
                  <motion.a
                    key={link.href}
                    href={link.href}
                    onClick={handleLinkClick}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.08 + idx * 0.03 }}
                    className="font-display font-bold text-xl uppercase tracking-tight text-white hover:text-[#7EA2C4] transition py-1.5 whitespace-nowrap"
                  >
                    {link.label}
                  </motion.a>
                ))}
              </nav>

              {/* Dedicated Mobile Theme & Appearance Switch Row */}
              <div className="p-3 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {activeTheme === 'dark' ? (
                    <Moon className="w-4 h-4 text-[#7EA2C4]" />
                  ) : (
                    <Sun className="w-4 h-4 text-amber-400" />
                  )}
                  <span className="font-mono text-xs text-stone-200">
                    {language === 'ru' ? 'Тема оформления' : 'Theme'}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={toggleTheme}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white font-mono text-xs transition active:scale-95"
                >
                  {activeTheme === 'dark' ? (
                    <>
                      <Sun className="w-3.5 h-3.5 text-amber-400" />
                      <span>{language === 'ru' ? 'Светлая' : 'Light'}</span>
                    </>
                  ) : (
                    <>
                      <Moon className="w-3.5 h-3.5 text-[#7EA2C4]" />
                      <span>{language === 'ru' ? 'Темная' : 'Dark'}</span>
                    </>
                  )}
                </button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="pt-6 border-t border-white/15 space-y-3"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  openAppointmentModal();
                }}
                className="w-full py-3 rounded-full bg-white/15 border border-white/25 text-white font-display font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 whitespace-nowrap"
              >
                <Calendar className="w-4 h-4 text-[#7EA2C4]" />
                <span>{language === 'ru' ? 'Забронировать встречу в шоуруме' : 'Book Discovery Meeting'}</span>
              </button>

              <a
                href="tel:+74958904412"
                className="flex items-center justify-center gap-2 font-mono text-sm text-white font-bold py-1 whitespace-nowrap"
              >
                <Phone className="w-4 h-4 text-[#7EA2C4]" />
                <span>+7 (495) 890-44-12</span>
              </a>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  openContactModal(language === 'ru' ? 'Мобильное меню' : 'Mobile menu');
                }}
                className="w-full py-3.5 rounded-full bg-white text-[#111315] font-display font-bold text-xs uppercase tracking-wider transition active:scale-95 whitespace-nowrap"
              >
                {t.nav.consultation}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

