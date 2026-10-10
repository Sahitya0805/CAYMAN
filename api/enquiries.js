// Serverless API Endpoint: /api/enquiries
// Dynamically exports all live contact form submissions into CSV or JSON on-the-fly

import { getSubmissions } from './contact-store.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
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
      const filename = `csk_live_enquiries_${new Date().toISOString().slice(0, 10)}.csv`;

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
    return res.status(500).json({ error: 'Failed to retrieve live enquiries' });
  }
}
