/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { siteConfig } from './site';
import { pages } from './page-config';
import { PageId } from './types.ts';
import { Navbar } from './components/Navbar.tsx';
import { Footer } from './components/Footer.tsx';
import { PrivacyModal } from './components/PrivacyModal.tsx';
import { ConsultationModal } from './components/ConsultationModal.tsx';
import { CookieBanner } from './components/CookieBanner.tsx';

// Pages
import { HomePage } from './pages/HomePage.tsx';
import { OfficesPage } from './pages/OfficesPage.tsx';
import { HomesPage } from './pages/HomesPage.tsx';
import { SolutionsPage } from './pages/SolutionsPage.tsx';
import { ArchitectsPage } from './pages/ArchitectsPage.tsx';
import { KNXPage } from './pages/KNXPage.tsx';
import { ProjectsPage } from './pages/ProjectsPage.tsx';
import { KnowledgePage } from './pages/KnowledgePage.tsx';
import { AboutPage } from './pages/AboutPage.tsx';
import { TeamPage } from './pages/TeamPage.tsx';
import { ContactPage } from './pages/ContactPage.tsx';

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageId>(() => siteConfig()?.page || 'home');
  const [currentHash, setCurrentHash] = useState<string | undefined>(undefined);

  // Modals state
  const [privacyModalOpen, setPrivacyModalOpen] = useState(false);
  const [privacyTab, setPrivacyTab] = useState<'privacy' | 'cookies' | 'rodo'>('privacy');
  const [consultationModalOpen, setConsultationModalOpen] = useState(false);
  const [consultationTopic, setConsultationTopic] = useState<string>('Konsultacja projektu automatyki KNX');

  // Sync title and meta description dynamically
  useEffect(() => {
    const meta = pages[currentPage];
    if (meta) {
      document.title = meta.title;
      const metaDescriptionTag = document.querySelector('meta[name="description"]');
      if (metaDescriptionTag) {
        metaDescriptionTag.setAttribute('content', meta.description);
      }
      const ogTitleTag = document.querySelector('meta[property="og:title"]');
      if (ogTitleTag) {
        ogTitleTag.setAttribute('content', meta.title);
      }
      const ogDescTag = document.querySelector('meta[property="og:description"]');
      if (ogDescTag) {
        ogDescTag.setAttribute('content', meta.description);
      }
    }
  }, [currentPage]);

  // Read hash on mount
  useEffect(() => {
    const handleHashChange = () => {
      if (siteConfig()) {
        const legacy = window.location.hash.slice(1).split('/');
        const target = Object.hasOwn(pages, legacy[0]) ? siteConfig()!.urls[legacy[0] as PageId] : undefined;
        if (target) { window.location.replace(target + (legacy[1] ? '#' + legacy[1] : '')); return; }
        setCurrentHash(window.location.hash.slice(1) || undefined);
        return;
      }
      const rawHash = window.location.hash.replace('#', '');
      if (rawHash) {
        const [pagePart, subPart] = rawHash.split('/');
        const validPages: PageId[] = [
          'home',
          'offices',
          'homes',
          'solutions',
          'architects',
          'knx',
          'projects',
          'knowledge',
          'about',
          'team',
          'contact',
        ];
        if (validPages.includes(pagePart as PageId)) {
          setCurrentPage(pagePart as PageId);
          setCurrentHash(subPart);
        }
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleNavigate = (page: PageId, subHash?: string) => {
    if (siteConfig()?.urls[page]) { window.location.assign(siteConfig()!.urls[page] + (subHash ? '#' + subHash : '')); return; }
    setCurrentPage(page);
    setCurrentHash(subHash);
    window.location.hash = subHash ? `${page}/${subHash}` : page === 'home' ? '' : page;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenPrivacy = (tab: 'privacy' | 'cookies' | 'rodo' = 'privacy') => {
    setPrivacyTab(tab);
    setPrivacyModalOpen(true);
  };

  const handleOpenConsultation = (topic?: string) => {
    if (topic) setConsultationTopic(topic);
    setConsultationModalOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F8F5] text-[#17211C]">
      {siteConfig()?.preview && <div role="status" className="bg-[#17211C] text-white text-center text-xs py-2 px-4">Podgląd roboczy · formularze nie wysyłają danych. <a className="underline" href="https://intelispaces.pl/">Otwórz stronę produkcyjną</a></div>}
      {/* Sticky Header & Navigation */}
      <Navbar
        currentPage={currentPage}
        onNavigate={handleNavigate}
        onOpenConsultation={() => handleOpenConsultation()}
      />

      {/* Main Content Viewport */}
      <main id="main-content" className="flex-grow">
        {currentPage === 'home' && (
          <HomePage
            onNavigate={handleNavigate}
            onOpenConsultation={() => handleOpenConsultation()}
            onOpenPrivacy={() => handleOpenPrivacy('privacy')}
          />
        )}

        {currentPage === 'offices' && (
          <OfficesPage
            onNavigate={handleNavigate}
            onOpenConsultation={() => handleOpenConsultation('Konsultacja projektu biura / fit-out')}
            onOpenPrivacy={() => handleOpenPrivacy('privacy')}
            initialHash={currentHash}
          />
        )}

        {currentPage === 'homes' && (
          <HomesPage
            onNavigate={handleNavigate}
            onOpenConsultation={() => handleOpenConsultation('Konsultacja rezydencji / apartamentu')}
            onOpenPrivacy={() => handleOpenPrivacy('privacy')}
            initialHash={currentHash}
          />
        )}

        {currentPage === 'solutions' && (
          <SolutionsPage
            onNavigate={handleNavigate}
            onOpenConsultation={() => handleOpenConsultation('Konsultacja techniczna modułów KNX/DALI')}
            initialHash={currentHash}
          />
        )}

        {currentPage === 'architects' && (
          <ArchitectsPage
            onNavigate={handleNavigate}
            onOpenConsultation={() => handleOpenConsultation('Konsultacja projektu z pracownią architektoniczną')}
            onOpenPrivacy={() => handleOpenPrivacy('privacy')}
          />
        )}

        {currentPage === 'knx' && (
          <KNXPage
            onNavigate={handleNavigate}
            onOpenConsultation={() => handleOpenConsultation('Audyt lub serwis instalacji KNX')}
          />
        )}

        {currentPage === 'projects' && (
          <ProjectsPage
            onNavigate={handleNavigate}
            onOpenConsultation={() => handleOpenConsultation('Konsultacja zakresu referencyjnego')}
          />
        )}

        {currentPage === 'knowledge' && (
          <KnowledgePage
            onNavigate={handleNavigate}
            onOpenConsultation={() => handleOpenConsultation('Pytanie techniczne do inżyniera KNX')}
          />
        )}

        {currentPage === 'about' && (
          <AboutPage
            onNavigate={handleNavigate}
            onOpenConsultation={() => handleOpenConsultation('Spotkanie w biurze Warszawa')}
          />
        )}

        {currentPage === 'team' && (
          <TeamPage
            onNavigate={handleNavigate}
            onOpenConsultation={() => handleOpenConsultation('Konsultacja z inżynierem INTELISPACES')}
          />
        )}

        {currentPage === 'contact' && (
          <ContactPage
            onOpenPrivacy={handleOpenPrivacy}
            onOpenConsultation={() => handleOpenConsultation()}
          />
        )}
      </main>

      {/* Editorial Footer */}
      <Footer
        onNavigate={handleNavigate}
        onOpenPrivacy={handleOpenPrivacy}
      />

      {/* Legal Privacy & Cookies Modal */}
      <PrivacyModal
        isOpen={privacyModalOpen}
        onClose={() => setPrivacyModalOpen(false)}
        defaultTab={privacyTab}
      />

      {/* Consultation Booking Modal */}
      <ConsultationModal
        isOpen={consultationModalOpen}
        onClose={() => setConsultationModalOpen(false)}
        initialTopic={consultationTopic}
        onOpenPrivacy={() => handleOpenPrivacy('privacy')}
      />

      {/* Cookie Consent Banner */}
      <CookieBanner onOpenPrivacy={handleOpenPrivacy} />
    </div>
  );
}
