import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { createSiteConfig, pageFromPath, siteConfig } from './site';
import { pages, redirectPath, retiredPages } from './page-config';

if (!siteConfig()) {
  const config = createSiteConfig(pageFromPath(window.location.pathname, import.meta.env.BASE_URL), import.meta.env.BASE_URL, true);
  // Vite serves the website; the full KNX application has its own test environment.
  config.plannerUrl = 'https://knx-staging.intelispaces.pl/editor';
  (globalThis as any).__INTELISPACES__ = config;
}

const config = siteConfig()!;
const targets = retiredPages[config.page];
const previous = pages[config.page].previousPath;
const localPath = '/' + window.location.pathname.slice(config.urls.home.length).replace(/(?:\/index\.html)?\/?$/, '/');
if (targets) {
  window.location.replace(config.urls.home + redirectPath(targets, window.location.hash.slice(1)));
} else if (previous && previous === localPath) {
  window.location.replace(config.urls[config.page] + window.location.search + window.location.hash);
} else createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
