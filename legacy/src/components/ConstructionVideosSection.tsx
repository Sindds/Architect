import React, { useState } from 'react';
import { useThemeLanguage } from '../context/ThemeLanguageContext';
import { CONSTRUCTION_VIDEOS } from '../data/landingData';
import { ConstructionVideo } from '../types';
import { Play, Video, X, Clock, Wrench, ShieldAlert } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { LazyImage } from './LazyImage';

export const ConstructionVideosSection: React.FC = () => {
  const { language, t } = useThemeLanguage();
  const [activeVideo, setActiveVideo] = useState<ConstructionVideo | null>(null);

  return (
    <section id="videos" className="py-20 sm:py-28 px-4 sm:px-6 md:px-8 max-w-[1500px] mx-auto w-full">
      {/* Header with entrance/exit animation */}
      <motion.div
        initial={{ opacity: 0, y: 35 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.2 }}
        transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
        className="text-center max-w-3xl mx-auto mb-12 sm:mb-16 space-y-4"
      >
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#5B7E9F]/10 dark:bg-[#7EA2C4]/15 border border-[#5B7E9F]/20 text-[#5B7E9F] dark:text-[#7EA2C4] font-mono text-[10px] sm:text-xs uppercase tracking-wider">
          <Video className="w-3.5 h-3.5" />
          <span>{t.videos.sectionBadge}</span>
        </div>

        <h2 className="font-display font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl uppercase tracking-tight text-neutral-900 dark:text-white">
          {t.videos.title}
        </h2>

        <p className="text-sm sm:text-base text-stone-600 dark:text-stone-300 max-w-2xl mx-auto leading-relaxed">
          {t.videos.subtitle}
        </p>
      </motion.div>

      {/* Video Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
        {CONSTRUCTION_VIDEOS.map((vid, idx) => (
          <motion.div
            key={vid.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.15 }}
            transition={{ duration: 0.8, delay: idx * 0.12, ease: [0.22, 1, 0.36, 1] }}
            className="group relative rounded-3xl overflow-hidden bg-stone-100 dark:bg-[#14171A] border border-stone-200 dark:border-stone-800 shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col justify-between"
          >
            {/* Thumbnail Box */}
            <div className="relative aspect-[16/9] w-full overflow-hidden bg-black/40">
              <LazyImage
                src={vid.thumbnail}
                alt={vid.title[language]}
                wrapperClassName="w-full h-full"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent pointer-events-none" />

              {/* Play Trigger Badge */}
              <button
                onClick={() => setActiveVideo(vid)}
                aria-label={`Play ${vid.title[language]}`}
                className="absolute inset-0 m-auto w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white/90 hover:bg-white text-neutral-900 flex items-center justify-center shadow-2xl transition-transform group-hover:scale-110 active:scale-95"
              >
                <Play className="w-6 h-6 fill-current ml-1 text-[#111315]" />
              </button>

              {/* Top Tags */}
              <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/20 text-white font-mono text-[10px] sm:text-xs uppercase tracking-wider">
                  {vid.category[language]}
                </span>
                <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/20 text-white font-mono text-[10px] sm:text-xs">
                  <Clock className="w-3 h-3" />
                  <span>{vid.duration}</span>
                </span>
              </div>

              {/* Bottom Equipment Tag */}
              <div className="absolute bottom-3 left-4 right-4 flex items-center gap-2 text-white/90 font-mono text-[11px]">
                <Wrench className="w-3.5 h-3.5 text-[#7EA2C4]" />
                <span className="truncate">{vid.equipmentTag}</span>
              </div>
            </div>

            {/* Video Meta Content */}
            <div className="p-5 sm:p-6 space-y-3">
              <h3 className="font-display font-bold text-base sm:text-lg uppercase text-neutral-900 dark:text-white leading-snug group-hover:text-[#5B7E9F] dark:group-hover:text-[#7EA2C4] transition-colors">
                {vid.title[language]}
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 line-clamp-2 leading-relaxed">
                {vid.description[language]}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Engineering Legal Notice */}
      <div className="mt-8 text-center font-mono text-[11px] sm:text-xs text-stone-500 dark:text-stone-400">
        {t.videos.engineeringNotice}
      </div>

      {/* Video Modal Player */}
      <AnimatePresence>
        {activeVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 sm:p-6"
            onClick={() => setActiveVideo(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="relative w-full max-w-4xl bg-[#111315] border border-white/15 rounded-3xl overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Bar */}
              <div className="flex items-center justify-between p-4 sm:p-5 border-b border-white/10 bg-white/5">
                <div className="truncate pr-4">
                  <span className="font-mono text-xs text-[#7EA2C4] uppercase block">
                    {activeVideo.category[language]} // {activeVideo.equipmentTag}
                  </span>
                  <h4 className="font-display font-bold text-sm sm:text-base text-white truncate">
                    {activeVideo.title[language]}
                  </h4>
                </div>
                <button
                  onClick={() => setActiveVideo(null)}
                  className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition"
                  aria-label="Close video player"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Video Element */}
              <div className="aspect-video w-full bg-black">
                <video
                  src={activeVideo.videoUrl}
                  controls
                  autoPlay
                  playsInline
                  className="w-full h-full object-contain"
                >
                  Your browser does not support HTML5 video.
                </video>
              </div>

              {/* Video Description */}
              <div className="p-4 sm:p-6 bg-white/5 border-t border-white/10 text-xs sm:text-sm text-stone-300">
                {activeVideo.description[language]}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
