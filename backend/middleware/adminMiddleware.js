// /backend/middleware/adminMiddleware.js

const adminOnly = (req, res, next) => {
  if (!req.user?.is_admin) {
    return res.status(403).json({ error: 'Admin access only' });
  }
  next();
};

module.exports = adminOnly;
