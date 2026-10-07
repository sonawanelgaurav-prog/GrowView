/**
 * High-performance image and asset cache.
 * Avoids repeated network requests, duplicate decoding, and enables <100ms export times.
 */

const imageCache = new Map<string, HTMLImageElement>();
const loadingPromises = new Map<string, Promise<HTMLImageElement>>();

/**
 * Preload and cache an image by URL or Data URL.
 * Automatically handles CORS and returns cached instance on subsequent calls.
 */
export function preloadImage(url: string): Promise<HTMLImageElement> {
  if (!url || typeof url !== 'string') {
    return Promise.reject(new Error('Invalid image URL'));
  }

  const cached = imageCache.get(url);
  if (cached && cached.complete && cached.naturalWidth > 0) {
    return Promise.resolve(cached);
  }

  const pending = loadingPromises.get(url);
  if (pending) {
    return pending;
  }

  const promise = new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    
    // Set crossOrigin for external URLs to avoid canvas tainting
    if (!url.startsWith('data:')) {
      img.crossOrigin = 'anonymous';
    }

    img.onload = () => {
      imageCache.set(url, img);
      loadingPromises.delete(url);
      resolve(img);
    };

    img.onerror = (err) => {
      loadingPromises.delete(url);
      console.warn(`[AssetCache] Failed to load image: ${url.slice(0, 80)}`, err);
      // Fallback: resolve with broken image instead of crashing the entire export pipeline
      resolve(img);
    };

    img.src = url;
  });

  loadingPromises.set(url, promise);
  return promise;
}

/**
 * Synchronously retrieves a cached image if already loaded, or null.
 */
export function getCachedImage(url?: string | null): HTMLImageElement | null {
  if (!url) return null;
  const cached = imageCache.get(url);
  return cached && cached.complete && cached.naturalWidth > 0 ? cached : null;
}

/**
 * Preloads a batch of image URLs in parallel.
 */
export async function preloadImages(urls: (string | undefined | null)[]): Promise<HTMLImageElement[]> {
  const validUrls = urls.filter((u): u is string => typeof u === 'string' && u.trim().length > 0);
  return Promise.all(validUrls.map(preloadImage));
}

/**
 * Verifies that web fonts are ready before drawing to canvas.
 */
export async function ensureFontsReady(): Promise<void> {
  if (typeof document !== 'undefined' && document.fonts) {
    try {
      await document.fonts.ready;
    } catch {
      // Ignore font readiness timeout
    }
  }
}
