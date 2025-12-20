export const ensureAuth = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }

  /*if (req.originalUrl.startsWith('/user')) {
    return res.status(401).json({ message: 'Not authenticated' });
  }*/

  return res.redirect('/');
};