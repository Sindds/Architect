import React, { useState, useEffect } from 'react';
import { useThemeLanguage } from '../context/ThemeLanguageContext';
import { X, Download, CheckCircle2, Shield, FileText, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { LazyImage } from './LazyImage';

export const DocViewerModal: React.FC = () => {
  const { language, t, docViewerDoc, closeDocViewer, trackGoal } = useThemeLanguage();
  const [downloaded, setDownloaded] = useState(false);

  useEffect(() => {
    if (!docViewerDoc) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeDocViewer();
    };
    window.addEventListener('keydown', handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [docViewerDoc, closeDocViewer]);

  const handleDownload = () => {
    setDownloaded(true);
    trackGoal('DOCUMENT_DOWNLOAD');
    setTimeout(() => setDownloaded(false), 3000);
  };

  return (
    <AnimatePresence>
      {docViewerDoc && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xl flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
          onClick={closeDocViewer}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ duration: 0.25 }}
            className="relative w-full max-w-2xl bg-white dark:bg-[#14171A] border border-stone-200 dark:border-stone-800 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden my-auto space-y-6"
            onClick={(e) => e.stopPropagation()}
          >
          {/* Close Button */}
          <button
            onClick={closeDocViewer}
            className="absolute top-5 right-5 p-2 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700 transition"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#5B7E9F]/10 dark:bg-[#7EA2C4]/15 text-[#5B7E9F] dark:text-[#7EA2C4] font-mono text-xs uppercase font-bold mb-2">
              <Shield className="w-3.5 h-3.5" />
              <span>{docViewerDoc.categoryLabel[language]} // OFFICIAL VERIFIED</span>
            </div>
            <h3 className="font-display font-bold text-xl sm:text-2xl uppercase text-neutral-900 dark:text-white leading-tight">
              {docViewerDoc.title[language]}
            </h3>
            <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-1">
              {docViewerDoc.description[language]}
            </p>
          </div>

          {/* Document Preview Frame */}
          <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden border border-stone-200 dark:border-stone-800 bg-stone-100 dark:bg-stone-900">
            <LazyImage
              src={docViewerDoc.previewImage}
              alt={docViewerDoc.title[language]}
              priority={true}
              wrapperClassName="w-full h-full"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex flex-col justify-end p-5 text-white">
              <div className="font-mono text-xs opacity-80">
                {t.documents.labelReg}: {docViewerDoc.regNumber}
              </div>
              <div className="font-mono text-xs opacity-80">
                {t.documents.labelIssuer}: {docViewerDoc.issuer}
              </div>
              <div className="font-mono text-xs text-emerald-400 font-bold mt-0.5">
                {t.documents.labelValid}: {docViewerDoc.validity}
              </div>
            </div>
          </div>

          {/* Guarantee clause notice */}
          <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800 text-xs font-mono text-stone-600 dark:text-stone-300 leading-relaxed">
            {t.documents.legalNotice}
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={handleDownload}
              className={`flex-1 py-3.5 px-6 rounded-full font-display font-bold text-xs uppercase tracking-wider transition flex items-center justify-center gap-2 shadow-lg active:scale-95 ${
                downloaded
                  ? 'bg-emerald-600 text-white'
                  : 'bg-[#111315] hover:bg-neutral-800 dark:bg-white dark:hover:bg-stone-200 text-white dark:text-[#111315]'
              }`}
            >
              {downloaded ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>{language === 'ru' ? 'Файл скачивается...' : 'Downloading PDF...'}</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>{docViewerDoc.downloadLabel[language]} ({docViewerDoc.fileSize})</span>
                </>
              )}
            </button>

            <button
              onClick={closeDocViewer}
              className="py-3 px-5 rounded-full border border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-300 text-xs font-display uppercase tracking-wider hover:bg-stone-100 dark:hover:bg-stone-800"
            >
              {language === 'ru' ? 'Закрыть' : 'Close'}
            </button>
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);
};
