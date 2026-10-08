import React, { useState } from 'react';
import { useSiteContent } from '../context/SiteContentContext';
import { SITE_IMAGES, SiteMasterConfig } from '../data/siteContent';
import { DynamicIcon } from './DynamicIcon';
import {
  X,
  Check,
  RotateCcw,
  Copy,
  Download,
  Image as ImageIcon,
  Sparkles,
  Layers,
  Home,
  Users,
  MessageSquare,
  HelpCircle,
  Phone,
  FileCode,
  ExternalLink,
  LogOut,
  KeyRound,
  ShieldCheck,
  Lock,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

type SectionTab =
  | 'hero'
  | 'about'
  | 'engineering'
  | 'villas'
  | 'cases'
  | 'team'
  | 'reviews'
  | 'contacts'
  | 'security';

export const QuickContentEditorModal: React.FC = () => {
  const {
    content,
    updateContent,
    updateSection,
    resetContent,
    isEditorOpen,
    closeEditor,
    hasCustomOverrides,
    isAuthenticated,
    logout,
    configuredEnvPassword,
  } = useSiteContent();

  const [activeTab, setActiveTab] = useState<SectionTab>('hero');
  const [copiedCode, setCopiedCode] = useState(false);
  const [imagePickerTarget, setImagePickerTarget] = useState<{
    section: string;
    field: string;
    index?: number;
  } | null>(null);

  if (!isEditorOpen || !isAuthenticated) return null;

  const handleCopyCode = () => {
    const code = `// Обновленная конфигурация контента (скопируйте в src/data/siteContent.ts)\nexport const DEFAULT_SITE_CONTENT = ${JSON.stringify(
      content,
      null,
      2
    )};`;
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  const handleDownloadJson = () => {
    const blob = new Blob([JSON.stringify(content, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'arcline-site-content.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-md p-2 sm:p-4 md:p-6 overflow-hidden">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-6xl h-[92vh] flex flex-col bg-[#111315] text-stone-100 rounded-2xl sm:rounded-3xl border border-stone-800 shadow-2xl overflow-hidden font-sans"
        >
          {/* Header Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:p-6 border-b border-stone-800 bg-[#16181C]">
            <div>
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <h2 className="font-display font-bold text-base sm:text-lg uppercase tracking-wider text-white">
                  Единый центр редактирования контента
                </h2>
                <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-[#fc3f1d]/20 text-[#fc3f1d] border border-[#fc3f1d]/30 font-bold uppercase">
                  Live CMS
                </span>
              </div>
              <p className="text-xs text-stone-400 font-mono mt-1">
                Файл в проекте:{' '}
                <code className="text-[#7EA2C4] font-bold">src/data/siteContent.ts</code>{' '}
                — правки здесь сразу видны на сайте
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={handleCopyCode}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-mono font-medium transition border border-stone-700"
                title="Скопировать готовый код для siteContent.ts"
              >
                {copiedCode ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400 font-bold">Скопировано!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Код для siteContent.ts</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleDownloadJson}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-mono font-medium transition border border-stone-700"
                title="Скачать JSON"
              >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">JSON</span>
              </button>

              {hasCustomOverrides && (
                <button
                  type="button"
                  onClick={resetContent}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 text-xs font-mono transition border border-amber-500/30"
                  title="Сбросить все правки к исходным"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Сброс</span>
                </button>
              )}

              {/* Logout Button */}
              <button
                type="button"
                onClick={logout}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-950/40 hover:bg-red-900/60 text-red-300 hover:text-white text-xs font-mono font-medium transition border border-red-800/40"
                title="Выйти из CMS"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Выйти</span>
              </button>

              <button
                type="button"
                onClick={closeEditor}
                className="w-8 h-8 rounded-lg flex items-center justify-center bg-stone-800 hover:bg-stone-700 text-stone-300 transition ml-1"
                aria-label="Закрыть"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Section Navigation Tabs */}
          <div className="flex items-center gap-1 p-2 px-4 sm:px-6 bg-[#131518] border-b border-stone-800/80 overflow-x-auto no-scrollbar font-mono text-xs">
            {[
              { id: 'hero', label: '1. Главный экран', icon: Sparkles },
              { id: 'about', label: '2. О бюро', icon: Layers },
              { id: 'engineering', label: '3. Инженерия', icon: FileCode },
              { id: 'villas', label: '4. Каталог вилл', icon: Home },
              { id: 'cases', label: '5. Реальные кейсы', icon: ImageIcon },
              { id: 'team', label: '6. Команда', icon: Users },
              { id: 'reviews', label: '7. Отзывы', icon: MessageSquare },
              { id: 'contacts', label: '8. Контакты и Футер', icon: Phone },
              { id: 'security', label: '9. Пароль и .env', icon: KeyRound },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id as SectionTab)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl transition whitespace-nowrap ${
                    isActive
                      ? 'bg-white text-[#111315] font-bold shadow'
                      : 'text-stone-400 hover:text-white hover:bg-stone-800/60'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Scrollable Form Body */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 space-y-8">
            {/* 1. HERO TAB */}
            {activeTab === 'hero' && (
              <div className="space-y-6 max-w-4xl">
                <div className="border-b border-stone-800 pb-3">
                  <h3 className="font-display font-bold text-lg text-white uppercase">
                    Главный экран (Hero Section)
                  </h3>
                  <p className="text-xs text-stone-400 font-mono mt-0.5">
                    Управляет заголовками, фоновым изображением и ключевыми цифрами на первом экране.
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-mono text-stone-400 mb-1.5 uppercase">
                      Претайтл (строка над заголовком)
                    </label>
                    <input
                      type="text"
                      value={content.hero.pretitle.ru}
                      onChange={(e) =>
                        updateSection('hero', {
                          ...content.hero,
                          pretitle: { ...content.hero.pretitle, ru: e.target.value },
                        })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-stone-900 border border-stone-700 text-stone-100 text-sm focus:outline-none focus:border-[#7EA2C4]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-stone-400 mb-1.5 uppercase">
                      Главный заголовок H1
                    </label>
                    <textarea
                      rows={2}
                      value={content.hero.title.ru}
                      onChange={(e) =>
                        updateSection('hero', {
                          ...content.hero,
                          title: { ...content.hero.title, ru: e.target.value },
                        })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-stone-900 border border-stone-700 text-stone-100 text-sm focus:outline-none focus:border-[#7EA2C4]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-stone-400 mb-1.5 uppercase">
                      Подзаголовок описания
                    </label>
                    <textarea
                      rows={3}
                      value={content.hero.subtitle.ru}
                      onChange={(e) =>
                        updateSection('hero', {
                          ...content.hero,
                          subtitle: { ...content.hero.subtitle, ru: e.target.value },
                        })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-stone-900 border border-stone-700 text-stone-100 text-sm focus:outline-none focus:border-[#7EA2C4]"
                    />
                  </div>

                  {/* Hero Background Image */}
                  <div className="p-4 rounded-2xl bg-stone-900 border border-stone-800 space-y-3">
                    <label className="block text-xs font-mono text-[#7EA2C4] uppercase font-bold">
                      Фоновое изображение первого экрана (Hero Background)
                    </label>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                      <img
                        src={content.hero.backgroundImage}
                        alt="Hero preview"
                        className="w-32 h-20 rounded-xl object-cover border border-stone-700 shadow-md"
                      />
                      <div className="flex-1 w-full space-y-2">
                        <input
                          type="text"
                          value={content.hero.backgroundImage}
                          onChange={(e) =>
                            updateSection('hero', {
                              ...content.hero,
                              backgroundImage: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-700 text-stone-200 text-xs font-mono"
                          placeholder="Введите URL изображения или путь из src/assets/images/"
                        />
                        <div className="flex flex-wrap gap-2 text-[11px] font-mono">
                          <span className="text-stone-400 self-center">Быстрый выбор:</span>
                          <button
                            type="button"
                            onClick={() =>
                              updateSection('hero', {
                                ...content.hero,
                                backgroundImage: SITE_IMAGES.vistaExterior,
                              })
                            }
                            className="px-2 py-1 rounded bg-stone-800 hover:bg-stone-700 text-stone-300"
                          >
                            Фахверк Vista
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              updateSection('hero', {
                                ...content.hero,
                                backgroundImage: SITE_IMAGES.titanExterior,
                              })
                            }
                            className="px-2 py-1 rounded bg-stone-800 hover:bg-stone-700 text-stone-300"
                          >
                            Монолит Titan
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              updateSection('hero', {
                                ...content.hero,
                                backgroundImage: SITE_IMAGES.nordicExterior,
                              })
                            }
                            className="px-2 py-1 rounded bg-stone-800 hover:bg-stone-700 text-stone-300"
                          >
                            Сканди Nordic
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 4 Hero Stats */}
                  <div className="space-y-3 pt-2">
                    <label className="block text-xs font-mono text-stone-400 uppercase font-bold">
                      4 ключевые плашки-метрики Hero
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {content.hero.stats.map((stat, idx) => (
                        <div
                          key={idx}
                          className="p-3.5 rounded-xl bg-stone-900 border border-stone-800 space-y-2"
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono text-stone-400">#{idx + 1} Значение:</span>
                            <input
                              type="text"
                              value={stat.number}
                              onChange={(e) => {
                                const newStats = [...content.hero.stats];
                                newStats[idx].number = e.target.value;
                                updateSection('hero', { ...content.hero, stats: newStats });
                              }}
                              className="flex-1 px-2.5 py-1 rounded-lg bg-stone-950 border border-stone-700 text-stone-100 font-mono text-sm font-bold"
                            />
                          </div>
                          <input
                            type="text"
                            value={stat.label.ru}
                            onChange={(e) => {
                              const newStats = [...content.hero.stats];
                              newStats[idx].label.ru = e.target.value;
                              updateSection('hero', { ...content.hero, stats: newStats });
                            }}
                            className="w-full px-2.5 py-1 rounded-lg bg-stone-950 border border-stone-700 text-stone-300 text-xs"
                            placeholder="Подпись"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 2. ABOUT TAB */}
            {activeTab === 'about' && (
              <div className="space-y-6 max-w-4xl">
                <div className="border-b border-stone-800 pb-3">
                  <h3 className="font-display font-bold text-lg text-white uppercase">
                    Секция «О бюро» (About)
                  </h3>
                  <p className="text-xs text-stone-400 font-mono mt-0.5">
                    Манифест, ключевые метрики (140+, 80+ и др.) и технологические карточки.
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-mono text-stone-400 mb-1.5 uppercase">
                      Главный манифест-заголовок
                    </label>
                    <textarea
                      rows={3}
                      value={content.about.manifestoTitle.ru}
                      onChange={(e) =>
                        updateSection('about', {
                          ...content.about,
                          manifestoTitle: { ...content.about.manifestoTitle, ru: e.target.value },
                        })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-stone-900 border border-stone-700 text-stone-100 text-sm focus:outline-none focus:border-[#7EA2C4]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-stone-400 mb-1.5 uppercase">
                      Текст описания
                    </label>
                    <textarea
                      rows={4}
                      value={content.about.description.ru}
                      onChange={(e) =>
                        updateSection('about', {
                          ...content.about,
                          description: { ...content.about.description, ru: e.target.value },
                        })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-stone-900 border border-stone-700 text-stone-100 text-sm focus:outline-none focus:border-[#7EA2C4]"
                    />
                  </div>

                  {/* Metrics */}
                  <div className="space-y-3 pt-2">
                    <label className="block text-xs font-mono text-stone-400 uppercase font-bold">
                      4 метрики в полосе
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                      {content.about.metrics.map((m, idx) => (
                        <div
                          key={idx}
                          className="p-3.5 rounded-xl bg-stone-900 border border-stone-800 space-y-2"
                        >
                          <input
                            type="text"
                            value={m.number}
                            onChange={(e) => {
                              const newM = [...content.about.metrics];
                              newM[idx].number = e.target.value;
                              updateSection('about', { ...content.about, metrics: newM });
                            }}
                            className="w-full px-2.5 py-1 rounded-lg bg-stone-950 border border-stone-700 text-stone-100 font-mono text-base font-bold"
                          />
                          <input
                            type="text"
                            value={m.label.ru}
                            onChange={(e) => {
                              const newM = [...content.about.metrics];
                              newM[idx].label.ru = e.target.value;
                              updateSection('about', { ...content.about, metrics: newM });
                            }}
                            className="w-full px-2.5 py-1 rounded-lg bg-stone-950 border border-stone-700 text-stone-300 text-xs"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Sub cards with icons */}
                  <div className="space-y-3 pt-2">
                    <label className="block text-xs font-mono text-stone-400 uppercase font-bold">
                      Карточки технологий (Purbond и Hundegger)
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {content.about.subCards.map((card, idx) => (
                        <div
                          key={idx}
                          className="p-4 rounded-xl bg-stone-900 border border-stone-800 space-y-3"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-lg bg-stone-800 flex items-center justify-center text-[#7EA2C4]">
                              <DynamicIcon name={card.icon} className="w-5 h-5" />
                            </div>
                            <div className="flex-1">
                              <input
                                type="text"
                                value={card.title}
                                onChange={(e) => {
                                  const newC = [...content.about.subCards];
                                  newC[idx].title = e.target.value;
                                  updateSection('about', { ...content.about, subCards: newC });
                                }}
                                className="w-full px-2 py-1 rounded bg-stone-950 border border-stone-700 text-sm font-bold text-white"
                                placeholder="Заголовок карточки"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-[10px] font-mono text-stone-400 mb-1">
                              Название иконки (Lucide):
                            </label>
                            <input
                              type="text"
                              value={card.icon}
                              onChange={(e) => {
                                const newC = [...content.about.subCards];
                                newC[idx].icon = e.target.value;
                                updateSection('about', { ...content.about, subCards: newC });
                              }}
                              className="w-full px-2 py-1 rounded bg-stone-950 border border-stone-700 text-xs font-mono text-[#7EA2C4]"
                              placeholder="ShieldCheck, Award, Cpu, Home..."
                            />
                          </div>
                          <textarea
                            rows={3}
                            value={card.text.ru}
                            onChange={(e) => {
                              const newC = [...content.about.subCards];
                              newC[idx].text.ru = e.target.value;
                              updateSection('about', { ...content.about, subCards: newC });
                            }}
                            className="w-full px-2.5 py-1.5 rounded bg-stone-950 border border-stone-700 text-xs text-stone-300"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 3. ENGINEERING TAB */}
            {activeTab === 'engineering' && (
              <div className="space-y-6 max-w-5xl">
                <div className="border-b border-stone-800 pb-3">
                  <h3 className="font-display font-bold text-lg text-white uppercase">
                    Инженерные стандарты (6 карточек)
                  </h3>
                  <p className="text-xs text-stone-400 font-mono mt-0.5">
                    Редактируйте тексты, метрики и иконки каждой технологической карточки.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {content.engineering.pillars.map((pillar, idx) => (
                    <div
                      key={pillar.id}
                      className="p-4 rounded-xl bg-stone-900 border border-stone-800 space-y-3"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-stone-800 flex items-center justify-center text-[#7EA2C4]">
                            <DynamicIcon name={pillar.iconName} className="w-4 h-4" />
                          </div>
                          <span className="font-mono text-xs text-stone-400 font-bold">
                            #{pillar.number}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 flex-1 max-w-xs">
                          <label className="text-[10px] font-mono text-stone-400">Иконка:</label>
                          <input
                            type="text"
                            value={pillar.iconName}
                            onChange={(e) => {
                              const newP = [...content.engineering.pillars];
                              newP[idx].iconName = e.target.value;
                              updateSection('engineering', {
                                ...content.engineering,
                                pillars: newP,
                              });
                            }}
                            className="w-full px-2 py-0.5 rounded bg-stone-950 border border-stone-700 text-xs font-mono text-[#7EA2C4]"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-mono text-stone-400 mb-1">
                          Заголовок:
                        </label>
                        <input
                          type="text"
                          value={pillar.title.ru}
                          onChange={(e) => {
                            const newP = [...content.engineering.pillars];
                            newP[idx].title.ru = e.target.value;
                            updateSection('engineering', {
                              ...content.engineering,
                              pillars: newP,
                            });
                          }}
                          className="w-full px-2.5 py-1.5 rounded bg-stone-950 border border-stone-700 text-xs font-bold text-white"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[10px] font-mono text-stone-400 mb-1">
                            Крупная метрика:
                          </label>
                          <input
                            type="text"
                            value={pillar.metric}
                            onChange={(e) => {
                              const newP = [...content.engineering.pillars];
                              newP[idx].metric = e.target.value;
                              updateSection('engineering', {
                                ...content.engineering,
                                pillars: newP,
                              });
                            }}
                            className="w-full px-2.5 py-1 rounded bg-stone-950 border border-stone-700 text-xs font-mono text-emerald-400 font-bold"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-mono text-stone-400 mb-1">
                            Бейдж:
                          </label>
                          <input
                            type="text"
                            value={pillar.badge.ru}
                            onChange={(e) => {
                              const newP = [...content.engineering.pillars];
                              newP[idx].badge.ru = e.target.value;
                              updateSection('engineering', {
                                ...content.engineering,
                                pillars: newP,
                              });
                            }}
                            className="w-full px-2.5 py-1 rounded bg-stone-950 border border-stone-700 text-xs font-mono text-stone-300"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-mono text-stone-400 mb-1">
                          Описание:
                        </label>
                        <textarea
                          rows={3}
                          value={pillar.description.ru}
                          onChange={(e) => {
                            const newP = [...content.engineering.pillars];
                            newP[idx].description.ru = e.target.value;
                            updateSection('engineering', {
                              ...content.engineering,
                              pillars: newP,
                            });
                          }}
                          className="w-full px-2.5 py-1.5 rounded bg-stone-950 border border-stone-700 text-xs text-stone-300"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 4. VILLAS TAB */}
            {activeTab === 'villas' && (
              <div className="space-y-6 max-w-5xl">
                <div className="border-b border-stone-800 pb-3">
                  <h3 className="font-display font-bold text-lg text-white uppercase">
                    Каталог авторских вилл
                  </h3>
                  <p className="text-xs text-stone-400 font-mono mt-0.5">
                    Редактируйте названия, фотографии (экстерьер и интерьер), площади, цены и опции.
                  </p>
                </div>

                <div className="space-y-6">
                  {content.villas.map((villa, idx) => (
                    <div
                      key={villa.id}
                      className="p-5 rounded-2xl bg-stone-900 border border-stone-800 space-y-4"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-800 pb-3">
                        <div>
                          <span className="font-mono text-[10px] uppercase text-[#7EA2C4] font-bold">
                            {villa.styleName.ru}
                          </span>
                          <h4 className="font-display font-bold text-lg text-white">
                            {villa.name}
                          </h4>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="font-mono text-xs">
                            <span className="text-stone-400">Площадь: </span>
                            <span className="text-white font-bold">{villa.area} м²</span>
                          </div>
                          <div className="font-mono text-xs">
                            <span className="text-stone-400">Стоимость: </span>
                            <span className="text-emerald-400 font-bold">
                              {villa.priceRub.toLocaleString('ru-RU')} ₽
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Images Row */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Main Image */}
                        <div className="p-3 rounded-xl bg-stone-950 border border-stone-800 space-y-2">
                          <span className="text-xs font-mono text-stone-300 font-bold block">
                            Главное фото (Экстерьер)
                          </span>
                          <img
                            src={villa.mainImage}
                            alt={`${villa.name} exterior`}
                            className="w-full h-36 rounded-lg object-cover border border-stone-800"
                          />
                          <input
                            type="text"
                            value={villa.mainImage}
                            onChange={(e) => {
                              const newV = [...content.villas];
                              newV[idx].mainImage = e.target.value;
                              updateSection('villas', newV);
                            }}
                            className="w-full px-2.5 py-1.5 rounded bg-stone-900 border border-stone-700 text-xs font-mono text-stone-200"
                            placeholder="URL изображения"
                          />
                        </div>

                        {/* Secondary Image */}
                        <div className="p-3 rounded-xl bg-stone-950 border border-stone-800 space-y-2">
                          <span className="text-xs font-mono text-stone-300 font-bold block">
                            Второе фото (Интерьер)
                          </span>
                          <img
                            src={villa.secondaryImage}
                            alt={`${villa.name} interior`}
                            className="w-full h-36 rounded-lg object-cover border border-stone-800"
                          />
                          <input
                            type="text"
                            value={villa.secondaryImage}
                            onChange={(e) => {
                              const newV = [...content.villas];
                              newV[idx].secondaryImage = e.target.value;
                              updateSection('villas', newV);
                            }}
                            className="w-full px-2.5 py-1.5 rounded bg-stone-900 border border-stone-700 text-xs font-mono text-stone-200"
                            placeholder="URL изображения интерьера"
                          />
                        </div>
                      </div>

                      {/* Specs and Tagline */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-[10px] font-mono text-stone-400 mb-1">
                            Название:
                          </label>
                          <input
                            type="text"
                            value={villa.name}
                            onChange={(e) => {
                              const newV = [...content.villas];
                              newV[idx].name = e.target.value;
                              updateSection('villas', newV);
                            }}
                            className="w-full px-2.5 py-1.5 rounded bg-stone-950 border border-stone-700 text-xs text-white font-bold"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-mono text-stone-400 mb-1">
                            Площадь (м²):
                          </label>
                          <input
                            type="number"
                            value={villa.area}
                            onChange={(e) => {
                              const newV = [...content.villas];
                              newV[idx].area = Number(e.target.value);
                              updateSection('villas', newV);
                            }}
                            className="w-full px-2.5 py-1.5 rounded bg-stone-950 border border-stone-700 text-xs text-white font-mono"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-mono text-stone-400 mb-1">
                            Цена (₽):
                          </label>
                          <input
                            type="number"
                            value={villa.priceRub}
                            onChange={(e) => {
                              const newV = [...content.villas];
                              newV[idx].priceRub = Number(e.target.value);
                              updateSection('villas', newV);
                            }}
                            className="w-full px-2.5 py-1.5 rounded bg-stone-950 border border-stone-700 text-xs text-emerald-400 font-mono font-bold"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-mono text-stone-400 mb-1">
                          Слоган / Описание виллы:
                        </label>
                        <input
                          type="text"
                          value={villa.tagline.ru}
                          onChange={(e) => {
                            const newV = [...content.villas];
                            newV[idx].tagline.ru = e.target.value;
                            updateSection('villas', newV);
                          }}
                          className="w-full px-2.5 py-1.5 rounded bg-stone-950 border border-stone-700 text-xs text-stone-200"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 5. CASES TAB */}
            {activeTab === 'cases' && (
              <div className="space-y-6 max-w-5xl">
                <div className="border-b border-stone-800 pb-3">
                  <h3 className="font-display font-bold text-lg text-white uppercase">
                    Реализованные кейсы (до/после и стройка)
                  </h3>
                  <p className="text-xs text-stone-400 font-mono mt-0.5">
                    Фотографии готовых домов, стройплощадки, цитаты клиентов и фактические сроки.
                  </p>
                </div>

                <div className="space-y-6">
                  {content.realCases.map((rc, idx) => (
                    <div
                      key={rc.id}
                      className="p-5 rounded-2xl bg-stone-900 border border-stone-800 space-y-4"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-800 pb-3">
                        <div>
                          <h4 className="font-display font-bold text-lg text-white">
                            {rc.title.ru}
                          </h4>
                          <span className="font-mono text-xs text-stone-400">{rc.location.ru}</span>
                        </div>
                        <div className="font-mono text-xs text-emerald-400 font-bold">
                          Срок: {rc.timelineDays} дней // {rc.budgetRub.toLocaleString('ru-RU')} ₽
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-3 rounded-xl bg-stone-950 border border-stone-800 space-y-2">
                          <span className="text-xs font-mono text-stone-300 font-bold block">
                            Фото готового дома
                          </span>
                          <img
                            src={rc.finishedImage}
                            alt="Finished"
                            className="w-full h-36 rounded-lg object-cover border border-stone-800"
                          />
                          <input
                            type="text"
                            value={rc.finishedImage}
                            onChange={(e) => {
                              const newC = [...content.realCases];
                              newC[idx].finishedImage = e.target.value;
                              updateSection('realCases', newC);
                            }}
                            className="w-full px-2.5 py-1.5 rounded bg-stone-900 border border-stone-700 text-xs font-mono text-stone-200"
                          />
                        </div>

                        <div className="p-3 rounded-xl bg-stone-950 border border-stone-800 space-y-2">
                          <span className="text-xs font-mono text-stone-300 font-bold block">
                            Фото со стройки
                          </span>
                          <img
                            src={rc.constructionImage}
                            alt="Construction"
                            className="w-full h-36 rounded-lg object-cover border border-stone-800"
                          />
                          <input
                            type="text"
                            value={rc.constructionImage}
                            onChange={(e) => {
                              const newC = [...content.realCases];
                              newC[idx].constructionImage = e.target.value;
                              updateSection('realCases', newC);
                            }}
                            className="w-full px-2.5 py-1.5 rounded bg-stone-900 border border-stone-700 text-xs font-mono text-stone-200"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-mono text-stone-400 mb-1">
                          Цитата заказчика:
                        </label>
                        <textarea
                          rows={2}
                          value={rc.clientQuote.ru}
                          onChange={(e) => {
                            const newC = [...content.realCases];
                            newC[idx].clientQuote.ru = e.target.value;
                            updateSection('realCases', newC);
                          }}
                          className="w-full px-2.5 py-1.5 rounded bg-stone-950 border border-stone-700 text-xs text-stone-300"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 6. TEAM TAB */}
            {activeTab === 'team' && (
              <div className="space-y-6 max-w-5xl">
                <div className="border-b border-stone-800 pb-3">
                  <h3 className="font-display font-bold text-lg text-white uppercase">
                    Команда бюро (4 специалиста)
                  </h3>
                  <p className="text-xs text-stone-400 font-mono mt-0.5">
                    Фотографии, имена, должности, опыт работы и биографии экспертов.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {content.team.map((member, idx) => (
                    <div
                      key={member.id}
                      className="p-4 rounded-xl bg-stone-900 border border-stone-800 space-y-3"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={member.photo}
                          alt={member.name.ru}
                          className="w-16 h-20 rounded-xl object-cover border border-stone-700 shadow"
                        />
                        <div className="flex-1 space-y-1">
                          <input
                            type="text"
                            value={member.name.ru}
                            onChange={(e) => {
                              const newT = [...content.team];
                              newT[idx].name.ru = e.target.value;
                              updateSection('team', newT);
                            }}
                            className="w-full px-2 py-1 rounded bg-stone-950 border border-stone-700 text-sm font-bold text-white"
                            placeholder="Имя"
                          />
                          <input
                            type="text"
                            value={member.role.ru}
                            onChange={(e) => {
                              const newT = [...content.team];
                              newT[idx].role.ru = e.target.value;
                              updateSection('team', newT);
                            }}
                            className="w-full px-2 py-1 rounded bg-stone-950 border border-stone-700 text-xs text-[#7EA2C4]"
                            placeholder="Должность"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-mono text-stone-400 mb-1">
                          Фотография (URL):
                        </label>
                        <input
                          type="text"
                          value={member.photo}
                          onChange={(e) => {
                            const newT = [...content.team];
                            newT[idx].photo = e.target.value;
                            updateSection('team', newT);
                          }}
                          className="w-full px-2 py-1 rounded bg-stone-950 border border-stone-700 text-xs font-mono text-stone-300"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-mono text-stone-400 mb-1">
                          Краткая биография:
                        </label>
                        <textarea
                          rows={3}
                          value={member.bio.ru}
                          onChange={(e) => {
                            const newT = [...content.team];
                            newT[idx].bio.ru = e.target.value;
                            updateSection('team', newT);
                          }}
                          className="w-full px-2.5 py-1.5 rounded bg-stone-950 border border-stone-700 text-xs text-stone-300"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 7. REVIEWS TAB */}
            {activeTab === 'reviews' && (
              <div className="space-y-6 max-w-5xl">
                <div className="border-b border-stone-800 pb-3">
                  <h3 className="font-display font-bold text-lg text-white uppercase">
                    Отзывы реальных владельцев
                  </h3>
                  <p className="text-xs text-stone-400 font-mono mt-0.5">
                    Аватары клиентов, фото их вилл, текст отзыва и локация.
                  </p>
                </div>

                <div className="space-y-4">
                  {content.reviews.map((rev, idx) => (
                    <div
                      key={rev.id}
                      className="p-4 rounded-xl bg-stone-900 border border-stone-800 space-y-3"
                    >
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                        <img
                          src={rev.avatar}
                          alt="Avatar"
                          className="w-12 h-12 rounded-full object-cover border border-stone-700"
                        />
                        <div className="flex-1 w-full grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <input
                            type="text"
                            value={rev.authorName.ru}
                            onChange={(e) => {
                              const newR = [...content.reviews];
                              newR[idx].authorName.ru = e.target.value;
                              updateSection('reviews', newR);
                            }}
                            className="w-full px-2 py-1 rounded bg-stone-950 border border-stone-700 text-sm font-bold text-white"
                            placeholder="Имя автора"
                          />
                          <input
                            type="text"
                            value={rev.authorTitle.ru}
                            onChange={(e) => {
                              const newR = [...content.reviews];
                              newR[idx].authorTitle.ru = e.target.value;
                              updateSection('reviews', newR);
                            }}
                            className="w-full px-2 py-1 rounded bg-stone-950 border border-stone-700 text-xs text-stone-400"
                            placeholder="Описание виллы"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[10px] font-mono text-stone-400 mb-1">
                            Аватар URL:
                          </label>
                          <input
                            type="text"
                            value={rev.avatar}
                            onChange={(e) => {
                              const newR = [...content.reviews];
                              newR[idx].avatar = e.target.value;
                              updateSection('reviews', newR);
                            }}
                            className="w-full px-2 py-1 rounded bg-stone-950 border border-stone-700 text-xs font-mono text-stone-300"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-mono text-stone-400 mb-1">
                            Фото дома URL:
                          </label>
                          <input
                            type="text"
                            value={rev.villaPhoto}
                            onChange={(e) => {
                              const newR = [...content.reviews];
                              newR[idx].villaPhoto = e.target.value;
                              updateSection('reviews', newR);
                            }}
                            className="w-full px-2 py-1 rounded bg-stone-950 border border-stone-700 text-xs font-mono text-stone-300"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-mono text-stone-400 mb-1">
                          Текст отзыва:
                        </label>
                        <textarea
                          rows={3}
                          value={rev.text.ru}
                          onChange={(e) => {
                            const newR = [...content.reviews];
                            newR[idx].text.ru = e.target.value;
                            updateSection('reviews', newR);
                          }}
                          className="w-full px-2.5 py-1.5 rounded bg-stone-950 border border-stone-700 text-xs text-stone-300"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 8. CONTACTS & FOOTER TAB */}
            {activeTab === 'contacts' && (
              <div className="space-y-6 max-w-4xl">
                <div className="border-b border-stone-800 pb-3">
                  <h3 className="font-display font-bold text-lg text-white uppercase">
                    Брендинг, Контакты и Шоурум
                  </h3>
                  <p className="text-xs text-stone-400 font-mono mt-0.5">
                    Название компании, слоган, телефон, email, адрес и режим работы шоурума.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono text-stone-400 mb-1.5 uppercase">
                        Название бренда
                      </label>
                      <input
                        type="text"
                        value={content.brand.name}
                        onChange={(e) =>
                          updateSection('brand', { ...content.brand, name: e.target.value })
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl bg-stone-900 border border-stone-700 text-stone-100 text-sm font-bold"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-stone-400 mb-1.5 uppercase">
                        Иконка логотипа (Lucide)
                      </label>
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-xl bg-stone-800 flex items-center justify-center text-[#7EA2C4]">
                          <DynamicIcon name={content.brand.logoIcon} className="w-5 h-5" />
                        </div>
                        <input
                          type="text"
                          value={content.brand.logoIcon}
                          onChange={(e) =>
                            updateSection('brand', { ...content.brand, logoIcon: e.target.value })
                          }
                          className="flex-1 px-3 py-2 rounded-xl bg-stone-900 border border-stone-700 text-stone-100 text-xs font-mono text-[#7EA2C4]"
                          placeholder="Compass, Home, Shield, Award..."
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-stone-400 mb-1.5 uppercase">
                      Слоган бюро
                    </label>
                    <input
                      type="text"
                      value={content.brand.tagline.ru}
                      onChange={(e) =>
                        updateSection('brand', {
                          ...content.brand,
                          tagline: { ...content.brand.tagline, ru: e.target.value },
                        })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-stone-900 border border-stone-700 text-stone-100 text-sm"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono text-stone-400 mb-1.5 uppercase">
                        Телефон прямой линии
                      </label>
                      <input
                        type="text"
                        value={content.brand.phone}
                        onChange={(e) =>
                          updateSection('brand', { ...content.brand, phone: e.target.value })
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl bg-stone-900 border border-stone-700 text-stone-100 font-mono text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-stone-400 mb-1.5 uppercase">
                        Email для VIP-запросов
                      </label>
                      <input
                        type="text"
                        value={content.brand.email}
                        onChange={(e) =>
                          updateSection('brand', { ...content.brand, email: e.target.value })
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl bg-stone-900 border border-stone-700 text-stone-100 font-mono text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-stone-400 mb-1.5 uppercase">
                      Адрес флагманского шоурума
                    </label>
                    <input
                      type="text"
                      value={content.brand.address.ru}
                      onChange={(e) =>
                        updateSection('brand', {
                          ...content.brand,
                          address: { ...content.brand.address, ru: e.target.value },
                        })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-stone-900 border border-stone-700 text-stone-100 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-stone-400 mb-1.5 uppercase">
                      Режим работы и посещения
                    </label>
                    <input
                      type="text"
                      value={content.brand.hours.ru}
                      onChange={(e) =>
                        updateSection('brand', {
                          ...content.brand,
                          hours: { ...content.brand.hours, ru: e.target.value },
                        })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-stone-900 border border-stone-700 text-stone-100 text-sm"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 9. SECURITY TAB */}
            {activeTab === 'security' && (
              <div className="space-y-6 max-w-4xl">
                <div className="border-b border-stone-800 pb-3">
                  <div className="flex items-center gap-2">
                    <KeyRound className="w-5 h-5 text-[#fc3f1d]" />
                    <h3 className="font-display font-bold text-lg text-white uppercase">
                      Безопасность и управление паролем CMS
                    </h3>
                  </div>
                  <p className="text-xs text-stone-400 font-mono mt-0.5">
                    Пароль администратора загружается из конфигурационного файла окружения .env
                  </p>
                </div>

                <div className="space-y-5">
                  <div className="p-5 rounded-2xl bg-stone-900 border border-stone-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono text-stone-400 uppercase font-bold">
                        Текущий активный пароль:
                      </span>
                      <span className="font-mono text-xs px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold">
                        Защита активна
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <input
                        type="text"
                        readOnly
                        value={configuredEnvPassword}
                        className="flex-1 px-4 py-2.5 rounded-xl bg-stone-950 border border-stone-700 font-mono text-sm text-stone-200 select-all"
                      />
                      <span className="text-xs text-stone-400 font-mono">
                        (значение из .env)
                      </span>
                    </div>
                  </div>

                  <div className="p-5 rounded-2xl bg-stone-900/60 border border-stone-800 space-y-3">
                    <h4 className="font-display font-bold text-sm uppercase text-[#7EA2C4] flex items-center gap-2">
                      <FileCode className="w-4 h-4" />
                      <span>Как изменить пароль:</span>
                    </h4>
                    <p className="text-xs text-stone-300 leading-relaxed">
                      Чтобы изменить пароль доступа к админке, откройте файл{' '}
                      <code className="text-white bg-black/60 px-1.5 py-0.5 rounded font-mono font-bold">
                        .env
                      </code>{' '}
                      в корне проекта и измените переменную{' '}
                      <code className="text-[#fc3f1d] bg-black/60 px-1.5 py-0.5 rounded font-mono font-bold">
                        VITE_ADMIN_PASSWORD
                      </code>:
                    </p>

                    <div className="bg-stone-950 p-4 rounded-xl border border-stone-800 font-mono text-xs text-stone-200 space-y-1">
                      <div className="text-stone-500"># Файл /.env</div>
                      <div className="text-emerald-400 font-bold">
                        VITE_ADMIN_PASSWORD="ваш_новый_секретный_пароль"
                      </div>
                    </div>

                    <p className="text-[11px] text-stone-400 font-mono">
                      * После изменения файла .env Vite автоматически применит новый пароль при следующей сессии.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-blue-950/20 border border-blue-900/30 flex items-start gap-3 text-xs text-stone-300">
                    <ShieldCheck className="w-5 h-5 text-[#7EA2C4] shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-white block mb-0.5">
                        Безопасность сессии:
                      </span>
                      При входе создаётся защищённая сессия администратора. До закрытия браузера повторный ввод пароля не требуется. Для завершения сеанса нажмите красную кнопку «Выйти».
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 px-6 border-t border-stone-800 bg-[#141619] text-xs font-mono">
            <div className="flex items-center gap-2 text-stone-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>Автосохранение включено (сохраняется в памяти браузера)</span>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={closeEditor}
                className="px-5 py-2 rounded-xl bg-white hover:bg-stone-200 text-[#111315] font-bold uppercase transition"
              >
                Готово / Закрыть
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
