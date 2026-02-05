/* eslint-disable no-restricted-globals */

/**
 * SafeImageWorker.js
 * 
 * Handles high-resolution image resizing off-main-thread.
 * Key Safety Features:
 * 1. Cooperative Cancellation: Checks `cancelled` flag during heavy operations.
 * 2. Memory Safety: Prefers native resize options; avoids full-size Canvas allocation.
 * 3. Step-Down Loop: Resizes in 50% decrements if native resize is partial or unavailable (Warning tier only).
 * 4. Progress Reporting: Sends 'step' and 'percent' updates.
 */

let cancelled = false;

self.onmessage = async ({ data }) => {
    // 1. Cooperative Cancellation Signal
    if (data.type === 'CANCEL') {
        cancelled = true;
        // Clean up if possible (though terminate usually follows)
        return;
    }

    if (data.type === 'RESIZE') {
        cancelled = false; // Reset for new job
        await handleResize(data);
    }
};

async function handleResize({ file, targetMaxDim, outputType, tier }) {
    try {
        if (checkCancelled()) return;

        self.postMessage({ type: 'PROGRESS', step: 'decoding', percent: 5 });

        // 2. Feature Detect & Native Resize Attempt
        // Extreme tier MUST use native options to avoid huge bitmap allocation.
        let bitmap = null;
        let usedNativeResize = false;

        try {
            // Attempt to decode AND resize simultaneously
            // This is the memory-critical step for 77MP images.
            bitmap = await createImageBitmap(file, { 
                resizeWidth: targetMaxDim, 
                resizeHeight: targetMaxDim, 
                resizeQuality: 'high' 
            });
            usedNativeResize = true;
        } catch (e) {
            // Native resize options failed or unsupported.
            
            // STRICT SAFETY: If Extreme tier, we cannot fall back to full decode.
            if (tier === 'EXTREME') {
                throw new Error("브라우저가 이 이미지의 안전한 처리를 지원하지 않습니다 (Native Resize 미지원). 원본 크기를 줄여서 다시 시도해주세요.");
            }

            // Fallback for Warning tier: Full decode (Risky but allowed)
            if (checkCancelled()) return;
            console.warn("Native resize failed, falling back to full decode.", e);
            try {
                bitmap = await createImageBitmap(file);
            } catch (fallbackErr) {
                 throw new Error("이미지를 읽을 수 없습니다. 파일이 손상되었거나 브라우저가 지원하지 않는 형식입니다.");
            }
        }

        if (checkCancelled()) {
            if (bitmap) bitmap.close();
            return;
        }

        let width = bitmap.width;
        let height = bitmap.height;
        let currentBitmap = bitmap;

        // 3. Step-Down Resize Loop
        // If native resize worked, width/height is roughly targetMaxDim, loop skipped.
        // If fallback used, we likely have huge bitmap -> must step down.
        
        self.postMessage({ type: 'PROGRESS', step: 'resizing', percent: 20 });

        while ((width > targetMaxDim || height > targetMaxDim)) {
            if (checkCancelled()) {
                currentBitmap.close();
                return;
            }

            // Calculate next step: 50% or target
            // We use floor to ensure we don't get fractional pixels
            const nextWidth = Math.max(targetMaxDim, Math.floor(width * 0.5));
            const nextHeight = Math.max(targetMaxDim, Math.floor(height * 0.5));
            
            // Update progress based on how close we are to target (roughly)
            // Logarithmic progress might be better but linear approx is fine
            const currentMax = Math.max(width, height);
            const progress = 20 + Math.floor(((targetMaxDim / currentMax) * 60)); // 20% -> 80% range
            self.postMessage({ type: 'PROGRESS', step: 'resizing', percent: progress });

            // Create strictly sized OFFSCREEN canvas
            // Never allocate full size canvas if we can avoid it (we are downscaling)
            const offscreen = new OffscreenCanvas(nextWidth, nextHeight);
            const ctx = offscreen.getContext('2d');
            
            // Draw current bitmap into smaller canvas
            ctx.drawImage(currentBitmap, 0, 0, nextWidth, nextHeight);

            // Immediate cleanup of previous heavy bitmap
            currentBitmap.close();

            // Prepare next iteration
            currentBitmap = offscreen.transferToImageBitmap();
            width = nextWidth;
            height = nextHeight;
        }

        if (checkCancelled()) {
            currentBitmap.close();
            return;
        }

        // 4. Export / Encoding
        self.postMessage({ type: 'PROGRESS', step: 'encoding', percent: 90 });
        
        const finalCanvas = new OffscreenCanvas(width, height);
        const ctx = finalCanvas.getContext('2d');
        ctx.drawImage(currentBitmap, 0, 0);
        currentBitmap.close(); // Done with bitmap

        // Feature detect output type support implicitly handles by browser implementation
        // But we were asked to be deterministic.
        // Usually convertToBlob simply ignores invalid types and returns png/jpeg.
        // We trust the passed `outputType` (calculated in main thread).
        
        const blob = await finalCanvas.convertToBlob({ 
            type: outputType, 
            quality: 0.8 
        });

        if (checkCancelled()) return;

        self.postMessage({ type: 'SUCCESS', blob });

    } catch (err) {
        if (checkCancelled()) return;
        self.postMessage({ type: 'ERROR', message: err.message });
    }
}

function checkCancelled() {
    if (cancelled) {
        return true;
    }
    return false;
}
