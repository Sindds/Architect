import React, { useEffect, useRef, useState } from 'react';
import { MapPin, Navigation, ExternalLink, Clock, Car } from 'lucide-react';
import { useThemeLanguage } from '../context/ThemeLanguageContext';
import { useSiteContent } from '../context/SiteContentContext';

declare global {
  interface Window {
    ymaps?: any;
  }
}

const SHOWROOM_COORDS = [55.795642, 37.198539];
const YANDEX_ROUTE_URL =
  'https://yandex.ru/maps/?rtext=~55.795642,37.198539&rtt=auto';
const YANDEX_ORG_URL =
  'https://yandex.ru/maps/org/riga_lend/1083418579/';
const YANDEX_WIDGET_IFRAME_URL =
  'https://yandex.ru/map-widget/v1/?ll=37.198539%2C55.795642&z=15&pt=37.198539,55.795642,pm2rdm';

export const ShowroomMap: React.FC = () => {
  const { language, t } = useThemeLanguage();
  const { content } = useSiteContent();
  const brand = content.brand;
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<any>(null);
  const [useIframeFallback, setUseIframeFallback] = useState(false);
  const [isJsMapReady, setIsJsMapReady] = useState(false);

  useEffect(() => {
    let isCancelled = false;

    const initYmaps = () => {
      if (!window.ymaps || !mapContainerRef.current || isCancelled) {
        return;
      }

      window.ymaps.ready(() => {
        if (isCancelled || !mapContainerRef.current || mapInstanceRef.current) {
          return;
        }

        try {
          // Clear any previous children in container
          mapContainerRef.current.innerHTML = '';

          const map = new window.ymaps.Map(
            mapContainerRef.current,
            {
              center: SHOWROOM_COORDS,
              zoom: 15,
              controls: ['zoomControl', 'fullscreenControl', 'geolocationControl', 'typeSelector'],
            },
            {
              searchControlProvider: 'yandex#search',
              suppressMapOpenBlock: false,
            }
          );

          mapInstanceRef.current = map;

          const placemark = new window.ymaps.Placemark(
            SHOWROOM_COORDS,
            {
              balloonContentHeader:
                '<div style="font-family: sans-serif; font-size: 13px; font-weight: 700; color: #111;">ARCLINE ESTATE // ШОУРУМ</div>',
              balloonContentBody:
                '<div style="font-family: sans-serif; font-size: 12px; color: #444; line-height: 1.4; margin-top: 4px;">БЦ «Riga Land», Новорижское ш., 23-й км, строение 3, этаж 2<br/><strong style="color: #111;">Часы:</strong> 10:00 – 21:00 (ежедневно)<br/><span style="color: #059669;">Бесплатная гостевая парковка на территории</span></div>',
              balloonContentFooter: `<a href="${YANDEX_ROUTE_URL}" target="_blank" rel="noopener noreferrer" style="display: inline-block; margin-top: 6px; color: #fc3f1d; font-family: sans-serif; font-size: 12px; font-weight: 700; text-decoration: none;">Построить маршрут в Яндекс Картах →</a>`,
              hintContent: 'Шоурум Arcline Estate — БЦ Riga Land',
            },
            {
              preset: 'islands#redDotIconWithCaption',
              iconCaption: 'ARCLINE // БЦ Riga Land',
            }
          );

          map.geoObjects.add(placemark);
          placemark.balloon.open();
          setIsJsMapReady(true);
        } catch (err) {
          console.warn('Yandex Maps JS API initialization failed, falling back to iframe:', err);
          setUseIframeFallback(true);
        }
      });
    };

    if (window.ymaps) {
      initYmaps();
    } else {
      // Dynamically load Yandex Maps script if not present
      if (!document.querySelector('script[src*="api-maps.yandex.ru"]')) {
        const script = document.createElement('script');
        script.src = 'https://api-maps.yandex.ru/2.1/?lang=ru_RU';
        script.async = true;
        script.onload = () => {
          if (!isCancelled) initYmaps();
        };
        script.onerror = () => {
          if (!isCancelled) setUseIframeFallback(true);
        };
        document.head.appendChild(script);
      }

      // If window.ymaps not available yet, wait up to 2.5 seconds then fallback to official widget
      const timeout = setTimeout(() => {
        if (!window.ymaps && !isCancelled) {
          setUseIframeFallback(true);
        } else if (window.ymaps && !mapInstanceRef.current && !isCancelled) {
          initYmaps();
        }
      }, 2500);

      // Also listen for script load if still loading
      const interval = setInterval(() => {
        if (window.ymaps && !mapInstanceRef.current && !isCancelled) {
          clearInterval(interval);
          clearTimeout(timeout);
          initYmaps();
        }
      }, 200);

      return () => {
        isCancelled = true;
        clearTimeout(timeout);
        clearInterval(interval);
        if (mapInstanceRef.current) {
          try {
            mapInstanceRef.current.destroy();
          } catch {}
          mapInstanceRef.current = null;
        }
      };
    }

    return () => {
      isCancelled = true;
      if (mapInstanceRef.current) {
        try {
          mapInstanceRef.current.destroy();
        } catch {}
        mapInstanceRef.current = null;
      }
    };
  }, []);

  return (
    <div className="space-y-4">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 font-mono text-xs">
        <div className="flex items-center gap-2.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-white font-bold uppercase tracking-wider">
            {language === 'ru' ? 'Шоурум на Яндекс Картах' : 'Showroom on Yandex Maps'}
          </span>
          <span className="text-stone-400 hidden sm:inline text-[11px]">
            ({language === 'ru' ? 'Новорижское ш., 23 км, БЦ «Riga Land»' : 'Novorizhskoe Hwy, Riga Land'})
          </span>
        </div>

        {/* Action Link: Direct to Yandex Maps */}
        <div className="flex items-center gap-2">
          <a
            href={YANDEX_ROUTE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#fc3f1d] hover:bg-[#e03618] text-white text-xs font-mono font-semibold transition shadow-md"
            title="Построить маршрут в Яндекс Картах"
          >
            <Navigation className="w-3.5 h-3.5" />
            <span>{language === 'ru' ? 'В Навигатор' : 'Directions'}</span>
            <ExternalLink className="w-3 h-3 opacity-80" />
          </a>

          <a
            href={YANDEX_ORG_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-stone-300 text-xs font-mono transition"
            title="Карточка организации"
          >
            <span>{language === 'ru' ? 'БЦ Riga Land' : 'Riga Land'}</span>
            <ExternalLink className="w-3 h-3 text-stone-400" />
          </a>
        </div>
      </div>

      {/* Main Map Box — Clean, Light, Native Yandex Map (No dark filters, No unrequested buttons) */}
      <div className="w-full h-80 sm:h-96 lg:h-[420px] rounded-2xl sm:rounded-3xl overflow-hidden border border-stone-800 relative bg-[#E8E8E8] shadow-2xl">
        {/* JS API Map Container */}
        <div
          ref={mapContainerRef}
          className={`w-full h-full ${useIframeFallback ? 'hidden' : 'block'}`}
        />

        {/* Widget iframe fallback (guaranteed to render if JS API blocked) */}
        {useIframeFallback && (
          <iframe
            src={YANDEX_WIDGET_IFRAME_URL}
            width="100%"
            height="100%"
            frameBorder="0"
            allowFullScreen={true}
            className="w-full h-full border-0 relative z-0"
            title="Яндекс Карта — Шоурум Arcline Estate в БЦ Riga Land"
            loading="lazy"
          />
        )}

        {/* Small Address Floating Badge in Bottom Left */}
        <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 z-10 max-w-xs bg-white/95 backdrop-blur-md p-3.5 rounded-2xl border border-stone-200/90 shadow-xl text-stone-900 pointer-events-auto">
          <div className="flex items-center gap-1.5 font-mono text-[10px] text-[#fc3f1d] uppercase font-bold tracking-wider mb-1">
            <MapPin className="w-3.5 h-3.5 text-[#fc3f1d]" />
            <span>ARCLINE ESTATE // RIGA LAND</span>
          </div>

          <p className="text-xs text-stone-800 font-sans font-medium leading-snug">
            {brand.address[language] || t.footer.showroomAddress}
          </p>

          <div className="mt-2 pt-2 border-t border-stone-200 flex items-center justify-between text-[11px] font-mono text-stone-600">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-stone-400" />
              {brand.hours[language] || t.footer.hours}
            </span>
            <a
              href={YANDEX_ROUTE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#fc3f1d] hover:text-[#d12f11] font-bold flex items-center gap-0.5 ml-2"
            >
              <span>{language === 'ru' ? 'Маршрут' : 'Route'}</span>
              <Navigation className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
