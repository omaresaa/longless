import express from "express";

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
    return res.renderPage("register", {
      error: "Username is already taken.",
    });
  }

  if (findUserByEmail(email)) {
    return res.renderPage("register", {
      error: "Email is already registered.",
    });
  }

  try {
    const userId = createUser(username, email, password);
    req.session.userId = userId;
    req.session.username = username;
    res.redirect("/");
  } catch (error) {
    console.error("Registration error:", error);
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
  if (!user || !validatePassword(password, user.hash)) {
    return res.renderPage("login", {
      error: "Invalid username or password.",
    });
  }

  try {
    req.session.userId = user.id;
    req.session.username = username;
    res.redirect("/");
  } catch (error) {
    console.error("Login error:", error);
    res.renderPage("login", {
      error: "Something went wrong. Please try again.",
    });
  }
});

// GET /logout
router.get("/logout", (req, res) => {
  req.session.destroy((error) => {
    if (error) {
      console.error("Logout error:", error);
      return res.redirect("/");
    }
    res.clearCookie("connect.sid");
    res.redirect("/login");
  });
});

export default router;
