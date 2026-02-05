import client from './client';
import { processImage } from '../utils/imageProcess';

export const uploadImage = async (file, description = '') => {
  // 1. Process Image (Resize & Compress)
  let fileToUpload = file;
  try {
     const { processedFile } = await processImage(file);
     fileToUpload = processedFile;
     console.log(`[ImageUpload] Original: ${file.size}, Processed: ${processedFile.size} (${processedFile.type})`);
  } catch (error) {
     console.warn('[ImageUpload] Processing failed, falling back to original', error);
  }

  const formData = new FormData();
  formData.append('img', fileToUpload);
  formData.append('description', description);

  // Note: Adjust the URL if the project uses a proxy or different base
  const token = process.env.REACT_APP_ACCESS_TOKEN;
  
  // Use client which has baseURL configured. 
  // We must unset Content-Type so the browser sets it with the boundary for FormData.
  console.log('[API] uploadImage Request FormData:', Array.from(formData.entries()));
  
  try {
      const response = await client.post('/image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data', // Axios with FormData usually handles this, but some versions need help or NULL
          // Actually, 'multipart/form-data' WITHOUT boundary is the killer. 
          // Setting to null or relying on auto-detection is best.
          // BUT, if client has default 'application/json', we MUST override it.
          // Let's try explicit null which implies 'remove this header'.
        },
        transformRequest: (data, headers) => {
            // Force removal of Content-Type to let browser set it with boundary
            if (headers['Content-Type']) delete headers['Content-Type'];
            return data;
        }
      });
      console.log('[API] uploadImage Response:', response);
      return response.data;
  } catch (error) {
      console.error('[API] uploadImage Error:', error.response || error);
      throw error;
  }
};
