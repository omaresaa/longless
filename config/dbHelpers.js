import bycrypt from "bcrypt";

import db from "./database.js";

export const createUser = (username, email, password) => {
  const hashedPassword = bycrypt.hashSync(password, 10);

  const stmt = db.prepare(
    "INSERT INTO users (username, email, hash) VALUES (?, ?, ?)"
  );

  const result = stmt.run(username, email, hashedPassword);

  return result.lastInsertRowid;
};

export const findUserByUsername = (username) => {
  const stmt = db.prepare("SELECT * FROM users WHERE username = ?");
  return stmt.get(username);
};

export const findUserByEmail = (email) => {
  const stmt = db.prepare("SELECT * FROM users WHERE email = ?");
  return stmt.get(email);
};

export const findUserById = (id) => {
  const stmt = db.prepare("SELECT * FROM users WHERE id = ?");
  return stmt.get(id);
};

export const validatePassword = (password, hash) => {
  return bycrypt.compareSync(password, hash);
};

export const findUrlByShortCode = (shortCode) => {
  const stmt = db.prepare("SELECT * FROM urls WHERE short_code = ?");
  return stmt.get(shortCode);
};

export const createUrl = (userId, shortCode, originalUrl, title = null) => {
  const stmt = db.prepare(
    "INSERT INTO urls (user_id, short_code, original_url, title) VALUES (?, ?, ?, ?)"
  );
  const result = stmt.run(userId, shortCode, originalUrl, title);
  return result.lastInsertRowid;
};

export const recordClick = (urlId, ip, userAgent) => {
  const stmt = db.prepare(
    "INSERT INTO clicks (url_id, ip_address, user_agent) VALUES (?, ?, ?)"
  );
  return stmt.run(urlId, ip, userAgent);
};

export const getUserLinks = (userId) => {
  const stmt = db.prepare("SELECT * FROM urls WHERE user_id = ?");
  return stmt.all(userId);
};

export const getLinkClickCount = (urlId) => {
  const stmt = db.prepare(
    "SELECT COUNT(*) as count FROM clicks WHERE url_id = ?"
  );
  return stmt.get(urlId).count;
};

export const deleteUserLinkById = (linkId, userId) => {
  const stmt = db.prepare("DELETE FROM urls WHERE id = ? AND user_id = ?");
  return stmt.run(linkId, userId);
};

export const getLinkById = (linkId) => {
  const stmt = db.prepare("SELECT * FROM urls WHERE id = ?");
  return stmt.get(linkId);
};

export const getClickById = (clickId) => {
  const stmt = db.prepare("SELECT * FROM clicks WHERE id = ?");
  return stmt.get(clickId);
};
