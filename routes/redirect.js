import express from "express";
import logger from "../utils/logger.js";

import {
  findUrlByShortCode,
  recordClick,
  getClickById,
} from "../config/dbHelpers.js";

const router = express.Router();

// Redirect to the original URL based on the short code
router.get("/:shortCode", (req, res, next) => {
  const { shortCode } = req.params;

  const url = findUrlByShortCode(shortCode);

  if (!url) {
    logger.debug("Redirect failed: Short code not found", { shortCode });
    return next();
  }

  try {
    const clickId = recordClick(
      url.id,
      req.ip,
      req.get("user-agent")
    ).lastInsertRowid;

    const clickData = getClickById(clickId);

    logger.info("Link redirected", {
      shortCode,
      urlId: clickData["url_id"],
      ip: clickData["ip_address"],
    });
    res.redirect(302, url["original_url"]);
  } catch (error) {
    logger.error("Redirect error", {
      error: error.message,
      stack: error.stack,
      shortCode,
      urlId: url["id"],
    });
    res.renderPage("error");
  }
});

export default router;
