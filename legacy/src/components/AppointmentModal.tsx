import React, { useState, useEffect } from 'react';
import { useThemeLanguage } from '../context/ThemeLanguageContext';
import { X, Calendar, Clock, MapPin, Video, CheckCircle2, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const AppointmentModal: React.FC = () => {
  const { language, t, appointmentModalOpen, closeAppointmentModal, trackGoal } = useThemeLanguage();

  const [format, setFormat] = useState<'showroom' | 'zoom' | 'onsite'>('showroom');
  const [date, setDate] = useState('2026-09-08');
  const [time, setTime] = useState('14:00');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; phone?: string }>({});

  useEffect(() => {
    if (!appointmentModalOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [appointmentModalOpen]);

  const validate = () => {
    const errs: { name?: string; phone?: string } = {};
    if (!name.trim()) {
      errs.name = language === 'ru' ? 'Пожалуйста, укажите ваше имя' : 'Please enter your name';
    }
    const cleanPhone = phone.replace(/[\s()-]/g, '');
    if (!cleanPhone || cleanPhone.length < 6) {
      errs.phone = language === 'ru' ? 'Введите корректный номер телефона' : 'Please enter a valid phone number';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);

    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
      trackGoal('APPOINTMENT_BOOKED');
    }, 800);
  };

  const handleClose = () => {
    closeAppointmentModal();
    setTimeout(() => {
      setSubmitted(false);
      setName('');
      setPhone('');
      setNotes('');
      setErrors({});
    }, 300);
  };

  return (
    <AnimatePresence>
      {appointmentModalOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xl flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ duration: 0.25 }}
            className="relative w-full max-w-xl bg-white dark:bg-[#14171A] border border-stone-200 dark:border-stone-800 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden my-auto"
            onClick={(e) => e.stopPropagation()}
          >
          {/* Close Button */}
          <button
            onClick={handleClose}
            className="absolute top-5 right-5 p-2 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700 transition"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          {submitted ? (
            <div className="py-8 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="font-display font-bold text-2xl uppercase text-neutral-900 dark:text-white">
                {t.appointment.successTitle}
              </h3>
              <p className="text-sm text-stone-600 dark:text-stone-300 max-w-md mx-auto leading-relaxed">
                {t.appointment.successDesc}
              </p>
              <div className="pt-4">
                <button
                  onClick={handleClose}
                  className="px-6 py-3 rounded-full bg-[#111315] dark:bg-white text-white dark:text-[#111315] font-display font-bold text-xs uppercase tracking-wider"
                >
                  {language === 'ru' ? 'Отлично, закрыть' : 'Done, Close'}
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Header */}
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#5B7E9F]/10 dark:bg-[#7EA2C4]/15 text-[#5B7E9F] dark:text-[#7EA2C4] font-mono text-[10px] uppercase font-bold mb-2">
                  <Calendar className="w-3 h-3" />
                  <span>VIP SHOWROOM & DISCOVERY</span>
                </div>
                <h3 className="font-display font-bold text-xl sm:text-2xl uppercase text-neutral-900 dark:text-white leading-tight">
                  {t.appointment.modalTitle}
                </h3>
                <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-1 leading-relaxed">
                  {t.appointment.modalSubtitle}
                </p>
              </div>

              {/* Format Selection */}
              <div className="space-y-2">
                <label className="block text-xs font-mono uppercase text-stone-600 dark:text-stone-300">
                  {t.appointment.selectFormat}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setFormat('showroom')}
                    className={`p-3 rounded-2xl border text-left flex flex-col justify-between transition ${
                      format === 'showroom'
                        ? 'bg-[#111315] dark:bg-white text-white dark:text-[#111315] border-transparent font-bold shadow'
                        : 'bg-stone-50 dark:bg-stone-900 border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-300'
                    }`}
                  >
                    <MapPin className="w-4 h-4 mb-2" />
                    <span className="text-xs">{language === 'ru' ? 'Шоурум Riga Land' : 'Riga Land BC'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormat('zoom')}
                    className={`p-3 rounded-2xl border text-left flex flex-col justify-between transition ${
                      format === 'zoom'
                        ? 'bg-[#111315] dark:bg-white text-white dark:text-[#111315] border-transparent font-bold shadow'
                        : 'bg-stone-50 dark:bg-stone-900 border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-300'
                    }`}
                  >
                    <Video className="w-4 h-4 mb-2" />
                    <span className="text-xs">{language === 'ru' ? 'Zoom / Онлайн' : 'Zoom Video'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormat('onsite')}
                    className={`p-3 rounded-2xl border text-left flex flex-col justify-between transition ${
                      format === 'onsite'
                        ? 'bg-[#111315] dark:bg-white text-white dark:text-[#111315] border-transparent font-bold shadow'
                        : 'bg-stone-50 dark:bg-stone-900 border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-300'
                    }`}
                  >
                    <Clock className="w-4 h-4 mb-2" />
                    <span className="text-xs">{language === 'ru' ? 'Выезд на участок' : 'On-Site Visit'}</span>
                  </button>
                </div>
              </div>

              {/* Date & Time Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono uppercase text-stone-500 mb-1">
                    {t.appointment.selectDate}
                  </label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900 text-neutral-900 dark:text-white text-xs font-mono focus:outline-none focus:ring-2 focus:ring-[#5B7E9F]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase text-stone-500 mb-1">
                    {t.appointment.selectTime}
                  </label>
                  <select
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900 text-neutral-900 dark:text-white text-xs font-mono focus:outline-none focus:ring-2 focus:ring-[#5B7E9F]"
                  >
                    <option value="11:00">11:00</option>
                    <option value="14:00">14:00</option>
                    <option value="16:30">16:30</option>
                    <option value="19:00">19:00</option>
                  </select>
                </div>
              </div>

              {/* Client Info Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono uppercase text-stone-500 mb-1">
                    {t.appointment.clientName} *
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
                    }}
                    placeholder={language === 'ru' ? 'Александр' : 'Alexander'}
                    className={`w-full px-4 py-2.5 rounded-xl border ${
                      errors.name ? 'border-rose-500 focus:ring-rose-500' : 'border-stone-200 dark:border-stone-800 focus:ring-[#5B7E9F]'
                    } bg-stone-50 dark:bg-stone-900 text-neutral-900 dark:text-white text-xs focus:outline-none focus:ring-2 transition`}
                  />
                  {errors.name && (
                    <p className="mt-1 text-[11px] font-mono text-rose-500">{errors.name}</p>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase text-stone-500 mb-1">
                    {t.appointment.clientPhone} *
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value);
                      if (errors.phone) setErrors((prev) => ({ ...prev, phone: undefined }));
                    }}
                    placeholder="+7 (999) 000-00-00"
                    className={`w-full px-4 py-2.5 rounded-xl border ${
                      errors.phone ? 'border-rose-500 focus:ring-rose-500' : 'border-stone-200 dark:border-stone-800 focus:ring-[#5B7E9F]'
                    } bg-stone-50 dark:bg-stone-900 text-neutral-900 dark:text-white text-xs font-mono focus:outline-none focus:ring-2 transition`}
                  />
                  {errors.phone && (
                    <p className="mt-1 text-[11px] font-mono text-rose-500">{errors.phone}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-stone-500 mb-1">
                  {t.appointment.clientNotes}
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder={language === 'ru' ? 'Например: Новорижское ш., поселок Millennium, площадь 450 м²' : 'E.g., plot address or architectural style'}
                  className="w-full px-4 py-2 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900 text-neutral-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-[#5B7E9F]"
                />
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 rounded-full bg-[#111315] hover:bg-neutral-800 dark:bg-white dark:hover:bg-stone-200 text-white dark:text-[#111315] font-display font-bold text-xs uppercase tracking-wider transition flex items-center justify-center gap-2 shadow-lg active:scale-95 disabled:opacity-50"
              >
                {submitting ? (
                  <span>{t.appointment.submitting}</span>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>{t.appointment.submitBtn}</span>
                  </>
                )}
              </button>
            </form>
          )}
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);
};
