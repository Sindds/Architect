import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { ThemeMode, ActiveTheme, Language, Currency, TrustDocument } from '../types';
import { TRANSLATIONS } from '../i18n/translations';

interface ThemeLanguageContextType {
  themeMode: ThemeMode;
  activeTheme: ActiveTheme;
  setThemeMode: (mode: ThemeMode) => void;
  toggleTheme: () => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  currency: Currency;
  setCurrency: (curr: Currency) => void;
  formatCurrency: (rubAmount: number, usdFallback?: number, overrideCurr?: Currency) => string;
  formatPrice: (rubAmount: number, overrideCurr?: Currency) => string;
  formatPricePerM2: (rubPerM2: number, overrideCurr?: Currency) => string;
  t: typeof TRANSLATIONS.ru;
  isContactModalOpen: boolean;
  contactModalOpen: boolean;
  openContactModal: (contextNote?: string) => void;
  closeContactModal: () => void;
  modalContextNote: string;
  isAppointmentModalOpen: boolean;
  appointmentModalOpen: boolean;
  openAppointmentModal: (prefFormat?: string) => void;
  closeAppointmentModal: () => void;
  appointmentPrefFormat: string;
  isPrivacyModalOpen: boolean;
  privacyModalOpen: boolean;
  openPrivacyModal: () => void;
  closePrivacyModal: () => void;
  activeDocViewer: TrustDocument | null;
  docViewerDoc: TrustDocument | null;
  openDocViewer: (doc: TrustDocument) => void;
  closeDocViewer: () => void;
  currentPage: 'home' | '404';
  navigateTo: (page: 'home' | '404') => void;
  trackGoal: (goalName: string, params?: Record<string, unknown>) => void;
}

const ThemeLanguageContext = createContext<ThemeLanguageContextType | undefined>(undefined);

// Conversion rates relative to 1 RUB
const RATES: Record<Currency, number> = {
  RUB: 1,
  USD: 1 / 91.5,
  EUR: 1 / 99.2,
  AED: 1 / 24.9,
};

export const ThemeLanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Language state with auto-detection & persistence:
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem('arcline_lang');
      if (saved === 'ru' || saved === 'en') return saved;
      if (typeof navigator !== 'undefined' && navigator.language) {
        const browserLang = navigator.language.toLowerCase();
        if (browserLang.startsWith('ru')) return 'ru';
        return 'en';
      }
    } catch {
      // Fallback
    }
    return 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('arcline_lang', lang);
    } catch {
      // ignored
    }
  };

  const toggleLanguage = () => {
    setLanguage(language === 'ru' ? 'en' : 'ru');
  };

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  // 2. Currency State
  const [currency, setCurrencyState] = useState<Currency>(() => {
    try {
      const saved = localStorage.getItem('arcline_currency') as Currency;
      if (saved && ['RUB', 'USD', 'EUR', 'AED'].includes(saved)) return saved;
    } catch {
      // ignored
    }
    return language === 'ru' ? 'RUB' : 'USD';
  });

  const setCurrency = (curr: Currency) => {
    setCurrencyState(curr);
    try {
      localStorage.setItem('arcline_currency', curr);
    } catch {
      // ignored
    }
  };

  // Sync default currency on language toggle if user hasn't explicitly set another
  useEffect(() => {
    const saved = localStorage.getItem('arcline_currency');
    if (!saved) {
      setCurrencyState(language === 'ru' ? 'RUB' : 'USD');
    }
  }, [language]);

  const formatCurrency = (rubAmount: number, usdFallback?: number, overrideCurr?: Currency): string => {
    const targetCurr = overrideCurr || currency;
    switch (targetCurr) {
      case 'USD': {
        const val =
          usdFallback !== undefined && usdFallback > 0
            ? Math.round(usdFallback)
            : Math.round(rubAmount * RATES.USD);
        return `$${val.toLocaleString('en-US')}`;
      }
      case 'EUR': {
        const val = Math.round(rubAmount * RATES.EUR);
        return `€${val.toLocaleString('de-DE')}`;
      }
      case 'AED': {
        const val = Math.round(rubAmount * RATES.AED);
        return `${val.toLocaleString('en-US')} AED`;
      }
      case 'RUB':
      default:
        return `${Math.round(rubAmount).toLocaleString('ru-RU')} ₽`;
    }
  };

  const formatPrice = (rubAmount: number, overrideCurr?: Currency): string => {
    const targetCurr = overrideCurr || currency;
    const rate = RATES[targetCurr] || 1;
    const converted = Math.round(rubAmount * rate);

    switch (targetCurr) {
      case 'USD':
        return `$${converted.toLocaleString('en-US')}`;
      case 'EUR':
        return `€${converted.toLocaleString('de-DE')}`;
      case 'AED':
        return `${converted.toLocaleString('en-US')} AED`;
      case 'RUB':
      default:
        return `${converted.toLocaleString('ru-RU')} ₽`;
    }
  };

  const formatPricePerM2 = (rubPerM2: number, overrideCurr?: Currency): string => {
    const targetCurr = overrideCurr || currency;
    const rate = RATES[targetCurr] || 1;
    const converted = Math.round(rubPerM2 * rate);

    switch (targetCurr) {
      case 'USD':
        return `$${converted.toLocaleString('en-US')}/m²`;
      case 'EUR':
        return `€${converted.toLocaleString('de-DE')}/m²`;
      case 'AED':
        return `${converted.toLocaleString('en-US')} AED/m²`;
      case 'RUB':
      default:
        return `${converted.toLocaleString('ru-RU')} ₽/м²`;
    }
  };

  // 3. Theme state with system preference & persistence
  const [themeMode, setThemeModeState] = useState<ThemeMode>(() => {
    try {
      const saved = localStorage.getItem('arcline_theme');
      if (saved === 'light' || saved === 'dark' || saved === 'system') return saved;
    } catch {
      // ignored
    }
    return 'system';
  });

  const [systemIsDark, setSystemIsDark] = useState<boolean>(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e: MediaQueryListEvent) => {
      setSystemIsDark(e.matches);
    };
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  const activeTheme: ActiveTheme =
    themeMode === 'system' ? (systemIsDark ? 'dark' : 'light') : themeMode;

  const setThemeMode = (mode: ThemeMode) => {
    setThemeModeState(mode);
    try {
      localStorage.setItem('arcline_theme', mode);
    } catch {
      // ignored
    }
  };

  const toggleTheme = () => {
    const nextTheme: ActiveTheme = activeTheme === 'dark' ? 'light' : 'dark';
    if (typeof document !== 'undefined' && 'startViewTransition' in document) {
      (document as unknown as { startViewTransition: (cb: () => void) => void }).startViewTransition(() => {
        setThemeMode(nextTheme);
      });
    } else {
      setThemeMode(nextTheme);
    }
  };

  useEffect(() => {
    const root = document.documentElement;
    if (activeTheme === 'dark') {
      root.classList.add('dark');
      root.style.colorScheme = 'dark';
    } else {
      root.classList.remove('dark');
      root.style.colorScheme = 'light';
    }
  }, [activeTheme]);

  // 4. Client-Side Router for Home / 404
  const [currentPage, setCurrentPage] = useState<'home' | '404'>(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname;
      const hash = window.location.hash;
      if (path === '/404' || hash === '#404') return '404';
    }
    return 'home';
  });

  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      const hash = window.location.hash;
      if (path === '/404' || hash === '#404') {
        setCurrentPage('404');
      } else {
        setCurrentPage('home');
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateTo = (page: 'home' | '404') => {
    setCurrentPage(page);
    try {
      if (page === '404') {
        window.history.pushState(null, '', '#404');
      } else {
        window.history.pushState(null, '', '/');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch {
      // fallback
    }
  };

  // 5. Global Consultation Modal State
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [modalContextNote, setModalContextNote] = useState('');

  const openContactModal = (contextNote = '') => {
    setModalContextNote(contextNote);
    setIsContactModalOpen(true);
    trackGoal('open_contact_modal', { note: contextNote });
  };

  const closeContactModal = () => {
    setIsContactModalOpen(false);
  };

  // 6. Appointment Booking Modal State (Showroom / Zoom)
  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);
  const [appointmentPrefFormat, setAppointmentPrefFormat] = useState('showroom');

  const openAppointmentModal = (prefFormat = 'showroom') => {
    setAppointmentPrefFormat(prefFormat);
    setIsAppointmentModalOpen(true);
    trackGoal('open_appointment_modal', { format: prefFormat });
  };

  const closeAppointmentModal = () => {
    setIsAppointmentModalOpen(false);
  };

  // 7. Privacy Policy Modal State
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
  const openPrivacyModal = () => setIsPrivacyModalOpen(true);
  const closePrivacyModal = () => setIsPrivacyModalOpen(false);

  // 8. Document Lightbox Viewer
  const [activeDocViewer, setActiveDocViewer] = useState<TrustDocument | null>(null);
  const openDocViewer = (doc: TrustDocument) => {
    setActiveDocViewer(doc);
    trackGoal('view_trust_document', { docId: doc.id });
  };
  const closeDocViewer = () => setActiveDocViewer(null);

  // 9. Goal Tracking (Yandex Metrika + Local DataLayer)
  const trackGoal = (goalName: string, params: Record<string, unknown> = {}) => {
    try {
      if (typeof window !== 'undefined') {
        const ym = (window as unknown as { ym?: (id: number, action: string, name: string, params?: Record<string, unknown>) => void }).ym;
        if (typeof ym === 'function') {
          ym(99441280, 'reachGoal', goalName, params);
        }
        localStorage.setItem(
          'arcline_last_goal',
          JSON.stringify({ goal: goalName, params, timestamp: Date.now() })
        );
      }
    } catch {
      // safe fallback
    }
  };

  const t = TRANSLATIONS[language];

  return (
    <ThemeLanguageContext.Provider
      value={{
        themeMode,
        activeTheme,
        setThemeMode,
        toggleTheme,
        language,
        setLanguage,
        toggleLanguage,
        currency,
        setCurrency,
        formatCurrency,
        formatPrice,
        formatPricePerM2,
        t,
        isContactModalOpen,
        contactModalOpen: isContactModalOpen,
        openContactModal,
        closeContactModal,
        modalContextNote,
        isAppointmentModalOpen,
        appointmentModalOpen: isAppointmentModalOpen,
        openAppointmentModal,
        closeAppointmentModal,
        appointmentPrefFormat,
        isPrivacyModalOpen,
        privacyModalOpen: isPrivacyModalOpen,
        openPrivacyModal,
        closePrivacyModal,
        activeDocViewer,
        docViewerDoc: activeDocViewer,
        openDocViewer,
        closeDocViewer,
        currentPage,
        navigateTo,
        trackGoal,
      }}
    >
      {children}
    </ThemeLanguageContext.Provider>
  );
};

export const useThemeLanguage = () => {
  const context = useContext(ThemeLanguageContext);
  if (!context) {
    throw new Error('useThemeLanguage must be used within ThemeLanguageProvider');
  }
  return context;
};

