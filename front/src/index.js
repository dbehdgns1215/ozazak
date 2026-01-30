import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

import { initImageMock } from './mocks/imageMock';

if (process.env.REACT_APP_USE_MOCK_IMAGE_API === 'true') {
  initImageMock();
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
