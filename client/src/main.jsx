import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext.jsx';
import App from './App.jsx';
import './index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <App />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#121212',
            color: '#fff',
            border: '1px solid #222222',
            borderRadius: '10px',
            fontSize: '14px',
            fontFamily: 'Inter, sans-serif',
          },
          success: {
            iconTheme: { primary: '#D4AF37', secondary: '#121212' },
          },
          error: {
            iconTheme: { primary: '#ef4444', secondary: '#121212' },
          },
        }}
      />
    </AuthProvider>
  </StrictMode>
);
