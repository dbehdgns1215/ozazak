
/* SafeImageProcessor.js */

export const RESIZE_CONFIG = {
    LIMITS: {
        MP: { NORMAL: 30 * 1000 * 1000, WARNING: 45 * 1000 * 1000, EXTREME: 80 * 1000 * 1000 },
        MB: { NORMAL: 10 * 1024 * 1024, WARNING: 20 * 1024 * 1024, EXTREME: 30 * 1024 * 1024 }
    },
    TIMEOUT: { DEFAULT: 5000, EXTREME: 10000 },
    TARGET_MAX_DIM: 2560
};

export class SafeImageProcessor {
    constructor() {
        this.worker = null;
    }

    // --- 1. Feature Detection ---
    static featureDetect() {
        if (typeof window === 'undefined') return { webp: false, nativeResize: false };
        
        // 1. WebP Support (Output capability)
        // Simple check: canvas toDataUrl
        const canvas = document.createElement('canvas');
        canvas.width = 1; 
        canvas.height = 1;
        const webpSupport = canvas.toDataURL('image/webp').startsWith('data:image/webp');

        // 2. Native Resize Support
        // Hard to detect perfectly without actually doing it, but checks for options support
        // This is tricky. Chrome/Edge support checks via 'createImageBitmap' args usually ignored if unsupported.
        // We can check if 'createImageBitmap' exists.
        // Accurate detection usually requires a test run, but we will assume modern browsers (Chrome/Firefox/Safari 15+)
        // have partial support. However, we only FORCE it for Extreme.
        // We can assume 'createImageBitmap' is available if logic runs.
        
        return { 
            webp: webpSupport, 
            nativeResize: ('createImageBitmap' in window) 
        };
    }

    // --- 2. Header Parsing & Detection ---
    static async detectImageStats(file) {
        const stats = {
            width: 0,
            height: 0,
            mp: 0,
            size: file.size,
            tier: 'NORMAL' // NORMAL, WARNING, EXTREME, REJECT
        };

        // Header Parsing (Partial Read)
        try {
            const dims = await this.probeDimensions(file);
            stats.width = dims.width;
            stats.height = dims.height;
            stats.mp = stats.width * stats.height;
        } catch (e) {
            console.warn("헤더 파싱 실패, 파일 크기 기준으로 처리합니다.", e);
            // Fallback: MP remains 0, rely on Size logic
        }

        // Classification Map
        const { LIMITS } = RESIZE_CONFIG;

        // Reject Gates
        if (stats.mp > LIMITS.MP.EXTREME || stats.size > LIMITS.MB.EXTREME) {
            stats.tier = 'REJECT';
        } else if (stats.mp > LIMITS.MP.WARNING || stats.size > LIMITS.MB.WARNING) {
            stats.tier = 'EXTREME';
        } else if (stats.mp > LIMITS.MP.NORMAL || stats.size > LIMITS.MB.NORMAL) {
            stats.tier = 'WARNING';
        } else {
            stats.tier = 'NORMAL';
        }

        return stats;
    }

    static async probeDimensions(file) {
        // Read first 512KB (Generous limit for finding headers)
        const FILE_SCAN_LIMIT = 512 * 1024; 
        const blob = file.slice(0, FILE_SCAN_LIMIT);
        const buffer = await blob.arrayBuffer();
        const arr = new Uint8Array(buffer);

        // Simple Format Detect
        // JPEG: FF D8
        if (arr[0] === 0xFF && arr[1] === 0xD8) {
            return this.parseJpegDims(arr);
        }
        // PNG: 89 50 4E 47 0D 0A 1A 0A
        if (arr[0] === 0x89 && arr[1] === 0x50 && arr[2] === 0x4E && arr[3] === 0x47) {
            return this.parsePngDims(arr);
        }
        // WebP: RIFF ... WEBP ... VP8
        if (arr[0] === 0x52 && arr[1] === 0x49 && arr[2] === 0x46) {
           return this.parseWebPDims(arr);
        }

        throw new Error("Unsupported or unrecognizable header");
    }

    static parseJpegDims(arr) {
        // Scan for SOF markers (C0..CF, except C4, C8, CC)
        let i = 2;
        while (i < arr.length) {
            if (arr[i] !== 0xFF) { i++; continue; }
            const marker = arr[i+1];
            const len = (arr[i+2] << 8) + arr[i+3];

            if ((marker >= 0xC0 && marker <= 0xC3) || (marker >= 0xC5 && marker <= 0xC7) || 
                (marker >= 0xC9 && marker <= 0xCB) || (marker >= 0xCD && marker <= 0xCF)) {
                // SOF Found
                const height = (arr[i+5] << 8) + arr[i+6];
                const width = (arr[i+7] << 8) + arr[i+8];
                return { width, height };
            }

            i += 2 + len;
        }
        throw new Error("JPEG SOF not found in first chunk");
    }

    static parsePngDims(arr) {
        // IHDR is usually very first chunk
        // 8 Byte Magic + 4 Byte Len + 4 Byte Type (IHDR)
        // IHDR starts at index 12 (0-based: 12,13,14,15)
        // Width at 16, Height at 20
        const width = (arr[16] << 24) + (arr[17] << 16) + (arr[18] << 8) + arr[19];
        const height = (arr[20] << 24) + (arr[21] << 16) + (arr[22] << 8) + arr[23];
        return { width, height };
    }

    static parseWebPDims(arr) {
        // RIFF (4) + Size (4) + WEBP (4)
        // VP8 (4) or VP8L (4) or VP8X (4)
        // Minimal logic for VP8/VP8L/VP8X basic
        // This is complex, implementing minimal 'VP8X' (Extended) and 'VP8 ' (Lossy) check
        // Ref: WebP Container Spec
        
        let offset = 12;
        const chunkHeader = String.fromCharCode(...arr.slice(offset, offset+4));
        
        if (chunkHeader === 'VP8 ') {
            // Lossy: offset 26-29 contains w/h (14 bit)
             // simplified scan for demo
             // Key frame check? 
             // Frame header starts at offset + 8
             // 0x9d, 0x01, 0x2a bytes signature
             const wRaw = (arr[offset+14] | (arr[offset+15] << 8)) & 0x3FFF;
             const hRaw = (arr[offset+16] | (arr[offset+17] << 8)) & 0x3FFF;
             return { width: wRaw, height: hRaw };
        } 
        else if (chunkHeader === 'VP8X') {
            // Extended: Width 24-26 (3 bytes), Height 27-29 (3 bytes)
            // Header size 10 bytes. 
            // Canvas Width is 0-indexed 24 bit int at offset + 12 (i.e., 12+12=24 global)
            const w1 = arr[offset+12], w2 = arr[offset+13], w3 = arr[offset+14];
            const h1 = arr[offset+15], h2 = arr[offset+16], h3 = arr[offset+17];
            
            const width = 1 + w1 + (w2 << 8) + (w3 << 16);
            const height = 1 + h1 + (h2 << 8) + (h3 << 16);
            return { width, height };
        } else if (chunkHeader === 'VP8L') {
             // Lossless: signature 0x2f
             // Bits
             const b0 = arr[offset+9];
             const b1 = arr[offset+10];
             const b2 = arr[offset+11];
             const b3 = arr[offset+12];
             
             // 14 bits width, 14 bits height
             const width = 1 + (((b1 & 0x3F) << 8) | b0); 
             const height = 1 + (((b3 & 0xF) << 10) | (b2 << 2) | ((b1 & 0xC0) >> 6));
             return { width, height };
        }

        throw new Error("WebP format parsing too complex for simple probe");
    }


    // --- 3. Process Logic ---
    static processImage(file, stats, onProgress) {
        return new Promise((resolve, reject) => {
            if (stats.tier === 'REJECT') {
                reject(new Error("이미지가 너무 큽니다. 제한: 약 80MP 또는 30MB 미만."));
                return;
            }

            // Create Worker
            const worker = new Worker(new URL('../workers/SafeImageWorker.js', import.meta.url));
            
            // Output Type
            const { webp } = this.featureDetect();
            const outputType = webp ? 'image/webp' : 'image/jpeg';

            // Timeout Setup
            const isExtreme = stats.tier === 'EXTREME';
            const timeoutDuration =(isExtreme ? RESIZE_CONFIG.TIMEOUT.EXTREME : RESIZE_CONFIG.TIMEOUT.DEFAULT);
            
            let isDone = false;
            
            const timer = setTimeout(() => {
                if (!isDone) {
                    worker.postMessage({ type: 'CANCEL' });
                    setTimeout(() => worker.terminate(), 100); // 100ms Grace
                    reject(new Error("이미지 처리 시간이 초과되었습니다. 더 작은 이미지를 사용해주세요."));
                }
            }, timeoutDuration);

            // Handler
            worker.onmessage = (e) => {
                const { type, blob, message, step, percent } = e.data;
                
                if (type === 'PROGRESS') {
                    if (onProgress) onProgress(step, percent);
                    return;
                }

                isDone = true;
                clearTimeout(timer);

                if (type === 'SUCCESS') {
                    worker.terminate();
                    resolve(blob);
                } else if (type === 'ERROR') {
                    worker.terminate();
                    reject(new Error(message || "알 수 없는 오류가 발생했습니다."));
                }
            };

            worker.onerror = (err) => {
                if (!isDone) {
                    isDone = true;
                    clearTimeout(timer);
                    worker.terminate();
                    reject(new Error("이미지 처리 중 치명적인 오류가 발생했습니다."));
                }
            };

            // Start
            worker.postMessage({
                type: 'RESIZE',
                file,
                targetMaxDim: RESIZE_CONFIG.TARGET_MAX_DIM,
                outputType,
                tier: stats.tier
            });
        });
    }
}
