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
  const response = await client.post('/api/image', formData, {
    headers: {
      Authorization: token ? `Bearer ${token}` : '',
      'Content-Type': undefined,
    },
  });

  return response.data;
};
