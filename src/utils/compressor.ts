/**
 * Core compression engine for OptiPic.
 * Runs entirely in the browser using the Canvas API.
 */

export interface CompressionResult {
  blob: Blob;
  quality: number;
  width: number;
  height: number;
  iterations: number;
}

export interface ImageMetadata {
  name: string;
  originalSize: number;
  type: string;
  width: number;
  height: number;
}

/**
 * Extracts dimensions and metadata from the raw file.
 */
export const getImageMetadata = (file: File): Promise<ImageMetadata> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      resolve({
        name: file.name,
        originalSize: file.size,
        type: file.type,
        width: img.width,
        height: img.height,
      });
      URL.revokeObjectURL(img.src);
    };
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
};

/**
 * Iterative compression algorithm:
 * 1. Checks if the file is already small enough.
 * 2. Steps down quality by 5% increments.
 * 3. Preserves transparency by using WebP for PNGs.
 * 4. Scales down physical dimensions if quality reduction isn't enough.
 */
export const compressToTargetSize = async (
  file: File,
  targetSizeKB: number,
  onProgress?: (iteration: number) => void
): Promise<CompressionResult> => {
  const targetSizeBytes = targetSizeKB * 1024;
  
  // Early Exit: If the file is already smaller than the target, return it immediately.
  if (file.size <= targetSizeBytes) {
    const meta = await getImageMetadata(file);
    return {
      blob: file,
      quality: 1,
      width: meta.width,
      height: meta.height,
      iterations: 0
    };
  }

  const img = new Image();
  const objectUrl = URL.createObjectURL(file);
  
  await new Promise((resolve) => {
    img.onload = resolve;
    img.src = objectUrl;
  });

  let quality = 0.9;
  let scale = 1.0;
  let iterations = 0;
  const MAX_ITERATIONS = 40; // Hard limit to prevent browser freezing

  let currentBlob: Blob = file;
  let currentWidth = img.width;
  let currentHeight = img.height;

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d')!;

  // Pro-Tip: Convert PNG to WebP to maintain transparency while allowing quality compression
  const outputMimeType = file.type === 'image/png' ? 'image/webp' : file.type;

  while (iterations < MAX_ITERATIONS) {
    iterations++;
    if (onProgress) onProgress(iterations);

    canvas.width = img.width * scale;
    canvas.height = img.height * scale;
    currentWidth = canvas.width;
    currentHeight = canvas.height;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    const blob: Blob = await new Promise((resolve) => {
      canvas.toBlob((b) => resolve(b!), outputMimeType, quality);
    });

    currentBlob = blob;

    if (blob.size <= targetSizeBytes) {
      break; 
    }

    if (quality > 0.2) {
      quality -= 0.05; // Drop quality first
    } else {
      scale -= 0.1; // If quality is already terrible, start shrinking the physical image size
      if (scale < 0.1) break; 
    }
  }

  URL.revokeObjectURL(objectUrl);

  return {
    blob: currentBlob,
    quality,
    width: currentWidth,
    height: currentHeight,
    iterations
  };
};

/**
 * Converts raw bytes into clean, readable formats (KB, MB).
 */
export const formatBytes = (bytes: number, decimals = 1) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};