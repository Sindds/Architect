/**
 * Блоки `.lazy-section` браузер раскладывает, только когда они подходят к окну (content-visibility: auto):
 * на телефоне первый экран рисуется раньше. До этого высота блока — оценка из CSS.
 * Перед переходом по якорю правило снимается (data-full-layout): страница один раз раскладывается целиком,
 * и плавная прокрутка останавливается точно на цели. То же при заходе по ссылке с #…
 * Встраивается в <head> и не ждёт React.
 */
export const lazySectionsInitScript = `(function () {
  var d = document.documentElement;
  var full = function () { d.setAttribute('data-full-layout', '') };
  try { if (location.hash.length > 1) full() } catch (e) {}
  document.addEventListener('click', function (e) {
    var t = e.target;
    if (t && t.closest && t.closest('a[href^="#"]')) full();
  }, true);
  addEventListener('hashchange', full);
})();`

/** Для прокрутки из кода (scrollIntoView): раскладка целиком, чтобы цель не сместилась по пути. */
export function fullLayout() {
  document.documentElement.setAttribute('data-full-layout', '')
}
