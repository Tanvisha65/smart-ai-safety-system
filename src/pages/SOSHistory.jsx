import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext.jsx';
import { useTheme } from '../context/ThemeContext.jsx';
import { Clock, MapPin, ExternalLink, AlertTriangle } from 'lucide-react';

const TYPE_COLORS = {
  Police:'#1565C0', Fire:'#E65100', Medical:'#2E7D32', Women:'#6A1B9A',
  Child:'#1565C0', Railway:'#0D47A1', Emergency:'#E0434F', Disaster:'#6D4C41'
};

export default function SOSHistory({ onMenuClick }) {
  const { apiHeaders } = useAuth();
  const { dark } = useTheme();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/sos', { headers: apiHeaders() })
      .then(r => r.ok ? r.json() : [])
      .then(d => { setHistory(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const fmt = str => {
    try { return new Date(str).toLocaleString('en-IN', { dateStyle:'medium', timeStyle:'short' }); }
    catch { return str; }
  };

  const card = dark ? 'bg-[#3d1520]' : 'bg-white';
  const shadow = 'shadow-[0_4px_24px_rgba(224,67,79,0.12)]';
  const statCard = dark ? 'bg-[#3d1520]' : 'bg-white';

  const lastAlert = history.length > 0
    ? fmt(history[history.length - 1]?.created_at)
    : 'N/A';

  return (
    <div className="max-w-4xl mx-auto pb-10">
        <div className={`text-sm mb-6 ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
          {history.length} alert{history.length !== 1 ? 's' : ''} recorded
        </div>

        {/* Stats bar */}
        {!loading && (
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className={`${statCard} rounded-2xl p-4 ${shadow}`}>
              <p className={`text-sm font-medium ${dark ? 'text-gray-400' : 'text-gray-500'}`}>Total Alerts</p>
              <p className={`text-3xl font-bold mt-1 ${dark ? 'text-white' : 'text-[#E0434F]'}`}>{history.length}</p>
            </div>
            <div className={`${statCard} rounded-2xl p-4 ${shadow}`}>
              <p className={`text-sm font-medium ${dark ? 'text-gray-400' : 'text-gray-500'}`}>Last Alert</p>
              <p className={`text-base font-semibold mt-1 ${dark ? 'text-white' : 'text-[#8E1722]'} truncate`}>{lastAlert}</p>
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-24">
            <div className="w-12 h-12 rounded-full border-4 border-[#E0434F] border-t-transparent animate-spin" />
          </div>
        ) : history.length === 0 ? (
          <div className={`${card} rounded-3xl ${shadow} p-12 text-center`}>
            <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-5">
              <AlertTriangle size={40} color="#E0434F" />
            </div>
            <h2 className={`text-xl font-bold mb-2 ${dark ? 'text-white' : 'text-gray-800'}`}>No SOS Alerts Yet</h2>
            <p className={`text-base ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
              Your SOS alert history will appear here once you trigger an alert.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {history.map((item, i) => {
              const color = TYPE_COLORS[item.type] || '#E0434F';
              return (
                <motion.div key={item.id}
                  initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay: i*0.04 }}
                  className={`${card} rounded-2xl ${shadow} p-5 flex gap-4 hover:shadow-lg transition-shadow`}>
                  {/* Colored circle icon */}
                  <div
                    className="w-14 h-14 rounded-full shrink-0 flex items-center justify-center"
                    style={{ background: `${color}18` }}>
                    <AlertTriangle size={26} color={color} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className="font-bold text-lg" style={{ color }}>{item.type}</span>
                      <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${
                        item.status === 'sent'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-500'
                      }`}>
                        {item.status}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 text-sm text-gray-400 mb-1.5">
                      <Clock size={13} />
                      <span>{fmt(item.created_at)}</span>
                    </div>

                    {item.maps_link && (
                      <a href={item.maps_link} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-sm text-[#E0434F] font-medium mb-1.5">
                        <MapPin size={13} /> View Location <ExternalLink size={12} />
                      </a>
                    )}

                    {(item.silent || item.volunteer_assist) && (
                      <div className="flex gap-3 mt-1">
                        {item.silent && (
                          <span className={`text-xs px-2 py-0.5 rounded-full ${dark ? 'bg-white/10 text-gray-300' : 'bg-gray-100 text-gray-500'}`}>
                            Silent
                          </span>
                        )}
                        {item.volunteer_assist && (
                          <span className={`text-xs px-2 py-0.5 rounded-full ${dark ? 'bg-white/10 text-gray-300' : 'bg-gray-100 text-gray-500'}`}>
                            Volunteer
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
    </div>
  );
}
