import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ControllerProvider } from "./hardware/ControllerContext.jsx";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ControllerProvider>
      <App />
    </ControllerProvider>
  </StrictMode>
);