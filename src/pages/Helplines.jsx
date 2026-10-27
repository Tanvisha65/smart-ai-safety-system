import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext.jsx';
import { Search, Phone, AlertTriangle } from 'lucide-react';
import { HELPLINES } from '../config/emergencyNumbers.js';

const CATS = ['All', 'Emergency', 'Police', 'Fire', 'Medical', 'Disaster', 'Women', 'Child',
              'Elderly', 'Railway', 'Cyber', 'Legal', 'Mental', 'Rights'];

const CAT_COLOR = {
  Emergency: '#E0434F', Police: '#1565C0', Fire: '#E65100', Medical: '#2E7D32',
  Disaster: '#6D4C41',  Women: '#6A1B9A',  Child: '#1565C0', Elderly: '#4E342E',
  Railway: '#0D47A1',   Cyber: '#1a237e',  Legal: '#4a148c', Mental: '#1B5E20',
  Rights: '#8B0000',    AntiDrug: '#E65100', Suicide: '#6A1B9A', Road: '#1565C0', Poison: '#2E7D32'
};

export default function Helplines({ onMenuClick }) {
  const { dark } = useTheme();
  const [search, setSearch] = useState('');
  const [cat, setCat] = useState('All');

  const filtered = HELPLINES.filter(h => {
    const matchCat  = cat === 'All' || h.category === cat;
    const matchSrch = !search ||
      h.name.toLowerCase().includes(search.toLowerCase()) ||
      h.number.includes(search) ||
      h.description.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSrch;
  });

  const card   = dark ? 'bg-[#3d1520]' : 'bg-white';
  const shadow = 'shadow-[0_4px_24px_rgba(224,67,79,0.12)]';

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
              placeholder="Search by name or number…"
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
                className={`px-3 py-2 rounded-full text-sm font-semibold border transition-all
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
            Numbers may vary by state. <strong>In immediate danger, call 112.</strong>
          </p>
        </div>

        {/* Row 3: Helpline cards grid */}
        {filtered.length === 0 ? (
          <div className={`${card} rounded-2xl ${shadow} p-12 flex flex-col items-center justify-center gap-3`}>
            <div className={`w-14 h-14 rounded-full flex items-center justify-center ${dark ? 'bg-[#4a1c28]' : 'bg-gray-100'}`}>
              <Phone size={26} className={dark ? 'text-gray-500' : 'text-gray-400'} />
            </div>
            <p className={`text-base ${dark ? 'text-gray-500' : 'text-gray-400'}`}>No helplines found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map(h => {
              const color = CAT_COLOR[h.category] || '#E0434F';
              const bgHex = `${color}18`;
              return (
                <motion.div
                  key={h.number + h.name}
                  layout
                  className={`${card} rounded-2xl ${shadow} p-5 flex flex-col gap-3`}
                >
                  {/* Top: icon + name + description */}
                  <div className="flex items-start gap-3">
                    <div
                      className="w-14 h-14 rounded-full shrink-0 flex items-center justify-center"
                      style={{ background: bgHex }}
                    >
                      <Phone size={24} color={color} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-base font-bold leading-snug ${dark ? 'text-white' : 'text-gray-900'}`}>
                        {h.name}
                      </p>
                      <p className={`text-sm mt-0.5 leading-relaxed ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
                        {h.description}
                      </p>
                    </div>
                  </div>

                  {/* Category badge */}
                  <span
                    className="self-start text-xs font-semibold px-2.5 py-1 rounded-full"
                    style={{ background: bgHex, color }}
                  >
                    {h.category}
                  </span>

                  {/* Call button */}
                  <motion.a
                    whileTap={{ scale: 0.96 }}
                    href={`tel:${h.number}`}
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-white font-bold text-sm"
                    style={{ background: `linear-gradient(135deg, ${color}, ${color}cc)` }}
                    aria-label={`Call ${h.name} ${h.number}`}
                  >
                    <Phone size={15} />
                    Call {h.number}
                  </motion.a>
                </motion.div>
              );
            })}
          </div>
        )}

    </div>
  );
}
