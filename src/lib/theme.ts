export type Theme = 'light' | 'dark'

/** Выбор темы в localStorage. */
export const THEME_KEY = 'arcline-theme'
/** Отметка в sessionStorage: лоадер уже показан в этой сессии. */
export const LOADER_KEY = 'arcline-loaded'

export function resolveTheme(stored: string | null, prefersDark: boolean): Theme {
  if (stored === 'light' || stored === 'dark') return stored
  return prefersDark ? 'dark' : 'light'
}

/**
 * Скрипт для <head>: выполняется до первой отрисовки, поэтому страница сразу открывается
 * в нужной теме без вспышки. Здесь же решаем, показывать ли лоадер.
 * Должен быть самодостаточным: никаких импортов, только браузерные API.
 */
export const themeInitScript = `(function () {
  var d = document.documentElement;
  var mm = function (q) { try { return matchMedia(q).matches } catch (e) { return false } };
  var stored = null;
  try { stored = localStorage.getItem('${THEME_KEY}') } catch (e) {}
  var theme = stored === 'light' || stored === 'dark' ? stored : (mm('(prefers-color-scheme: dark)') ? 'dark' : 'light');
  d.dataset.theme = theme;
  d.style.colorScheme = theme;
  var visited = false;
  try { visited = sessionStorage.getItem('${LOADER_KEY}') === '1' } catch (e) {}
  if (visited || mm('(prefers-reduced-motion: reduce)')) d.dataset.loader = 'skip';
})();`
