import React from 'react';
import { useThemeLanguage } from '../context/ThemeLanguageContext';
import { PACKAGE_TIERS } from '../data/landingData';
import { Check, ArrowUpRight, Clock } from 'lucide-react';
import { motion } from 'motion/react';

export const PackagesBento: React.FC = () => {
  const { language, t, openContactModal } = useThemeLanguage();

  return (
    <section
      id="packages"
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
            {language === 'ru' ? 'КОМПЛЕКТАЦИИ // PACKAGES' : 'SPECIFICATION TIERS'}
          </div>
          <div className="font-mono text-[10px] text-stone-500 dark:text-stone-400 mt-1 uppercase tracking-wider">
            FIXED ESTIMATE GUARANTEE
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
            {t.packages.title}
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 max-w-2xl font-normal leading-relaxed">
            {t.packages.subtitle}
          </p>
        </motion.div>
      </div>

      {/* 3-Column Bento Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 items-stretch">
        {PACKAGE_TIERS.map((pkg, idx) => {
          const isFeatured = pkg.isPopular;
          const formattedPrice =
            language === 'ru'
              ? `от ${pkg.pricePerM2Rub.toLocaleString()} ₽`
              : `from $${pkg.pricePerM2Usd.toLocaleString()}`;

          return (
            <motion.div
              key={pkg.id}
              id={`package-tier-${pkg.id}`}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ duration: 0.5, delay: idx * 0.12 }}
              whileHover={{ y: -6 }}
              className={`p-6 sm:p-8 rounded-[28px] sm:rounded-3xl flex flex-col justify-between transition-shadow relative ${
                isFeatured
                  ? 'bg-[#111315] text-white border-2 border-[#5B7E9F] shadow-2xl'
                  : 'bg-stone-50 dark:bg-[#121519] text-neutral-900 dark:text-white border border-stone-200/80 dark:border-stone-800/80 shadow-xs'
              }`}
            >
              {/* Featured Badge */}
              {isFeatured && pkg.badge && (
                <div className="absolute -top-3.5 right-6 px-3.5 py-1 rounded-full bg-[#5B7E9F] text-white font-mono text-[10px] uppercase font-bold tracking-wider shadow-md">
                  ★ {pkg.badge[language]}
                </div>
              )}

              {/* Header Info */}
              <div className="space-y-4">
                <div>
                  <span
                    className={`text-xs font-mono uppercase tracking-wider block ${
                      isFeatured ? 'text-[#7EA2C4]' : 'text-stone-500 dark:text-stone-400'
                    }`}
                  >
                    {pkg.subtitle[language]}
                  </span>
                  <h3 className="font-display font-bold text-2xl sm:text-3xl uppercase tracking-tight mt-1">
                    {pkg.title[language]}
                  </h3>
                </div>

                {/* Price Display */}
                <div className="pt-2">
                  <div className="text-2xl sm:text-3xl font-display font-bold">
                    {formattedPrice}{' '}
                    <span
                      className={`text-xs font-normal font-mono ${
                        isFeatured ? 'text-stone-300' : 'text-stone-500'
                      }`}
                    >
                      / {t.packages.perM2}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] font-mono mt-1 text-stone-400">
                    <Clock className="w-3.5 h-3.5 text-[#5B7E9F]" />
                    <span>{pkg.timeline[language]}</span>
                  </div>
                </div>

                {/* Features Checklist */}
                <div
                  className={`pt-5 border-t space-y-2.5 ${
                    isFeatured ? 'border-white/15' : 'border-stone-200 dark:border-stone-800'
                  }`}
                >
                  <span
                    className={`text-[11px] font-mono uppercase block font-semibold ${
                      isFeatured ? 'text-stone-300' : 'text-stone-500'
                    }`}
                  >
                    {t.packages.included}
                  </span>
                  {pkg.features[language].map((feat, i) => (
                    <div key={i} className="flex items-start gap-2.5 text-xs leading-relaxed">
                      <Check
                        className={`w-4 h-4 shrink-0 mt-0.5 ${
                          isFeatured ? 'text-[#7EA2C4]' : 'text-[#5B7E9F]'
                        }`}
                      />
                      <span className={isFeatured ? 'text-stone-200' : 'text-stone-600 dark:text-stone-300'}>
                        {feat}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-8">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() =>
                    openContactModal(
                      language === 'ru'
                        ? `Выбор комплектации: ${pkg.title[language]} (${formattedPrice}/м²)`
                        : `Selected package tier: ${pkg.title[language]} (${formattedPrice}/m²)`
                    )
                  }
                  className={`w-full py-3.5 rounded-full text-xs font-display font-bold uppercase tracking-wider transition flex items-center justify-center gap-2 shadow-sm ${
                    isFeatured
                      ? 'bg-white hover:bg-zinc-100 text-[#111315]'
                      : 'bg-[#111315] hover:bg-neutral-800 dark:bg-white dark:hover:bg-stone-200 text-white dark:text-[#111315]'
                  }`}
                >
                  <span>{t.packages.choosePlan}</span>
                  <ArrowUpRight className="w-4 h-4" />
                </motion.button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};
