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
  res.render("register", {
    title: "Longless - Sign Up",
    error: null,
  });
});

// POST /register
router.post("/register", requireGuest, async (req, res) => {
  const { username, email, password, confirmPassword } = req.body;

  if (!username || !email || !password || !confirmPassword) {
    return res.render("register", {
      title: "Longless - Sign Up",
      error: "All fields are required.",
    });
  }

  if (password !== confirmPassword) {
    return res.render("register", {
      title: "Longless - Sign Up",
      error: "Passwords do not match.",
    });
  }

  if (password.length < 6) {
    return res.render("register", {
      title: "Longless - Sign Up",
      error: "Password must be at least 6 characters long.",
    });
  }

  if (findUserByUsername(username)) {
    return res.render("register", {
      title: "Longless - Sign Up",
      error: "Username is already taken.",
    });
  }

  if (findUserByEmail(email)) {
    return res.render("register", {
      title: "Longless - Sign Up",
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
    res.render("register", {
      title: "Longless - Sign Up",
      error: "Something went wrong. Please try again.",
    });
  }
});

// GET /login
router.get("/login", requireGuest, (req, res) => {
  res.render("login", {
    title: "Longless - Login",
    error: null,
  });
});

// POST /login
router.post("/login", requireGuest, async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.render("login", {
      title: "Longless - Login",
      error: "All fields are required.",
    });
  }

  const user = findUserByUsername(username);
  if (!user || !validatePassword(password, user.hash)) {
    return res.render("login", {
      title: "Longless - Login",
      error: "Invalid username or password.",
    });
  }

  try {
    req.session.userId = user.id;
    req.session.username = username;
    res.redirect("/");
  } catch (error) {
    console.error("Login error:", error);
    res.render("login", {
      title: "Longless - Login",
      error: "Something went wrong. Please try again.",
    });
  }
});

// GET /logout
router.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Logout error:", err);
      return res.redirect("/");
    }
    res.clearCookie("connect.sid");
    res.redirect("/login");
  });
});

export default router;
