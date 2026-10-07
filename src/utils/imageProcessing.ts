/**
 * Image processing utilities for GrowView:
 * - Client-side smart background removal (transparent PNG conversion)
 * - Color chroma-keying with corner sampling & feathering
 * - Image compression and file conversion
 */

export interface BgRemoveOptions {
  tolerance?: number; // 5 to 100 (default 36)
  feather?: number; // edge smoothing 1 to 10
  detectCornerBg?: boolean; // auto detect background from corners/borders
  contiguousOnly?: boolean; // only remove background connected to edges (protects clothing/eyes)
  customTargetColor?: { r: number; g: number; b: number };
}

/**
 * Remove solid / gradient background from an image on HTML5 canvas and return transparent PNG Data URL
 */
export async function removeImageBackground(
  imageSrc: string,
  options: BgRemoveOptions = {}
): Promise<string> {
  const {
    tolerance = 38,
    feather = 4,
    detectCornerBg = true,
    contiguousOnly = true,
    customTargetColor,
  } = options;

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        if (!ctx) {
          reject(new Error('Canvas context not available'));
          return;
        }

        // Limit size for fast and snappy processing
        const maxDim = 1200;
        let width = img.width;
        let height = img.height;
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);

        const imgData = ctx.getImageData(0, 0, width, height);
        const data = imgData.data;

        // Sample background color along perimeter
        let bgR = 255;
        let bgG = 255;
        let bgB = 255;

        if (customTargetColor) {
          bgR = customTargetColor.r;
          bgG = customTargetColor.g;
          bgB = customTargetColor.b;
        } else if (detectCornerBg) {
          // Sample perimeter pixels (corners and edges)
          const samples: number[] = [];
          // 4 corners
          samples.push(0, (width - 1) * 4, (height - 1) * width * 4, ((height - 1) * width + (width - 1)) * 4);
          // midpoints of 4 sides
          samples.push(Math.round(width / 2) * 4);
          samples.push(((height - 1) * width + Math.round(width / 2)) * 4);
          samples.push(Math.round(height / 2) * width * 4);
          samples.push((Math.round(height / 2) * width + width - 1) * 4);

          let rSum = 0;
          let gSum = 0;
          let bSum = 0;
          samples.forEach((idx) => {
            rSum += data[idx];
            gSum += data[idx + 1];
            bSum += data[idx + 2];
          });
          bgR = Math.round(rSum / samples.length);
          bgG = Math.round(gSum / samples.length);
          bgB = Math.round(bSum / samples.length);
        }

        // Color distance function
        const threshold = tolerance * 2.55; // scale to 0-255 range
        const featherRange = feather * 3;

        const isBgColor = (idx: number) => {
          const r = data[idx];
          const g = data[idx + 1];
          const b = data[idx + 2];
          const a = data[idx + 3];
          if (a === 0) return true;
          const dr = r - bgR;
          const dg = g - bgG;
          const db = b - bgB;
          return Math.sqrt(dr * dr + dg * dg + db * db) <= threshold;
        };

        if (contiguousOnly) {
          // Flood fill from all 4 borders to only remove connected background
          const visited = new Uint8Array(width * height);
          const queue: number[] = [];

          // Enqueue all border pixels that match background
          for (let x = 0; x < width; x++) {
            const topIdx = x;
            const bottomIdx = (height - 1) * width + x;
            if (isBgColor(topIdx * 4)) {
              visited[topIdx] = 1;
              queue.push(topIdx);
            }
            if (isBgColor(bottomIdx * 4)) {
              visited[bottomIdx] = 1;
              queue.push(bottomIdx);
            }
          }
          for (let y = 0; y < height; y++) {
            const leftIdx = y * width;
            const rightIdx = y * width + (width - 1);
            if (!visited[leftIdx] && isBgColor(leftIdx * 4)) {
              visited[leftIdx] = 1;
              queue.push(leftIdx);
            }
            if (!visited[rightIdx] && isBgColor(rightIdx * 4)) {
              visited[rightIdx] = 1;
              queue.push(rightIdx);
            }
          }

          // BFS traversal
          let head = 0;
          while (head < queue.length) {
            const curr = queue[head++];
            const cx = curr % width;
            const cy = Math.floor(curr / width);

            const neighbors = [
              cx > 0 ? curr - 1 : -1,
              cx < width - 1 ? curr + 1 : -1,
              cy > 0 ? curr - width : -1,
              cy < height - 1 ? curr + width : -1,
            ];

            for (const n of neighbors) {
              if (n >= 0 && !visited[n] && isBgColor(n * 4)) {
                visited[n] = 1;
                queue.push(n);
              }
            }
          }

          // Apply transparency to visited pixels
          for (let p = 0; p < visited.length; p++) {
            if (visited[p] === 1) {
              const byteIdx = p * 4;
              const r = data[byteIdx];
              const g = data[byteIdx + 1];
              const b = data[byteIdx + 2];
              const dr = r - bgR;
              const dg = g - bgG;
              const db = b - bgB;
              const dist = Math.sqrt(dr * dr + dg * dg + db * db);

              if (dist <= threshold - featherRange) {
                data[byteIdx + 3] = 0;
              } else {
                const factor = Math.max(0, Math.min(1, (dist - (threshold - featherRange)) / featherRange));
                data[byteIdx + 3] = Math.round(data[byteIdx + 3] * factor * 0.4);
              }
            }
          }
        } else {
          // Direct pixel removal
          for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            const a = data[i + 3];

            if (a === 0) continue;

            const dr = r - bgR;
            const dg = g - bgG;
            const db = b - bgB;
            const dist = Math.sqrt(dr * dr + dg * dg + db * db);

            if (dist <= threshold) {
              data[i + 3] = 0;
            } else if (dist < threshold + featherRange) {
              const factor = (dist - threshold) / featherRange;
              data[i + 3] = Math.round(a * factor);
            }
          }
        }

        ctx.putImageData(imgData, 0, 0);
        const transparentPng = canvas.toDataURL('image/png');
        resolve(transparentPng);
      } catch (err) {
        reject(err);
      }
    };
    img.onerror = () => reject(new Error('Failed to load image for processing'));
    img.src = imageSrc;
  });
}

/**
 * Convert user uploaded file (PNG, JPG, WebP, WhatsApp Image) to high quality Base64 string
 */
export function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Could not read image file'));
      }
    };
    reader.onerror = (e) => reject(e);
    reader.readAsDataURL(file);
  });
}
