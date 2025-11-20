export function checkAPIKey(req, res, next) {
  if (!process.env.API_SECRET) {
    return res.status(500).json({ error: 'API secret not configured' });
  }

  const token = req.headers['x-api-key'];
  if (token === process.env.API_SECRET) {
    return next();
  }

  return res.status(401).json({ error: 'unauthorized' });
}