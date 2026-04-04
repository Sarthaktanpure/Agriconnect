const mongoose = require("mongoose");

const USER_ROLES = {
  FARMER: "farmer",
  BUYER: "buyer",
  ADMIN: "admin",
};

const LISTING_FIELDS = ["crop", "description", "price", "location", "country"];
const PHONE_DIGITS_REGEX = /^\d{10,15}$/;

function sanitizeText(value) {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeRole(role) {
  return sanitizeText(role).toLowerCase();
}

function normalizePhone(value) {
  const rawValue = sanitizeText(value);

  if (!rawValue) {
    return "";
  }

  const hasLeadingPlus = rawValue.startsWith("+");
  const digits = rawValue.replace(/\D/g, "");

  if (!digits) {
    return "";
  }

  return `${hasLeadingPlus ? "+" : ""}${digits}`;
}

function isValidPhone(value) {
  const digits = String(value || "").replace(/\D/g, "");
  return PHONE_DIGITS_REGEX.test(digits);
}

function validateSignupPayload(payload = {}) {
  const name = sanitizeText(payload.name);
  const email = sanitizeText(payload.email).toLowerCase();
  const phone = normalizePhone(payload.phone);
  const password = typeof payload.password === "string" ? payload.password : "";
  const requestedRole = normalizeRole(payload.role);
  const role = requestedRole || USER_ROLES.BUYER;
  const errors = [];

  if (name.length < 2) {
    errors.push("Name must be at least 2 characters long.");
  }

  if (!/^\S+@\S+\.\S+$/.test(email)) {
    errors.push("A valid email address is required.");
  }

  if (password.length < 8) {
    errors.push("Password must be at least 8 characters long.");
  }

  if (![USER_ROLES.FARMER, USER_ROLES.BUYER].includes(role)) {
    errors.push("Role must be either farmer or buyer.");
  }

  if (role === USER_ROLES.FARMER && !phone) {
    errors.push("A contact number is required for farmer accounts.");
  }

  if (phone && !isValidPhone(phone)) {
    errors.push("Contact number must include 10 to 15 digits.");
  }

  return {
    isValid: errors.length === 0,
    errors,
    values: { name, email, phone, password, role },
  };
}

function validateProfilePayload(payload = {}, role = USER_ROLES.BUYER) {
  const name = sanitizeText(payload.name);
  const email = sanitizeText(payload.email).toLowerCase();
  const phone = normalizePhone(payload.phone);
  const errors = [];

  if (name.length < 2) {
    errors.push("Name must be at least 2 characters long.");
  }

  if (!/^\S+@\S+\.\S+$/.test(email)) {
    errors.push("A valid email address is required.");
  }

  if (role === USER_ROLES.FARMER && !phone) {
    errors.push("A contact number is required for farmer accounts.");
  }

  if (phone && !isValidPhone(phone)) {
    errors.push("Contact number must include 10 to 15 digits.");
  }

  return {
    isValid: errors.length === 0,
    errors,
    values: { name, email, phone },
  };
}

function validateLoginPayload(payload = {}) {
  const email = sanitizeText(payload.email).toLowerCase();
  const password = typeof payload.password === "string" ? payload.password : "";
  const errors = [];

  if (!/^\S+@\S+\.\S+$/.test(email)) {
    errors.push("A valid email address is required.");
  }

  if (!password) {
    errors.push("Password is required.");
  }

  return {
    isValid: errors.length === 0,
    errors,
    values: { email, password },
  };
}

function validateListingPayload(payload = {}) {
  const crop = sanitizeText(payload.crop);
  const description = sanitizeText(payload.description);
  const location = sanitizeText(payload.location);
  const country = sanitizeText(payload.country);
  const price = Number(payload.price);
  const errors = [];

  if (crop.length < 2) {
    errors.push("Crop name must be at least 2 characters long.");
  }

  if (description.length < 20) {
    errors.push("Description must be at least 20 characters long.");
  }

  if (!Number.isFinite(price) || price < 0) {
    errors.push("Price must be a valid positive number.");
  }

  if (location.length < 2) {
    errors.push("Location must be at least 2 characters long.");
  }

  if (country.length < 2) {
    errors.push("Country must be at least 2 characters long.");
  }

  return {
    isValid: errors.length === 0,
    errors,
    values: { crop, description, price, location, country },
  };
}

function isValidObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

function pickListingFields(payload = {}) {
  return LISTING_FIELDS.reduce((accumulator, field) => {
    if (payload[field] !== undefined) {
      accumulator[field] = payload[field];
    }
    return accumulator;
  }, {});
}

module.exports = {
  USER_ROLES,
  isValidObjectId,
  normalizeRole,
  pickListingFields,
  normalizePhone,
  sanitizeText,
  validateListingPayload,
  validateLoginPayload,
  validateProfilePayload,
  validateSignupPayload,
};
