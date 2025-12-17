import { getUserLinks, getLinkClickCount } from "../config/dbHelpers.js";

const pageDefaults = {
  home: { title: "Longless - Home" },
  login: { title: "Longless - Login" },
  register: { title: "Longless - Sign Up" },
  dashboard: { title: "Longless - Dashboard" },
  notFound: { title: "404 - Page Not Found" },
};

export const setupRender = (req, res, next) => {
  res.renderPage = (template, data = {}) => {
    const defaults = {
      title: "Longless",
      baseUrl: `${req.protocol}://${req.get("host")}`,
      user: req.session.userId
        ? { id: req.session.userId, username: req.session.username }
        : null,
      error: null,
      shortUrl: null,
      ...(pageDefaults[template] || {}),
    };

    if (template === "dashboard" && req.session.userId) {
      const links = getUserLinks(req.session.userId);

      const linksWithClicks = links.map((link) => ({
        ...link,
        clicks: getLinkClickCount(link.id),
      }));

      const totalClicks = linksWithClicks.reduce(
        (sum, link) => sum + link.clicks,
        0
      );

      defaults.links = linksWithClicks;
      defaults.totalClicks = totalClicks;
      defaults.averageClicks =
        linksWithClicks.length > 0
          ? Math.round(totalClicks / linksWithClicks.length)
          : 0;
    }
    res.render(template, { ...defaults, ...data });
  };

  next();
};
