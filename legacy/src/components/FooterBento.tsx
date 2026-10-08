import React from 'react';
import { useThemeLanguage } from '../context/ThemeLanguageContext';
import { useSiteContent } from '../context/SiteContentContext';
import { DynamicIcon } from './DynamicIcon';
import { Compass, MapPin, Clock, Globe, Sun, Moon, ArrowUpRight, Lock } from 'lucide-react';
import { motion } from 'motion/react';
import { ShowroomMap } from './ShowroomMap';

export const FooterBento: React.FC = () => {
  const { language, toggleLanguage, activeTheme, toggleTheme, t, openContactModal, navigateTo } =
    useThemeLanguage();
  const { content, openEditor } = useSiteContent();
  const brand = content.brand;

  return (
    <footer id="contacts" className="w-full pt-8 pb-12 px-4 sm:px-6 md:px-8 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 35 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="rounded-[28px] sm:rounded-[36px] bg-[#111315] text-white p-6 sm:p-10 lg:p-14 border border-stone-800 shadow-2xl space-y-10"
      >
        {/* Top Grid: Brand + Office + Contacts */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 sm:gap-12 pb-10 border-b border-white/10">
          
          {/* Col 1: Brand & Identity (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white text-[#111315] flex items-center justify-center font-display font-bold text-lg shadow-md">
                <DynamicIcon name={brand.logoIcon || 'Compass'} className="w-5 h-5 text-[#5B7E9F]" />
              </div>
              <div>
                <span className="font-display font-bold text-xl tracking-wider uppercase block leading-none">
                  {brand.name || t.nav.brand}
                </span>
                <span className="font-mono text-[9px] tracking-widest text-[#7EA2C4] uppercase block mt-1">
                  {brand.tagline[language] || t.nav.tagline}
                </span>
              </div>
            </div>

            <p className="text-xs text-stone-400 max-w-sm leading-relaxed font-normal">
              {t.footer.brandDesc}
            </p>

            <div className="pt-2 flex items-center gap-2">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={toggleLanguage}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-xs font-mono font-semibold transition"
              >
                <Globe className="w-3.5 h-3.5 text-[#7EA2C4]" />
                <span>{language.toUpperCase()}</span>
              </motion.button>

              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={toggleTheme}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-xs transition"
                aria-label="Toggle Theme"
              >
                {activeTheme === 'dark' ? (
                  <Sun className="w-4 h-4 text-amber-400" />
                ) : (
                  <Moon className="w-4 h-4 text-[#7EA2C4]" />
                )}
              </motion.button>
            </div>
          </div>

          {/* Col 2: Showroom & Office (4 cols) */}
          <div className="lg:col-span-4 space-y-3 font-mono text-xs">
            <span className="text-[#7EA2C4] uppercase tracking-wider block font-bold">
              {t.footer.showroomTitle}
            </span>
            <div className="flex items-start gap-2.5 text-stone-200">
              <MapPin className="w-4 h-4 text-[#7EA2C4] shrink-0 mt-0.5" />
              <p className="leading-relaxed font-sans text-xs">
                {brand.address[language] || t.footer.showroomAddress}
              </p>
            </div>
            <div className="flex items-center gap-2.5 text-stone-400 pt-1">
              <Clock className="w-4 h-4 text-stone-500 shrink-0" />
              <span className="text-[11px]">{brand.hours[language] || t.footer.hours}</span>
            </div>
          </div>

          {/* Col 3: Direct Line & Lead Button (3 cols) */}
          <div className="lg:col-span-3 space-y-3 font-mono text-xs">
            <span className="text-[#7EA2C4] uppercase tracking-wider block font-bold">
              {t.footer.contactsTitle}
            </span>
            <div className="space-y-1.5">
              <a
                href={`tel:${brand.phone.replace(/[^+\d]/g, '')}`}
                className="text-white hover:text-[#7EA2C4] transition block font-bold text-sm"
              >
                {brand.phone || t.footer.phone}
              </a>
              <a
                href={`mailto:${brand.email}`}
                className="text-stone-400 hover:text-white transition block"
              >
                {brand.email || t.footer.email}
              </a>
            </div>

            <div className="pt-2">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.95 }}
                onClick={() =>
                  openContactModal(
                    language === 'ru' ? 'Футер: VIP Консультация' : 'Footer: VIP Consultation'
                  )
                }
                className="w-full py-3.5 rounded-full bg-white hover:bg-zinc-100 text-[#111315] font-display font-bold text-xs uppercase tracking-wider transition shadow-md flex items-center justify-center gap-1.5"
              >
                <span>{t.footer.vipConsultation}</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </motion.button>
            </div>
          </div>

        </div>

        {/* Middle Interactive Showroom Map */}
        <ShowroomMap />

        {/* Bottom Legal Copyright Strip */}
        <div className="pt-6 flex flex-col sm:flex-row justify-between items-center text-[11px] font-mono text-stone-400 gap-4 border-t border-white/10">
          <span>{t.footer.copyright}</span>
          <div className="flex items-center gap-4">
            <span className="hidden md:inline-block text-stone-400">
              {t.footer.annexNote}
            </span>
            <span>•</span>
            <button
              onClick={() => navigateTo('404')}
              className="text-stone-400 hover:text-white underline transition"
            >
              {t.nav.test404}
            </button>
            <span>•</span>
            <button
              onClick={openEditor}
              className="text-stone-400 hover:text-white underline transition inline-flex items-center gap-1 font-mono"
              title="Панель администратора CMS"
            >
              <Lock className="w-3 h-3 text-[#7EA2C4]" />
              <span>{language === 'ru' ? 'Вход в CMS' : 'Admin CMS'}</span>
            </button>
          </div>
          <a href="#" className="hover:text-stone-200 transition">
            {t.footer.privacy}
          </a>
        </div>

      </motion.div>
    </footer>
  );
};
