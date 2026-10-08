import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { createSiteConfig, pageFromPath, siteConfig } from './site';

if (!siteConfig()) {
  const config = createSiteConfig(pageFromPath(window.location.pathname, import.meta.env.BASE_URL), import.meta.env.BASE_URL, true);
  // Vite serves the website; the full KNX application has its own test environment.
  config.plannerUrl = 'https://knx-staging.intelispaces.pl/editor';
  (globalThis as any).__INTELISPACES__ = config;
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
