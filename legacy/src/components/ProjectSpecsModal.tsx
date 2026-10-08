import React, { useEffect } from 'react';
import { VillaProject } from '../types';
import { useThemeLanguage } from '../context/ThemeLanguageContext';
import { X, CheckCircle2, Shield, Flame, Ruler, Clock, ArrowUpRight } from 'lucide-react';
import { LazyImage } from './LazyImage';

interface ProjectSpecsModalProps {
  project: VillaProject | null;
  onClose: () => void;
  onSelectForCalc: (project: VillaProject) => void;
}

export const ProjectSpecsModal: React.FC<ProjectSpecsModalProps> = ({
  project,
  onClose,
  onSelectForCalc,
}) => {
  const { language, t, openContactModal } = useThemeLanguage();

  useEffect(() => {
    if (!project) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [project, onClose]);

  if (!project) return null;

  const formattedPrice =
    language === 'ru'
      ? `${(project.priceRub / 1000000).toFixed(1)} млн ₽`
      : `$${project.priceUsd.toLocaleString()}`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="relative w-full max-w-4xl bg-white dark:bg-[#12151c] rounded-3xl border border-stone-200 dark:border-stone-800 shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 sm:p-6 border-b border-stone-200 dark:border-stone-800 sticky top-0 bg-white/95 dark:bg-[#12151c]/95 backdrop-blur-md z-10">
          <div>
            <span className="font-mono text-xs text-sky-600 dark:text-sky-400 font-bold uppercase tracking-wider">
              {project.styleName[language]}
            </span>
            <h3 className="font-display font-bold text-xl sm:text-2xl text-neutral-950 dark:text-white uppercase tracking-tight">
              {project.name}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-500 hover:text-neutral-950 dark:text-stone-400 dark:hover:text-white transition"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-8 overflow-y-auto space-y-6">
          {/* Dual Image Gallery */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div className="rounded-2xl overflow-hidden aspect-[4/3] bg-stone-100 dark:bg-stone-800 shadow-sm relative">
              <LazyImage
                src={project.mainImage}
                alt={project.name}
                wrapperClassName="w-full h-full"
                className="w-full h-full object-cover"
              />
              <span className="absolute bottom-3 left-3 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white font-mono text-[10px] uppercase pointer-events-none">
                Экстерьер
              </span>
            </div>
            <div className="rounded-2xl overflow-hidden aspect-[4/3] bg-stone-100 dark:bg-stone-800 shadow-sm relative">
              <LazyImage
                src={project.secondaryImage}
                alt={`${project.name} Interior`}
                wrapperClassName="w-full h-full"
                className="w-full h-full object-cover"
              />
              <span className="absolute bottom-3 left-3 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white font-mono text-[10px] uppercase pointer-events-none">
                Интерьер & Детали
              </span>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-stone-50 dark:bg-stone-900/60 border border-stone-200/80 dark:border-stone-800/80 font-mono text-xs">
            <div>
              <span className="text-stone-500 dark:text-stone-400 block uppercase text-[10px]">
                {t.projects.labelArea}
              </span>
              <span className="font-bold text-neutral-950 dark:text-white text-base">
                {project.area} м²
              </span>
            </div>
            <div>
              <span className="text-stone-500 dark:text-stone-400 block uppercase text-[10px]">
                {t.projects.labelBeds}
              </span>
              <span className="font-bold text-neutral-950 dark:text-white text-base">
                {project.bedrooms} мастер-блока
              </span>
            </div>
            <div>
              <span className="text-stone-500 dark:text-stone-400 block uppercase text-[10px]">
                {t.projects.labelTime}
              </span>
              <span className="font-bold text-neutral-950 dark:text-white text-base">
                {project.durationDays} дней
              </span>
            </div>
            <div>
              <span className="text-stone-500 dark:text-stone-400 block uppercase text-[10px]">
                Базовый контур
              </span>
              <span className="font-bold text-sky-600 dark:text-sky-400 text-base">
                {formattedPrice}
              </span>
            </div>
          </div>

          {/* Detailed Engineering Specifications */}
          <div className="space-y-3">
            <h4 className="font-display font-bold text-sm uppercase tracking-wider text-neutral-900 dark:text-white">
              Конструктивные узлы и материалы
            </h4>
            <div className="grid sm:grid-cols-2 gap-3 text-xs">
              <div className="p-4 rounded-xl border border-stone-200 dark:border-stone-800 space-y-1 bg-white dark:bg-stone-900/30">
                <span className="font-mono text-stone-500 dark:text-stone-400 uppercase text-[10px]">
                  Фундаментное основание
                </span>
                <p className="font-medium text-neutral-900 dark:text-stone-200">
                  {project.specs[language].foundation}
                </p>
              </div>

              <div className="p-4 rounded-xl border border-stone-200 dark:border-stone-800 space-y-1 bg-white dark:bg-stone-900/30">
                <span className="font-mono text-stone-500 dark:text-stone-400 uppercase text-[10px]">
                  Светопрозрачные конструкции
                </span>
                <p className="font-medium text-neutral-900 dark:text-stone-200">
                  {project.specs[language].glazing}
                </p>
              </div>

              <div className="p-4 rounded-xl border border-stone-200 dark:border-stone-800 space-y-1 bg-white dark:bg-stone-900/30">
                <span className="font-mono text-stone-500 dark:text-stone-400 uppercase text-[10px]">
                  Несущий деревянный конструктив
                </span>
                <p className="font-medium text-neutral-900 dark:text-stone-200">
                  {project.specs[language].timber}
                </p>
              </div>

              <div className="p-4 rounded-xl border border-stone-200 dark:border-stone-800 space-y-1 bg-white dark:bg-stone-900/30">
                <span className="font-mono text-stone-500 dark:text-stone-400 uppercase text-[10px]">
                  Энергоэффективность и изоляция
                </span>
                <p className="font-medium text-neutral-900 dark:text-stone-200">
                  {project.specs[language].energyRating}
                </p>
              </div>
            </div>
          </div>

          {/* Features Highlights */}
          <div className="space-y-3">
            <h4 className="font-display font-bold text-sm uppercase tracking-wider text-neutral-900 dark:text-white">
              {t.projects.keyHighlights}
            </h4>
            <div className="grid sm:grid-cols-2 gap-2 text-xs">
              {project.features[language].map((f, i) => (
                <div key={i} className="flex items-start gap-2 text-stone-700 dark:text-stone-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <span>{f}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="p-5 sm:p-6 border-t border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900/80 flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={() => {
              onClose();
              onSelectForCalc(project);
            }}
            className="px-5 py-3 rounded-full border border-stone-300 dark:border-stone-700 text-xs font-display font-bold uppercase tracking-wider hover:bg-stone-200 dark:hover:bg-stone-800 transition"
          >
            {t.projects.calculateThisVilla}
          </button>

          <button
            onClick={() => {
              onClose();
              openContactModal(`Встреча по проекту: ${project.name}`);
            }}
            className="px-7 py-3 rounded-full bg-sky-600 hover:bg-sky-700 text-white text-xs font-display font-bold uppercase tracking-wider shadow-md transition flex items-center gap-2"
          >
            <span>Записаться на презентацию в шоу-руме</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
