// Serverless API Endpoint: /api/enquiries  (club administrators only)
// Requires the CSK_ADMIN_KEY environment variable and an
// "Authorization: Bearer <key>" or "X-Admin-Key: <key>" header.
import { getSubmissions } from './contact-store.js';
import { applyCors, requireAdmin, csvCell } from './_lib/security.js';

export default async function handler(req, res) {
  applyCors(req, res, 'GET, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
  if (!requireAdmin(req, res)) return;

  try {
    const submissions = getSubmissions();
    const format = String(req.query.format || 'json');

    if (format === 'csv' || format === 'excel') {
      const headers = ['Submission Timestamp', 'Cayman Local Time', 'Full Name', 'Email Address', 'Phone', 'Subject / Category', 'Message Body', 'Status'];
      const rows = [headers.map(csvCell).join(',')];
      for (const s of submissions) {
        rows.push([s.timestamp, s.dateFormatted, s.name, s.email, s.phone, s.subject, s.message, s.status || 'Received'].map(csvCell).join(','));
      }
      res.setHeader('Content-Type', 'text/csv; charset=utf-8');
      res.setHeader('Content-Disposition', `attachment; filename="csk_enquiries_${new Date().toISOString().slice(0, 10)}.csv"`);
      return res.status(200).send(rows.join('\r\n'));
    }

    return res.status(200).json({
      success: true,
      total_enquiries: submissions.length,
      note: 'Recent submissions held by this server instance. The Google Sheet is the complete record.',
      enquiries: submissions
    });
  } catch (err) {
    console.error('API /api/enquiries error:', err && err.message);
    return res.status(500).json({ error: 'Failed to retrieve enquiry records' });
  }
}
