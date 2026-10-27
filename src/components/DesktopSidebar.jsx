import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext.jsx';
import { useTheme } from '../context/ThemeContext.jsx';
import {
  Home, User, Phone, Clock, MessageCircle, FileText, HelpCircle,
  Settings, Info, BookOpen, LogOut, Sun, Moon, Shield
} from 'lucide-react';

const NAV = [
  { path: '/',            label: 'Home',               icon: Home },
  { path: '/profile',     label: 'Profile',            icon: User },
  { path: '/e-contact',   label: 'E-Contact',          icon: Phone },
  { path: '/sos-history', label: 'SOS History',        icon: Clock },
  { path: '/ai-help',     label: 'AI Help',            icon: MessageCircle },
  { path: '/complaints',  label: 'Register Complaint', icon: FileText },
  { path: '/helplines',   label: 'Helplines',          icon: HelpCircle },
  { path: '/settings',    label: 'Settings',           icon: Settings },
  { path: '/app-info',    label: 'App Info',           icon: Info },
  { path: '/faq',         label: 'Top Questions',      icon: BookOpen },
];

export default function DesktopSidebar() {
  const { user, logout } = useAuth();
  const { dark, toggleDark } = useTheme();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : 'U';

  const go = (path) => navigate(path);

  // hidden on mobile, shown on desktop via CSS
  return (
    <aside className="app-sidebar hidden lg:flex">
      {/* Header */}
      <div className="gradient-main px-6 py-6 relative overflow-hidden shrink-0">
        {['-12deg','18deg','-28deg'].map((r, i) => (
          <div key={i} className="geo-band" style={{ top: `${i * 50 - 10}px`, transform: `rotate(${r})` }} />
        ))}
        {/* Logo line */}
        <div className="flex items-center gap-2 mb-5 relative z-10">
          <Shield size={20} color="white" />
          <span className="text-white font-bold text-sm leading-tight">Smart AI<br />Safety System</span>
        </div>
        {/* Avatar */}
        <div className="flex items-center gap-3 relative z-10">
          <div className="w-16 h-16 rounded-full bg-white/25 border-2 border-white/40 flex items-center justify-center text-white text-2xl font-black shrink-0">
            {initials}
          </div>
          <div className="min-w-0">
            <p className="text-white font-bold text-base leading-tight truncate">{user?.name}</p>
            <p className="text-red-200 text-sm truncate mt-0.5">{user?.phone}</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-3">
        {NAV.map(({ path, label, icon: Icon }) => {
          const active = pathname === path || (path !== '/' && pathname.startsWith(path));
          return (
            <button key={path} onClick={() => go(path)}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl mb-1 text-left transition-all relative group
                ${active ? 'text-[#E0434F]' : dark ? 'text-gray-300 hover:text-white hover:bg-white/5' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'}`}
              aria-label={label}>
              {active && (
                <motion.div layoutId="sidebar-pill"
                  className={`absolute inset-0 rounded-xl ${dark ? 'bg-red-900/20' : 'bg-[#FFEBEE]'}`}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 relative z-10 transition-colors
                ${active ? 'gradient-main' : dark ? 'bg-white/8' : 'bg-gray-100 group-hover:bg-gray-200'}`}>
                <Icon size={17} color={active ? 'white' : dark ? '#bbb' : '#666'} />
              </div>
              <span className="text-[15px] font-medium relative z-10">{label}</span>
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className={`px-3 py-4 border-t shrink-0 ${dark ? 'border-white/10' : 'border-gray-100'}`}>
        <button onClick={toggleDark}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl mb-2 transition-colors
            ${dark ? 'bg-white/10 text-white hover:bg-white/15' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          aria-label="Toggle dark mode">
          {dark ? <Sun size={16} /> : <Moon size={16} />}
          <span className="text-sm font-medium">{dark ? 'Light Mode' : 'Dark Mode'}</span>
        </button>
        <button onClick={() => { logout(); navigate('/login'); }}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[#E0434F] hover:bg-red-50 transition-colors"
          aria-label="Logout">
          <LogOut size={16} />
          <span className="text-sm font-medium">Logout</span>
        </button>
        <p className={`text-center text-xs mt-3 ${dark ? 'text-gray-600' : 'text-gray-400'}`}>Version 1.0.0</p>
      </div>
    </aside>
  );
}
