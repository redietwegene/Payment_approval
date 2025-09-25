import jwt from 'jsonwebtoken';

export default (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: 'Missing authorization header' });

  const parts = auth.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') return res.status(401).json({ error: 'Invalid authorization header' });

  try {
    const payload = jwt.verify(parts[1], process.env.JWT_SECRET || 'dev-secret');
    req.user = payload;
    next();
  } catch (err) { return res.status(401).json({ error: 'Invalid token' }); }
};
