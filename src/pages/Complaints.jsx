import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext.jsx';
import { Search, ExternalLink, Phone, ChevronDown, ChevronUp, AlertTriangle } from 'lucide-react';
import { COMPLAINT_PORTALS, HOW_TO_FILE_TIPS } from '../config/emergencyNumbers.js';

const CATS = ['All', 'Women', 'Child', 'Cyber', 'Rights'];

const CAT_COLORS = {
  Women: { icon: '#6A1B9A', bg: '#F3E5F5' },
  Child: { icon: '#1565C0', bg: '#E3F2FD' },
  Cyber: { icon: '#1a237e', bg: '#E8EAF6' },
  Rights: { icon: '#8B0000', bg: '#FFEBEE' },
};

export default function Complaints({ onMenuClick }) {
  const { dark } = useTheme();
  const [search, setSearch] = useState('');
  const [cat, setCat] = useState('All');
  const [openTip, setOpenTip] = useState(null);

  const card = dark ? 'bg-[#3d1520]' : 'bg-white';
  const shadow = 'shadow-[0_4px_24px_rgba(224,67,79,0.12)]';

  const filtered = COMPLAINT_PORTALS
    .filter(g => cat === 'All' || g.category === cat)
    .map(g => ({
      ...g,
      items: g.items.filter(item =>
        !search ||
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.description.toLowerCase().includes(search.toLowerCase())
      )
    }))
    .filter(g => g.items.length > 0);

  // Flatten all items for the grid view
  const allItems = filtered.flatMap(group => group.items.map(item => ({ ...item, category: group.category })));

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">

        {/* Row 1: Controls */}
        <div className={`${card} rounded-2xl ${shadow} p-4 flex flex-wrap gap-4 items-center`}>
          {/* Search input */}
          <div className={`flex items-center gap-2 flex-1 min-w-64 border ${dark ? 'border-[#5a2a35] bg-[#2A0F14]' : 'border-gray-200 bg-white'} rounded-full px-4 py-2.5`}>
            <Search size={18} color="#E0434F" className="shrink-0" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search portals…"
              className={`flex-1 bg-transparent text-base outline-none ${dark ? 'text-white placeholder-gray-500' : 'text-gray-800 placeholder-gray-400'}`}
            />
          </div>
          {/* Category chips */}
          <div className="flex gap-2 flex-wrap">
            {CATS.map(c => (
              <motion.button
                key={c}
                whileTap={{ scale: 0.93 }}
                onClick={() => setCat(c)}
                className={`px-4 py-2 rounded-full text-sm font-semibold border transition-all
                  ${cat === c
                    ? 'gradient-main text-white border-transparent'
                    : dark
                      ? 'border-[#5a2a35] text-gray-300 hover:border-[#E0434F]/50'
                      : 'border-gray-200 text-gray-600 bg-white hover:border-[#E0434F]/40'
                  }`}
              >
                {c}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Row 2: Disclaimer */}
        <div className={`rounded-2xl p-4 flex gap-3 items-start ${dark ? 'bg-yellow-900/20 border border-yellow-800/30' : 'bg-yellow-50 border border-yellow-200'}`}>
          <AlertTriangle size={18} className="text-yellow-600 shrink-0 mt-0.5" />
          <p className="text-sm text-yellow-700 leading-relaxed">
            Numbers may vary by state. <strong>In immediate danger, call 112.</strong> Portal complaints ≠ FIR — also file at your local police station for criminal matters.
          </p>
        </div>

        {/* Row 3: Portal Cards Grid */}
        {allItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {allItems.map(item => {
              const colors = CAT_COLORS[item.category] || { icon: '#E0434F', bg: '#FFEBEE' };
              return (
                <motion.div
                  key={item.name}
                  layout
                  className={`${card} rounded-2xl ${shadow} p-5 flex flex-col relative`}
                >
                  {/* Category badge (top-right) */}
                  <span
                    className="absolute top-4 right-4 text-xs font-semibold px-2.5 py-1 rounded-full"
                    style={{ background: colors.bg, color: colors.icon }}
                  >
                    {item.category}
                  </span>

                  {/* Icon circle */}
                  <div
                    className="w-14 h-14 rounded-full flex items-center justify-center mb-3 shrink-0"
                    style={{ background: colors.bg }}
                  >
                    <Phone size={24} color={colors.icon} />
                  </div>

                  {/* Name */}
                  <p className={`text-lg font-bold leading-snug pr-20 ${dark ? 'text-white' : 'text-gray-900'}`}>
                    {item.name}
                  </p>

                  {/* Description */}
                  <p className={`text-sm mt-1 leading-relaxed ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
                    {item.description}
                  </p>

                  {/* Spacer */}
                  <div className="flex-1" />

                  {/* Helpline pill */}
                  {item.helpline && (
                    <a
                      href={`tel:${item.helpline}`}
                      className="inline-flex items-center gap-1.5 self-start mt-3 bg-green-100 text-green-700 rounded-full px-3 py-1 text-sm font-bold"
                    >
                      <Phone size={13} />
                      {item.helpline}
                    </a>
                  )}

                  {/* Open Portal button */}
                  <motion.a
                    whileTap={{ scale: 0.97 }}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="gradient-main mt-3 w-full flex items-center justify-center gap-2 text-white text-sm font-semibold py-2.5 rounded-full"
                  >
                    <ExternalLink size={15} />
                    Open Portal
                  </motion.a>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className={`${card} rounded-2xl ${shadow} p-12 text-center`}>
            <p className={`text-base ${dark ? 'text-gray-500' : 'text-gray-400'}`}>No portals found</p>
          </div>
        )}

        {/* Row 4: How to File accordion */}
        <div className={`${card} rounded-3xl ${shadow} p-6`}>
          <p className={`text-xl font-bold mb-4 ${dark ? 'text-white' : 'text-gray-900'}`}>
            📋 How to File a Complaint
          </p>
          <div className="space-y-2">
            {HOW_TO_FILE_TIPS.map((tip, i) => (
              <div
                key={i}
                className={`rounded-xl overflow-hidden border ${dark ? 'border-[#5a2a35]' : 'border-gray-100'}`}
              >
                <button
                  onClick={() => setOpenTip(openTip === i ? null : i)}
                  className={`w-full flex items-center justify-between py-4 px-5 text-left transition-colors
                    ${dark ? 'bg-[#4a1c28] hover:bg-[#551e2e]' : 'bg-gray-50 hover:bg-gray-100'}`}
                >
                  <span className={`text-base font-medium pr-4 ${dark ? 'text-white' : 'text-gray-800'}`}>
                    {tip.title}
                  </span>
                  {openTip === i
                    ? <ChevronUp size={18} color="#E0434F" className="shrink-0" />
                    : <ChevronDown size={18} className="text-gray-400 shrink-0" />}
                </button>
                <AnimatePresence>
                  {openTip === i && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: 'auto' }}
                      exit={{ height: 0 }}
                      className="overflow-hidden"
                    >
                      <p className={`px-5 pb-4 pt-2 text-base leading-relaxed ${dark ? 'bg-[#3d1520] text-gray-300' : 'bg-white text-gray-600'}`}>
                        {tip.content}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>

    </div>
  );
}
