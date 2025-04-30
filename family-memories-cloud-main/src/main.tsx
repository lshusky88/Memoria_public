import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { initStorage } from './integrations/supabase/storage'

// Initialize Supabase storage
initStorage().catch(error => {
  console.error('Failed to initialize storage:', error);
});

createRoot(document.getElementById("root")!).render(<App />);
