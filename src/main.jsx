import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Service Worker disabled to prevent web component conflicts
// if ('serviceWorker' in navigator) {
//   window.addEventListener('load', () => {
//     navigator.serviceWorker.register('/sw.js')
//       .then((registration) => {
//         console.log('FIXING ISSUE 29: Service Worker registered:', registration);
//       })
//       .catch((error) => {
//         console.log('Service Worker registration failed:', error);
//       });
//   });
// }

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
