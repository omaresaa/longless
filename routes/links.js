import express from "express";

import { requireAuth } from "../middleware/auth.js";
import { createUrl } from "../config/dbHelpers.js";
import { generateShortCode, isValidUrl } from "../utils/helpers.js";

const router = express.Router();

// POST /shorten
router.post("/shorten", requireAuth, (req, res) => {
  const { originalUrl } = req.body;

  if (!originalUrl) {
    return res.render("index", {
      title: "Longless - Home",
      error: "Please provide a URL to shorten.",
    });
  }

  if (!isValidUrl(originalUrl)) {
    return res.render("index", {
      title: "Longless - Home",
      error: "Please enter a valid URL.",
    });
  }

  try {
    const shortCode = generateShortCode();
    createUrl(req.session.userId, shortCode, originalUrl);

    res.render("index", {
      title: "Longless - Home",
      shortUrl: `${req.protocol}://${req.get("host")}/${shortCode}`,
    });
  } catch (error) {
    console.error("Error creating short URL:", err);
    res.render("index", {
      title: "Longless - Home",
      error: "Something went wrong. Please try again.",
    });
  }
});

// GET /dashboard
router.get("/dashboard", requireAuth, (req, res) => {
  res.render("dashboard", { title: "Longless - Dashboard", links: [] });
});

export default router;
