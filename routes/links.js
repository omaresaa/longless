import express from "express";

import { requireAuth } from "../middleware/auth.js";
import { createUrl, deleteUserLinkById } from "../config/dbHelpers.js";
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
    console.error("Error creating short URL:", error);
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

  try {
    deleteUserLinkById(linkId, req.session.userId);
    res.renderPage("dashboard");
  } catch (error) {
    console.error("Error deleting link:", error);
    res.renderPage("error");
  }
});

export default router;
