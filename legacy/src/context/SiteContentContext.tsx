import React, { createContext, useContext, useState, useEffect } from 'react';
import { DEFAULT_SITE_CONTENT, SiteMasterConfig } from '../data/siteContent';

interface SiteContentContextType {
  content: SiteMasterConfig;
  updateContent: (newContent: SiteMasterConfig) => void;
  updateSection: <K extends keyof SiteMasterConfig>(section: K, data: SiteMasterConfig[K]) => void;
  resetContent: () => void;
  isEditorOpen: boolean;
  openEditor: () => void;
  closeEditor: () => void;
  toggleEditor: () => void;
  hasCustomOverrides: boolean;

  // Admin Authentication
  isAuthenticated: boolean;
  isLoginModalOpen: boolean;
  openLoginModal: () => void;
  closeLoginModal: () => void;
  login: (password: string) => boolean;
  logout: () => void;
  configuredEnvPassword: string;
}

const STORAGE_KEY = 'arcline_custom_content_v4';
const AUTH_SESSION_KEY = 'arcline_admin_session_auth_v1';

const SiteContentContext = createContext<SiteContentContextType | undefined>(undefined);

export const SiteContentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [content, setContent] = useState<SiteMasterConfig>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return { ...DEFAULT_SITE_CONTENT, ...parsed };
      }
    } catch (e) {
      console.warn('Could not load custom content from localStorage', e);
    }
    return DEFAULT_SITE_CONTENT;
  });

  // Password from .env (VITE_ADMIN_PASSWORD), defaults to 'admin' if not set
  const configuredEnvPassword =
    (import.meta.env.VITE_ADMIN_PASSWORD as string | undefined)?.trim() || 'admin';

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem(AUTH_SESSION_KEY) === 'true';
    } catch {
      return false;
    }
  });

  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [hasCustomOverrides, setHasCustomOverrides] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      setHasCustomOverrides(!!saved);
    } catch {}
  }, [content]);

  // Open editor if authorized, otherwise prompt with Login Modal
  const requestAdminAccess = () => {
    if (isAuthenticated) {
      setIsEditorOpen(true);
    } else {
      setIsLoginModalOpen(true);
    }
  };

  // Keyboard shortcut: Alt+A or Alt+E or Ctrl+Shift+E
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        (e.altKey && (e.key.toLowerCase() === 'e' || e.key.toLowerCase() === 'a')) ||
        (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'e')
      ) {
        e.preventDefault();
        requestAdminAccess();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAuthenticated]);

  const login = (passwordInput: string): boolean => {
    const input = passwordInput.trim();
    if (input === configuredEnvPassword) {
      setIsAuthenticated(true);
      try {
        sessionStorage.setItem(AUTH_SESSION_KEY, 'true');
      } catch {}
      setIsLoginModalOpen(false);
      setIsEditorOpen(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setIsEditorOpen(false);
    try {
      sessionStorage.removeItem(AUTH_SESSION_KEY);
    } catch {}
  };

  const updateContent = (newContent: SiteMasterConfig) => {
    setContent(newContent);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newContent));
      setHasCustomOverrides(true);
    } catch (e) {
      console.error('Failed to save content to localStorage', e);
    }
  };

  const updateSection = <K extends keyof SiteMasterConfig>(section: K, data: SiteMasterConfig[K]) => {
    const updated = {
      ...content,
      [section]: data,
    };
    updateContent(updated);
  };

  const resetContent = () => {
    setContent(DEFAULT_SITE_CONTENT);
    try {
      localStorage.removeItem(STORAGE_KEY);
      setHasCustomOverrides(false);
    } catch {}
  };

  const openEditor = () => requestAdminAccess();
  const closeEditor = () => setIsEditorOpen(false);
  const toggleEditor = () => requestAdminAccess();

  const openLoginModal = () => setIsLoginModalOpen(true);
  const closeLoginModal = () => setIsLoginModalOpen(false);

  return (
    <SiteContentContext.Provider
      value={{
        content,
        updateContent,
        updateSection,
        resetContent,
        isEditorOpen,
        openEditor,
        closeEditor,
        toggleEditor,
        hasCustomOverrides,
        isAuthenticated,
        isLoginModalOpen,
        openLoginModal,
        closeLoginModal,
        login,
        logout,
        configuredEnvPassword,
      }}
    >
      {children}
    </SiteContentContext.Provider>
  );
};

export const useSiteContent = (): SiteContentContextType => {
  const context = useContext(SiteContentContext);
  if (!context) {
    throw new Error('useSiteContent must be used within a SiteContentProvider');
  }
  return context;
};
