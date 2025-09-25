export const requireRole = (role) => (req, res, next) => {
  if (!req.user) return res.status(401).json({ error: 'Not authenticated' });
  const userRole = req.user.role;
  if (userRole === role || (role === 'admin' && userRole === 'super_admin')) return next();
  return res.status(403).json({ error: 'Insufficient role' });
};
