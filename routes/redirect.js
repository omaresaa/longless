import express from "express";

import { findUrlByShortCode, recordClick } from "../config/dbHelpers.js";

const router = express.Router();

// Redirect to the original URL based on the short code
router.get("/:shortCode", (req, res, next) => {
  const { shortCode } = req.params;

  const url = findUrlByShortCode(shortCode);

  if (!url) {
    return next();
  }

  recordClick(url.id, req.ip, req.get("user-agent"));

  res.redirect(302, url["original_url"]);
});

export default router;
