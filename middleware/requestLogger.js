import logger from "../utils/logger.js";

export const logRequests = (req, res, next) => {
  const start = Date.now();

  // Log after response finishes
  res.on("finish", () => {
    const duration = Date.now() - start;

    logger.info("HTTP Request", {
      method: req.method,
      path: req.path,
      status: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip,
      userAgent: req.get("user-agent"),
    });
  });

  next();
};
