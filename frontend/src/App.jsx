import React, { useState, useEffect } from 'react';
import PublicNavbar from './components/public/PublicNavbar';
import PublicFooter from './components/public/PublicFooter';
import HomePage from './components/public/HomePage';
import AboutPage from './components/public/AboutPage';
import HowItWorksPage from './components/public/HowItWorksPage';
import RulesPublicPage from './components/public/RulesPublicPage';
import GuidelinesPage from './components/public/GuidelinesPage';
import ContactPage from './components/public/ContactPage';

import OfficerSidebar from './components/officer/OfficerSidebar';
import OfficerHeader from './components/officer/OfficerHeader';
import DashboardHome from './components/officer/DashboardHome';
import InspectionWizard from './components/InspectionWizard';
import ECommerceInspectionView from './components/officer/ECommerceInspectionView';
import InspectionsList from './components/officer/InspectionsList';
import InspectionDetail from './components/officer/InspectionDetail';
import ProductHistory from './components/officer/ProductHistory';
import FindingsSummary from './components/officer/FindingsSummary';
import RulesVersionView from './components/officer/RulesVersionView';
import ReportsView from './components/ReportsView';
import EvidenceRecords from './components/officer/EvidenceRecords';
import OfflineQueueView from './components/officer/OfflineQueueView';
import OfficerLoginModal from './components/officer/OfficerLoginModal';
import ProtectedRoute from './components/common/ProtectedRoute';

import { useAuth } from './context/AuthContext';
import { getPendingQueueCount } from './utils/offlineQueue';

export default function App() {
  // Centralized Authentication State
  const { user, token, isAuthenticated, login, logout } = useAuth();

  const [showLoginModal, setShowLoginModal] = useState(false);
  const [currentMode, setCurrentMode] = useState('public');

  // Public-side navigation
  const [publicPage, setPublicPage] = useState('home');

  // Officer-side navigation
  const [officerTab, setOfficerTab] = useState('dashboard');
  const [selectedInspection, setSelectedInspection] = useState(null);

  // Real Network Status Tracking
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [pendingQueueCount, setPendingQueueCount] = useState(0);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    setPendingQueueCount(getPendingQueueCount());

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Called after successful login → sets centralized auth state & enters officer mode
  const handleAuthSuccess = (userData, accessToken) => {
    login(userData, accessToken);
    setShowLoginModal(false);
    setOfficerTab('dashboard');
    setCurrentMode('officer');
  };

  // Called when officer clicks logout
  const handleLogout = async () => {
    await logout();
    setSelectedInspection(null);
    setOfficerTab('dashboard');
    setPublicPage('home');
    setCurrentMode('public');
  };

  const handleGoToPublicSite = () => {
    setCurrentMode('public');
    setPublicPage('home');
    window.scrollTo(0, 0);
  };

  const handleGoToOfficerPortal = () => {
    if (!isAuthenticated) {
      setShowLoginModal(true);
      return;
    }
    setCurrentMode('officer');
    setOfficerTab('dashboard');
    window.scrollTo(0, 0);
  };

  // Unified Start Inspection action from Public Homepage
  const handleStartInspectionFromPublic = () => {
    if (!isAuthenticated) {
      setShowLoginModal(true);
    } else {
      setCurrentMode('officer');
      setOfficerTab('new_inspection');
      window.scrollTo(0, 0);
    }
  };

  const handleSelectInspection = (insp) => {
    setSelectedInspection(insp);
    setOfficerTab('detail');
  };

  // ---------------------------------------------------------------
  // RENDER: PUBLIC EXPERIENCE
  // ---------------------------------------------------------------
  if (currentMode === 'public') {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#ffffff' }}>
        <PublicNavbar
          activePage={publicPage}
          onNavigate={(page) => {
            setPublicPage(page);
            window.scrollTo(0, 0);
          }}
          onLoginClick={() => setShowLoginModal(true)}
          user={user}
          isAuthenticated={isAuthenticated}
          onGoToPortal={handleGoToOfficerPortal}
        />

        <main style={{ flex: 1 }}>
          {publicPage === 'home' && (
            <HomePage
              onNavigate={(page) => {
                setPublicPage(page);
                window.scrollTo(0, 0);
              }}
              onLoginClick={handleStartInspectionFromPublic}
            />
          )}

          {publicPage === 'about' && (
            <AboutPage
              onNavigate={(page) => {
                setPublicPage(page);
                window.scrollTo(0, 0);
              }}
              onLoginClick={() => setShowLoginModal(true)}
            />
          )}

          {publicPage === 'how-it-works' && (
            <HowItWorksPage
              onNavigate={(page) => {
                setPublicPage(page);
                window.scrollTo(0, 0);
              }}
              onLoginClick={() => setShowLoginModal(true)}
            />
          )}

          {publicPage === 'rules' && <RulesPublicPage />}
          {publicPage === 'guidelines' && <GuidelinesPage />}
          {publicPage === 'contact' && <ContactPage />}
        </main>

        <PublicFooter
          onNavigate={(page) => {
            setPublicPage(page);
            window.scrollTo(0, 0);
          }}
          onLoginClick={() => setShowLoginModal(true)}
        />

        {showLoginModal && (
          <OfficerLoginModal
            onAuthSuccess={handleAuthSuccess}
            onClose={() => setShowLoginModal(false)}
          />
        )}
      </div>
    );
  }

  // ---------------------------------------------------------------
  // RENDER: OFFICER PORTAL (PROTECTED ROUTE WRAPPER)
  // ---------------------------------------------------------------
  const getHeaderTitle = () => {
    switch (officerTab) {
      case 'dashboard': return { title: 'Officer Dashboard', sub: 'Packaged commodity compliance inspection overview' };
      case 'new_inspection': return { title: 'New Inspection Wizard', sub: 'Guided multi-surface scan, OCR extraction, and rule evaluation' };
      case 'ecommerce': return { title: 'E-Commerce Marketplace Audit', sub: 'Rule 6(10) digital product listing compliance review' };
      case 'active_inspections': return { title: 'Active / Incomplete Inspections', sub: 'Inspections awaiting supplemental packaging surface capture' };
      case 'history': return { title: 'Inspection History Ledger', sub: 'Complete database of inspected packaged commodities' };
      case 'product_history': return { title: 'Product Identity History', sub: 'Historical compliance trends grouped by brand & commodity' };
      case 'findings': return { title: 'Compliance Findings Audit', sub: 'Aggregated potential statutory non-compliances' };
      case 'rules_versions': return { title: 'LMPC Rules & Version Sets', sub: 'Active Legal Metrology statutory rules configuration' };
      case 'reports': return { title: 'Compliance Inspection Reports', sub: 'Formal inspection certificates ready for PDF streaming' };
      case 'evidence': return { title: 'Cryptographic Evidence Records', sub: 'Tamper-evident SHA-256 digests and provenance log' };
      case 'offline_queue': return { title: 'Offline Inspection Queue', sub: 'Locally cached field audits awaiting server sync' };
      case 'detail': return { title: 'Inspection Detail Record', sub: selectedInspection?.inspectionId || 'Audit Record' };
      default: return { title: 'Officer Portal', sub: 'Legal Metrology inspection workstation' };
    }
  };

  const headerInfo = getHeaderTitle();

  return (
    <ProtectedRoute onRequireLogin={() => setShowLoginModal(true)}>
      <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--bg-page)' }}>
        {/* Dark Navy Institutional Sidebar */}
        <OfficerSidebar
          activeView={officerTab}
          onNavigate={(tab) => {
            setSelectedInspection(null);
            setOfficerTab(tab);
            window.scrollTo(0, 0);
          }}
          user={user}
          onLogout={handleLogout}
          onGoToPublicSite={handleGoToPublicSite}
          pendingCount={pendingQueueCount}
        />

        {/* Main Officer Workspace */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          <OfficerHeader
            title={headerInfo.title}
            subtitle={headerInfo.sub}
            onNewInspection={officerTab !== 'new_inspection' ? () => setOfficerTab('new_inspection') : null}
            isOnline={isOnline}
            pendingSyncCount={pendingQueueCount}
          />

          <main style={{ flex: 1, paddingBottom: '60px' }}>
            {officerTab === 'dashboard' && (
              <DashboardHome
                token={token}
                user={user}
                onNavigate={(tab) => {
                  setOfficerTab(tab);
                  window.scrollTo(0, 0);
                }}
                onSelectInspection={handleSelectInspection}
              />
            )}

            {officerTab === 'new_inspection' && (
              <InspectionWizard
                token={token}
                user={user}
                onFinish={() => {
                  setOfficerTab('dashboard');
                  window.scrollTo(0, 0);
                }}
                onSelectInspection={handleSelectInspection}
              />
            )}

            {officerTab === 'ecommerce' && (
              <ECommerceInspectionView
                token={token}
                onBack={() => setOfficerTab('dashboard')}
                onSelectInspection={handleSelectInspection}
              />
            )}

            {officerTab === 'active_inspections' && (
              <InspectionsList
                token={token}
                filterStatus="IN_PROGRESS"
                onSelectInspection={handleSelectInspection}
                onNewInspection={() => setOfficerTab('new_inspection')}
              />
            )}

            {officerTab === 'history' && (
              <InspectionsList
                token={token}
                filterStatus="ALL"
                onSelectInspection={handleSelectInspection}
                onNewInspection={() => setOfficerTab('new_inspection')}
              />
            )}

            {officerTab === 'product_history' && (
              <ProductHistory
                token={token}
                onSelectInspection={handleSelectInspection}
                onNewInspection={() => setOfficerTab('new_inspection')}
              />
            )}

            {officerTab === 'findings' && (
              <FindingsSummary
                token={token}
                onSelectInspection={handleSelectInspection}
                onNewInspection={() => setOfficerTab('new_inspection')}
              />
            )}

            {officerTab === 'rules_versions' && (
              <RulesVersionView token={token} />
            )}

            {officerTab === 'reports' && (
              <ReportsView
                token={token}
                onSelectInspection={handleSelectInspection}
                onNewInspection={() => setOfficerTab('new_inspection')}
              />
            )}

            {officerTab === 'evidence' && (
              <EvidenceRecords
                token={token}
                onSelectInspection={handleSelectInspection}
                onNewInspection={() => setOfficerTab('new_inspection')}
              />
            )}

            {officerTab === 'offline_queue' && (
              <OfflineQueueView
                token={token}
                isOnline={isOnline}
                onSyncComplete={() => setPendingQueueCount(getPendingQueueCount())}
                onNewInspection={() => setOfficerTab('new_inspection')}
              />
            )}

            {officerTab === 'detail' && selectedInspection && (
              <InspectionDetail
                inspection={selectedInspection}
                token={token}
                onBack={() => setOfficerTab('history')}
                onNewInspection={() => setOfficerTab('new_inspection')}
              />
            )}
          </main>
        </div>

        {showLoginModal && (
          <OfficerLoginModal
            onAuthSuccess={handleAuthSuccess}
            onClose={() => setShowLoginModal(false)}
          />
        )}
      </div>
    </ProtectedRoute>
  );
}
