import axios from 'axios';

// Since we are not using a configured axios instance globally yet (based on previous file structure), 
// we'll assume a base URL or relative path if proxy is set up.
// If there is a global api client, we should ideally use it. 
// For now, I'll use a direct axios call but respect the project structure if I see a client later.
// Checking `src/api/user.js` or `auth.js` would reveal the pattern. 
// Proactively I will check `src/api/community.js` structure first, but for this step I'll write a standard one.

import { processImage } from '../utils/imageProcess';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080';

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
  const response = await axios.post(`${API_BASE_URL}/api/image`, formData, {
    headers: {
      Authorization: token ? `Bearer ${token}` : '',
    },
  });

  return response.data;
};
