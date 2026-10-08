import React, { useState } from 'react';
import { useSiteContent } from '../context/SiteContentContext';
import { Lock, Eye, EyeOff, ShieldCheck, X, AlertCircle, KeyRound, FileCode } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const AdminLoginModal: React.FC = () => {
  const { isLoginModalOpen, closeLoginModal, login, configuredEnvPassword } = useSiteContent();

  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isLoginModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(false);

    setTimeout(() => {
      const success = login(password);
      if (!success) {
        setError(true);
      } else {
        setPassword('');
        setError(false);
      }
      setIsSubmitting(false);
    }, 200);
  };

  const handleUseDefault = () => {
    setPassword(configuredEnvPassword);
    setError(false);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/85 backdrop-blur-md p-4 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-md bg-[#111315] text-stone-100 rounded-3xl border border-stone-800 shadow-2xl p-6 sm:p-8 font-sans overflow-hidden"
        >
          {/* Subtle Ambient Glow */}
          <div className="absolute -top-24 -left-24 w-48 h-48 bg-[#fc3f1d]/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-[#5B7E9F]/15 rounded-full blur-3xl pointer-events-none" />

          {/* Close button */}
          <button
            type="button"
            onClick={closeLoginModal}
            className="absolute top-5 right-5 w-8 h-8 rounded-full bg-stone-800/80 hover:bg-stone-700 flex items-center justify-center text-stone-400 hover:text-white transition"
            aria-label="Закрыть"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Header */}
          <div className="text-center space-y-3 mb-6">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#fc3f1d]/20 to-[#5B7E9F]/20 border border-white/10 mx-auto flex items-center justify-center shadow-inner">
              <Lock className="w-6 h-6 text-[#fc3f1d]" />
            </div>

            <div>
              <span className="font-mono text-[10px] uppercase tracking-widest text-[#7EA2C4] font-bold block mb-1">
                ARCLINE ESTATE // SECURITY
              </span>
              <h3 className="font-display font-bold text-xl uppercase tracking-tight text-white">
                Вход в панель CMS
              </h3>
            </div>

            <p className="text-xs text-stone-400 leading-relaxed max-w-xs mx-auto">
              Редактирование текстов, иконок и фотографий доступно только администратору с паролем.
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1.5 font-mono text-xs">
                <label className="text-stone-300 font-semibold">Пароль администратора:</label>
                <button
                  type="button"
                  onClick={handleUseDefault}
                  className="text-[10px] text-[#7EA2C4] hover:underline"
                  title="Подставить пароль из текущего .env"
                >
                  Вставить из .env
                </button>
              </div>

              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (error) setError(false);
                  }}
                  autoFocus
                  placeholder="Введите пароль..."
                  className={`w-full px-4 py-3 rounded-xl bg-stone-900 border text-white text-sm font-mono placeholder:text-stone-600 focus:outline-none transition ${
                    error
                      ? 'border-red-500 focus:border-red-400'
                      : 'border-stone-700 focus:border-[#7EA2C4]'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-200 transition"
                  aria-label={showPassword ? 'Скрыть пароль' : 'Показать пароль'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {error && (
                <div className="flex items-center gap-1.5 mt-2 text-xs font-mono text-red-400 animate-shake">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>Неверный пароль. Проверьте значение в .env</span>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !password.trim()}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#fc3f1d] to-[#d12f11] hover:from-[#e03618] hover:to-[#be270d] text-white font-display font-bold text-xs uppercase tracking-wider transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <KeyRound className="w-4 h-4" />
              <span>Войти в CMS</span>
            </button>
          </form>

          {/* Info on .env configuration */}
          <div className="mt-6 pt-5 border-t border-stone-800/80 space-y-2 text-[11px] font-mono text-stone-400">
            <div className="flex items-start gap-2 bg-stone-900/60 p-3 rounded-xl border border-stone-800">
              <FileCode className="w-4 h-4 text-[#7EA2C4] shrink-0 mt-0.5" />
              <div className="leading-snug">
                <span className="text-stone-300 font-bold block mb-0.5">
                  Где меняется пароль:
                </span>
                В файле <code className="text-[#7EA2C4] font-bold">.env</code> строка:
                <div className="text-stone-200 bg-black/50 px-2 py-1 rounded mt-1 font-semibold">
                  VITE_ADMIN_PASSWORD="ваш_пароль"
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
