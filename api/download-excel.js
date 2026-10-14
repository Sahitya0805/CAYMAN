import fs from 'fs';
import path from 'path';
import { getSubmissions } from './contact-store.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const format = (req.query.format || '').toLowerCase();
    const isLive = req.query.live === 'true' || format === 'csv';

    // 1. Dynamic Live Export (Always 100% Real-Time from Serverless Datastore)
    if (isLive) {
      const submissions = getSubmissions();
      const headers = [
        "Submission Timestamp (UTC)",
        "Cayman Local Date & Time",
        "Sender Full Name",
        "Sender Email Address",
        "Enquiry Category / Subject",
        "Message Body / Inquiry Details",
        "Follow-up Status",
        "Assigned Official / Committee Member"
      ];

      const csvRows = [headers.join(',')];

      for (const s of submissions) {
        const row = [
          `"${(s.timestamp || '').replace(/"/g, '""')}"`,
          `"${(s.dateFormatted || '').replace(/"/g, '""')}"`,
          `"${(s.name || '').replace(/"/g, '""')}"`,
          `"${(s.email || '').replace(/"/g, '""')}"`,
          `"${(s.subject || '').replace(/"/g, '""')}"`,
          `"${(s.message || '').replace(/"/g, '""').replace(/\r?\n/g, ' ')}"`,
          `"${(s.status || 'New / Received').replace(/"/g, '""')}"`,
          `"${(s.assigned || 'Committee Review').replace(/"/g, '""')}"`
        ];
        csvRows.push(row.join(','));
      }

      const csvContent = csvRows.join('\r\n');
      const filename = `CSK_Live_Enquiries_${new Date().toISOString().slice(0, 10)}.csv`;

      res.setHeader('Content-Type', 'text/csv; charset=utf-8');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');

      return res.status(200).send(csvContent);
    }

    // 2. Static Pre-compiled Excel Workbook (.xlsx)
    const isMaster = req.query.type === 'master' || req.query.all === 'true';
    const filename = isMaster 
      ? 'Cayman_Super_Kings_Complete_Database.xlsx' 
      : 'CSK_Contact_Enquiries_Database.xlsx';

    const filePath = path.join(process.cwd(), 'exports', filename);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: `Excel file ${filename} not found on server.` });
    }

    const fileBuffer = fs.readFileSync(filePath);

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate');

    return res.status(200).send(fileBuffer);
  } catch (error) {
    console.error('Error serving Excel download:', error);
    return res.status(500).json({ error: 'Failed to download Excel file' });
  }
}
