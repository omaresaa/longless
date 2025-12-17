import express from "express";
import dotenv from "dotenv";
import expressLayouts from "express-ejs-layouts";
import session from "express-session";

import db from "./config/database.js";
import { requireAuth, notFound, setupRender } from "./middleware/index.js";
import { authRoutes, linkRoutes, redirectRoutes } from "./routes/index.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Template engine setup
app.set("view engine", "ejs");
app.set("views", "./views");
app.use(expressLayouts);
app.set("layout", "layouts/main");

app.use(express.json());
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

// Session configuration
app.use(
  session({
    secret: process.env.SESSION_SECRET || "dev-secret-change-in-production",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
      rolling: true,
    },
  })
);

// renderPage wrapper middleware
app.use(setupRender);

app.get("/", requireAuth, (req, res) => {
  res.renderPage("home");
});

// Routes
app.use("/", authRoutes);
app.use("/", linkRoutes);
app.use(redirectRoutes);

// 404 Not Found handler
app.use(notFound);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
