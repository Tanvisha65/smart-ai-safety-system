// MobileSidebar — drawer version (shown <1024px via hamburger)
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext.jsx';
import { useTheme } from '../context/ThemeContext.jsx';
import {
  Home, User, Phone, Clock, MessageCircle, FileText, HelpCircle,
  Settings, Info, BookOpen, LogOut, Sun, Moon, Shield, X
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

export default function MobileSidebar({ open, onClose }) {
  const { user, logout } = useAuth();
  const { dark, toggleDark } = useTheme();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const initials = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U';
  const go = (path) => { navigate(path); onClose(); };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose} />
          <motion.aside
            className={`fixed top-0 left-0 h-full w-72 z-50 flex flex-col shadow-2xl lg:hidden
              ${dark ? 'bg-[#1e0a10]' : 'bg-white'}`}
            initial={{ x: -300 }} animate={{ x: 0 }} exit={{ x: -300 }}
            transition={{ type: 'spring', damping: 28, stiffness: 220 }}>
            {/* Header */}
            <div className="gradient-main px-5 pt-10 pb-6 relative overflow-hidden">
              {['-12deg','18deg'].map((r, i) => (
                <div key={i} className="geo-band" style={{ top: `${i * 45}px`, transform: `rotate(${r})` }} />
              ))}
              <button onClick={onClose} aria-label="Close menu"
                className="absolute top-4 right-4 text-white/70 hover:text-white z-20">
                <X size={22} />
              </button>
              <div className="flex items-center gap-3 relative z-10">
                <div className="w-14 h-14 rounded-full bg-white/25 border-2 border-white/30 flex items-center justify-center text-white font-bold text-xl shrink-0">
                  {initials}
                </div>
                <div className="min-w-0">
                  <p className="text-white font-bold truncate">{user?.name}</p>
                  <p className="text-red-200 text-sm truncate">{user?.phone}</p>
                </div>
              </div>
            </div>
            {/* Nav */}
            <nav className="flex-1 overflow-y-auto py-3 px-3">
              {NAV.map(({ path, label, icon: Icon }) => {
                const active = pathname === path || (path !== '/' && pathname.startsWith(path));
                return (
                  <button key={path} onClick={() => go(path)}
                    className={`w-full flex items-center gap-3 px-3 py-3.5 rounded-xl mb-1 text-left transition-all
                      ${active ? 'bg-[#FFEBEE] text-[#E0434F]' : dark ? 'text-gray-300 hover:bg-white/5' : 'text-gray-600 hover:bg-gray-50'}`}>
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0
                      ${active ? 'gradient-main' : dark ? 'bg-white/8' : 'bg-gray-100'}`}>
                      <Icon size={16} color={active ? 'white' : dark ? '#bbb' : '#666'} />
                    </div>
                    <span className="text-sm font-medium">{label}</span>
                  </button>
                );
              })}
            </nav>
            {/* Footer */}
            <div className={`px-3 py-4 border-t ${dark ? 'border-white/10' : 'border-gray-100'}`}>
              <button onClick={toggleDark}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl mb-2
                  ${dark ? 'bg-white/10 text-white' : 'bg-gray-100 text-gray-700'}`}>
                {dark ? <Sun size={15} /> : <Moon size={15} />}
                <span className="text-sm font-medium">{dark ? 'Light Mode' : 'Dark Mode'}</span>
              </button>
              <button onClick={() => { logout(); navigate('/login'); onClose(); }}
                className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-[#E0434F] hover:bg-red-50">
                <LogOut size={15} />
                <span className="text-sm font-medium">Logout</span>
              </button>
              <p className="text-center text-xs text-gray-400 mt-3">Version 1.0.0</p>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
