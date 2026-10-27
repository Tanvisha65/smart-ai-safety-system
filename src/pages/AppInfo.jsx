import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext.jsx';
import { Shield, Phone, Heart, Users, AlertTriangle, MessageCircle, FileText } from 'lucide-react';

const FEATURES = [
  { icon: AlertTriangle, label:'SOS Timer',         desc:'5-second countdown with vibration, silent mode & volunteer option' },
  { icon: Phone,         label:'Emergency Helplines', desc:'One-tap access to all Indian emergency numbers' },
  { icon: Users,         label:'E-Contact',          desc:'SMS your emergency contacts your GPS location instantly' },
  { icon: MessageCircle, label:'AI Safety Assistant', desc:'Situation analysis, step-by-step guidance & helpline suggestions' },
  { icon: FileText,      label:'Complaint Portals',   desc:'NCW, NCPCR, Cybercrime, NHRC & more — with how-to tips' },
  { icon: Heart,         label:'Volunteer Network',   desc:'Opt in to help others in your area' },
];

export default function AppInfo({ onMenuClick }) {
  const { dark } = useTheme();
  const card   = dark ? 'bg-[#3d1520]' : 'bg-white';
  const shadow  = 'shadow-[0_4px_24px_rgba(224,67,79,0.12)]';

  return (
    <div className="max-w-4xl mx-auto pb-10 space-y-5">

        {/* Hero card — shield + app name */}
        <div className={`${card} rounded-3xl ${shadow} p-8 text-center`}>
          <div className="w-20 h-20 rounded-full gradient-main flex items-center justify-center mx-auto mb-5">
            <Shield size={40} color="white" />
          </div>
          <h1 className="text-3xl font-bold text-[#E0434F]">Smart AI Safety System</h1>
          <p className={`text-base mt-2 ${dark ? 'text-gray-400' : 'text-gray-500'}`}>Version 1.0.0 · Built for India</p>
        </div>

        {/* About */}
        <div className={`${card} rounded-3xl ${shadow} p-6`}>
          <p className="text-[22px] font-semibold text-[#E0434F] mb-3">About</p>
          <p className={`text-base leading-relaxed ${dark ? 'text-gray-300' : 'text-gray-600'}`}>
            Smart AI Safety System is a mobile-first PWA designed to provide immediate safety assistance across India.
            It combines AI-powered guidance with quick access to all emergency services, complaint portals, and
            real-time location sharing.
          </p>
        </div>

        {/* Key Features */}
        <div className={`${card} rounded-3xl ${shadow} p-6`}>
          <p className="text-[22px] font-semibold text-[#E0434F] mb-5">Key Features</p>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {FEATURES.map(({ icon: Icon, label, desc }) => (
              <motion.div
                key={label}
                whileHover={{ y: -2 }}
                className={`rounded-2xl p-4 flex gap-3 items-start transition-shadow hover:shadow-md ${
                  dark ? 'bg-[#2A0F14]' : 'bg-[#FFF5F5]'
                }`}>
                <div className="w-12 h-12 rounded-full shrink-0 flex items-center justify-center"
                  style={{ background: dark ? 'rgba(224,67,79,0.15)' : '#FFE0E3' }}>
                  <Icon size={22} color="#E0434F" />
                </div>
                <div>
                  <p className={`text-base font-bold ${dark ? 'text-white' : 'text-gray-800'}`}>{label}</p>
                  <p className={`text-sm mt-0.5 leading-relaxed ${dark ? 'text-gray-400' : 'text-gray-500'}`}>{desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Disclaimer */}
        <div className={`rounded-2xl p-5 flex gap-4 items-start border ${
          dark
            ? 'bg-yellow-900/20 border-yellow-700/30'
            : 'bg-yellow-50 border-yellow-200'
        }`}>
          <AlertTriangle size={22} className="shrink-0 text-yellow-600 mt-0.5" />
          <p className={`text-sm leading-relaxed ${dark ? 'text-yellow-300' : 'text-yellow-800'}`}>
            <span className="font-semibold">Disclaimer: </span>
            This app is a safety tool and does not replace emergency services. Always call 112 in immediate danger.
            Helpline numbers may vary by state. The AI assistant does not provide medical or legal diagnoses.
          </p>
        </div>

    </div>
  );
}
