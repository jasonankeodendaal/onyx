import React, { useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import Dashboard from './pages/Dashboard';
import SiteDetail from './pages/SiteDetail';
import Settings from './pages/Settings';
import About from './pages/About';
import Version from './pages/Version';
import Docs from './pages/Docs';
import { ErrorBoundary } from './components/ErrorBoundary';

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [selectedSiteId, setSelectedSiteId] = useState<string | undefined>(undefined);

  const navigate = (page: string, siteId?: string) => {
    setCurrentPage(page);
    if (siteId) setSelectedSiteId(siteId);
    // Scroll to top on nav
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderContent = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard onNavigate={navigate} />;
      case 'site':
        return selectedSiteId ? <SiteDetail siteId={selectedSiteId} onBack={() => navigate('dashboard')} /> : <Dashboard onNavigate={navigate} />;
      case 'settings':
        return <Settings />;
      case 'docs':
        return <Docs />;
      case 'about':
        return <About />;
      case 'version':
        return <Version />;
      default:
        return <Dashboard onNavigate={navigate} />;
    }
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-black flex flex-col font-sans text-gray-100 selection:bg-white selection:text-black">
        <Header currentPage={currentPage} onNavigate={navigate} />
        
        <main className="flex-1 w-full relative z-10">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-onyx-900/40 via-black to-black -z-10 pointer-events-none" />
          {renderContent()}
        </main>

        <Footer />
      </div>
    </ErrorBoundary>
  );
}

export default App;