import React, { useState } from 'react';
import { useThemeLanguage } from '../context/ThemeLanguageContext';
import { TRUST_DOCUMENTS } from '../data/landingData';
import { TrustDocument } from '../types';
import { FileText, Download, Eye, ShieldCheck, CheckCircle2, ArrowUpRight } from 'lucide-react';
import { motion } from 'motion/react';

export const DocumentsSection: React.FC = () => {
  const { language, t, openDocViewer, openContactModal } = useThemeLanguage();
  const [filter, setFilter] = useState<'all' | 'passport' | 'estimate' | 'contract' | 'warranty' | 'sro'>('all');

  const filteredDocs = filter === 'all'
    ? TRUST_DOCUMENTS
    : TRUST_DOCUMENTS.filter((doc) => doc.category === filter);

  return (
    <section id="documents" className="py-20 sm:py-28 px-4 sm:px-6 md:px-8 max-w-[1500px] mx-auto w-full">
      {/* Header with entrance/exit animation */}
      <motion.div
        initial={{ opacity: 0, y: 35 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.2 }}
        transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
        className="text-center max-w-3xl mx-auto mb-12 sm:mb-16 space-y-4"
      >
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#5B7E9F]/10 dark:bg-[#7EA2C4]/15 border border-[#5B7E9F]/20 text-[#5B7E9F] dark:text-[#7EA2C4] font-mono text-[10px] sm:text-xs uppercase tracking-wider">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>{t.documents.sectionBadge}</span>
        </div>

        <h2 className="font-display font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl uppercase tracking-tight text-neutral-900 dark:text-white">
          {t.documents.title}
        </h2>

        <p className="text-sm sm:text-base text-stone-600 dark:text-stone-300 max-w-2xl mx-auto leading-relaxed">
          {t.documents.subtitle}
        </p>
      </motion.div>

      {/* Filter Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.2 }}
        transition={{ duration: 0.75, delay: 0.1 }}
        className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar"
      >
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-full text-xs font-mono uppercase transition whitespace-nowrap ${
            filter === 'all'
              ? 'bg-[#111315] dark:bg-white text-white dark:text-[#111315] font-bold shadow'
              : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700'
          }`}
        >
          {t.documents.tabAll}
        </button>
        <button
          onClick={() => setFilter('passport')}
          className={`px-4 py-2 rounded-full text-xs font-mono uppercase transition whitespace-nowrap ${
            filter === 'passport'
              ? 'bg-[#111315] dark:bg-white text-white dark:text-[#111315] font-bold shadow'
              : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700'
          }`}
        >
          {t.documents.tabPassport}
        </button>
        <button
          onClick={() => setFilter('estimate')}
          className={`px-4 py-2 rounded-full text-xs font-mono uppercase transition whitespace-nowrap ${
            filter === 'estimate'
              ? 'bg-[#111315] dark:bg-white text-white dark:text-[#111315] font-bold shadow'
              : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700'
          }`}
        >
          {t.documents.tabEstimate}
        </button>
        <button
          onClick={() => setFilter('contract')}
          className={`px-4 py-2 rounded-full text-xs font-mono uppercase transition whitespace-nowrap ${
            filter === 'contract'
              ? 'bg-[#111315] dark:bg-white text-white dark:text-[#111315] font-bold shadow'
              : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700'
          }`}
        >
          {t.documents.tabContract}
        </button>
        <button
          onClick={() => setFilter('warranty')}
          className={`px-4 py-2 rounded-full text-xs font-mono uppercase transition whitespace-nowrap ${
            filter === 'warranty'
              ? 'bg-[#111315] dark:bg-white text-white dark:text-[#111315] font-bold shadow'
              : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700'
          }`}
        >
          {t.documents.tabWarranty}
        </button>
        <button
          onClick={() => setFilter('sro')}
          className={`px-4 py-2 rounded-full text-xs font-mono uppercase transition whitespace-nowrap ${
            filter === 'sro'
              ? 'bg-[#111315] dark:bg-white text-white dark:text-[#111315] font-bold shadow'
              : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700'
          }`}
        >
          {t.documents.tabSro}
        </button>
      </motion.div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDocs.map((doc, idx) => (
          <motion.div
            key={doc.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.15 }}
            transition={{ duration: 0.8, delay: idx * 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="rounded-3xl p-6 bg-stone-50 dark:bg-[#14171A] border border-stone-200 dark:border-stone-800 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between space-y-5"
          >
            <div className="space-y-4">
              {/* Header Badge */}
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-[#5B7E9F]/10 dark:bg-[#7EA2C4]/15 text-[#5B7E9F] dark:text-[#7EA2C4] font-mono text-[10px] sm:text-xs uppercase font-bold">
                  {doc.categoryLabel[language]}
                </span>
                <span className="font-mono text-[11px] text-stone-400">{doc.fileSize}</span>
              </div>

              {/* Title & Description */}
              <div>
                <h3 className="font-display font-bold text-lg uppercase text-neutral-900 dark:text-white leading-snug">
                  {doc.title[language]}
                </h3>
                <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 mt-2 leading-relaxed">
                  {doc.description[language]}
                </p>
              </div>

              {/* Meta details */}
              <div className="p-3.5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 space-y-1.5 text-xs font-mono">
                <div className="flex justify-between">
                  <span className="text-stone-500">{t.documents.labelReg}:</span>
                  <span className="font-bold text-neutral-900 dark:text-white truncate ml-2">
                    {doc.regNumber}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">{t.documents.labelIssuer}:</span>
                  <span className="text-stone-700 dark:text-stone-300 truncate ml-2">{doc.issuer}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">{t.documents.labelValid}:</span>
                  <span className="text-emerald-600 dark:text-emerald-400 truncate ml-2 font-semibold">
                    {doc.validity}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex items-center gap-2">
              <button
                onClick={() => openDocViewer(doc)}
                className="flex-1 py-2.5 px-4 rounded-xl bg-[#111315] hover:bg-neutral-800 dark:bg-white dark:hover:bg-stone-200 text-white dark:text-[#111315] font-display font-bold text-xs uppercase tracking-wider transition flex items-center justify-center gap-1.5 active:scale-95"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>{t.documents.btnInspect}</span>
              </button>

              <button
                onClick={() => openDocViewer(doc)}
                className="p-2.5 rounded-xl bg-stone-200/70 hover:bg-stone-300 dark:bg-stone-800 dark:hover:bg-stone-700 text-neutral-900 dark:text-white transition"
                title={doc.downloadLabel[language]}
              >
                <Download className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Legal Fixed Price Notice Box */}
      <div className="mt-10 p-5 sm:p-6 rounded-3xl bg-neutral-900 text-white border border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <p className="text-xs sm:text-sm text-stone-300 leading-relaxed font-mono">
            {t.documents.legalNotice}
          </p>
        </div>
        <button
          onClick={() =>
            openContactModal(
              language === 'ru' ? 'Запрос образца договора генподряда' : 'Request contract sample'
            )
          }
          className="py-3 px-6 rounded-full bg-white text-[#111315] font-display font-bold text-xs uppercase tracking-wider hover:bg-stone-100 transition whitespace-nowrap shrink-0 active:scale-95"
        >
          {language === 'ru' ? 'Получить проект договора' : 'Request Agreement Draft'}
        </button>
      </div>
    </section>
  );
};
