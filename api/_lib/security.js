// Shared helpers for the serverless API.
// Files in /api/_lib are not exposed as endpoints by Vercel.
import crypto from 'crypto';

const SITE_ORIGINS = [
  'https://caymansuperkings.com',
  'https://www.caymansuperkings.com'
];

/** Allow our own site (and Vercel preview deployments) to call the API. */
export function applyCors(req, res, methods) {
  const origin = req.headers.origin || '';
  const allowed =
    SITE_ORIGINS.includes(origin) ||
    /^https:\/\/[a-z0-9-]+\.vercel\.app$/i.test(origin) ||
    (process.env.ALLOWED_ORIGIN && origin === process.env.ALLOWED_ORIGIN);
  if (allowed) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
  }
  res.setHeader('Access-Control-Allow-Methods', methods);
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Admin-Key');
  res.setHeader('X-Content-Type-Options', 'nosniff');
}

/**
 * Admin check. The key must come from the CSK_ADMIN_KEY environment
 * variable (set it in Vercel → Project → Settings → Environment Variables).
 * There is deliberately no fallback key, and keys are only accepted in
 * headers (never in the URL, where they end up in logs and history).
 */
export function requireAdmin(req, res) {
  const secret = process.env.CSK_ADMIN_KEY || '';
  if (secret.length < 16) {
    res.status(503).json({ error: 'Admin access is not configured on this server.' });
    return false;
  }
  const bearer = String(req.headers['authorization'] || '').replace(/^Bearer\s+/i, '').trim();
  const header = String(req.headers['x-admin-key'] || '').trim();
  const supplied = bearer || header;
  if (!supplied || !safeEqual(supplied, secret)) {
    res.setHeader('Cache-Control', 'no-store');
    res.status(401).json({ error: 'Unauthorized.' });
    return false;
  }
  res.setHeader('Cache-Control', 'no-store');
  return true;
}

function safeEqual(a, b) {
  const ha = crypto.createHash('sha256').update(a).digest();
  const hb = crypto.createHash('sha256').update(b).digest();
  return crypto.timingSafeEqual(ha, hb);
}

/* Simple per-instance rate limiter (best effort on serverless). */
const hits = new Map();
export function rateLimited(req, { limit = 5, windowMs = 10 * 60 * 1000 } = {}) {
  const ip = String(req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown').split(',')[0].trim();
  const now = Date.now();
  const list = (hits.get(ip) || []).filter(t => now - t < windowMs);
  list.push(now);
  hits.set(ip, list);
  if (hits.size > 5000) hits.clear();
  return list.length > limit;
}

/** Escape a value for CSV and neutralise spreadsheet formula injection. */
export function csvCell(v) {
  let s = String(v == null ? '' : v).replace(/\r?\n/g, ' ');
  if (/^[=+\-@\t\r]/.test(s)) s = "'" + s;
  return `"${s.replace(/"/g, '""')}"`;
}
