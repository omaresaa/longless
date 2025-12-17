export function requireAuth(req, res, next) {
  // Check if the user is authenticated
  if (!req.session.userId) {
    return res.redirect("/login");
  }
  next();
}

export function requireGuest(req, res, next) {
  // Check if the user is a guest
  if (req.session.userId) {
    return res.redirect("/dashboard");
  }
  next();
}
