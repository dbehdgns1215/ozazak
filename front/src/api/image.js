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

  // Debug Logging
  console.group('🚀 [API] uploadImage Start');
  console.log('📦 Input File:', {
      name: fileToUpload.name,
      type: fileToUpload.type,
      size: fileToUpload.size,
      lastModified: fileToUpload.lastModified
  });

  const formData = new FormData();
  formData.append('img', fileToUpload);
  formData.append('description', description);

  // FormData Inspection (Note: limited in some browsers but usually works in dev)
  const formDataEntries = Array.from(formData.entries()).map(([key, val]) => {
      if (val instanceof File) {
          return `${key}: File(${val.name}, ${val.type}, ${val.size})`;
      }
      return `${key}: ${val}`;
  });
  console.log('📋 FormData Entries:', formDataEntries);

  try {
      console.log('📡 Sending Request to /image...');
      const response = await client.post('/image', formData, {
        headers: {
          'Content-Type': undefined, 
        }
      });
      console.log('✅ [API] uploadImage Success:', response);
      console.groupEnd();
      return response.data;
  } catch (error) {
      console.error('❌ [API] uploadImage Error:', {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          headers: error.response?.headers
      });
      console.groupEnd();
      throw error;
  }
};
