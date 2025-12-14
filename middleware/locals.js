export const setDefaultLocals = (req, res, next) => {
  res.locals.user =
    { id: req.session.userId, username: req.session.username } || null;
  res.locals.error = res.locals.error || null;
  res.locals.title = res.locals.title || "Longless";
  res.locals.shortUrl = res.locals.shortUrl || null;

  next();
};
