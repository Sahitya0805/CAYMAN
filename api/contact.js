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
    const { name, email, subject, message, source, parentName, childInfo, phone, level, experienceLevel } = req.body || {};

    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email, and message are required.' });
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(String(email).trim())) {
      return res.status(400).json({ error: 'Please provide a valid email address.' });
    }

    const isYouth = source === 'youth' || String(subject || '').toLowerCase().includes('youth academy');

    const submission = {
      source: isYouth ? 'youth' : 'contact',
      timestamp: new Date().toISOString(),
      dateFormatted: new Date().toLocaleString('en-US', { timeZone: 'America/Cayman' }),
      name: String(name).trim().slice(0, 100),
      parentName: parentName ? String(parentName).trim().slice(0, 100) : String(name).trim().slice(0, 100),
      childInfo: childInfo ? String(childInfo).trim().slice(0, 120) : '',
      phone: phone ? String(phone).trim().slice(0, 60) : '',
      email: String(email).trim().slice(0, 120),
      level: level || experienceLevel || '',
      experienceLevel: experienceLevel || level || '',
      subject: String(subject || 'General Enquiry').trim().slice(0, 150),
      message: String(message).trim().slice(0, 3000),
      status: "New / Received"
    };

    // Safely store in backend private store
    addSubmission(submission);

    console.log('[CSK Backend Contact Enquiry Logged]:', submission);

    // Forward to dedicated Google Sheets Webhooks for Youth vs Contact
    const CONTACT_SHEET_WEBHOOK = 'https://script.google.com/macros/s/AKfycbxdrEtosSOUijKfu7X-1a1KxT96iuScxyG5YWwk87xDCukycILrLo28se0GwPouOVUTDw/exec';
    const YOUTH_SHEET_WEBHOOK = 'https://script.google.com/macros/s/AKfycbyETv2XdvX7LimsrXNq0eRaK0RVRU2_nABhKRpofuTN4ec7FWL6dLlSPhNu2qgAPvtUag/exec';
    const webhookUrl = isYouth
      ? (process.env.YOUTH_SHEET_WEBHOOK_URL || YOUTH_SHEET_WEBHOOK)
      : (CONTACT_SHEET_WEBHOOK || process.env.CONTACT_WEBHOOK_URL || process.env.GOOGLE_SHEET_WEBHOOK_URL);

    let sheetSynced = false;
    if (webhookUrl && webhookUrl.startsWith('http')) {
      try {
        const webhookRes = await fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify(submission),
          redirect: 'follow'
        });
        const respText = await webhookRes.text().catch(() => '');
        if (webhookRes.ok && (respText.includes('"status":"ok"') || respText.includes('"result":"success"'))) {
          sheetSynced = true;
        }
      } catch (webhookErr) {
        console.warn('Backend webhook dispatch notice:', webhookErr);
      }
    }

    return res.status(200).json({
      success: true,
      sheetSynced,
      message: 'Enquiry safely received and logged in CSK private database.',
      timestamp: submission.timestamp
    });
  } catch (err) {
    console.error('API /api/contact error:', err);
    return res.status(500).json({ error: 'Internal server error processing enquiry' });
  }
}
