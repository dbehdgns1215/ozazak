/**
 * Process image file: resize, compress, and format conversion.
 * Constraints:
 * - Max dimension: 1920px (long side)
 * - Max file size: 2MB
 * - Prioritize WebP > JPEG (unless PNG with transparency)
 */
export const processImage = async (file, options = {}) => {
  const MAX_DIMENSION = options.maxDim || 1920;
  const MAX_BYTES = options.maxBytes || 2 * 1024 * 1024; // 2MB
  const MIN_QUALITY = 0.45;
  const START_QUALITY = 0.85;
  const QUALITY_STEP = 0.10;

  // 1. Check if PNG with transparency
  const isPng = file.type === 'image/png';
  // We can't easy detect alpha channel without canvas, but generally if PNG, we might want to preserve it 
  // OR map to WebP (which supports alpha).
  // Strategy: If PNG, try WebP first. If not supported, keep PNG (avoid JPEG artifacts on transparency).
  // However, specifically requested: "If input is PNG with transparency: keep PNG (skip lossy compression)"
  // Implementation: We will treat PNGs as candidates for downscaling ONLY, unless they are huge. 
  // But strict requirement says "skip lossy compression". 
  // Let's load the image first.

  const loadImage = (src) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });
  };

  const originalUrl = URL.createObjectURL(file);
  const img = await loadImage(originalUrl);

  const originalMeta = {
    width: img.width,
    height: img.height,
    size: file.size
  };

  // 2. Calculate new dimensions
  let { width, height } = img;
  if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
    if (width > height) {
      height = Math.round(height * (MAX_DIMENSION / width));
      width = MAX_DIMENSION;
    } else {
      width = Math.round(width * (MAX_DIMENSION / height));
      height = MAX_DIMENSION;
    }
  }

  // 3. Draw to canvas
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0, width, height);

  URL.revokeObjectURL(originalUrl);

  // 4. Compress
  // Determine Type
  let targetType = 'image/jpeg';
  if (file.type === 'image/webp') targetType = 'image/webp';
  // If original was PNG, check if we need to preserve it
  // Simple heuristic: If user uploaded PNG, try to keep it unless it violates size significantly?
  // Requirements: "If input is PNG with transparency: keep PNG (skip lossy compression)"
  // "Else: prefer image/webp"
  
  // NOTE: Simple check for transparency is hard. 
  // We will assume ALL PNGs might have transparency for safety if we strictly follow "Input is PNG -> keep PNG".
  // But strictly keeping PNG might violate 2MB limit easily.
  // Exception: The prompt says "if kept PNG, still downscale". 
  // Let's assume we output PNG for PNG input, and WebP/JPEG for others.
  
  if (isPng) {
      targetType = 'image/png';
  } else {
      // Feature detection for WebP not strictly needed in modern browsers, but 'image/webp' is safe default fallback
      targetType = 'image/webp';
  }

  let quality = START_QUALITY;
  let processedBlob = null;

  const toBlob = (type, q) => {
      return new Promise(resolve => canvas.toBlob(resolve, type, q));
  }

  // Compression Loop
  while (true) {
    if (targetType === 'image/png') {
        processedBlob = await toBlob(targetType);
        
        // Strategy Update: If PNG is still > 2MB, switch to WebP
        if (processedBlob.size > MAX_BYTES) {
            console.warn(`[ImageProcess] PNG size ${processedBlob.size} > ${MAX_BYTES}. Switching to WebP.`);
            targetType = 'image/webp';
            quality = START_QUALITY;
            continue; // Retry as WebP
        }
        break; 
    } else {
        processedBlob = await toBlob(targetType, quality);
        
        if (processedBlob.size <= MAX_BYTES || quality <= MIN_QUALITY) {
            break;
        }
        
        quality -= QUALITY_STEP;
    }
  }

  // Fallback: If WebP/JPEG still > 2MB at min quality? 
  // We return what we have.

  // Create File object
  const processedFile = new File([processedBlob], file.name.replace(/\.[^/.]+$/, "") + (targetType === 'image/webp' ? '.webp' : (targetType === 'image/png' ? '.png' : '.jpg')), {
      type: targetType,
      lastModified: Date.now()
  });

  return {
    processedFile,
    original: originalMeta,
    processed: {
      width,
      height,
      size: processedFile.size,
      type: targetType,
      qualityUsed: targetType === 'image/png' ? 'lossless' : quality
    }
  };
};
