// Centralized intelligent image preloading & cache management engine

const globalLoadedImageCache = new Set<string>();

/**
 * Checks if an image is already cached in memory or has finished downloading in the browser.
 */
export function isImagePreloaded(src: string): boolean {
  if (!src) return false;
  if (globalLoadedImageCache.has(src)) return true;

  if (typeof window !== 'undefined') {
    try {
      const img = new Image();
      img.src = src;
      if (img.complete && img.naturalWidth > 0) {
        globalLoadedImageCache.add(src);
        return true;
      }
    } catch {
      // Ignore any creation errors
    }
  }

  return false;
}

/**
 * Registers an image URL as fully loaded in the client runtime.
 */
export function markImageAsLoaded(src: string): void {
  if (src) {
    globalLoadedImageCache.add(src);
  }
}

/**
 * Preloads a single image and caches its status.
 */
export function preloadImage(src: string): Promise<boolean> {
  return new Promise((resolve) => {
    if (!src) return resolve(false);
    if (globalLoadedImageCache.has(src)) return resolve(true);

    const img = new Image();
    img.decoding = 'async';

    img.onload = () => {
      globalLoadedImageCache.add(src);
      resolve(true);
    };

    img.onerror = () => {
      resolve(false);
    };

    img.src = src;

    // In case the image was already cached synchronously
    if (img.complete && img.naturalWidth > 0) {
      globalLoadedImageCache.add(src);
      resolve(true);
    }
  });
}

// Master list of site images organized by viewport / scroll priority
const TIER_1_CRITICAL_IMAGES = [
  // 1. Hero background & Primary Villa (Immediate First Screen & Projects Showcase)
  '/src/assets/images/vista_exterior_fachwerk_1791226463608.webp',
  '/src/assets/images/vista_interior_living_1791226475298.webp',
  '/src/assets/images/nordic_exterior_villa_1791226487192.webp',
  '/src/assets/images/nordic_interior_lounge_1791226497950.webp',
];

const TIER_2_UPCOMING_IMAGES = [
  // 2. Remaining catalog villas & Construction Cases & Team Engineers
  '/src/assets/images/titan_exterior_monolith_1791226508091.webp',
  '/src/assets/images/titan_interior_gallery_1791226518952.webp',
  '/src/assets/images/chalet_exterior_stone_1791226528798.webp',
  '/src/assets/images/chalet_interior_fireplace_1791226542576.webp',
  '/src/assets/images/novariga_construction_site_1791402742102.webp',
  '/src/assets/images/novariga_bim_blueprint_1791402774881.webp',
  '/src/assets/images/agalarov_construction_site_1791402789924.webp',
  '/src/assets/images/agalarov_bim_blueprint_1791402804711.webp',
  '/src/assets/images/repino_construction_site_1791402819862.webp',
  '/src/assets/images/repino_bim_blueprint_1791402835570.webp',
  '/src/assets/images/nikolina_construction_site_1791402850712.webp',
  '/src/assets/images/nikolina_bim_blueprint_1791402872210.webp',
  '/src/assets/images/team_alexey_portrait_1791316187784.webp',
  '/src/assets/images/team_mikhail_engineer_1791316200520.webp',
  '/src/assets/images/team_dmitry_qc_1791316213087.webp',
  '/src/assets/images/team_ekaterina_bim_1791316228337.webp',
];

const TIER_3_DEEP_SCROLL_IMAGES = [
  // 3. Client reviews, testimonials & video covers
  '/src/assets/images/client_sergey_elena_1790974502846.webp',
  '/src/assets/images/client_konstantin_owner_1790974513567.webp',
  '/src/assets/images/client_marina_artem_1790974524724.webp',
  'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=800&q=75',
  'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=75',
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=75',
  'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=75',
  'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=800&q=75',
];

let preloadingStarted = false;

/**
 * Initiates progressive background preloading of all website images
 * in accordance with the user scroll trajectory.
 */
export function preloadSiteImages(): void {
  if (typeof window === 'undefined' || preloadingStarted) return;
  preloadingStarted = true;

  // Tier 1: Immediately fetch critical top-of-page images
  TIER_1_CRITICAL_IMAGES.forEach((src) => {
    preloadImage(src);
  });

  // Tier 2: Fetch middle section images during initial idle or quick timeout
  const scheduleTier2 = () => {
    TIER_2_UPCOMING_IMAGES.forEach((src) => {
      preloadImage(src);
    });
  };

  // Tier 3: Fetch bottom section images once browser is fully ready
  const scheduleTier3 = () => {
    TIER_3_DEEP_SCROLL_IMAGES.forEach((src) => {
      preloadImage(src);
    });
  };

  if ('requestIdleCallback' in window) {
    (window as any).requestIdleCallback(
      () => {
        scheduleTier2();
        (window as any).requestIdleCallback(scheduleTier3, { timeout: 1500 });
      },
      { timeout: 500 }
    );
  } else {
    setTimeout(scheduleTier2, 100);
    setTimeout(scheduleTier3, 400);
  }
}
