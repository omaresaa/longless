export const setDefaultLocals = (req, res, next) => {
  res.locals.user = req.session.userId || null;
  res.locals.error = res.locals.error || null;
  res.locals.title = res.locals.title || "Longless";

  next();
};
