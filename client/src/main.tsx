import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { Toaster } from "@/components/ui/toaster";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { 
  registerServiceWorker, 
  initInstallPrompt, 
  setupSafeAreaVariables 
} from "./lib/pwa";

// Initialize PWA features
const initializePWA = async () => {
  // Register service worker
  const registration = await registerServiceWorker();
  
  // Set up install prompt event handler
  initInstallPrompt();
  
  // Set up safe area variables for notched devices
  setupSafeAreaVariables();
  
  return registration;
};

// Initialize PWA in development and production
initializePWA().then((registration) => {
  if (registration) {
    console.log('PWA initialized successfully');
  } else {
    console.warn('PWA initialization failed or is not supported');
  }
});

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <App />
    <Toaster />
  </QueryClientProvider>
);
