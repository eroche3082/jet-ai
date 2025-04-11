import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { Toaster } from "@/components/ui/toaster";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { initializePWA } from "./lib/pwa";

// Initialize PWA features if in production
if (import.meta.env.PROD) {
  initializePWA();
}

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <App />
    <Toaster />
  </QueryClientProvider>
);
