import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext.jsx';
import { useTheme } from '../context/ThemeContext.jsx';
import {
  Home, User, Phone, Clock, MessageCircle, FileText, HelpCircle,
  Settings, Info, BookOpen, LogOut, X, Sun, Moon
} from 'lucide-react';

const NAV = [
  { path: '/',            label: 'Home',                   icon: Home },
  { path: '/profile',     label: 'Profile',                icon: User },
  { path: '/e-contact',   label: 'E-Contact',              icon: Phone },
  { path: '/sos-history', label: 'SOS History',            icon: Clock },
  { path: '/ai-help',     label: 'AI Help',                icon: MessageCircle },
  { path: '/complaints',  label: 'Register Complaint',     icon: FileText },
  { path: '/helplines',   label: 'Helplines',              icon: HelpCircle },
  { path: '/settings',    label: 'Settings',               icon: Settings },
  { path: '/app-info',    label: 'App Info',               icon: Info },
  { path: '/faq',         label: 'Top Questions',          icon: BookOpen },
];

export default function Sidebar({ open, onClose }) {
  const { user, logout } = useAuth();
  const { dark, toggleDark } = useTheme();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const go = (path) => { navigate(path); onClose(); };
  const handleLogout = () => { logout(); navigate('/login'); onClose(); };

  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : 'U';

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/50 z-40"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.aside
            className={`fixed top-0 left-0 h-full w-72 z-50 flex flex-col shadow-2xl
              ${dark ? 'bg-[#2A0F14]' : 'bg-white'}`}
            initial={{ x: -300 }} animate={{ x: 0 }} exit={{ x: -300 }}
            transition={{ type: 'spring', damping: 28, stiffness: 220 }}
          >
            {/* Header */}
            <div className="gradient-main px-5 pt-12 pb-6 relative overflow-hidden">
              {/* Diagonal deco */}
              {['-15deg','20deg'].map((r,i) => (
                <div key={i} className="geo-band" style={{ top:`${i*40}px`, transform:`rotate(${r})`, opacity:0.08 }} />
              ))}
              <button onClick={onClose} aria-label="Close menu"
                className="absolute top-4 right-4 text-white/70 hover:text-white z-10">
                <X size={20} />
              </button>
              <div className="flex items-center gap-3 relative z-10">
                <div className="w-14 h-14 rounded-full bg-white/25 flex items-center justify-center
                  text-white font-bold text-xl border-2 border-white/30 shrink-0">
                  {initials}
                </div>
                <div className="min-w-0">
                  <p className="text-white font-bold truncate">{user?.name}</p>
                  <p className="text-red-200 text-xs truncate">{user?.phone}</p>
                </div>
              </div>
            </div>

            {/* Nav items */}
            <nav className="flex-1 overflow-y-auto py-3">
              {NAV.map(({ path, label, icon: Icon }) => {
                const active = pathname === path || (path !== '/' && pathname.startsWith(path));
                return (
                  <button key={path} onClick={() => go(path)}
                    className={`w-full flex items-center gap-3 px-4 py-3.5 text-left transition-all relative
                      ${active
                        ? 'text-[#E0434F]'
                        : dark ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                      }`}
                    aria-label={label}>
                    {active && (
                      <motion.div layoutId="nav-pill"
                        className="absolute inset-x-3 inset-y-1 rounded-xl"
                        style={{ background: dark ? 'rgba(224,67,79,0.15)' : '#FFE8EA' }}
                      />
                    )}
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 relative z-10
                      ${active
                        ? 'gradient-main'
                        : dark ? 'bg-white/5' : 'bg-gray-100'}`}>
                      <Icon size={17} color={active ? 'white' : dark ? '#ccc' : '#666'} />
                    </div>
                    <span className="text-sm font-medium relative z-10">{label}</span>
                  </button>
                );
              })}
            </nav>

            {/* Footer */}
            <div className={`px-4 py-4 border-t ${dark ? 'border-white/10' : 'border-gray-100'}`}>
              <button onClick={toggleDark}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl mb-2
                  ${dark ? 'bg-white/10 text-white' : 'bg-gray-100 text-gray-700'}`}
                aria-label="Toggle dark mode">
                {dark ? <Sun size={16} /> : <Moon size={16} />}
                <span className="text-sm font-medium">{dark ? 'Light Mode' : 'Dark Mode'}</span>
              </button>
              <button onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-[#E0434F] hover:bg-red-50 dark:hover:bg-red-900/20"
                aria-label="Logout">
                <LogOut size={16} />
                <span className="text-sm font-medium">Logout</span>
              </button>
              <p className={`text-center text-[11px] mt-3 ${dark ? 'text-gray-600' : 'text-gray-400'}`}>
                Version 1.0.0
              </p>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
