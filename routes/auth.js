import express from "express";
import logger from "../utils/logger.js";

import { requireGuest } from "../middleware/auth.js";
import {
  createUser,
  findUserByUsername,
  findUserByEmail,
  validatePassword,
} from "../config/dbHelpers.js";

const router = express.Router();

// GET /register
router.get("/register", requireGuest, (req, res) => {
  res.renderPage("register");
});

// POST /register
router.post("/register", requireGuest, async (req, res) => {
  const { username, email, password, confirmPassword } = req.body;

  if (!username || !email || !password || !confirmPassword) {
    return res.renderPage("register", {
      error: "All fields are required.",
    });
  }

  if (password !== confirmPassword) {
    return res.renderPage("register", {
      error: "Passwords do not match.",
    });
  }

  if (password.length < 6) {
    return res.renderPage("register", {
      error: "Password must be at least 6 characters long.",
    });
  }

  if (findUserByUsername(username)) {
    logger.warn("Registration failed: Username already exists", { username });
    return res.renderPage("register", {
      error: "Username is already taken.",
    });
  }

  if (findUserByEmail(email)) {
    logger.warn("Registration failed: Email already exists", { email });
    return res.renderPage("register", {
      error: "Email is already registered.",
    });
  }

  try {
    const userId = createUser(username, email, password);
    req.session.userId = userId;
    req.session.username = username;
    logger.info("New user registered", { userId, username, email });
    res.redirect("/");
  } catch (error) {
    logger.error("Registration error", {
      error: error.message,
      stack: error.stack,
      username,
      email,
    });

    res.renderPage("register", {
      error: "Something went wrong. Please try again.",
    });
  }
});

// GET /login
router.get("/login", requireGuest, (req, res) => {
  res.renderPage("login");
});

// POST /login
router.post("/login", requireGuest, async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.renderPage("login", {
      error: "All fields are required.",
    });
  }

  const user = findUserByUsername(username);
  if (!user) {
    logger.warn("Login failed: User not found", { username });
    return res.renderPage("login", {
      error: "Invalid username or password.",
    });
  }

  if (!validatePassword(password, user.hash)) {
    logger.warn("Login failed: Invalid password", {
      username,
      userId: user.id,
    });
    return res.renderPage("login", {
      error: "Invalid username or password.",
    });
  }

  try {
    req.session.userId = user.id;
    req.session.username = username;
    logger.info("User logged in", { userId: user.id, username });
    res.redirect("/");
  } catch (error) {
    logger.error("Login error", {
      error: error.message,
      stack: error.stack,
      username,
    });

    res.renderPage("login", {
      error: "Something went wrong. Please try again.",
    });
  }
});

// GET /logout
router.get("/logout", (req, res) => {
  const userId = req.session.userId;
  const username = req.session.username;

  req.session.destroy((error) => {
    if (error) {
      logger.error("Logout error", {
        error: error.message,
        stack: error.stack,
        userId,
        username,
      });
      return res.renderPage("error");
    }

    logger.info("User logged out", { userId, username });
    res.clearCookie("connect.sid");
    res.redirect("/login");
  });
});

export default router;
