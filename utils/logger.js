import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure log directory exists
const logDir = path.join(__dirname, "../logs");
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

const LEVEL = {
  INFO: "INFO",
  WARN: "WARN",
  ERROR: "ERROR",
  DEBUG: "DEBUG",
};

// Format current timestamp
const timestamp = () => new Date().toISOString();

// Write log to file
const writeLog = (level, message, meta = {}) => {
  const logEntry = {
    timestamp: timestamp(),
    level,
    message,
    ...meta,
  };

  const logString = JSON.stringify(logEntry) + "\n";

  // Write to appropriate log file
  if (level === LEVEL.ERROR) {
    fs.appendFileSync(path.join(logDir, "error.log"), logString);
  }

  fs.appendFileSync(path.join(logDir, "app.log"), logString);

  // console.log in development
  if (process.env.NODE_ENV === "development") {
    const color =
      {
        INFO: "\x1b[36m", // Cyan
        WARN: "\x1b[33m", // Yellow
        ERROR: "\x1b[31m", // Red
        DEBUG: "\x1b[90m", // Gray
      }[level] || "\x1b[0m";

    console.log(
      `${color}[${logEntry.timestamp}] ${level}:\x1b[0m ${message}`,
      Object.keys(meta).length ? meta : ""
    );
  }
};

export const logger = {
  info: (message, meta = {}) => writeLog(LEVEL.INFO, message, meta),
  warn: (message, meta = {}) => writeLog(LEVEL.WARN, message, meta),
  error: (message, meta = {}) => writeLog(LEVEL.ERROR, message, meta),
  debug: (message, meta = {}) => writeLog(LEVEL.DEBUG, message, meta),
};

export default logger;
