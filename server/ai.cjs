'use strict';
const express = require('express');
const { authenticate } = require('./auth.cjs');

const router = express.Router();

const SAFETY_RULES = [
  { keywords: ['fire', 'aag', 'jalana', 'burn'], category: 'Fire Emergency', helpline: '101', steps: ['Move away from fire immediately', 'Call 101 (Fire)', 'Alert others nearby', 'Use fire extinguisher if safe', 'Do NOT use lift'] },
  { keywords: ['accident', 'crash', 'hurt', 'injury', 'injured', 'blood'], category: 'Medical Emergency', helpline: '108', steps: ['Call 108 (Ambulance)', 'Keep the person still and calm', 'Apply pressure to wounds', 'Do NOT move injured person', 'Stay on call with dispatcher'] },
  { keywords: ['theft', 'steal', 'rob', 'robbery', 'stolen', 'chori'], category: 'Police Emergency', helpline: '100', steps: ['Move to a safe location', 'Call 100 (Police)', 'Do not confront the thief', 'Note description and direction', 'Preserve evidence'] },
  { keywords: ['rape', 'assault', 'harass', 'molest', 'attack', 'unsafe woman'], category: 'Women Safety', helpline: '181', steps: ['Get to a safe public place', 'Call 181 (Women Helpline)', 'Call 112 immediately if in danger', 'Note attacker details', 'File complaint at nearest police station'] },
  { keywords: ['child', 'bachcha', 'missing child', 'abuse child'], category: 'Child Safety', helpline: '1098', steps: ['Call 1098 (Childline)', 'Do not leave child alone', 'Inform local police', 'Note any suspicious persons', 'Report to NCPCR if needed'] },
  { keywords: ['cyber', 'online fraud', 'hack', 'phishing', 'scam', 'blackmail'], category: 'Cyber Crime', helpline: '1930', steps: ['Do NOT pay or transfer money', 'Call 1930 (Cyber Helpline)', 'Report at cybercrime.gov.in', 'Take screenshots as evidence', 'Preserve all communication'] },
  { keywords: ['flood', 'earthquake', 'disaster', 'cyclone', 'tsunami'], category: 'Natural Disaster', helpline: '1078', steps: ['Move to higher ground if flood', 'Call 1078 (Disaster)', 'Follow official evacuation routes', 'Carry emergency kit', 'Stay tuned to official alerts'] },
  { keywords: ['mental', 'suicid', 'depression', 'kiran', 'anxiet'], category: 'Mental Health', helpline: '1800-599-0019', steps: ['Call Kiran: 1800-599-0019 (free)', 'You are not alone', 'Stay in a safe place', 'Talk to a trusted person', 'Avoid being alone right now'] },
];

function ruleBasedResponse(message, language) {
  const lower = message.toLowerCase();
  let matched = null;
  for (const rule of SAFETY_RULES) {
    if (rule.keywords.some(k => lower.includes(k))) {
      matched = rule;
      break;
    }
  }

  if (!matched) {
    return {
      category: 'General Safety',
      helpline: '112',
      response: `I understand you need help. If you are in immediate danger, please press SOS or call 112 now.\n\n**Steps:**\n1. Move to a safe location\n2. Call 112 for any emergency\n3. Alert someone you trust\n4. Stay calm and breathe\n5. Follow instructions from emergency services`,
      buttons: ['Call 112', 'Send SOS']
    };
  }

  const stepsText = matched.steps.map((s, i) => `${i + 1}. ${s}`).join('\n');
  return {
    category: matched.category,
    helpline: matched.helpline,
    response: `**${matched.category}**\n\n${stepsText}\n\n📞 Call **${matched.helpline}** immediately.\n\n⚠️ If in immediate danger, press SOS or call 112 first.`,
    buttons: [`Call ${matched.helpline}`, 'Call 112', 'Send SOS']
  };
}

router.post('/assist', authenticate, async (req, res) => {
  const { message, language } = req.body;
  if (!message) return res.status(400).json({ error: 'Message required' });

  const apiKey = process.env.AI_API_KEY;

  if (apiKey && apiKey.length > 10) {
    try {
      const systemPrompt = `You are a calm safety assistant for India. Classify the situation, give 3-5 short steps, name the right helpline or portal, and say "press SOS or call 112 first" if there is immediate danger. No medical or legal diagnoses. Reply in ${language || 'English'}. Format: Category badge, numbered steps, helpline. Keep responses concise and actionable.`;

      const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=' + apiKey, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: systemPrompt }] },
          contents: [{ parts: [{ text: message }] }]
        })
      });

      if (response.ok) {
        const data = await response.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
        const ruled = ruleBasedResponse(message, language);
        return res.json({
          category: ruled.category,
          helpline: ruled.helpline,
          response: text,
          buttons: ruled.buttons,
          source: 'ai'
        });
      }
    } catch (err) {
      console.error('AI API error:', err.message);
    }
  }

  // Fallback to rule-based
  const result = ruleBasedResponse(message, language);
  res.json({ ...result, source: 'rules' });
});

module.exports = router;
