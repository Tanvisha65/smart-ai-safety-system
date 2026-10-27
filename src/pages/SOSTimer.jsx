import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext.jsx';
import { MapPin, CheckCircle, Circle } from 'lucide-react';

/* ── phase: 'countdown' | 'standby' | 'cancelled' ────────── */
export default function SOSTimer() {
  const { state }       = useLocation();
  const { user, apiHeaders } = useAuth();
  const navigate        = useNavigate();
  const { type = 'Emergency', number = '112', coords } = state || {};

  const [phase, setPhase]       = useState('countdown');
  const [count, setCount]       = useState(5);
  const [silent, setSilent]     = useState(false);
  const [volunteer, setVolunteer] = useState(false);
  const [mapsLink, setMapsLink]  = useState('');
  const [locationStr, setLocationStr] = useState('');
  const [statusItems, setStatusItems] = useState([]);

  const timerRef = useRef(null);

  /* ── Resolve location ──────────────────────────────────── */
  useEffect(() => {
    const resolve = async (lat, lng) => {
      const link = `https://maps.google.com/?q=${lat},${lng}`;
      setMapsLink(link);
      try {
        const r = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`);
        const d = await r.json();
        setLocationStr(d.display_name?.split(',').slice(0, 3).join(', ') || link);
      } catch { setLocationStr(link); }
    };
    if (coords?.latitude) resolve(coords.latitude, coords.longitude);
    else if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        p => resolve(p.coords.latitude, p.coords.longitude),
        () => {}
      );
    }
  }, [coords]);

  /* ── Countdown tick ────────────────────────────────────── */
  useEffect(() => {
    if (phase !== 'countdown') return;
    timerRef.current = setInterval(() => {
      setCount(c => {
        if ('vibrate' in navigator) navigator.vibrate(200);
        if (c <= 1) { clearInterval(timerRef.current); triggerSOS(); return 0; }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [phase]);

  /* ── Trigger SOS ───────────────────────────────────────── */
  const triggerSOS = async () => {
    clearInterval(timerRef.current);
    setPhase('standby');

    const statusSteps = [
      { label: 'Location captured', done: false },
      { label: `Call to ${number} placed`, done: false },
      { label: 'Contacts notified', done: false },
    ];
    setStatusItems(statusSteps);

    // step 1 – location
    await new Promise(r => setTimeout(r, 600));
    setStatusItems(s => s.map((x,i) => i===0 ? { ...x, done:true } : x));

    // save to DB
    try {
      await fetch('/api/sos', {
        method: 'POST', headers: apiHeaders(),
        body: JSON.stringify({
          type, latitude: coords?.latitude ?? null,
          longitude: coords?.longitude ?? null,
          maps_link: mapsLink, silent, volunteer_assist: volunteer
        })
      });
    } catch {}

    // step 2 – call
    await new Promise(r => setTimeout(r, 600));
    setStatusItems(s => s.map((x,i) => i===1 ? { ...x, done:true } : x));
    if (!silent) setTimeout(() => { window.location.href = `tel:${number}`; }, 300);

    // step 3 – SMS contacts
    try {
      const cr = await fetch('/api/contacts', { headers: apiHeaders() });
      const contacts = await cr.json();
      const msg = `🚨 EMERGENCY from ${user?.name}: ${type} emergency.${mapsLink ? ' Location: ' + mapsLink : ' Please help immediately.'}`;
      contacts.forEach(c => window.open(`sms:${c.phone}?body=${encodeURIComponent(msg)}`, '_blank'));
    } catch {}
    await new Promise(r => setTimeout(r, 400));
    setStatusItems(s => s.map((x,i) => i===2 ? { ...x, done:true } : x));
  };

  const handleCancel = () => {
    clearInterval(timerRef.current);
    setPhase('cancelled');
    setTimeout(() => navigate(-1), 1500);
  };

  const handleTap = () => {
    if (phase === 'countdown') { clearInterval(timerRef.current); triggerSOS(); }
  };

  /* ─────────────────────────────────────────────────────── */
  /* COUNTDOWN */
  if (phase === 'countdown') return (
    <div className="fixed inset-0 flex flex-col items-center justify-center"
      style={{ background: 'linear-gradient(160deg,#8E1722,#E0434F)' }}>

      <p className="text-white font-bold text-xl mb-1">Sending Emergency Alert</p>
      <p className="text-red-200 text-sm mb-2">{type} · Call {number}</p>
      <p className="text-red-300 text-xs mb-10">Tap the timer to send immediately</p>

      {/* Big circle + ripple rings */}
      <motion.button onClick={handleTap} className="relative flex items-center justify-center" style={{ width:200, height:200 }}
        aria-label="Tap to send immediately">
        <div className="ripple-ring" />
        <div className="ripple-ring" />
        <div className="ripple-ring" />
        <motion.div
          key={count}
          initial={{ scale: 1.3, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="relative z-10 w-40 h-40 rounded-full bg-white flex items-center justify-center count-beat shadow-2xl">
          <span className="text-7xl font-black text-[#E0434F]">{count}</span>
        </motion.div>
      </motion.button>

      <p className="text-red-200 text-xs mt-8 px-8 text-center leading-relaxed">
        When the timer reaches zero, an SOS will be sent
      </p>

      {locationStr && (
        <div className="flex items-center gap-1.5 mt-4 px-6">
          <MapPin size={12} color="rgba(255,180,188,0.9)" />
          <p className="text-red-300 text-[11px] text-center truncate max-w-xs">{locationStr}</p>
        </div>
      )}

      {/* Toggles */}
      <div className="mt-6 bg-white/10 rounded-2xl px-6 py-4 mx-6 space-y-3">
        {[
          { label: 'Silent Communication', val: silent, set: setSilent },
          { label: 'Require volunteer assistance', val: volunteer, set: setVolunteer },
        ].map(({ label, val, set }) => (
          <label key={label} className="flex items-center justify-between cursor-pointer">
            <span className="text-sm text-white/80">{label}</span>
            <button type="button" onClick={() => set(v => !v)}
              className={`w-11 h-6 rounded-full relative transition-colors ${val ? 'bg-white' : 'bg-white/20'}`}>
              <div className={`w-4 h-4 rounded-full bg-[#E0434F] absolute top-1 transition-all ${val ? 'right-1' : 'left-1'}`} />
            </button>
          </label>
        ))}
      </div>

      {/* Cancel */}
      <motion.button whileTap={{ scale: 0.95 }} onClick={handleCancel}
        className="mt-8 px-12 py-3.5 rounded-full border-2 border-white text-white font-bold text-sm hover:bg-white/10"
        aria-label="Cancel SOS">
        CANCEL
      </motion.button>
    </div>
  );

  /* CANCELLED */
  if (phase === 'cancelled') return (
    <div className="fixed inset-0 flex flex-col items-center justify-center"
      style={{ background: 'linear-gradient(160deg,#8E1722,#E0434F)' }}>
      <motion.div initial={{ scale:0.7,opacity:0 }} animate={{ scale:1,opacity:1 }} className="text-center">
        <div className="text-6xl mb-4">✅</div>
        <p className="text-white text-2xl font-bold">Alert Cancelled</p>
        <p className="text-red-200 mt-2 text-sm">You are safe. Returning…</p>
      </motion.div>
    </div>
  );

  /* STANDBY */
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center px-6"
      style={{ background: 'linear-gradient(160deg,#5a0010,#A3202B)' }}>

      {/* Pulsing SOS circle */}
      <div className="relative flex items-center justify-center mb-8" style={{ width:180,height:180 }}>
        <div className="ripple-ring" />
        <div className="ripple-ring" />
        <div className="w-36 h-36 rounded-full bg-white flex items-center justify-center z-10 shadow-2xl">
          <span className="text-3xl font-black text-[#E0434F]">SOS</span>
        </div>
      </div>

      <p className="text-white font-bold text-xl text-center mb-2">Please standby</p>
      <p className="text-red-200 text-sm text-center mb-8">
        We are currently requesting help.
      </p>

      {/* Status checklist */}
      <div className="bg-white/10 rounded-2xl px-6 py-5 w-full max-w-sm space-y-3">
        {statusItems.map((item, i) => (
          <motion.div key={item.label}
            initial={{ opacity:0, x:-10 }} animate={{ opacity:1, x:0 }}
            transition={{ delay: i*0.2 }}
            className="flex items-center gap-3">
            {item.done
              ? <CheckCircle size={20} color="#4ade80" className="shrink-0" />
              : <Circle size={20} color="rgba(255,255,255,0.4)" className="shrink-0 animate-pulse" />
            }
            <span className={`text-sm ${item.done ? 'text-white' : 'text-white/50'}`}>{item.label}</span>
          </motion.div>
        ))}
      </div>

      {mapsLink && (
        <a href={mapsLink} target="_blank" rel="noopener noreferrer"
          className="mt-5 text-red-300 text-xs underline text-center">
          View location on map
        </a>
      )}

      <div className="flex gap-3 mt-8">
        <motion.button whileTap={{ scale:0.95 }} onClick={() => navigate('/')}
          className="px-6 py-3 bg-white text-[#E0434F] font-bold rounded-full text-sm">
          Back to Home
        </motion.button>
        <motion.button whileTap={{ scale:0.95 }} onClick={() => navigate('/sos-history')}
          className="px-6 py-3 border border-white/40 text-white font-semibold rounded-full text-sm">
          SOS History
        </motion.button>
      </div>
    </div>
  );
}
