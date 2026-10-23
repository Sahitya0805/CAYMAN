// Serverless API Endpoint: /api/matches
// Serves Cayman Super Kings match results built from the official
// Cayman Islands Cricket Association CricClubs records
// (see scripts/build_fixtures_from_cricclubs.py).

import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=120, public');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { season, competition } = req.query || {};

  try {
    const contentDir = path.join(process.cwd(), 'content');
    const filePath = path.join(contentDir, 'fixtures.json');
    if (!fs.existsSync(filePath)) {
      return res.status(200).json({ success: true, matches: [] });
    }

    let fixtures = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    if (season && season !== 'all') {
      fixtures = fixtures.filter(m => m.season === season);
    }
    if (competition && competition !== 'all') {
      fixtures = fixtures.filter(m => m.competition === competition);
    }

    let updatedAt = null;
    const metaPath = path.join(contentDir, 'fixtures-meta.json');
    if (fs.existsSync(metaPath)) {
      updatedAt = JSON.parse(fs.readFileSync(metaPath, 'utf8')).updated_at || null;
    }

    return res.status(200).json({
      success: true,
      source: 'cricclubs_cica',
      portal_url: 'https://cricclubs.com/CaymanCricketAssociation',
      updated_at: updatedAt,
      total_matches: fixtures.length,
      matches: fixtures
    });
  } catch (err) {
    console.error('API /api/matches error:', err);
    return res.status(200).json({ success: false, error: 'Failed to load matches', matches: [] });
  }
}
