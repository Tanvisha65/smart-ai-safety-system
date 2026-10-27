import React from 'react';
import { useTheme } from '../context/ThemeContext.jsx';
import { Shield, Dot } from 'lucide-react';

const PRIVACY_ITEMS = [
  'Location is only accessed when you open the app or trigger SOS.',
  'Your data is stored locally and never shared with third parties.',
  "SMS alerts open your phone's SMS app — no SMS is sent silently from a web app.",
  "SOS calls open your phone's dialer — Twilio env vars enable auto-SMS.",
];

function SettingRow({ label, description, children, dark }) {
  return (
    <div className={`flex items-center justify-between py-5 border-b last:border-0 ${dark ? 'border-white/5' : 'border-gray-100'}`}>
      <div className="flex-1 pr-6">
        <p className={`text-base font-semibold ${dark ? 'text-white' : 'text-gray-800'}`}>{label}</p>
        {description && (
          <p className={`text-sm mt-0.5 ${dark ? 'text-gray-400' : 'text-gray-500'}`}>{description}</p>
        )}
      </div>
      {children}
    </div>
  );
}

export default function Settings({ onMenuClick }) {
  const { dark, toggleDark } = useTheme();

  const card   = dark ? 'bg-[#3d1520]' : 'bg-white';
  const shadow  = 'shadow-[0_4px_24px_rgba(224,67,79,0.12)]';

  return (
    <div className="max-w-3xl mx-auto pb-10 space-y-5">

        {/* Appearance */}
        <div className={`${card} rounded-3xl ${shadow} px-6 py-2`}>
          <p className="text-xs font-bold uppercase tracking-wider text-gray-400 pt-4 pb-1">Appearance</p>
          <SettingRow
            dark={dark}
            label="Dark Mode"
            description="Switch to dark wine theme">
            <button
              onClick={toggleDark}
              aria-label="Toggle dark mode"
              className={`w-14 h-7 rounded-full relative transition-colors shrink-0 ${dark ? '' : 'bg-gray-200'}`}
              style={dark ? { background: 'linear-gradient(135deg,#E0434F,#8E1722)' } : {}}>
              <div className={`w-6 h-6 bg-white rounded-full absolute top-0.5 shadow transition-all ${dark ? 'right-0.5' : 'left-0.5'}`} />
            </button>
          </SettingRow>
        </div>

        {/* Privacy & Safety */}
        <div className={`${card} rounded-3xl ${shadow} px-6 py-5`}>
          <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-4">Privacy &amp; Safety</p>
          <div className="space-y-3">
            {PRIVACY_ITEMS.map((t, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className={`w-2 h-2 rounded-full mt-2 shrink-0 ${dark ? 'bg-[#E0434F]' : 'bg-[#E0434F]'}`} />
                <p className={`text-base leading-relaxed ${dark ? 'text-gray-300' : 'text-gray-600'}`}>{t}</p>
              </div>
            ))}
          </div>
        </div>

        {/* About */}
        <div className={`${card} rounded-3xl ${shadow} px-6 py-5 flex items-center gap-5`}>
          <div className="w-14 h-14 rounded-2xl gradient-main flex items-center justify-center shrink-0">
            <Shield size={28} color="white" />
          </div>
          <div>
            <p className={`text-xl font-bold ${dark ? 'text-white' : 'text-gray-900'}`}>Smart AI Safety System</p>
            <p className={`text-base mt-0.5 ${dark ? 'text-gray-400' : 'text-gray-500'}`}>Version 1.0.0 · Built for India</p>
          </div>
        </div>

    </div>
  );
}
