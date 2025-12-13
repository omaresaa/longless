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
