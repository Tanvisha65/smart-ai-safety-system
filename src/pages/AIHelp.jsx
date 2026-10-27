import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext.jsx';
import { useTheme } from '../context/ThemeContext.jsx';
import { Menu, Send, Mic, MicOff, Wind, Phone, AlertTriangle, MessageCircle, FileText } from 'lucide-react';

const QUICK_PROMPTS = [
  'Fire emergency','Someone following me','Cyber fraud',
  'Need medical help','Feeling unsafe','Road accident',
];

const QUICK_ACTIONS = [
  { label:'Call 112',            icon:Phone,        action:'call' },
  { label:'Send SOS',            icon:AlertTriangle, action:'sos' },
  { label:'Open complaint portal',icon:FileText,    action:'portal' },
  { label:'Open full chat',      icon:MessageCircle, action:'chat' },
];

function Bubble({ msg, dark }) {
  const isUser = msg.role === 'user';
  return (
    <motion.div initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      {!isUser && (
        <div className="w-9 h-9 rounded-full gradient-main flex items-center justify-center text-white text-xs font-bold mr-3 shrink-0 self-end">
          AI
        </div>
      )}
      <div style={{ maxWidth:'70%' }}>
        {!isUser && msg.category && (
          <span className="inline-block text-xs px-3 py-1 rounded-full mb-2 text-white font-semibold gradient-main">
            {msg.category}
          </span>
        )}
        <div className={`px-5 py-3.5 rounded-2xl text-base leading-relaxed whitespace-pre-wrap
          ${isUser
            ? 'gradient-main text-white rounded-tr-sm'
            : dark ? 'bg-[#3d1520] text-gray-200 rounded-tl-sm shadow-sm'
                   : 'bg-white text-[#2B2B2B] rounded-tl-sm shadow-sm'}`}>
          {msg.content}
        </div>
        {!isUser && msg.buttons?.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {msg.buttons.map(b => (
              <motion.button key={b} whileTap={{ scale:0.93 }}
                onClick={() => { if (b.startsWith('Call')) window.location.href = `tel:${b.replace('Call ','')}` }}
                className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold border border-[#E0434F] text-[#E0434F] bg-white hover:bg-[#FFEBEE] transition-colors">
                {b.startsWith('Call') && <Phone size={12} />}
                {b}
              </motion.button>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default function AIHelp() {
  const { user, apiHeaders } = useAuth();
  const { dark } = useTheme();
  const navigate = useNavigate();
  const locationState = useLocation().state;

  const [messages, setMessages] = useState([{
    role:'assistant',
    content:`Hello ${user?.name||'there'}! 👋\n\nI'm your AI Safety Assistant. Describe your situation and I'll guide you step-by-step.\n\n⚠️ If you are in immediate danger, press SOS or call 112 right now.`,
    category:'Welcome'
  }]);
  const [input, setInput]         = useState('');
  const [loading, setLoading]     = useState(false);
  const [listening, setListening] = useState(false);
  const recogRef  = useRef(null);
  const bottomRef = useRef(null);
  const sentInit  = useRef(false);

  useEffect(() => {
    if (locationState?.message && !sentInit.current) {
      sentInit.current = true;
      sendMsg(locationState.message);
    }
  }, []);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior:'smooth' }); }, [messages]);

  const sendMsg = async (text) => {
    const msg = (text ?? input).trim();
    if (!msg) return;
    setInput('');
    setMessages(m => [...m, { role:'user', content:msg }]);
    setLoading(true);
    try {
      const r = await fetch('/api/ai/assist', {
        method:'POST', headers:apiHeaders(),
        body:JSON.stringify({ message:msg, language:user?.language||'English' })
      });
      const d = await r.json();
      setMessages(m => [...m, { role:'assistant', content:d.response, category:d.category, buttons:d.buttons }]);
    } catch {
      setMessages(m => [...m, { role:'assistant', content:'Sorry, could not process. Call 112 if emergency.' }]);
    }
    setLoading(false);
  };

  const handleMic = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return alert('Speech recognition not supported');
    if (listening) { recogRef.current?.stop(); setListening(false); return; }
    const r = new SR();
    r.lang = user?.language==='Hindi' ? 'hi-IN' : user?.language==='Marathi' ? 'mr-IN' : 'en-IN';
    r.onresult = e => { setInput(e.results[0][0].transcript); setListening(false); };
    r.onerror = r.onend = () => setListening(false);
    recogRef.current = r; r.start(); setListening(true);
  };

  const bg   = dark ? 'bg-[#2A0F14]' : 'bg-[#FDECEC]';
  const card  = dark ? 'bg-[#3d1520]' : 'bg-white';

  return (
    <div className={`${bg} h-full min-h-[calc(100vh-72px)]`}>
      <div className="flex gap-6 h-full" style={{ minHeight: 'calc(100vh - 72px - 80px)' }}>
        {/* ── Chat panel ─────────────────────────────────── */}
        <div className={`flex-1 ${card} rounded-3xl shadow-lg flex flex-col overflow-hidden`} style={{ minHeight: 600 }}>
          {/* Quick Exit */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <div>
              <p className="font-bold text-base text-[#E0434F]">AI Safety Assistant</p>
              <p className="text-sm text-gray-400">Rule-based · AI when key set</p>
            </div>
            <motion.button whileTap={{ scale:0.9 }} onClick={() => navigate('/weather')}
              className="flex items-center gap-2 bg-gray-100 text-gray-600 text-sm font-semibold px-4 py-2.5 rounded-full hover:bg-gray-200 transition-colors"
              aria-label="Quick exit">
              <Wind size={14} /> Quick Exit
            </motion.button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-6 py-5">
            {messages.map((msg, i) => <Bubble key={i} msg={msg} dark={dark} />)}
            {loading && (
              <div className="flex items-end gap-3 mb-4">
                <div className="w-9 h-9 rounded-full gradient-main flex items-center justify-center text-white text-xs font-bold shrink-0">AI</div>
                <div className={`px-5 py-3.5 rounded-2xl rounded-tl-sm ${dark ? 'bg-[#3d1520]' : 'bg-white'} shadow-sm`}>
                  <div className="flex gap-1.5">
                    {[0,1,2].map(i => (
                      <div key={i} className="w-2.5 h-2.5 rounded-full bg-[#E0434F] animate-bounce"
                        style={{ animationDelay:`${i*0.15}s` }} />
                    ))}
                  </div>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Quick prompts */}
          <div className="flex gap-2 px-6 pb-3 overflow-x-auto">
            {QUICK_PROMPTS.map(p => (
              <button key={p} onClick={() => sendMsg(p)}
                className={`whitespace-nowrap text-sm px-4 py-2 rounded-full border shrink-0 font-medium
                  ${dark ? 'border-[#5a2a35] text-gray-300 bg-[#3d1520]' : 'border-[#FFB3BA] text-[#E0434F] bg-white'}`}>
                {p}
              </button>
            ))}
          </div>

          {/* Input */}
          <div className={`px-6 pb-6 pt-2 border-t ${dark ? 'border-white/10' : 'border-gray-100'}`}>
            <div className={`flex items-end gap-3 rounded-2xl border-2 border-[#E0434F]/20 px-4 py-2
              ${dark ? 'bg-[#3d1520]' : 'bg-gray-50'}`}>
              <textarea value={input} onChange={e => setInput(e.target.value)}
                onKeyDown={e => { if (e.key==='Enter' && !e.shiftKey) { e.preventDefault(); sendMsg(); } }}
                placeholder="Describe your situation…" rows={1}
                className={`flex-1 py-3 text-base bg-transparent outline-none resize-none ${dark ? 'text-white placeholder-gray-500' : 'text-[#2B2B2B] placeholder-gray-400'}`}
                style={{ maxHeight:120 }}
              />
              <motion.button whileTap={{ scale:0.85 }} onClick={handleMic}
                className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${listening ? 'bg-[#E0434F]' : dark ? 'bg-[#4a1c28]' : 'bg-[#FFEBEE]'}`}
                aria-label="Voice input">
                {listening ? <MicOff size={18} color="white" /> : <Mic size={18} color="#E0434F" />}
              </motion.button>
              <motion.button whileTap={{ scale:0.85 }} onClick={() => sendMsg()}
                disabled={loading || !input.trim()}
                className="w-11 h-11 rounded-xl gradient-main flex items-center justify-center shrink-0 disabled:opacity-40"
                aria-label="Send">
                <Send size={16} color="white" />
              </motion.button>
            </div>
            <p className="text-xs text-gray-400 text-center mt-2">Not a substitute for professional help. Call 112 in emergencies.</p>
          </div>
        </div>

        {/* ── Right panel: quick actions ──────────────────── */}
        <div className="hidden lg:flex flex-col gap-4 w-64 shrink-0">
          <div className={`${card} rounded-3xl shadow-lg p-5`}>
            <p className="font-bold text-base text-[#E0434F] mb-4">Quick Actions</p>
            <div className="space-y-3">
              {QUICK_ACTIONS.map(({ label, icon: Icon, action }) => (
                <motion.button key={label} whileTap={{ scale:0.95 }}
                  onClick={() => {
                    if (action==='call') window.location.href = 'tel:112';
                    else if (action==='sos') navigate('/sos-timer', { state: { type:'Emergency', number:'112' } });
                    else if (action==='portal') navigate('/complaints');
                    else navigate('/ai-help');
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl bg-[#FFEBEE] text-[#E0434F] font-semibold text-sm hover:bg-red-100 transition-colors">
                  <div className="w-8 h-8 rounded-lg gradient-main flex items-center justify-center shrink-0">
                    <Icon size={16} color="white" />
                  </div>
                  {label}
                </motion.button>
              ))}
            </div>
          </div>

          <div className={`${card} rounded-3xl shadow-lg p-5`}>
            <p className="font-bold text-base text-[#E0434F] mb-3">How It Works</p>
            <ol className="space-y-3">
              {['Describe your situation in text or voice','AI classifies and gives action steps','Tap a quick action or call the helpline'].map((s,i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full gradient-main flex items-center justify-center text-white text-xs font-bold shrink-0 mt-0.5">{i+1}</span>
                  <p className="text-sm text-gray-600 leading-snug">{s}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
