import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import { ThemeProvider, useTheme } from './context/ThemeContext.jsx';

import Login      from './pages/Login.jsx';
import Register   from './pages/Register.jsx';
import Dashboard  from './pages/Dashboard.jsx';
import Profile    from './pages/Profile.jsx';
import EContact   from './pages/EContact.jsx';
import SOSHistory from './pages/SOSHistory.jsx';
import AIHelp     from './pages/AIHelp.jsx';
import Complaints from './pages/Complaints.jsx';
import Helplines  from './pages/Helplines.jsx';
import Settings   from './pages/Settings.jsx';
import AppInfo    from './pages/AppInfo.jsx';
import FAQ        from './pages/FAQ.jsx';
import Weather    from './pages/Weather.jsx';
import SOSTimer   from './pages/SOSTimer.jsx';
import DesktopSidebar from './components/DesktopSidebar.jsx';
import MobileSidebar  from './components/MobileSidebar.jsx';
import TopBar         from './components/TopBar.jsx';

import {
  Home, User, Phone, Clock, MessageCircle, FileText, HelpCircle,
  Settings as Cog, Info, BookOpen, LogOut, Sun, Moon
} from 'lucide-react';

// Page titles for TopBar
const PAGE_TITLES = {
  '/':           'Dashboard',
  '/dashboard':  'Dashboard',
  '/profile':    'My Profile',
  '/e-contact':  'Emergency Contacts',
  '/sos-history':'SOS History',
  '/ai-help':    'AI Safety Assistant',
  '/complaints': 'Register Your Complaint',
  '/helplines':  'Helplines Directory',
  '/settings':   'Settings',
  '/app-info':   'About the App',
  '/faq':        'Top Questions',
};

function RequireAuth({ children }) {
  const { user, loading } = useAuth();
  if (loading) return (
    <div className="flex items-center justify-center h-screen" style={{ background: '#FDECEC' }}>
      <div className="text-center">
        <div className="w-20 h-20 rounded-full gradient-main flex items-center justify-center text-white text-3xl font-black mx-auto mb-4 shadow-lg">S</div>
        <p className="text-[#E0434F] font-semibold text-base">Loading…</p>
      </div>
    </div>
  );
  return user ? children : <Navigate to="/login" replace />;
}

function AppLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user } = useAuth();
  const { dark }  = useTheme();
  const location  = useLocation();

  const noShell = ['/login', '/register', '/sos-timer', '/weather'];
  const isShell = user && !noShell.some(p => location.pathname.startsWith(p));
  const pageTitle = PAGE_TITLES[location.pathname] || 'Smart AI Safety System';

  // Pages rendered inside the shell
  const shellRoutes = (
    <Routes location={location} key={location.pathname}>
      <Route path="/"           element={<RequireAuth><Dashboard /></RequireAuth>} />
      <Route path="/dashboard"  element={<RequireAuth><Dashboard /></RequireAuth>} />
      <Route path="/profile"    element={<RequireAuth><Profile /></RequireAuth>} />
      <Route path="/e-contact"  element={<RequireAuth><EContact /></RequireAuth>} />
      <Route path="/sos-history"element={<RequireAuth><SOSHistory /></RequireAuth>} />
      <Route path="/ai-help"    element={<RequireAuth><AIHelp /></RequireAuth>} />
      <Route path="/complaints" element={<RequireAuth><Complaints /></RequireAuth>} />
      <Route path="/helplines"  element={<RequireAuth><Helplines /></RequireAuth>} />
      <Route path="/settings"   element={<RequireAuth><Settings /></RequireAuth>} />
      <Route path="/app-info"   element={<RequireAuth><AppInfo /></RequireAuth>} />
      <Route path="/faq"        element={<RequireAuth><FAQ /></RequireAuth>} />
      <Route path="*"           element={<Navigate to="/" replace />} />
    </Routes>
  );

  return (
    <div className={dark ? 'dark' : ''}>
      <Routes location={location}>
        <Route path="/login"    element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/weather"  element={<Weather />} />
        <Route path="/sos-timer" element={<RequireAuth><SOSTimer /></RequireAuth>} />
        <Route path="/*" element={
          isShell ? (
            <div className="app-shell">
              {/* Persistent desktop sidebar */}
              <DesktopSidebar />
              {/* Mobile drawer */}
              <MobileSidebar open={mobileOpen} onClose={() => setMobileOpen(false)} />

              <div className="app-main">
                {/* Top bar */}
                <TopBar
                  title={pageTitle}
                  onMenuClick={() => setMobileOpen(true)}
                />
                {/* Page content */}
                <div className="app-content">
                  {shellRoutes}
                </div>
              </div>
            </div>
          ) : shellRoutes
        } />
      </Routes>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <AppLayout />
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}
