import React from 'react';
import { useThemeLanguage } from '../context/ThemeLanguageContext';
import { X, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const PrivacyModal: React.FC = () => {
  const { language, t, privacyModalOpen, closePrivacyModal } = useThemeLanguage();

  return (
    <AnimatePresence>
      {privacyModalOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xl flex items-center justify-center p-4 overflow-y-auto"
          onClick={closePrivacyModal}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="relative w-full max-w-2xl bg-white dark:bg-[#14171A] border border-stone-200 dark:border-stone-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5 my-auto max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
          <div className="flex items-center justify-between pb-3 border-b border-stone-200 dark:border-stone-800">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-500" />
              <h3 className="font-display font-bold text-lg uppercase text-neutral-900 dark:text-white">
                {t.privacy.title}
              </h3>
            </div>
            <button
              onClick={closePrivacyModal}
              className="p-1.5 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-4 text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
            <p>
              {language === 'ru'
                ? 'Архитектурно-строительное бюро ARCLINE ESTATE строго соблюдает законодательство о защите персональных данных в соответствии с Федеральным законом РФ № 152-ФЗ «О персональных данных» и международными стандартами GDPR.'
                : 'ARCLINE ESTATE architectural bureau strictly adheres to personal data protection regulations under Federal Law No. 152-FZ and GDPR best practices.'}
            </p>

            <h4 className="font-display font-bold text-neutral-900 dark:text-white uppercase text-xs sm:text-sm">
              {language === 'ru' ? '1. Цели обработки данных' : '1. Purpose of Processing'}
            </h4>
            <p>
              {language === 'ru'
                ? 'Персональные данные (имя, номер телефона, параметры земельного участка и пожелания к проекту виллы) собираются исключительно для расчета инженерной сметы, подготовки проектной спецификации и согласования встречи с главным архитектором.'
                : 'Contact information is gathered solely to calculate construction estimates, prepare blueprints, and arrange discovery meetings.'}
            </p>

            <h4 className="font-display font-bold text-neutral-900 dark:text-white uppercase text-xs sm:text-sm">
              {language === 'ru' ? '2. Защита и нераспространение третьим лицам' : '2. Confidentiality Guarantee'}
            </h4>
            <p>
              {language === 'ru'
                ? 'Бюро гарантирует полную конфиденциальность. Мы никогда не передаем, не продаем и не раскрываем контакты клиентов третьим лицам, рекламным сетям или спам-агентствам. Все каналы связи зашифрованы по протоколу TLS 1.3.'
                : 'We guarantee strict privacy. Customer records are never shared or sold to third parties or advertising syndicates.'}
            </p>

            <h4 className="font-display font-bold text-neutral-900 dark:text-white uppercase text-xs sm:text-sm">
              {language === 'ru' ? '3. Права субъекта данных' : '3. User Rights'}
            </h4>
            <p>
              {language === 'ru'
                ? 'Вы в любой момент вправе запросить удаление ваших контактных данных из базы бюро, направив письмо на legal@arcline-estate.ru.'
                : 'You may request data erasure at any time by contacting legal@arcline-estate.ru.'}
            </p>
          </div>

          <div className="pt-4 border-t border-stone-200 dark:border-stone-800 flex justify-end">
            <button
              onClick={closePrivacyModal}
              className="px-6 py-2.5 rounded-full bg-[#111315] dark:bg-white text-white dark:text-[#111315] font-display font-bold text-xs uppercase tracking-wider"
            >
              {t.privacy.closeBtn}
            </button>
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);
};
