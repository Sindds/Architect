/**
 * КАРТИНКИ САЙТА — все фото, визуализации, чертежи и портреты лежат в папке src/content/images.
 *
 * Как заменить картинку: положите новый файл в src/content/images под тем же именем (например, hero-forest.webp)
 * и поправьте подпись (alt) ниже — её читают незрячие посетители и поисковики. Другой формат (.jpg, .png) —
 * поменяйте расширение и в строке import. Сайт сам сжимает картинки и отдаёт телефону уменьшенную копию.
 * Размеры: фото и чертежи — горизонтальные, не меньше 1400×770 px; портреты — вертикальные, около 640×850 px.
 * Карта офиса (office-map.webp) делается командой pnpm map:preview по точке geo из company.ts.
 * После замены фото первого экрана: pnpm seo:images (картинка для соцсетей и мессенджеров).
 * Какой проект какие картинки показывает — projects.ts, какой портрет у сотрудника — people.ts.
 */
import type { Picture } from "./types";

import chaletExterior from "./images/chalet-exterior.webp";
import chaletInterior from "./images/chalet-interior.webp";
import chaletScheme from "./images/chalet-scheme.webp";
import heroForest from "./images/hero-forest.webp";
import nordicExterior from "./images/nordic-exterior.webp";
import nordicInterior from "./images/nordic-interior.webp";
import nordicScheme from "./images/nordic-scheme.webp";
import processFrame from "./images/process-frame.webp";
import teamAlexey from "./images/team-alexey.webp";
import teamDmitry from "./images/team-dmitry.webp";
import teamEkaterina from "./images/team-ekaterina.webp";
import teamMikhail from "./images/team-mikhail.webp";
import titanExterior from "./images/titan-exterior.webp";
import titanInterior from "./images/titan-interior.webp";
import titanScheme from "./images/titan-scheme.webp";
import vistaExterior from "./images/vista-exterior.webp";
import vistaInterior from "./images/vista-interior.webp";
import vistaScheme from "./images/vista-scheme.webp";

// Фото домов — визуализации (CONTENT-SPEC §1, §7). 18.10.2026 заказчик заменил фасады и интерьеры NORDIC, VISTA,
// CHALET, фото этапа «Как мы работаем», два портрета команды и все схемы — теперь это архитектурные чертежи
// (план, фасады, разрезы; alt составлен по тексту на чертежах). Под нового заказчика замените портреты команды
// фотографиями его сотрудников (с их согласия, ст. 152.1 ГК РФ). Фото клиентов в отзывах нет.
const viz = (src: Picture["src"], alt: string): Picture => ({
  src,
  alt,
  caption: "Визуализация",
});
const drawing = (src: Picture["src"], alt: string): Picture => ({
  src,
  alt,
  caption: "Чертёж",
});

const portrait = (src: Picture["src"], alt: string): Picture => ({
  src,
  alt,
  caption: "Портрет",
});

export const MEDIA = {
  teamAlexey: portrait(teamAlexey, "Алексей Воронов, главный архитектор"),
  teamMikhail: portrait(teamMikhail, "Михаил Седов, инженер-конструктор"),
  teamEkaterina: portrait(teamEkaterina, "Екатерина Лаврова, координатор информационной модели"),
  teamDmitry: portrait(
    teamDmitry,
    "Дмитрий Орлов, руководитель строительного контроля",
  ),

  heroForest: viz(
    heroForest,
    "Загородный дом с панорамным остеклением в лесу, визуализация",
  ),
  processFrame: viz(
    processFrame,
    "Монтаж каркаса дома из клееного бруса, визуализация",
  ),

  vistaExterior: viz(
    vistaExterior,
    "Двухэтажный дом с фахверковым каркасом и панорамными окнами, визуализация",
  ),
  vistaInterior: viz(
    vistaInterior,
    "Гостиная с панорамным остеклением в фахверковом доме, визуализация",
  ),
  vistaScheme: drawing(vistaScheme, "Архитектурные чертежи дома VISTA: план первого этажа, разрез и терраса"),

  nordicExterior: viz(
    nordicExterior,
    "Одноэтажный дом в скандинавском стиле с панорамными окнами, визуализация",
  ),
  nordicInterior: viz(
    nordicInterior,
    "Гостиная одноэтажного дома в скандинавском стиле, визуализация",
  ),
  nordicScheme: drawing(nordicScheme, "Архитектурные чертежи одноэтажного дома NORDIC: план этажа, фасады и разрез"),

  titanExterior: viz(
    titanExterior,
    "Двухэтажный монолитный дом с панорамными фасадами, визуализация",
  ),
  titanInterior: viz(
    titanInterior,
    "Интерьер монолитного дома с панорамным остеклением, визуализация",
  ),
  titanScheme: drawing(titanScheme, "Архитектурные чертежи дома TITAN: план первого этажа, план кровли, фасады и терраса"),

  chaletExterior: viz(
    chaletExterior,
    "Дом в стиле шале с каменным цоколем, визуализация",
  ),
  chaletInterior: viz(
    chaletInterior,
    "Каминный зал в доме в стиле шале, визуализация",
  ),
  chaletScheme: drawing(chaletScheme, "Архитектурные чертежи дома CHALET: план этажа"),

} satisfies Record<string, Picture>;
