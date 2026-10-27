import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext.jsx';
import { useTheme } from '../context/ThemeContext.jsx';
import { Plus, Trash2, Phone, MessageCircle, Users, Shield } from 'lucide-react';

export function PageHeader() { return null; }

export default function EContact({ onMenuClick }) {
  const { user, apiHeaders } = useAuth();
  const { dark } = useTheme();
  const [contacts, setContacts] = useState([]);
  const [form, setForm] = useState({ name: '', phone: '', relation: '' });
  const [adding, setAdding] = useState(false);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  const load = () => fetch('/api/contacts', { headers: apiHeaders() })
    .then(r => r.ok ? r.json() : []).then(setContacts).catch(() => {});

  useEffect(() => { load(); }, []);

  const addContact = async () => {
    if (!form.name || !form.phone) return setMsg('Name and phone are required');
    setLoading(true);
    try {
      const r = await fetch('/api/contacts', { method: 'POST', headers: apiHeaders(), body: JSON.stringify(form) });
      const data = await r.json();
      if (!r.ok) throw new Error(data.error);
      setContacts(c => [...c, data]);
      setForm({ name: '', phone: '', relation: '' });
      setAdding(false); setMsg('Contact added!');
      setTimeout(() => setMsg(''), 2000);
    } catch (e) { setMsg(e.message); }
    finally { setLoading(false); }
  };

  const del = async (id) => {
    await fetch(`/api/contacts/${id}`, { method: 'DELETE', headers: apiHeaders() });
    setContacts(c => c.filter(x => x.id !== id));
  };

  const importFromPhone = async () => {
    if ('contacts' in navigator && 'ContactsManager' in window) {
      try {
        const imported = await navigator.contacts.select(['name', 'tel'], { multiple: true });
        for (const c of imported) {
          if (contacts.length >= 5) break;
          const name = c.name?.[0] || 'Contact';
          const phone = c.tel?.[0]?.replace(/\D/g, '').slice(-10) || '';
          if (!phone) continue;
          const r = await fetch('/api/contacts', { method: 'POST', headers: apiHeaders(), body: JSON.stringify({ name, phone }) });
          if (r.ok) { const d = await r.json(); setContacts(x => [...x, d]); }
        }
        setMsg('Contacts imported!'); setTimeout(() => setMsg(''), 2000);
      } catch { setMsg('Import cancelled or unsupported'); setTimeout(() => setMsg(''), 3000); setAdding(true); }
    } else { setMsg('Contact Picker not supported. Use manual add.'); setTimeout(() => setMsg(''), 3000); setAdding(true); }
  };

  const inputCls = `w-full px-4 py-3 rounded-xl border text-base outline-none focus:border-[#E0434F] transition-colors
    ${dark ? 'bg-[#4a1c28] border-[#6a2a38] text-white placeholder-gray-500' : 'bg-gray-50 border-gray-200 text-[#2B2B2B]'}`;
  const cardCls = `rounded-3xl shadow-[0_4px_24px_rgba(224,67,79,0.12)] ${dark ? 'bg-[#3d1520]' : 'bg-white'}`;

  return (
    <div className="max-w-5xl mx-auto pb-10">
      {msg && (
        <div className={`mb-6 px-4 py-3 rounded-xl text-sm font-medium ${msg.includes('!') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {msg}
        </div>
      )}

      <div className="lg:grid lg:grid-cols-[1fr_360px] gap-6 space-y-6 lg:space-y-0">

        {/* LEFT: Contacts list */}
        <div className="space-y-5">

          {/* Heading + count */}
          <div className="flex items-center justify-between">
            <h2 className={`text-2xl font-bold ${dark ? 'text-white' : 'text-[#2B2B2B]'}`}>
              My Emergency Contacts
            </h2>
            <span className={`text-sm font-semibold px-3 py-1 rounded-full
              ${dark ? 'bg-[#3d1520] text-red-300' : 'bg-[#FDECEC] text-[#E0434F]'}`}>
              {contacts.length}/5
            </span>
          </div>

          {/* Action buttons */}
          <div className="flex gap-3">
            <motion.button whileTap={{ scale: 0.95 }} onClick={importFromPhone}
              className={`flex-1 flex items-center justify-center gap-2 min-h-12 rounded-2xl border-2 text-base font-semibold
                border-[#E0434F] text-[#E0434F] ${dark ? '' : 'bg-white'} hover:-translate-y-0.5 transition`}>
              <Users size={18} /> Import from Phone
            </motion.button>
            {contacts.length < 5 && (
              <motion.button whileTap={{ scale: 0.95 }} onClick={() => setAdding(a => !a)}
                className="flex-1 flex items-center justify-center gap-2 min-h-12 rounded-2xl gradient-main text-white text-base font-semibold hover:-translate-y-0.5 transition shadow-[0_4px_24px_rgba(224,67,79,0.25)]">
                <Plus size={18} /> Add Manually
              </motion.button>
            )}
          </div>

          {/* Add form (inline) */}
          {adding && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
              className={`${cardCls} p-6 space-y-4`}>
              <p className={`text-[22px] font-semibold ${dark ? 'text-white' : 'text-[#2B2B2B]'}`}>New Contact</p>
              {[
                { k: 'name', ph: 'Full Name', t: 'text' },
                { k: 'phone', ph: 'Phone Number', t: 'tel' },
                { k: 'relation', ph: 'Relation (optional)', t: 'text' }
              ].map(({ k, ph, t }) => (
                <input key={k} type={t} inputMode={t === 'tel' ? 'numeric' : undefined}
                  placeholder={ph} value={form[k]} onChange={e => setForm(f => ({ ...f, [k]: e.target.value }))}
                  maxLength={k === 'phone' ? 10 : undefined} className={inputCls} />
              ))}
              <div className="flex gap-3 pt-1">
                <button onClick={() => setAdding(false)}
                  className={`flex-1 min-h-12 rounded-xl text-base font-semibold ${dark ? 'bg-[#4a1c28] text-gray-300' : 'bg-gray-100 text-gray-600'}`}>
                  Cancel
                </button>
                <button onClick={addContact} disabled={loading}
                  className="flex-1 min-h-12 rounded-xl gradient-main text-white text-base font-semibold disabled:opacity-60">
                  {loading ? 'Adding…' : 'Add Contact'}
                </button>
              </div>
            </motion.div>
          )}

          {/* Contacts cards */}
          {contacts.length === 0 ? (
            <div className={`${cardCls} p-10 flex flex-col items-center justify-center text-center`}>
              <Users size={56} className={`mb-4 ${dark ? 'text-gray-600' : 'text-gray-300'}`} />
              <p className={`text-lg font-semibold ${dark ? 'text-gray-400' : 'text-gray-500'}`}>No emergency contacts yet</p>
              <p className={`text-base mt-1 ${dark ? 'text-gray-600' : 'text-gray-400'}`}>Add up to 5 trusted contacts</p>
            </div>
          ) : (
            <div className="space-y-3">
              {contacts.map(c => (
                <motion.div key={c.id} layout
                  className={`${dark ? 'bg-[#3d1520]' : 'bg-white'} rounded-2xl shadow-[0_4px_24px_rgba(224,67,79,0.12)]
                    flex items-center gap-4 p-4 hover:-translate-y-0.5 hover:shadow-xl transition`}>
                  {/* Avatar */}
                  <div className="w-16 h-16 rounded-full gradient-main flex items-center justify-center text-white text-2xl font-bold shrink-0">
                    {c.name[0].toUpperCase()}
                  </div>
                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className={`text-lg font-semibold truncate ${dark ? 'text-white' : 'text-[#2B2B2B]'}`}>{c.name}</p>
                    <p className={`text-sm truncate ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
                      {c.phone}{c.relation ? ` · ${c.relation}` : ''}
                    </p>
                  </div>
                  {/* Action buttons */}
                  <div className="flex gap-2 shrink-0">
                    <a href={`tel:${c.phone}`} aria-label={`Call ${c.name}`}
                      className="w-11 h-11 rounded-full bg-green-100 flex items-center justify-center hover:bg-green-200 transition">
                      <Phone size={18} color="#16a34a" />
                    </a>
                    <a href={`sms:${c.phone}?body=Hi`} aria-label={`SMS ${c.name}`}
                      className="w-11 h-11 rounded-full bg-blue-100 flex items-center justify-center hover:bg-blue-200 transition">
                      <MessageCircle size={18} color="#2563eb" />
                    </a>
                    <button onClick={() => del(c.id)} aria-label={`Delete ${c.name}`}
                      className="w-11 h-11 rounded-full bg-red-100 flex items-center justify-center hover:bg-red-200 transition">
                      <Trash2 size={18} color="#dc2626" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT: Info card */}
        <div className="space-y-4">
          <div className={`${cardCls} p-6`}>
            {/* Shield icon */}
            <div className="w-14 h-14 rounded-full bg-[#FDECEC] flex items-center justify-center mb-5">
              <Shield size={28} color="#E0434F" />
            </div>

            <h3 className={`text-[22px] font-semibold mb-3 ${dark ? 'text-white' : 'text-[#2B2B2B]'}`}>
              About Emergency Contacts
            </h3>

            <p className={`text-base leading-relaxed mb-4 ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
              Your emergency contacts will receive an SMS with your GPS location every time you trigger an SOS alert. Make sure the numbers are correct and reachable.
            </p>

            <div className={`flex items-center gap-3 px-4 py-3 rounded-2xl border-l-4 border-[#E0434F]
              ${dark ? 'bg-[#4a1c28]' : 'bg-[#FDECEC]'} mb-5`}>
              <div>
                <p className={`text-sm font-semibold ${dark ? 'text-red-300' : 'text-[#E0434F]'}`}>Max 5 Contacts</p>
                <p className={`text-sm mt-0.5 ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
                  You can add up to 5 emergency contacts. Currently using {contacts.length}/5 slots.
                </p>
              </div>
            </div>

            {contacts.length < 5 && (
              <button onClick={() => { setAdding(true); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                className="w-full min-h-12 gradient-main text-white text-base font-semibold rounded-2xl
                  flex items-center justify-center gap-2 hover:-translate-y-0.5 hover:shadow-xl transition
                  shadow-[0_4px_24px_rgba(224,67,79,0.25)]">
                <Plus size={18} /> Add Contact
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Floating FAB — mobile only */}
      {contacts.length < 5 && !adding && (
        <motion.button whileTap={{ scale: 0.9 }}
          onClick={() => setAdding(true)}
          className="lg:hidden fixed bottom-6 right-5 w-14 h-14 rounded-full gradient-main flex items-center justify-center shadow-2xl z-20"
          aria-label="Add contact">
          <Plus size={24} color="white" />
        </motion.button>
      )}
    </div>
  );
}
