const pageDefaults = {
  home: { title: "Longless - Home" },
  login: { title: "Longless - Login" },
  register: { title: "Longless - Sign Up" },
  dashboard: { title: "Longless - Dashboard", links: [], totalClicks: 0 },
  notFound: { title: "404 - Page Not Found" },
};

export const setupRender = (req, res, next) => {
  res.renderPage = (template, data = {}) => {
    const defaults = {
      title: "Longless",
      user: req.session.userId
        ? { id: req.session.userId, username: req.session.username }
        : null,
      error: null,
      shortUrl: null,
      ...(pageDefaults[template] || {}),
    };

    res.render(template, { ...defaults, ...data });
  };

  next();
};
