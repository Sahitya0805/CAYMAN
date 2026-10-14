import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
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
