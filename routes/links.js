import express from "express";

import { requireAuth } from "../middleware/auth.js";
import { createUrl } from "../config/dbHelpers.js";
import { generateShortCode, isValidUrl } from "../utils/helpers.js";

const router = express.Router();

// POST /:page/shorten
router.post("/:page/shorten", requireAuth, (req, res) => {
  const { originalUrl } = req.body;
  const page = req.params.page;

  if (!originalUrl) {
    return res.renderPage(page, {
      error: "Please provide a URL to shorten.",
    });
  }

  if (!isValidUrl(originalUrl)) {
    return res.renderPage(page, {
      error: "Please enter a valid URL.",
    });
  }

  try {
    const shortCode = generateShortCode();
    createUrl(req.session.userId, shortCode, originalUrl);

    res.renderPage(page, {
      shortUrl: `${req.protocol}://${req.get("host")}/${shortCode}`,
    });
  } catch (error) {
    console.error("Error creating short URL:", err);
    res.renderPage(page, {
      error: "Something went wrong. Please try again.",
    });
  }
});

// GET /dashboard
router.get("/dashboard", requireAuth, (req, res) => {
  res.renderPage("dashboard");
});

export default router;
