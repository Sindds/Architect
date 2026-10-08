import React, { useState } from 'react';
import { useThemeLanguage } from '../context/ThemeLanguageContext';
import { useSiteContent } from '../context/SiteContentContext';
import { ReviewItem } from '../types';
import { Star, CheckCircle2, Play, MessageSquareQuote, MapPin, Home, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { LazyImage } from './LazyImage';

export const ReviewsSection: React.FC = () => {
  const { language, t } = useThemeLanguage();
  const { content } = useSiteContent();
  const reviews = content.reviews;
  const [activeVideoUrl, setActiveVideoUrl] = useState<string | null>(null);

  return (
    <section id="reviews" className="py-20 sm:py-28 px-4 sm:px-6 md:px-8 max-w-[1500px] mx-auto w-full">
      {/* Header with entrance/exit animation */}
      <motion.div
        initial={{ opacity: 0, y: 35 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.2 }}
        transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
        className="text-center max-w-3xl mx-auto mb-12 sm:mb-16 space-y-4"
      >
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#5B7E9F]/10 dark:bg-[#7EA2C4]/15 border border-[#5B7E9F]/20 text-[#5B7E9F] dark:text-[#7EA2C4] font-mono text-[10px] sm:text-xs uppercase tracking-wider">
          <MessageSquareQuote className="w-3.5 h-3.5" />
          <span>{t.reviews.sectionBadge}</span>
        </div>

        <h2 className="font-display font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl uppercase tracking-tight text-neutral-900 dark:text-white">
          {t.reviews.title}
        </h2>

        <p className="text-sm sm:text-base text-stone-600 dark:text-stone-300 max-w-2xl mx-auto leading-relaxed">
          {t.reviews.subtitle}
        </p>

        {/* Rating Score Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 font-mono text-xs">
          <div className="flex text-amber-500">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-3.5 h-3.5 fill-current" />
            ))}
          </div>
          <span className="font-bold">{t.reviews.ratingStars}</span>
        </div>
      </motion.div>

      {/* Reviews Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        {reviews.map((rev, idx) => (
          <motion.div
            key={rev.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.15 }}
            transition={{ duration: 0.8, delay: idx * 0.12, ease: [0.22, 1, 0.36, 1] }}
            className="rounded-3xl p-6 sm:p-7 bg-stone-50 dark:bg-[#14171A] border border-stone-200 dark:border-stone-800 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between space-y-6"
          >
            {/* Top Author & Villa Bar */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <LazyImage
                    src={rev.avatar}
                    alt={rev.authorName[language]}
                    wrapperClassName="w-12 h-12 rounded-full overflow-hidden border-2 border-white dark:border-stone-800 shadow shrink-0"
                    className="w-full h-full object-cover"
                  />
                  <div>
                    <h3 className="font-display font-bold text-sm sm:text-base text-neutral-900 dark:text-white leading-tight">
                      {rev.authorName[language]}
                    </h3>
                    <div className="font-mono text-[11px] text-stone-500">
                      {rev.authorTitle[language]}
                    </div>
                  </div>
                </div>

                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono text-[10px] uppercase font-bold">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>{t.reviews.verifiedOwner}</span>
                </span>
              </div>

              {/* Location & Villa Meta */}
              <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-stone-500 dark:text-stone-400 pt-1">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-[#5B7E9F]" />
                  <span>{rev.location[language]}</span>
                </span>
                <span className="flex items-center gap-1">
                  <Home className="w-3 h-3 text-[#5B7E9F]" />
                  <span>{rev.villaName} ({rev.area} м²)</span>
                </span>
              </div>

              {/* Villa Photo Thumbnail with Video Action if available */}
              <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden bg-stone-200 dark:bg-stone-800">
                <LazyImage
                  src={rev.villaPhoto}
                  alt={rev.villaName}
                  wrapperClassName="w-full h-full"
                  className="w-full h-full object-cover"
                />
                {rev.videoUrl && (
                  <button
                    onClick={() => setActiveVideoUrl(rev.videoUrl!)}
                    className="absolute inset-0 m-auto w-12 h-12 rounded-full bg-black/70 hover:bg-black/90 text-white flex items-center justify-center transition shadow-lg backdrop-blur-sm group active:scale-95"
                    title={t.reviews.viewVideo}
                  >
                    <Play className="w-5 h-5 fill-current ml-0.5 text-white" />
                  </button>
                )}
                <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/60 backdrop-blur-md text-white font-mono text-[10px]">
                  Построено в {rev.yearBuilt}
                </div>
              </div>

              {/* Review Text */}
              <p className="text-xs sm:text-sm text-stone-700 dark:text-stone-300 leading-relaxed italic">
                {rev.text[language]}
              </p>
            </div>

            {/* Bottom Stars */}
            <div className="pt-4 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between">
              <div className="flex text-amber-500">
                {[...Array(rev.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <span className="font-mono text-[11px] text-stone-400">
                {language === 'ru' ? 'Акт ввода объекта подписан' : 'Handover deed verified'}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Video Modal Player */}
      <AnimatePresence>
        {activeVideoUrl && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-4"
            onClick={() => setActiveVideoUrl(null)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="relative w-full max-w-3xl bg-[#111315] border border-white/15 rounded-3xl overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-4 border-b border-white/10">
                <span className="font-mono text-xs text-stone-300 uppercase">
                  {language === 'ru' ? 'Видеоотзыв владельца виллы' : 'Villa Owner Video Review'}
                </span>
                <button
                  onClick={() => setActiveVideoUrl(null)}
                  className="p-1.5 rounded-full bg-white/10 text-white hover:bg-white/20"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="aspect-video w-full bg-black">
                <video src={activeVideoUrl} controls autoPlay playsInline className="w-full h-full object-contain" />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
