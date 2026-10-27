import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Thermometer, Droplets, Wind, Sun, Moon, Cloud } from 'lucide-react';

/* Neutral quick-exit page — safe destination from AI chat */
export default function Weather() {
  const navigate = useNavigate();
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const hour = time.getHours();
  const isDay = hour >= 6 && hour < 19;
  const greeting = hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening';

  const bg = isDay
    ? 'linear-gradient(160deg, #56CCF2, #2F80ED)'
    : 'linear-gradient(160deg, #0f0c29, #302b63, #24243e)';

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6"
      style={{ background: bg }}>
      <motion.div initial={{ opacity:0, y:-20 }} animate={{ opacity:1, y:0 }} className="text-center w-full max-w-xs">

        <div className="mb-6">
          <motion.div animate={{ rotate: isDay ? [0, 10, -10, 0] : 0 }} transition={{ repeat:Infinity, duration:6 }}>
            {isDay ? <Sun size={72} className="mx-auto text-yellow-200 mb-3" />
                   : <Moon size={72} className="mx-auto text-blue-200 mb-3" />}
          </motion.div>
          <h1 className="text-white font-bold text-3xl">{greeting}</h1>
          <p className="text-white/70 text-2xl font-mono mt-1">
            {time.toLocaleTimeString('en-IN', { hour:'2-digit', minute:'2-digit' })}
          </p>
          <p className="text-white/50 text-sm mt-1">
            {time.toLocaleDateString('en-IN', { weekday:'long', month:'long', day:'numeric' })}
          </p>
        </div>

        {/* Weather widget */}
        <div className="bg-white/15 backdrop-blur-sm rounded-3xl p-5 mb-8 border border-white/20">
          <p className="text-white/60 text-xs mb-4 flex items-center justify-center gap-1">
            <Cloud size={12} /> Partly Cloudy · India
          </p>
          <div className="flex items-center justify-around text-white">
            {[
              { icon: Thermometer, val:'28°C', label:'Temp' },
              { icon: Droplets,    val:'65%',  label:'Humidity' },
              { icon: Wind,        val:'12 km/h', label:'Wind' },
            ].map(({ icon: Icon, val, label }) => (
              <div key={label} className="text-center">
                <Icon size={22} className="mx-auto mb-1 text-white/80" />
                <p className="font-bold text-lg">{val}</p>
                <p className="text-white/50 text-xs">{label}</p>
              </div>
            ))}
          </div>
        </div>

        <motion.button whileTap={{ scale:0.95 }} onClick={() => navigate('/')}
          className="flex items-center justify-center gap-2 mx-auto bg-white/20 text-white border border-white/30 px-6 py-3 rounded-full font-semibold text-sm hover:bg-white/30 transition-colors"
          aria-label="Back to app">
          <ArrowLeft size={16} /> Back to App
        </motion.button>
      </motion.div>
    </div>
  );
}
