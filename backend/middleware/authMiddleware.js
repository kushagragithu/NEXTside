export const ensureAuth = (req, res, next) => {
  if (req.isAuthenticated && req.isAuthenticated()) {
    return next();
  }

  if (req.xhr || req.headers.accept?.includes("application/json")) {
    return res.status(401).json({ error: "Login required" });
  }

  return res.redirect('/');
};