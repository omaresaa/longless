import express from "express";
import logger from "../utils/logger.js";

import { requireAuth } from "../middleware/auth.js";
import {
  createUrl,
  deleteUserLinkById,
  getLinkById,
} from "../config/dbHelpers.js";
import { generateShortCode, isValidUrl } from "../utils/helpers.js";

const router = express.Router();

// POST /:page/shorten
router.post("/:page/shorten", requireAuth, (req, res) => {
  const { originalUrl } = req.body;
  const page = req.params.page;

  if (!originalUrl) {
    logger.debug("Link creation failed: No URL provided", {
      userId: req.session.userId,
    });
    return res.renderPage(page, {
      error: "Please provide a URL to shorten.",
    });
  }

  if (!isValidUrl(originalUrl)) {
    logger.warn("Link creation failed: Invalid URL", {
      userId: req.session.userId,
      originalUrl,
    });
    return res.renderPage(page, {
      error: "Please enter a valid URL.",
    });
  }

  try {
    const shortCode = generateShortCode();
    createUrl(req.session.userId, shortCode, originalUrl);
    logger.info("Link created", {
      userId: req.session.userId,
      shortCode,
      originalUrl,
    });

    res.renderPage(page, {
      shortUrl: `${req.protocol}://${req.get("host")}/${shortCode}`,
    });
  } catch (error) {
    logger.error("Link creation error", {
      error: error.message,
      stack: error.stack,
      userId: req.session.userId,
      originalUrl,
    });
    res.renderPage(page, {
      error: "Something went wrong. Please try again.",
    });
  }
});

// GET /dashboard
router.get("/dashboard", requireAuth, (req, res) => {
  res.renderPage("dashboard");
});

// POST /links/:id/delete
router.post("/links/:id/delete", requireAuth, (req, res) => {
  const linkId = req.params.id;
  const link = getLinkById(linkId);

  if (!link) {
    logger.warn("Delete failed: Link not found", {
      linkId,
      userId: req.session.userId,
    });
    res.renderPage("dashboard");
  }

  if (link["user_id"] !== req.session.userId) {
    logger.warn("Delete failed: Unauthorized attempt", {
      linkId,
      userId: req.session.userId,
      linkOwnerId: link["user_id"],
    });
    res.renderPage("dashboard");
  }

  try {
    deleteUserLinkById(linkId, req.session.userId);
    logger.info("Link deleted", {
      linkId,
      userId: req.session.userId,
      shortCode: link["short_code"],
    });
    res.renderPage("dashboard");
  } catch (error) {
    logger.error("Delete link error", {
      error: error.message,
      stack: error.stack,
      linkId,
      userId: req.session.userId,
    });
    res.renderPage("error");
  }
});

export default router;
