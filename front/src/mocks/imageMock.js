import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

let mock;

export const initImageMock = () => {
    if (mock) return; // Prevent multiple initializations

    console.log('[Mock] Initializing Image API Mock...');
    mock = new MockAdapter(axios, { delayResponse: 500 });

    mock.onPost(/\/api\/image/).reply(async (config) => {
        try {
            const formData = config.data; // In axios mock, data is the request body (FormData)
            
            // Validate FormData
            if (!(formData instanceof FormData)) {
                console.warn('[Mock] Request data is not FormData');
                return [400, { message: 'Invalid request format' }];
            }

            const file = formData.get('img');
            const description = formData.get('description');

            if (!file || !(file instanceof Blob)) {
                console.warn('[Mock] No file uploaded or invalid file type');
                return [400, { message: 'No image file provided' }];
            }

            console.log(`[Mock] Uploading file: ${file.name} (${file.type}, ${file.size} bytes)`);

            // Generate Data URL for persistence (localStorage support)
            const getDataUrl = (blob) => {
                return new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onloadend = () => resolve(reader.result);
                    reader.onerror = reject;
                    reader.readAsDataURL(blob);
                });
            };

            const objectUrl = await getDataUrl(file);

            // Read Image Dimensions Asynchronously
            const getImageDimensions = (url) => {
                return new Promise((resolve) => {
                    const img = new Image();
                    img.onload = () => resolve({ width: img.width, height: img.height });
                    img.onerror = () => resolve({ width: null, height: null });
                    img.src = url;
                });
            };

            const dimensions = await getImageDimensions(objectUrl);

            // Construct Mock Response
            const mockResponse = {
                data: {
                    uploadId: crypto.randomUUID(),
                    urls: {
                        original: objectUrl,
                        large: objectUrl,
                        medium: objectUrl,
                        thumb: objectUrl
                    },
                    primaryUrl: objectUrl,
                    meta: {
                        mimeType: file.type,
                        sizeBytes: file.size,
                        width: dimensions.width,
                        height: dimensions.height,
                        description: description || ''
                    }
                }
            };

            return [200, mockResponse];

        } catch (error) {
            console.error('[Mock] Error processing upload:', error);
            return [500, { message: 'Internal Server Error (Mock)' }];
        }
    });

    // Pass through all other requests so we don't block other APIs
    mock.onAny().passThrough();
};
