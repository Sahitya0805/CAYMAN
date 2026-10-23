// Serverless API Endpoint: /api/contact
// Receives contact-page and youth-academy enquiries and forwards them to
// the club's Google Sheets. Webhook URLs are read from environment
// variables so they are not shipped to browsers.
import { addSubmission } from './contact-store.js';
import { applyCors, rateLimited } from './_lib/security.js';

// Fallbacks keep the forms working until the env vars are set in Vercel.
// These URLs were previously published in the site's JavaScript, so the
// Apps Scripts should be re-deployed (new URLs) and stored only in env vars.
const FALLBACK_CONTACT_WEBHOOK = 'https://script.google.com/macros/s/AKfycbxdrEtosSOUijKfu7X-1a1KxT96iuScxyG5YWwk87xDCukycILrLo28se0GwPouOVUTDw/exec';
const FALLBACK_YOUTH_WEBHOOK = 'https://script.google.com/macros/s/AKfycbyETv2XdvX7LimsrXNq0eRaK0RVRU2_nABhKRpofuTN4ec7FWL6dLlSPhNu2qgAPvtUag/exec';

const EMAIL_RE = /^[^\s@<>()"']{1,64}@[^\s@<>()"']{1,190}\.[a-z]{2,24}$/i;

function clean(v, max) {
  if (v == null) return '';
  if (typeof v !== 'string' && typeof v !== 'number') return '';
  // strip control characters (keep newlines/tabs in messages)
  return String(v).replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '').trim().slice(0, max);
}

export default async function handler(req, res) {
  applyCors(req, res, 'POST, OPTIONS');
  res.setHeader('Cache-Control', 'no-store');

  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST, OPTIONS');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const body = req.body && typeof req.body === 'object' ? req.body : null;
  if (!body) return res.status(400).json({ error: 'Invalid request.' });
  if (JSON.stringify(body).length > 12000) return res.status(413).json({ error: 'Message too long.' });

  // Honeypot: real visitors never fill the hidden "website" field
  if (clean(body.website, 200)) return res.status(200).json({ success: true });

  if (rateLimited(req, { limit: 5, windowMs: 10 * 60 * 1000 })) {
    return res.status(429).json({ error: 'Too many submissions. Please try again in a few minutes.' });
  }

  try {
    const name = clean(body.name, 100);
    const email = clean(body.email, 120);
    const message = clean(body.message, 3000);
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email, and message are required.' });
    }
    if (!EMAIL_RE.test(email)) {
      return res.status(400).json({ error: 'Please provide a valid email address.' });
    }

    const subject = clean(body.subject, 150) || 'General Enquiry';
    const isYouth = body.source === 'youth' || subject.toLowerCase().includes('youth academy');
    const level = clean(body.level || body.experienceLevel, 60);

    const submission = {
      source: isYouth ? 'youth' : 'contact',
      timestamp: new Date().toISOString(),
      dateFormatted: new Date().toLocaleString('en-US', { timeZone: 'America/Cayman' }),
      name,
      parentName: clean(body.parentName, 100) || name,
      childInfo: clean(body.childInfo, 120),
      phone: clean(body.phone, 60),
      email,
      level,
      experienceLevel: level,
      subject,
      message,
      status: 'New / Received'
    };

    addSubmission(submission);
    // Log only non-personal details
    console.log('[CSK enquiry received]', submission.source, submission.timestamp);

    const webhookUrl = isYouth
      ? (process.env.YOUTH_SHEET_WEBHOOK_URL || FALLBACK_YOUTH_WEBHOOK)
      : (process.env.CONTACT_SHEET_WEBHOOK_URL || process.env.CONTACT_WEBHOOK_URL || FALLBACK_CONTACT_WEBHOOK);

    let sheetSynced = false;
    if (/^https:\/\/script\.google\.com\//.test(webhookUrl)) {
      try {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), 8000);
        const webhookRes = await fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify(submission),
          redirect: 'follow',
          signal: controller.signal
        });
        clearTimeout(timer);
        const respText = await webhookRes.text().catch(() => '');
        sheetSynced = webhookRes.ok && (respText.includes('"status":"ok"') || respText.includes('"result":"success"'));
      } catch (_) {
        console.warn('[CSK enquiry] sheet webhook unavailable');
      }
    }

    return res.status(200).json({
      success: true,
      sheetSynced,
      message: 'Enquiry received.',
      timestamp: submission.timestamp
    });
  } catch (err) {
    console.error('API /api/contact error:', err && err.message);
    return res.status(500).json({ error: 'Could not process the enquiry.' });
  }
}
