import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ControllerProvider } from "./hardware/ControllerContext.jsx";
import { UIModelProvider } from './contexts/UIModelContext';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <UIModelProvider>
      <ControllerProvider>
        <App />
      </ControllerProvider>
    </UIModelProvider>
  </StrictMode>
);