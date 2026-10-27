import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext.jsx';
import { useTheme } from '../context/ThemeContext.jsx';
import { Menu, Bell, Info, Search, Phone, Sun, Moon } from 'lucide-react';

export default function TopBar({ title, onMenuClick }) {
  const { user } = useAuth();
  const { dark, toggleDark } = useTheme();
  const navigate = useNavigate();

  const initials = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U';

  return (
    <div className="app-topbar">
      {/* Hamburger — mobile only */}
      <button onClick={onMenuClick} aria-label="Open menu"
        className="lg:hidden w-10 h-10 rounded-xl flex items-center justify-center bg-[#FFEBEE] shrink-0">
        <Menu size={20} color="#E0434F" />
      </button>

      {/* Page title */}
      <h1 className={`text-xl lg:text-2xl font-bold flex-1 ${dark ? 'text-white' : 'text-[#2B2B2B]'}`}>
        {title}
      </h1>

      {/* Right actions */}
      <div className="flex items-center gap-3">
        {/* Search — desktop only */}
        <div className={`hidden lg:flex items-center gap-2 rounded-xl px-4 py-2.5 w-52 border
          ${dark ? 'bg-[#2e1015] border-[#4a1c28]' : 'bg-gray-50 border-gray-200'}`}>
          <Search size={16} color="#999" />
          <span className="text-sm text-gray-400">Search…</span>
        </div>

        {/* Dark toggle */}
        <button onClick={toggleDark} aria-label="Toggle dark mode"
          className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors
            ${dark ? 'bg-white/10 text-white' : 'bg-gray-100 text-gray-600'}`}>
          {dark ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* Notification bell */}
        <button aria-label="Notifications"
          className={`w-10 h-10 rounded-xl flex items-center justify-center
            ${dark ? 'bg-white/10 text-white' : 'bg-gray-100 text-gray-600'}`}>
          <Bell size={18} />
        </button>

        {/* Info */}
        <button onClick={() => navigate('/app-info')} aria-label="App info"
          className={`w-10 h-10 rounded-xl flex items-center justify-center
            ${dark ? 'bg-white/10 text-white' : 'bg-gray-100 text-gray-600'}`}>
          <Info size={18} />
        </button>

        {/* Dial 112 pill */}
        <a href="tel:112" aria-label="Dial 112"
          className="hidden sm:flex items-center gap-2 gradient-main text-white text-sm font-bold px-5 py-2.5 rounded-full whitespace-nowrap hover:opacity-90 transition-opacity">
          <Phone size={15} fill="white" /> Dial 112
        </a>

        {/* Avatar */}
        <div className="w-10 h-10 rounded-full gradient-main flex items-center justify-center text-white font-bold text-sm shrink-0">
          {initials}
        </div>
      </div>
    </div>
  );
}
