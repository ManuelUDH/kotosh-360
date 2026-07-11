import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import OverviewView  from './views/OverviewView';
import HotspotsView  from './views/HotspotsView';
import MetricsView   from './views/MetricsView';
import LoginView     from './views/LoginView';
import ExploreView   from './views/ExploreView';
import LandingView   from './views/LandingView';
import { LanguageProvider } from './context/LanguageContext';
import './App.css';

function AppContent() {
  const location = useLocation();
  const hideSidebar = location.pathname === '/login' || location.pathname === '/explore' || location.pathname === '/';

  return (
    <div className="app-layout">
      {!hideSidebar && <Sidebar />}
      <main className={`app-content ${hideSidebar ? 'no-sidebar' : ''}`}>
        <Routes>
          <Route path="/"          element={<LandingView />} />
          <Route path="/login"     element={<LoginView />} />
          <Route path="/explore"   element={<ExploreView />} />
          <Route path="/dashboard" element={<OverviewView />} />
          <Route path="/hotspots"  element={<HotspotsView />} />
          <Route path="/metrics"   element={<MetricsView />} />
          <Route path="*"          element={<Navigate to="/" />} />
        </Routes>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </LanguageProvider>
  );
}


