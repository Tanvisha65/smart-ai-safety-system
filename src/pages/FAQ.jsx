import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext.jsx';
import { ChevronDown, ChevronUp } from 'lucide-react';

const FAQS = [
  { q:'How does the SOS timer work?',
    a:'Tapping any emergency service button starts a 5-second countdown. You can tap the circle to send immediately, or press CANCEL to abort. At zero, your GPS location is saved, emergency contacts get an SMS, and the phone dialer opens.' },
  { q:'How do I add emergency contacts?',
    a:'Go to E-Contact from the sidebar. Add up to 5 contacts manually or import from your phone (Contact Picker API — supported on Android Chrome). These contacts receive an SMS every time you trigger SOS.' },
  { q:'Will SMS be sent automatically?',
    a:"On a web app, SMS is triggered via sms: links that open your phone's SMS app — you tap Send manually. For automatic background SMS, configure the Twilio environment variables (TWILIO_SID, TWILIO_TOKEN, TWILIO_FROM) on the server." },
  { q:'How does AI Help work?',
    a:"Describe your situation by text or voice. The AI classifies it, gives 3–5 action steps, and suggests the right helpline. If AI_API_KEY isn't set, a smart rule-based system handles the response. No medical or legal diagnoses." },
  { q:'Is my location data shared?',
    a:'Location is only accessed when you open the app (for the dashboard bar) or trigger SOS. It is never stored without your action. The Maps link is only sent to your manually added emergency contacts.' },
  { q:'Complaint portal vs. FIR — what is the difference?',
    a:'A complaint to NCW, NHRC, or NCPCR is a civil rights complaint — it does NOT equal an FIR. For criminal action, also file an FIR at your local police station.' },
  { q:'Can I use this offline?',
    a:'The app caches itself as a PWA (service worker). Helplines directory and emergency numbers are available offline. SOS history and AI chat require an internet connection.' },
  { q:'What is the demo account?',
    a:'Phone: 9999999999 · Password: demo123. This pre-seeded account lets you explore all features without registering.' },
  { q:'How do I file a cybercrime complaint?',
    a:"Go to Register Complaint → Cyber. Report at cybercrime.gov.in or call 1930. Screenshot all evidence before filing. Do NOT pay scammers." },
  { q:'What is TrackMe?',
    a:"TrackMe shares your current GPS location as a Google Maps link — via SMS to all your emergency contacts, or copied to clipboard if you have none." },
];

export default function FAQ({ onMenuClick }) {
  const { dark } = useTheme();
  const [open, setOpen] = useState(null);

  const card   = dark ? 'bg-[#3d1520]' : 'bg-white';
  const shadow  = 'shadow-[0_4px_24px_rgba(224,67,79,0.12)]';

  return (
    <div className="max-w-3xl mx-auto pb-10">

        {/* subtitle */}
        <div className="mb-5">
          <p className={`text-base mt-1 ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
            {FAQS.length} frequently asked questions
          </p>
        </div>

        {/* FAQ cards */}
        <div className="space-y-3">
          {FAQS.map((faq, i) => (
            <div key={i} className={`${card} rounded-2xl ${shadow} overflow-hidden`}>
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between px-5 py-4 text-left gap-3"
                aria-expanded={open === i}>
                <span className={`font-semibold text-base leading-snug ${dark ? 'text-white' : 'text-gray-800'}`}>
                  {faq.q}
                </span>
                {open === i
                  ? <ChevronUp size={20} color="#E0434F" className="shrink-0" />
                  : <ChevronDown size={20} className="text-gray-400 shrink-0" />}
              </button>
              <AnimatePresence>
                {open === i && (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: 'auto' }}
                    exit={{ height: 0 }}
                    className="overflow-hidden">
                    <p className={`px-5 pb-5 text-base leading-relaxed ${dark ? 'text-gray-300' : 'text-gray-600'}`}>
                      {faq.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

    </div>
  );
}
