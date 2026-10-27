import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext.jsx';
import { useTheme } from '../context/ThemeContext.jsx';
import { Edit2, LogOut, Bell, Heart } from 'lucide-react';

const STATES = [
  'Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Goa',
  'Gujarat','Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala',
  'Madhya Pradesh','Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland',
  'Odisha','Punjab','Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura',
  'Uttar Pradesh','Uttarakhand','West Bengal','Delhi','Jammu & Kashmir',
  'Ladakh','Puducherry'
];

function Row({ label, value, dark }) {
  return (
    <div className={`flex justify-between py-3 border-b last:border-0 ${dark ? 'border-white/5' : 'border-gray-100'}`}>
      <span className="text-sm text-gray-500">{label}</span>
      <span className={`text-base font-semibold ${dark ? 'text-white' : 'text-[#2B2B2B]'}`}>{value || '—'}</span>
    </div>
  );
}

function Toggle({ label, icon: Icon, value, onChange, dark }) {
  return (
    <div className="flex items-center justify-between py-4">
      <div className="flex items-center gap-3">
        <Icon size={20} color="#E0434F" />
        <span className={`text-base font-medium ${dark ? 'text-white' : 'text-[#2B2B2B]'}`}>{label}</span>
      </div>
      <button
        onClick={() => onChange(!value)}
        aria-label={label}
        className={`w-12 h-6 rounded-full relative transition-colors ${value ? '' : 'bg-gray-200'}`}
        style={value ? { background: 'linear-gradient(135deg,#E0434F,#8E1722)' } : {}}
      >
        <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 shadow transition-all ${value ? 'right-0.5' : 'left-0.5'}`} />
      </button>
    </div>
  );
}

export default function Profile({ onMenuClick }) {
  const { user, updateProfile, logout } = useAuth();
  const { dark } = useTheme();
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    if (user) setForm({
      name: user.name, state: user.state || '', dob: user.dob || '',
      gender: user.gender || '', language: user.language || 'English',
      notifications: !!user.notifications, volunteer: !!user.volunteer,
      about_me: user.about_me || ''
    });
  }, [user]);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const save = async () => {
    setSaving(true);
    try {
      await updateProfile({ ...form, notifications: form.notifications ? 1 : 0, volunteer: form.volunteer ? 1 : 0 });
      setEditing(false);
      setMsg('Saved!');
      setTimeout(() => setMsg(''), 2000);
    } catch (e) { setMsg(e.message); }
    finally { setSaving(false); }
  };

  const initials = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U';

  const inputCls = `w-full px-4 py-3 rounded-xl border text-base outline-none focus:border-[#E0434F] transition-colors
    ${dark ? 'bg-[#4a1c28] border-[#6a2a38] text-white placeholder-gray-500'
            : 'bg-gray-50 border-gray-200 text-[#2B2B2B]'}`;

  const cardCls = `rounded-3xl shadow-[0_4px_24px_rgba(224,67,79,0.12)] ${dark ? 'bg-[#3d1520]' : 'bg-white'}`;

  return (
    <div className="max-w-4xl mx-auto pb-10">
      {msg && (
        <div className={`mb-6 px-4 py-3 rounded-xl text-sm font-medium ${msg === 'Saved!' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {msg}
        </div>
      )}

      {/* Profile Hero Card */}
      <div className="rounded-3xl gradient-main h-40 relative overflow-hidden mb-6 flex items-center px-8">
        {/* Decorative bands */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="geo-band" style={{ top: '-15px', transform: 'rotate(-15deg)', opacity: 0.08 }} />
          <div className="geo-band" style={{ top: '50px', transform: 'rotate(20deg)', opacity: 0.08 }} />
        </div>

        {/* Avatar */}
        <div className="w-24 h-24 rounded-full bg-white/25 border-4 border-white/50 flex items-center justify-center text-white text-4xl font-bold shrink-0 z-10">
          {initials}
        </div>

        {/* User info */}
        <div className="ml-6 flex-1 z-10">
          <p className="text-3xl font-bold text-white leading-tight">{user?.name}</p>
          <p className="text-red-200 text-base mt-1">{user?.phone}</p>
          <div className="flex items-center gap-3 mt-1">
            {user?.state && <p className="text-red-300 text-sm">{user.state}</p>}
            {user?.volunteer && (
              <span className="bg-white/20 text-white text-xs font-semibold px-3 py-0.5 rounded-full">
                Volunteer
              </span>
            )}
          </div>
        </div>

        {/* Edit button top-right */}
        <button
          onClick={() => setEditing(e => !e)}
          className="absolute top-4 right-4 z-10 flex items-center gap-2 bg-white text-[#E0434F] font-semibold text-sm px-4 py-2 rounded-full shadow hover:shadow-md transition"
        >
          <Edit2 size={14} />
          {editing ? 'Cancel' : 'Edit'}
        </button>
      </div>

      {/* Two-column layout */}
      <div className="lg:grid lg:grid-cols-2 gap-6 space-y-6 lg:space-y-0">

        {/* LEFT: Personal Information */}
        <div className={`${cardCls} p-6`}>
          <h2 className={`text-[22px] font-semibold mb-5 ${dark ? 'text-white' : 'text-[#2B2B2B]'}`}>
            Personal Information
          </h2>

          {editing ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-500 mb-1 block">Full Name</label>
                  <input value={form.name} onChange={e => set('name', e.target.value)} placeholder="Full Name" className={inputCls} />
                </div>
                <div>
                  <label className="text-sm text-gray-500 mb-1 block">State</label>
                  <select value={form.state} onChange={e => set('state', e.target.value)} className={inputCls}>
                    <option value="">Select State</option>
                    {STATES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-500 mb-1 block">Date of Birth</label>
                  <input type="date" value={form.dob} onChange={e => set('dob', e.target.value)} className={inputCls} />
                </div>
                <div>
                  <label className="text-sm text-gray-500 mb-1 block">Gender</label>
                  <div className="flex gap-2 mt-1">
                    {['Male', 'Female', 'Other'].map(g => (
                      <button key={g} type="button" onClick={() => set('gender', g)}
                        className={`flex-1 py-3 rounded-xl text-sm font-semibold border transition-all
                          ${form.gender === g ? 'gradient-main text-white border-transparent' : dark ? 'border-[#5a2a35] text-gray-300' : 'border-gray-200 text-gray-500'}`}>
                        {g}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div>
                <label className="text-sm text-gray-500 mb-1 block">About Me</label>
                <textarea value={form.about_me} onChange={e => set('about_me', e.target.value)}
                  placeholder="Medical info, allergies, etc." rows={3}
                  className={`${inputCls} resize-none`} />
              </div>
              <button onClick={save} disabled={saving}
                className="w-full gradient-main text-white py-3 rounded-xl font-semibold text-base min-h-12 disabled:opacity-60">
                {saving ? 'Saving…' : 'Save Changes'}
              </button>
            </div>
          ) : (
            <>
              <Row label="Name" value={user?.name} dark={dark} />
              <Row label="Phone" value={user?.phone} dark={dark} />
              <Row label="State" value={user?.state} dark={dark} />
              <Row label="Date of Birth" value={user?.dob} dark={dark} />
              <Row label="Gender" value={user?.gender} dark={dark} />
              {user?.about_me && (
                <div className={`pt-3 mt-1 border-t ${dark ? 'border-white/5' : 'border-gray-100'}`}>
                  <p className="text-sm text-gray-500 mb-1">About Me</p>
                  <p className={`text-base ${dark ? 'text-white' : 'text-[#2B2B2B]'}`}>{user.about_me}</p>
                </div>
              )}
            </>
          )}
        </div>

        {/* RIGHT column */}
        <div className="space-y-6">

          {/* Preferences card */}
          <div className={`${cardCls} p-6`}>
            <h2 className={`text-[22px] font-semibold mb-5 ${dark ? 'text-white' : 'text-[#2B2B2B]'}`}>
              Preferences
            </h2>

            {/* Language chips */}
            <div className="mb-4">
              <p className="text-sm text-gray-500 mb-2">Language</p>
              <div className="grid grid-cols-3 gap-2">
                {['English', 'Hindi', 'Marathi'].map(l => (
                  <button key={l} onClick={() => set('language', l)}
                    className={`py-2.5 rounded-xl text-sm font-semibold border transition-all
                      ${form.language === l ? 'gradient-main text-white border-transparent' : dark ? 'border-[#5a2a35] text-gray-300' : 'border-gray-200 text-gray-500'}`}>
                    {l}
                  </button>
                ))}
              </div>
            </div>

            <div className={`border-t ${dark ? 'border-white/5' : 'border-gray-100'}`}>
              <Toggle label="Notifications" icon={Bell} value={form.notifications} onChange={v => set('notifications', v)} dark={dark} />
              <div className={`border-t ${dark ? 'border-white/5' : 'border-gray-100'}`}>
                <Toggle label="Volunteer Assistance" icon={Heart} value={form.volunteer} onChange={v => set('volunteer', v)} dark={dark} />
              </div>
            </div>

            {(form.language !== user?.language || form.notifications !== !!user?.notifications || form.volunteer !== !!user?.volunteer) && (
              <button onClick={save} disabled={saving}
                className="w-full mt-4 gradient-main text-white py-3 rounded-xl font-semibold text-base min-h-12">
                {saving ? 'Saving…' : 'Save Preferences'}
              </button>
            )}
          </div>

          {/* Logout button */}
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => { logout(); navigate('/login'); }}
            className={`w-full flex items-center gap-3 px-5 py-4 rounded-3xl min-h-12
              ${dark ? 'bg-[#3d1520]' : 'bg-white'} shadow-[0_4px_24px_rgba(224,67,79,0.12)] text-[#E0434F]
              hover:-translate-y-1 hover:shadow-xl transition`}>
            <LogOut size={20} />
            <span className="font-semibold text-base">Logout</span>
          </motion.button>
        </div>
      </div>
    </div>
  );
}
