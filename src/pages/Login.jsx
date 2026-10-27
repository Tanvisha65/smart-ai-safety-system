import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext.jsx';
import { Phone, Lock, Eye, EyeOff, Shield, User, MapPin, Calendar } from 'lucide-react';

const STATES = [
  'Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Goa',
  'Gujarat','Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala',
  'Madhya Pradesh','Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland',
  'Odisha','Punjab','Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura',
  'Uttar Pradesh','Uttarakhand','West Bengal','Delhi','Jammu & Kashmir','Ladakh','Puducherry'
];

function UInput({ icon: Icon, type, placeholder, value, onChange, right, ...rest }) {
  return (
    <div className="flex items-end gap-3 mb-7">
      {Icon && <Icon size={20} className="text-[#E0434F] mb-3 shrink-0" />}
      <div className="flex-1 relative">
        <input type={type} placeholder={placeholder} value={value} onChange={onChange}
          className="input-underline pr-8 text-base" {...rest} />
        {right && <div className="absolute right-0 bottom-3">{right}</div>}
      </div>
    </div>
  );
}

function LoginForm({ onDone }) {
  const { login } = useAuth();
  const [phone, setPhone] = useState('');
  const [pw, setPw]       = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr]       = useState('');

  const submit = async e => {
    e.preventDefault(); setErr(''); setLoading(true);
    try { await login(phone, pw); onDone(); }
    catch (ex) { setErr(ex.message); }
    finally { setLoading(false); }
  };

  return (
    <form onSubmit={submit}>
      {err && <p className="text-[#E0434F] text-sm mb-5 bg-red-50 px-4 py-3 rounded-xl border border-red-200">{err}</p>}

      <UInput icon={Phone} type="tel" inputMode="numeric" placeholder="Phone Number"
        value={phone} onChange={e => setPhone(e.target.value)} required maxLength={10} />
      <UInput icon={Lock} type={showPw ? 'text' : 'password'} placeholder="Password"
        value={pw} onChange={e => setPw(e.target.value)} required
        right={
          <button type="button" onClick={() => setShowPw(s => !s)} aria-label="Toggle password">
            {showPw ? <EyeOff size={18} className="text-gray-400" /> : <Eye size={18} className="text-gray-400" />}
          </button>
        }
      />

      <div className="flex items-center justify-between mb-6">
        <span className="text-sm text-gray-400 cursor-pointer hover:text-[#E0434F] transition-colors">Forgot Password?</span>
        <motion.button whileTap={{ scale: 0.95 }} type="submit" disabled={loading}
          className="gradient-main text-white text-base font-bold px-10 py-3.5 rounded-full shadow-lg disabled:opacity-60 min-w-[160px]">
          {loading ? 'Logging in…' : 'LOGIN'}
        </motion.button>
      </div>

      <button type="button" onClick={() => { setPhone('9999999999'); setPw('demo123'); }}
        className="w-full text-center text-sm text-[#E0434F] font-semibold mb-4 hover:underline py-2">
        Use Demo Account (9999999999 / demo123)
      </button>

      <a href="tel:112" className="flex items-center justify-center gap-2 w-full py-3.5 rounded-full border-2 border-[#E0434F] text-[#E0434F] font-bold text-base hover:bg-[#FFEBEE] transition-colors">
        <Phone size={18} fill="#E0434F" /> Dial 112 — Emergency
      </a>

      <div className="mt-8 text-center">
        <p className="text-sm text-gray-400 mb-4">Or login with</p>
        <div className="flex justify-center gap-4">
          {['Google', 'Facebook'].map(name => (
            <div key={name} className="relative group">
              <button disabled
                className="px-6 py-2.5 rounded-full border border-gray-200 text-sm text-gray-400 flex items-center gap-2 cursor-not-allowed">
                {name === 'Google' ? <span className="font-bold text-blue-500 text-base">G</span>
                                   : <span className="font-bold text-blue-700 text-base">f</span>}
                {name}
              </button>
              <span className="absolute -top-9 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                Coming soon
              </span>
            </div>
          ))}
        </div>
      </div>
    </form>
  );
}

function RegisterForm({ onDone }) {
  const { register } = useAuth();
  const [f, setF] = useState({ name:'', phone:'', password:'', state:'', dob:'', gender:'' });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr]         = useState('');
  const set = (k, v) => setF(x => ({ ...x, [k]: v }));

  const submit = async e => {
    e.preventDefault(); setErr(''); setLoading(true);
    try { await register(f); onDone(); }
    catch (ex) { setErr(ex.message); }
    finally { setLoading(false); }
  };

  const inputCls = 'w-full px-4 py-3 rounded-xl border text-sm outline-none focus:border-[#E0434F] bg-gray-50 border-gray-200 text-[#2B2B2B]';

  return (
    <form onSubmit={submit}>
      {err && <p className="text-[#E0434F] text-sm mb-4 bg-red-50 px-4 py-3 rounded-xl border border-red-200">{err}</p>}
      {/* 2-column grid so it fits without scrolling */}
      <div className="grid grid-cols-2 gap-x-6 gap-y-4 mb-6">
        <div>
          <label className="text-xs text-gray-500 font-medium mb-1 block">Full Name</label>
          <input type="text" placeholder="Jane Doe" value={f.name} onChange={e => set('name', e.target.value)} required className={inputCls} />
        </div>
        <div>
          <label className="text-xs text-gray-500 font-medium mb-1 block">Phone Number</label>
          <input type="tel" inputMode="numeric" placeholder="10 digits" value={f.phone} onChange={e => set('phone', e.target.value)} required maxLength={10} className={inputCls} />
        </div>
        <div className="relative">
          <label className="text-xs text-gray-500 font-medium mb-1 block">Password</label>
          <input type={showPw ? 'text' : 'password'} placeholder="Min 6 chars" value={f.password} onChange={e => set('password', e.target.value)} required className={`${inputCls} pr-10`} />
          <button type="button" onClick={() => setShowPw(s => !s)} className="absolute right-3 top-[34px] text-gray-400">
            {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        <div>
          <label className="text-xs text-gray-500 font-medium mb-1 block">State</label>
          <select value={f.state} onChange={e => set('state', e.target.value)} className={inputCls}>
            <option value="">Select state</option>
            {STATES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label className="text-xs text-gray-500 font-medium mb-1 block">Date of Birth</label>
          <input type="date" value={f.dob} onChange={e => set('dob', e.target.value)} className={inputCls} />
        </div>
        <div>
          <label className="text-xs text-gray-500 font-medium mb-1 block">Gender</label>
          <div className="flex gap-2 mt-1">
            {['Male','Female','Other'].map(g => (
              <button key={g} type="button" onClick={() => set('gender', g)}
                className={`flex-1 py-2.5 rounded-xl text-sm font-medium border transition-all
                  ${f.gender===g ? 'gradient-main text-white border-transparent' : 'border-gray-200 text-gray-500 bg-white'}`}>
                {g}
              </button>
            ))}
          </div>
        </div>
      </div>

      <motion.button whileTap={{ scale: 0.95 }} type="submit" disabled={loading}
        className="w-full gradient-main text-white font-bold py-4 rounded-full shadow-lg text-base disabled:opacity-60">
        {loading ? 'Creating Account…' : 'CREATE ACCOUNT'}
      </motion.button>
    </form>
  );
}

export default function Login() {
  const navigate = useNavigate();
  const [tab, setTab] = useState('login');
  const done = () => navigate('/');

  return (
    <div className="min-h-screen flex items-center justify-center p-6"
      style={{ background: 'linear-gradient(160deg, #4A0F1E 0%, #2A0A14 100%)' }}>

      {/* ── Mobile (stacked) ── */}
      <div className="sm:hidden w-full max-w-sm">
        <div className="gradient-main rounded-t-3xl px-6 pt-10 pb-14 relative overflow-hidden text-center">
          {['-20deg','15deg','-30deg'].map((r,i) => (
            <div key={i} className="geo-band" style={{ top:`${i*40-10}px`, transform:`rotate(${r})` }} />
          ))}
          <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-3 relative z-10">
            <Shield size={30} className="text-white" />
          </div>
          <h1 className="text-white font-bold text-xl relative z-10">Smart AI Safety System</h1>
          <p className="text-red-200 text-sm mt-1 relative z-10">Your safety companion for India</p>
        </div>
        <div className="bg-[#FDECEC] -mt-8 rounded-t-3xl px-5 pt-6 pb-8">
          <div className="flex gap-2 mb-6 bg-white rounded-full p-1 shadow-sm">
            {['login','register'].map(t => (
              <button key={t} onClick={() => setTab(t)}
                className={`flex-1 py-2.5 rounded-full text-sm font-bold transition-all ${tab===t ? 'gradient-main text-white shadow' : 'text-gray-500'}`}>
                {t === 'login' ? 'LOGIN' : 'SIGN UP'}
              </button>
            ))}
          </div>
          <AnimatePresence mode="wait">
            <motion.div key={tab} initial={{ x: tab==='login' ? -16:16, opacity:0 }} animate={{ x:0, opacity:1 }}
              exit={{ x: tab==='login' ? 16:-16, opacity:0 }} transition={{ duration:0.18 }}>
              {tab === 'login' ? <LoginForm onDone={done} /> : <RegisterForm onDone={done} />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* ── Desktop split-panel card ── */}
      <div className="hidden sm:flex w-full max-w-[1000px] rounded-3xl overflow-hidden shadow-[0_32px_80px_rgba(0,0,0,0.5)]" style={{ minHeight: 620 }}>
        {/* Left gradient panel — 42% */}
        <div className="relative flex flex-col items-center justify-center overflow-hidden"
          style={{ width: '42%', background: 'linear-gradient(160deg, #E0434F, #8E1722)' }}>
          {['-20deg','12deg','-35deg','22deg','-10deg','30deg'].map((r, i) => (
            <div key={i} className="geo-band" style={{ top: `${i * 80 - 30}px`, transform: `rotate(${r})` }} />
          ))}
          {/* Badge */}
          <div className="w-24 h-24 rounded-full bg-white/20 border-4 border-white/30 flex items-center justify-center mb-6 relative z-10">
            <Shield size={44} className="text-white" />
          </div>
          <h2 className="text-white font-black text-[32px] text-center leading-tight relative z-10 px-6">
            Smart AI<br />Safety System
          </h2>
          <p className="text-red-200 text-base text-center mt-2 relative z-10 px-8">
            Your safety companion for India
          </p>

          {/* Vertical tabs */}
          <div className="mt-10 flex flex-col gap-3 w-full px-8 relative z-10">
            {[{id:'login',label:'LOGIN'},{id:'register',label:'SIGN UP'}].map(t => (
              <button key={t.id} onClick={() => setTab(t.id)}
                className={`w-full py-4 rounded-2xl text-lg font-bold transition-all ${tab===t.id
                  ? 'bg-white text-[#E0434F] shadow-lg'
                  : 'text-white/70 hover:text-white border-2 border-white/20 hover:border-white/40'}`}>
                {t.label}
              </button>
            ))}
          </div>

          <p className="text-white/30 text-xs absolute bottom-6 text-center px-4 z-10">
            Smart · Secure · Always Ready
          </p>
        </div>

        {/* Right white panel — 58% */}
        <div className="flex-1 bg-white overflow-y-auto" style={{ padding: '56px' }}>
          {/* Icon badge + heading */}
          <div className="flex items-center gap-4 mb-8">
            <div className="w-[72px] h-[72px] rounded-2xl gradient-main flex items-center justify-center shadow-lg">
              {tab === 'login' ? <Lock size={30} className="text-white" /> : <User size={30} className="text-white" />}
            </div>
            <div>
              <h2 className="text-[36px] font-black text-[#E0434F] leading-none">
                {tab === 'login' ? 'LOGIN' : 'SIGN UP'}
              </h2>
              <p className="text-gray-400 text-sm mt-1">
                {tab === 'login' ? 'Welcome back — sign in to continue' : 'Create your safety account'}
              </p>
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div key={tab} initial={{ x: 20, opacity:0 }} animate={{ x:0, opacity:1 }}
              exit={{ x:-20, opacity:0 }} transition={{ duration:0.2 }}>
              {tab === 'login' ? <LoginForm onDone={done} /> : <RegisterForm onDone={done} />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
