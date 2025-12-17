import { ALPHANUMERIC } from "./const.js";
import { findUrlByShortCode } from "../config/dbHelpers.js";

export const generateShortCode = (length = 6, maxRetries = 10) => {
  // Attempt to generate a unique short code
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    let result = "";
    for (let i = 0; i < length; i++) {
      result += ALPHANUMERIC.charAt(
        Math.floor(Math.random() * ALPHANUMERIC.length)
      );
    }

    if (!findUrlByShortCode(result)) {
      return result;
    }
  }

  return generateShortCode(length + 1, maxRetries);
};

export const isValidUrl = (url) => {
  // Check if the URL is a valid format
  try {
    const parsedUrl = new URL(url);
    return parsedUrl.protocol === "http:" || parsedUrl.protocol === "https:";
  } catch (error) {
    return false;
  }
};
