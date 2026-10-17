import type { CSSProperties } from 'react'

/**
 * Появление блоков при прокрутке в обе стороны. Встраивается в <head> и не ждёт React:
 * IntersectionObserver ставит у `.reveal` атрибут data-in, когда блок в окне, и снимает, когда ушёл.
 * data-from (top | bottom) — с какой стороны блок ушёл или войдёт: при прокрутке вверх он выезжает сверху.
 * Новые блоки (фильтр проектов, окна) подхватывает MutationObserver. Он же следит за сменой класса:
 * React при смене вида (квиз → вилка цены) переиспользует старый элемент и только добавляет ему `reveal`,
 * новый узел при этом не появляется — без этой проверки блок остался бы прозрачным.
 * Без JS, без IntersectionObserver и при prefers-reduced-motion атрибута data-reveal нет — всё видно сразу.
 * Анимируются только transform и opacity, без translate3d: у скрытых блоков нет своих GPU-слоёв.
 */
export const revealInitScript = `(function () {
  var d = document.documentElement;
  try { if (!('IntersectionObserver' in window) || matchMedia('(prefers-reduced-motion: reduce)').matches) return } catch (e) { return }
  d.dataset.reveal = '';
  var side = function (e) { return e.boundingClientRect.top < 0 ? 'top' : 'bottom' };
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      var el = e.target;
      el.dataset.from = side(e);
      if (e.isIntersecting) el.dataset.in = '';
      else delete el.dataset.in;
    });
  }, { rootMargin: '0px 0px -6% 0px', threshold: 0.06 });
  var seen = new WeakSet();
  var watch = function (el) { if (!seen.has(el)) { seen.add(el); io.observe(el) } };
  var scan = function (root) {
    if (root.classList && root.classList.contains('reveal')) watch(root);
    if (root.querySelectorAll) root.querySelectorAll('.reveal').forEach(watch);
  };
  var start = function () {
    scan(document);
    new MutationObserver(function (list) {
      list.forEach(function (m) {
        if (m.type === 'attributes') { if (m.target.classList.contains('reveal')) watch(m.target) }
        else m.addedNodes.forEach(function (n) { if (n.nodeType === 1) scan(n) });
      });
    }).observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['class'] });
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();`

/** Порядковый номер в группе: задержка появления 45 мс на шаг (не больше 8 шагов). */
export const revealOrder = (i: number) => ({ '--i': i }) as CSSProperties
