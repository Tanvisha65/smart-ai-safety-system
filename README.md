# 🛡️ Smart AI Safety System

A **mobile-first PWA** for emergency safety across India — built with React, Node.js, and AI.

![License](https://img.shields.io/badge/license-MIT-blue) ![Stack](https://img.shields.io/badge/stack-React%20%2B%20Node.js-crimson)

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🆘 **SOS Timer** | 5-second countdown with GPS location, SMS to contacts & 112 call |
| 🤖 **AI Safety Assistant** | Situation analysis, step-by-step guidance, helpline suggestions |
| 📞 **Helplines Directory** | One-tap access to all Indian emergency numbers |
| 👥 **Emergency Contacts** | Add up to 5 contacts — auto-SMS on SOS |
| 📝 **Complaint Portals** | NCW, NCPCR, Cybercrime, NHRC & more |
| 📍 **TrackMe** | Share live GPS location via SMS |
| 🌙 **Dark Mode** | Dark wine theme with crimson accents |
| 📱 **PWA** | Installable, works offline |

---

## 🚀 Quick Start

```bash
git clone https://github.com/Tanvisha65/smart-ai-safety-system
cd smart-ai-safety-system
npm install
npm run dev
```

Open **http://localhost:5173**

### Demo Account
| Field | Value |
|-------|-------|
| Phone | `9999999999` |
| Password | `demo123` |

---

## 🛠️ Tech Stack

**Frontend:** React 19 · Vite · Tailwind CSS v4 · Framer Motion · Lucide React · React Router

**Backend:** Node.js · Express 5 · SQLite (node:sqlite) · bcryptjs · JWT

**AI:** Rule-based fallback + optional Gemini API (`AI_API_KEY` env var)

**SMS:** Optional Twilio (`TWILIO_SID`, `TWILIO_TOKEN`, `TWILIO_FROM`) — falls back to `sms:` links

---

## ⚙️ Environment Variables

Create a `.env` file in the root:

```env
PORT=3001
JWT_SECRET=your_secret_here
AI_API_KEY=your_gemini_api_key        # optional
TWILIO_SID=your_twilio_sid            # optional
TWILIO_TOKEN=your_twilio_token        # optional
TWILIO_FROM=+1234567890               # optional
```

---

## 📁 Project Structure

```
├── src/
│   ├── pages/          # All app pages (Dashboard, SOS, AI Help, etc.)
│   ├── components/     # Sidebar, TopBar, etc.
│   ├── context/        # Auth & Theme context
│   └── config/         # Emergency numbers config
├── server/
│   ├── index.js        # Express app entry
│   ├── db.cjs          # SQLite database
│   ├── auth.cjs        # Register / Login / Profile
│   ├── contacts.cjs    # Emergency contacts CRUD
│   ├── sos.cjs         # SOS history
│   └── ai.cjs          # AI assistant route
├── public/             # PWA manifest, service worker
└── index.html
```

---

## 📞 Emergency Numbers (India)

`112` · Police `100` · Fire `101` · Medical `108` · Women `181` · Child `1098` · Cyber `1930`

---

## 📄 License

MIT — free to use, modify and distribute.
