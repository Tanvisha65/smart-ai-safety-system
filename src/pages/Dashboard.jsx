import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext.jsx';
import { useTheme } from '../context/ThemeContext.jsx';
import {
  MapPin, Mic, MicOff, Send, ChevronRight,
  User, Clock, Bell, Globe, AlertTriangle, Shield,
  Flame, Heart, Zap, Baby, Train, UserCheck, MessageCircle, Phone, Info
} from 'lucide-react';

const SLIDES = [
  { tag: 'Always available, anywhere', sub: 'Smart AI-powered emergency assistance' },
  { tag: 'Check your SOS history', sub: 'Every alert logged with GPS and timestamp' },
  { tag: 'Choose to volunteer and help others', sub: 'Join the community safety network' },
];

const QUICK = [
  { label: 'Profile',      icon: User,          path: '/profile',     bg: '#F0F4FF', ic: '#4A90D9' },
  { label: 'SOS History',  icon: Clock,         path: '/sos-history', bg: '#FFF4E5', ic: '#F59E0B' },
  { label: 'Notifications',icon: Bell,          path: '/settings',    bg: '#E8F5E9', ic: '#22C55E' },
  { label: 'About Us',     icon: Info,          path: '/app-info',    bg: '#F3E5F5', ic: '#9B59B6' },
  { label: 'Dial 112',     icon: Phone,         action: 'call_112',   bg: '#FFEBEE', ic: '#E0434F' },
  { label: 'Chat AI',      icon: MessageCircle, path: '/ai-help',     bg: '#E0F2F1', ic: '#14B8A6' },
  { label: 'TrackMe',      icon: Globe,         action: 'trackme',    bg: '#FFF9C4', ic: '#D97706' },
  { label: 'Emergency',    icon: AlertTriangle, action: 'sos',        bg: '#FFCDD2', ic: '#E0434F', pulse: true },
];

const SERVICES = [
  { key:'police',  label:'POLICE',   icon:Shield,    color:'#1565C0', bg:'#E3F2FD', number:'100' },
  { key:'fire',    label:'FIRE',     icon:Flame,     color:'#E65100', bg:'#FFF3E0', number:'101' },
  { key:'medical', label:'MEDICAL',  icon:Heart,     color:'#2E7D32', bg:'#E8F5E9', number:'108' },
  { key:'disaster',label:'DISASTER', icon:Zap,       color:'#6D4C41', bg:'#EFEBE9', number:'1078' },
  { key:'woman',   label:'WOMAN',    icon:User,      color:'#6A1B9A', bg:'#F3E5F5', number:'181' },
  { key:'child',   label:'CHILD',    icon:Baby,      color:'#1565C0', bg:'#E3F2FD', number:'1098' },
  { key:'elderly', label:'ELDERLY',  icon:UserCheck, color:'#4E342E', bg:'#EFEBE9', number:'14567' },
  { key:'railway', label:'RAILWAY',  icon:Train,     color:'#0D47A1', bg:'#E3F2FD', number:'139' },
];

const SUGGESTIONS = ['I feel unsafe', 'Someone is following me', 'Medical emergency'];

function Card({ children, className = '', hover = true }) {
  return (
    <div className={`card-white ${hover ? '' : 'hover:transform-none hover:shadow-[0_4px_24px_rgba(224,67,79,0.08)]'} ${className}`}>
      {children}
    </div>
  );
}

export default function Dashboard() {
  const { user, apiHeaders } = useAuth();
  const { dark } = useTheme();
  const navigate = useNavigate();

  const [slide, setSlide]       = useState(0);
  const [location, setLocation] = useState('Detecting location…');
  const [coords, setCoords]     = useState(null);
  const [situation, setSituation] = useState('');
  const [listening, setListening] = useState(false);
  const [contacts, setContacts]   = useState([]);
  const [aiReply, setAiReply]     = useState('');
  const recogRef = useRef(null);

  useEffect(() => {
    const t = setInterval(() => setSlide(s => (s + 1) % SLIDES.length), 4000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (!('geolocation' in navigator)) return setLocation('Location unavailable');
    navigator.geolocation.getCurrentPosition(async pos => {
      const { latitude: lat, longitude: lng } = pos.coords;
      setCoords({ latitude: lat, longitude: lng });
      try {
        const r = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`);
        const d = await r.json();
        setLocation(d.display_name?.split(',').slice(0, 3).join(', ') ?? `${lat.toFixed(4)}, ${lng.toFixed(4)}`);
      } catch { setLocation(`${lat.toFixed(4)}, ${lng.toFixed(4)}`); }
    }, () => setLocation('Location unavailable'));
  }, []);

  useEffect(() => {
    fetch('/api/contacts', { headers: apiHeaders() })
      .then(r => r.ok ? r.json() : []).then(setContacts).catch(() => {});
  }, []);

  const mapsLink = coords ? `https://maps.google.com/?q=${coords.latitude},${coords.longitude}` : '';

  const handleSOS = (type = 'Emergency', number = '112') =>
    navigate('/sos-timer', { state: { type, number, coords } });

  const handleAction = item => {
    if (item.path) return navigate(item.path);
    if (item.action === 'call_112') return (window.location.href = 'tel:112');
    if (item.action === 'sos') return handleSOS();
    if (item.action === 'trackme') {
      if (!coords) return alert('Location not available yet.');
      const msg = `Track me: ${mapsLink}`;
      if (contacts.length) contacts.forEach(c => window.open(`sms:${c.phone}?body=${encodeURIComponent(msg)}`, '_blank'));
      else { navigator.clipboard?.writeText(mapsLink); alert('Location link copied!'); }
    }
  };

  const handleMic = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return alert('Speech recognition not supported');
    if (listening) { recogRef.current?.stop(); setListening(false); return; }
    const r = new SR();
    r.lang = user?.language === 'Hindi' ? 'hi-IN' : user?.language === 'Marathi' ? 'mr-IN' : 'en-IN';
    r.onresult = e => { setSituation(e.results[0][0].transcript); setListening(false); };
    r.onerror = r.onend = () => setListening(false);
    recogRef.current = r; r.start(); setListening(true);
  };

  const sendToAI = async (msg) => {
    if (!msg.trim()) return;
    navigate('/ai-help', { state: { message: msg } });
  };

  const bg   = dark ? 'bg-[#2A0F14]' : 'bg-[#FDECEC]';
  const text  = dark ? 'text-gray-200' : 'text-[#2B2B2B]';
  const muted = dark ? 'text-gray-400' : 'text-gray-500';

  return (
    <div className={`${bg} min-h-full`}>
      {/* ── ROW 1: Hero + SOS card ────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
        {/* Hero carousel — 8 cols */}
        <div className="lg:col-span-8">
          <div className="rounded-3xl overflow-hidden relative" style={{ height: 280, background: 'linear-gradient(135deg,#E0434F,#8E1722)' }}>
            <AnimatePresence mode="wait">
              <motion.div key={slide}
                initial={{ x: 80, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
                exit={{ x: -80, opacity: 0 }} transition={{ duration: 0.4 }}
                className="absolute inset-0 flex items-center px-10">
                {/* Diagonal deco bands */}
                {['-20deg','15deg','-35deg'].map((r, i) => (
                  <div key={i} className="geo-band" style={{ top: `${i * 60 - 20}px`, transform: `rotate(${r})` }} />
                ))}
                {/* Left text */}
                <div className="flex-1 z-10">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-1.5 h-16 bg-white rounded-full opacity-80" />
                    <div>
                      <h2 className="text-white font-black text-[40px] leading-tight drop-shadow-md">
                        {SLIDES[slide].tag}
                      </h2>
                      <p className="text-red-200 text-lg mt-1">{SLIDES[slide].sub}</p>
                    </div>
                  </div>
                  <a href="tel:112"
                    className="inline-flex items-center gap-2 bg-white text-[#E0434F] font-bold px-6 py-3 rounded-full text-sm shadow-lg hover:bg-red-50 transition-colors">
                    <Phone size={16} fill="#E0434F" /> Call 112 Now
                  </a>
                </div>
                {/* Big 112 */}
                <div className="z-10 text-white font-black text-[160px] leading-none opacity-90 drop-shadow-2xl select-none">
                  112
                </div>
              </motion.div>
            </AnimatePresence>
            {/* Dots */}
            <div className="absolute bottom-4 left-10 flex gap-2">
              {SLIDES.map((_, i) => (
                <button key={i} onClick={() => setSlide(i)} aria-label={`Slide ${i + 1}`}
                  className={`h-2 rounded-full transition-all ${i === slide ? 'w-8 bg-white' : 'w-2 bg-white/40'}`} />
              ))}
            </div>
          </div>
        </div>

        {/* SOS card — 4 cols */}
        <div className="lg:col-span-4">
          <Card className="h-full flex flex-col items-center justify-center p-8 text-center" hover={false}>
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-6">Emergency SOS</p>
            <motion.button whileTap={{ scale: 0.94 }} onClick={() => handleSOS()}
              className="relative flex items-center justify-center cursor-pointer mb-6"
              style={{ width: 180, height: 180 }}
              aria-label="Press SOS">
              <div className="ripple-ring" />
              <div className="ripple-ring" />
              <div className="ripple-ring" />
              <div className="w-36 h-36 rounded-full gradient-main flex items-center justify-center z-10 shadow-2xl pulse-sos">
                <span className="text-white font-black text-3xl tracking-wide">SOS</span>
              </div>
            </motion.button>
            <p className={`text-sm leading-relaxed ${muted} max-w-[220px]`}>
              Press to alert your emergency contacts and call 112 with your location.
            </p>
            <motion.button whileTap={{ scale: 0.96 }}
              onClick={() => handleSOS()}
              className="mt-5 w-full gradient-main text-white font-bold py-3.5 rounded-2xl text-base shadow-lg">
              🚨 SEND EMERGENCY ALERT
            </motion.button>
          </Card>
        </div>
      </div>

      {/* ── ROW 2: Quick Actions ─────────────────────────── */}
      <div className="mb-8">
        <h2 className={`text-xl font-bold mb-5 ${text}`}>Quick Actions</h2>
        <Card className="p-6">
          <div className="grid grid-cols-4 lg:grid-cols-8 gap-4">
            {QUICK.map((item, i) => (
              <motion.button key={item.label}
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                whileTap={{ scale: 0.9 }} whileHover={{ scale: 1.05 }}
                onClick={() => handleAction(item)}
                className="flex flex-col items-center gap-3"
                aria-label={item.label}>
                <div className={`w-[88px] h-[88px] rounded-full flex items-center justify-center shadow-md ${item.pulse ? 'pulse-sos' : ''}`}
                  style={{ background: item.bg }}>
                  <item.icon size={32} color={item.ic} />
                </div>
                <span className={`text-sm font-semibold text-center leading-tight ${dark ? 'text-gray-300' : 'text-gray-700'}`}>
                  {item.label}
                </span>
              </motion.button>
            ))}
          </div>
        </Card>
      </div>

      {/* ── ROW 3: Emergency Services ─────────────────────── */}
      <div className="mb-8">
        <h2 className={`text-xl font-bold mb-5 ${text}`}>Contact Emergency Services</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-4">
          {SERVICES.map((svc, i) => (
            <motion.div key={svc.key}
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}>
              <motion.button whileTap={{ scale: 0.95 }} whileHover={{ scale: 1.03 }}
                onClick={() => handleSOS(svc.label, svc.number)}
                className="card-white w-full p-6 flex flex-col items-center gap-3 text-center"
                style={{ minHeight: 160 }}
                aria-label={`${svc.label} ${svc.number}`}>
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center"
                  style={{ background: svc.bg }}>
                  <svc.icon size={30} color={svc.color} />
                </div>
                <span className="font-bold text-base" style={{ color: svc.color }}>{svc.label}</span>
                <span className={`text-sm font-semibold px-3 py-1 rounded-full text-white`}
                  style={{ background: svc.color }}>{svc.number}</span>
              </motion.button>
            </motion.div>
          ))}
        </div>
        {/* All contacts row */}
        <Card className="p-5" hover={false}>
          <motion.button whileTap={{ scale: 0.98 }} onClick={() => navigate('/helplines')}
            className="w-full flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex -space-x-3">
                {['P','F','M','D'].map((l, i) => (
                  <div key={i} className="w-9 h-9 rounded-full gradient-main flex items-center justify-center
                    text-white text-xs font-bold border-2 border-white shadow">
                    {l}
                  </div>
                ))}
              </div>
              <div>
                <p className="font-bold text-base text-[#E0434F]">All Emergency Contacts</p>
                <p className={`text-sm ${muted}`}>View the full helplines directory →</p>
              </div>
            </div>
            <ChevronRight size={22} color="#E0434F" />
          </motion.button>
        </Card>
      </div>

      {/* ── ROW 4: Situation input + Contacts ─────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
        {/* Situation input — 7 cols */}
        <div className="lg:col-span-7">
          <Card className="p-6 h-full flex flex-col gap-5" hover={false}>
            <h2 className={`text-lg font-bold ${text}`}>Describe the Situation</h2>
            {/* Input */}
            <div className={`flex items-center gap-3 rounded-2xl border-2 border-[#E0434F]/25 px-5 py-3
              ${dark ? 'bg-[#3d1520]' : 'bg-gray-50'}`}>
              <input value={situation} onChange={e => setSituation(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && sendToAI(situation)}
                placeholder="Briefly describe what's happening…"
                className={`flex-1 bg-transparent text-base outline-none ${dark ? 'text-white placeholder-gray-500' : 'placeholder-gray-400'}`}
              />
              <motion.button whileTap={{ scale: 0.85 }} onClick={handleMic} aria-label="Voice input"
                className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${listening ? 'bg-[#E0434F]' : dark ? 'bg-[#4a1c28]' : 'bg-[#FFEBEE]'}`}>
                {listening ? <MicOff size={18} color="white" /> : <Mic size={18} color="#E0434F" />}
              </motion.button>
              <motion.button whileTap={{ scale: 0.85 }} aria-label="Send to AI"
                onClick={() => sendToAI(situation)}
                className="w-11 h-11 rounded-xl gradient-main flex items-center justify-center shrink-0">
                <Send size={16} color="white" />
              </motion.button>
            </div>
            {listening && <p className="text-sm text-[#E0434F] animate-pulse">🎙 Listening…</p>}
            {/* Suggestion chips */}
            <div className="flex flex-wrap gap-3">
              {SUGGESTIONS.map(s => (
                <button key={s} onClick={() => sendToAI(s)}
                  className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors
                    ${dark ? 'border-[#5a2a35] text-gray-300 hover:bg-[#3d1520]' : 'border-[#FFB3BA] text-[#E0434F] bg-white hover:bg-[#FFEBEE]'}`}>
                  {s}
                </button>
              ))}
            </div>
            {/* AI reply preview area */}
            <div className={`flex-1 rounded-2xl p-4 min-h-[80px] flex items-center ${dark ? 'bg-[#3d1520]' : 'bg-[#FFEBEE]'}`}>
              {aiReply ? (
                <p className={`text-sm leading-relaxed ${dark ? 'text-gray-300' : 'text-gray-700'}`}>{aiReply}</p>
              ) : (
                <p className={`text-sm ${muted} text-center w-full`}>
                  AI response will appear here — or <button onClick={() => navigate('/ai-help')} className="text-[#E0434F] font-semibold underline">open full chat →</button>
                </p>
              )}
            </div>
          </Card>
        </div>

        {/* Emergency contacts — 5 cols */}
        <div className="lg:col-span-5">
          <Card className="p-6 h-full flex flex-col" hover={false}>
            <div className="flex items-center justify-between mb-5">
              <h2 className={`text-lg font-bold ${text}`}>Emergency Contacts</h2>
              <button onClick={() => navigate('/e-contact')} className="text-sm text-[#E0434F] font-semibold hover:underline">
                Manage
              </button>
            </div>
            {contacts.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center gap-3 py-8">
                <div className="w-16 h-16 rounded-full bg-[#FFEBEE] flex items-center justify-center">
                  <Phone size={28} color="#E0434F" />
                </div>
                <p className={`text-sm ${muted} text-center`}>No emergency contacts added</p>
                <button onClick={() => navigate('/e-contact')}
                  className="gradient-main text-white text-sm font-semibold px-5 py-2.5 rounded-full">
                  Add Contacts
                </button>
              </div>
            ) : (
              <>
                <div className="space-y-3 flex-1">
                  {contacts.map(c => (
                    <div key={c.id} className={`flex items-center gap-3 p-3 rounded-xl ${dark ? 'bg-[#3d1520]' : 'bg-gray-50'}`}>
                      <div className="w-11 h-11 rounded-full gradient-main flex items-center justify-center text-white font-bold shrink-0">
                        {c.name[0].toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm truncate">{c.name}</p>
                        <p className={`text-sm ${muted}`}>{c.phone}</p>
                      </div>
                      <div className="flex gap-2">
                        <a href={`tel:${c.phone}`} aria-label={`Call ${c.name}`}
                          className="w-9 h-9 rounded-full bg-green-100 flex items-center justify-center">
                          <Phone size={15} color="#16a34a" />
                        </a>
                        <a href={`sms:${c.phone}?body=${encodeURIComponent(`🚨 Emergency from ${user?.name}${mapsLink ? '. Location: ' + mapsLink : ''}`)}`}
                          aria-label={`SMS ${c.name}`}
                          className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center">
                          <MessageCircle size={15} color="#2563eb" />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
                <button onClick={() => {
                  const msg = `🚨 EMERGENCY from ${user?.name}! Please help.${mapsLink ? ' Location: ' + mapsLink : ''}`;
                  contacts.forEach(c => window.open(`sms:${c.phone}?body=${encodeURIComponent(msg)}`, '_blank'));
                }}
                  className="mt-4 w-full gradient-main text-white font-bold py-3.5 rounded-2xl text-base">
                  Alert All Contacts
                </button>
              </>
            )}
          </Card>
        </div>
      </div>

      {/* ── ROW 5: Location ──────────────────────────────── */}
      <div className="mb-8">
        <Card className="p-6" hover={false}>
          <div className="flex items-center justify-between mb-4">
            <h2 className={`text-lg font-bold ${text}`}>Your Location</h2>
            {mapsLink && (
              <a href={mapsLink} target="_blank" rel="noopener noreferrer"
                className="text-sm text-[#E0434F] font-semibold hover:underline flex items-center gap-1">
                <MapPin size={14} /> Open in Maps
              </a>
            )}
          </div>
          {/* Location bar */}
          <div className={`flex items-center gap-3 rounded-2xl px-5 py-4 mb-4 ${dark ? 'bg-[#3d1520]' : 'bg-[#FFEBEE]'}`}>
            <MapPin size={20} color="#E0434F" className="shrink-0" />
            <p className={`text-base flex-1 truncate font-medium ${dark ? 'text-gray-200' : 'text-gray-700'}`}>{location}</p>
            {!coords && (
              <button onClick={() => window.location.reload()}
                className="text-sm text-[#E0434F] font-semibold whitespace-nowrap border border-[#E0434F] px-4 py-2 rounded-full">
                Enable Location
              </button>
            )}
          </div>
          {/* Map placeholder / iframe */}
          {coords ? (
            <div className="rounded-2xl overflow-hidden border border-gray-200" style={{ height: 280 }}>
              <iframe
                title="Your location"
                width="100%" height="100%"
                style={{ border: 'none' }}
                src={`https://www.openstreetmap.org/export/embed.html?bbox=${coords.longitude - 0.01},${coords.latitude - 0.01},${coords.longitude + 0.01},${coords.latitude + 0.01}&layer=mapnik&marker=${coords.latitude},${coords.longitude}`}
                allowFullScreen
              />
            </div>
          ) : (
            <div className={`rounded-2xl flex items-center justify-center border-2 border-dashed ${dark ? 'border-[#5a2a35] bg-[#3d1520]' : 'border-gray-200 bg-gray-50'}`} style={{ height: 280 }}>
              <div className="text-center">
                <MapPin size={40} className="mx-auto mb-3 text-gray-300" />
                <p className={`text-base ${muted}`}>Location not available</p>
                <p className="text-sm text-gray-400 mt-1">Allow location access and reload the page</p>
              </div>
            </div>
          )}
          {coords && (
            <button onClick={() => {
              const msg = `📍 My live location: ${mapsLink}`;
              if (contacts.length) contacts.forEach(c => window.open(`sms:${c.phone}?body=${encodeURIComponent(msg)}`, '_blank'));
              else { navigator.clipboard?.writeText(mapsLink); alert('Location copied!'); }
            }}
              className="mt-4 w-full border-2 border-[#E0434F] text-[#E0434F] font-bold py-3.5 rounded-2xl text-base hover:bg-[#FFEBEE] transition-colors">
              📡 Share Live Location
            </button>
          )}
        </Card>
      </div>
    </div>
  );
}
