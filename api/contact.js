import { addSubmission } from './contact-store.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name, email, subject, message } = req.body || {};

    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email, and message are required.' });
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(String(email).trim())) {
      return res.status(400).json({ error: 'Please provide a valid email address.' });
    }

    const submission = {
      timestamp: new Date().toISOString(),
      dateFormatted: new Date().toLocaleString('en-US', { timeZone: 'America/Cayman' }),
      name: String(name).trim().slice(0, 100),
      email: String(email).trim().slice(0, 120),
      subject: String(subject || 'General Enquiry').trim().slice(0, 150),
      message: String(message).trim().slice(0, 3000),
      status: "New / Received"
    };

    // Safely store in backend private store
    addSubmission(submission);

    console.log('[CSK Backend Contact Enquiry Logged]:', submission);

    // Forward to secure backend webhook (Google Sheets / Discord / Slack / Email) if configured
    const DEFAULT_SHEET_WEBHOOK = 'https://script.google.com/macros/s/AKfycbxS5Xi-KXNqrsbSd2BFfB28LmbhPMioPz59lxcp1DEZX5mAyn-If8lIjuiEedpAgaoDEg/exec';
    const webhookUrl = process.env.CONTACT_WEBHOOK_URL || process.env.GOOGLE_SHEET_WEBHOOK_URL || DEFAULT_SHEET_WEBHOOK;
    if (webhookUrl && webhookUrl.startsWith('http')) {
      try {
        await fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify(submission),
          redirect: 'follow'
        });
      } catch (webhookErr) {
        console.warn('Backend webhook dispatch notice:', webhookErr);
      }
    }

    return res.status(200).json({
      success: true,
      message: 'Enquiry safely received and logged in CSK private database.',
      timestamp: submission.timestamp
    });
  } catch (err) {
    console.error('API /api/contact error:', err);
    return res.status(500).json({ error: 'Internal server error processing enquiry' });
  }
}
