// Serverless API Endpoint: /api/download-excel  (club administrators only)
// Live CSV export of recent enquiries. Requires CSK_ADMIN_KEY (see /api/enquiries).
import { getSubmissions } from './contact-store.js';
import { applyCors, requireAdmin, csvCell } from './_lib/security.js';

export default async function handler(req, res) {
  applyCors(req, res, 'GET, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
  if (!requireAdmin(req, res)) return;

  const headers = ['Submission Timestamp (UTC)', 'Cayman Local Date & Time', 'Sender Full Name', 'Sender Email Address', 'Phone', 'Enquiry Category / Subject', 'Message Body / Inquiry Details', 'Follow-up Status'];
  const rows = [headers.map(csvCell).join(',')];
  for (const s of getSubmissions()) {
    rows.push([s.timestamp, s.dateFormatted, s.name, s.email, s.phone, s.subject, s.message, s.status || 'New / Received'].map(csvCell).join(','));
  }
  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', `attachment; filename="CSK_Live_Enquiries_${new Date().toISOString().slice(0, 10)}.csv"`);
  return res.status(200).send(rows.join('\r\n'));
}
