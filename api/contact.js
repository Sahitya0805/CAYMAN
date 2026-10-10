// Serverless API Endpoint: /api/contact
// Receives contact messages and dispatches notifications

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

    const submission = {
      timestamp: new Date().toISOString(),
      dateFormatted: new Date().toLocaleString('en-US', { timeZone: 'America/Cayman' }),
      name: String(name).trim().slice(0, 100),
      email: String(email).trim().slice(0, 120),
      subject: String(subject || 'General Enquiry').trim().slice(0, 150),
      message: String(message).trim().slice(0, 3000)
    };

    console.log('[CSK Contact Enquiry Received]:', submission);

    // Optional: Forward to external webhook (Google Sheets / Discord / Slack / Web3Forms)
    const webhookUrl = process.env.CONTACT_WEBHOOK_URL;
    if (webhookUrl && webhookUrl.startsWith('http')) {
      try {
        await fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(submission)
        });
      } catch (webhookErr) {
        console.warn('Webhook dispatch warning:', webhookErr);
      }
    }

    return res.status(200).json({
      success: true,
      message: 'Enquiry safely logged and recorded.',
      data: submission
    });
  } catch (err) {
    console.error('API /api/contact error:', err);
    return res.status(500).json({ error: 'Internal server error processing enquiry' });
  }
}
