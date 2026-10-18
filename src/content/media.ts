import type { Picture } from "./types";

import chaletExterior from "@/assets/images/chalet-exterior.webp";
import chaletInterior from "@/assets/images/chalet-interior.webp";
import chaletScheme from "@/assets/images/chalet-scheme.webp";
import heroForest from "@/assets/images/hero-forest.webp";
import nordicExterior from "@/assets/images/nordic-exterior.webp";
import nordicInterior from "@/assets/images/nordic-interior.webp";
import nordicScheme from "@/assets/images/nordic-scheme.webp";
import processFrame from "@/assets/images/process-frame.webp";
import teamAlexey from "@/assets/images/team-alexey.webp";
import teamDmitry from "@/assets/images/team-dmitry.webp";
import teamEkaterina from "@/assets/images/team-ekaterina.webp";
import teamMikhail from "@/assets/images/team-mikhail.webp";
import titanExterior from "@/assets/images/titan-exterior.webp";
import titanInterior from "@/assets/images/titan-interior.webp";
import titanScheme from "@/assets/images/titan-scheme.webp";
import vistaExterior from "@/assets/images/vista-exterior.webp";
import vistaInterior from "@/assets/images/vista-interior.webp";
import vistaScheme from "@/assets/images/vista-scheme.webp";

// Фото домов — визуализации (CONTENT-SPEC §1, §7). 18.10.2026 заказчик заменил фасады и интерьеры NORDIC, VISTA,
// CHALET, фото этапа «Как мы работаем», два портрета команды и все схемы — теперь это архитектурные чертежи
// (план, фасады, разрезы; alt составлен по тексту на чертежах). Портреты помечены generated: в режиме client
// их скрывает visiblePhoto (people.ts), пока заказчик не даст фото сотрудников. Фото клиентов в отзывах нет.
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
  generated: true,
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
