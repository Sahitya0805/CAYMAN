// Serverless API Endpoint: /api/enquiries
// STRICTLY RESTRICTED TO CSK CLUB ADMINISTRATORS

import { getSubmissions } from './contact-store.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type, X-Admin-Key');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Security Verification: Admin Secret configured in server environment or default admin key
  const ADMIN_SECRET = process.env.CSK_ADMIN_KEY || process.env.ADMIN_SECRET || 'CSK_ADMIN_2026';


  const authHeader = req.headers['authorization'] || '';
  const bearerToken = authHeader.replace(/^Bearer\s+/i, '').trim();
  const queryKey = req.query.key || req.query.secret || '';
  const customHeader = req.headers['x-admin-key'] || '';

  const isAuthorized = (
    (bearerToken && bearerToken === ADMIN_SECRET) ||
    (queryKey && queryKey === ADMIN_SECRET) ||
    (customHeader && customHeader === ADMIN_SECRET)
  );

  if (!isAuthorized) {
    return res.status(401).json({
      error: 'Unauthorized access. Confidential enquiry records are strictly restricted to CSK Club Administrators.',
      status: 401
    });
  }

  try {
    const submissions = getSubmissions();
    const format = req.query.format || 'json';

    if (format === 'csv' || format === 'excel') {
      const headers = [
        "Submission Timestamp",
        "Cayman Local Time",
        "Full Name",
        "Email Address",
        "Subject / Category",
        "Message Body",
        "Status"
      ];

      const csvRows = [headers.join(',')];

      for (const s of submissions) {
        const row = [
          `"${(s.timestamp || '').replace(/"/g, '""')}"`,
          `"${(s.dateFormatted || '').replace(/"/g, '""')}"`,
          `"${(s.name || '').replace(/"/g, '""')}"`,
          `"${(s.email || '').replace(/"/g, '""')}"`,
          `"${(s.subject || '').replace(/"/g, '""')}"`,
          `"${(s.message || '').replace(/"/g, '""').replace(/\n/g, ' ')}"`,
          `"${(s.status || 'Received').replace(/"/g, '""')}"`
        ];
        csvRows.push(row.join(','));
      }

      const csvString = csvRows.join('\n');
      const filename = `csk_admin_enquiries_${new Date().toISOString().slice(0, 10)}.csv`;

      res.setHeader('Content-Type', 'text/csv; charset=utf-8');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      return res.status(200).send(csvString);
    }

    return res.status(200).json({
      success: true,
      total_enquiries: submissions.length,
      updated_at: new Date().toISOString(),
      enquiries: submissions
    });
  } catch (err) {
    console.error('API /api/enquiries error:', err);
    return res.status(500).json({ error: 'Failed to retrieve enquiry records' });
  }
}
