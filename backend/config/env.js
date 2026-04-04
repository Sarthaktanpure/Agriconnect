const DEFAULT_DEV_ORIGINS = [
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "http://localhost:4173",
  "http://127.0.0.1:4173",
  "http://localhost:5173",
  "http://127.0.0.1:5173",
];

function normalizeOrigin(origin) {
  return String(origin || "").trim().replace(/\/+$/, "");
}

function parseOrigins(value) {
  return String(value || "")
    .split(",")
    .map((origin) => normalizeOrigin(origin))
    .filter(Boolean);
}

const NODE_ENV = process.env.NODE_ENV || "development";
const IS_PRODUCTION = NODE_ENV === "production";
const PORT = Number(process.env.PORT) || 8080;
const JWT_SECRET = process.env.JWT_SECRET || process.env.SECRET || "";
const MONGO_URI =
  process.env.MONGO_URI ||
  (IS_PRODUCTION ? "" : "mongodb://127.0.0.1:27017/agriconnectai");
const configuredOrigins = parseOrigins(process.env.ALLOWED_ORIGINS || process.env.CLIENT_URL);
const ALLOWED_ORIGINS = Array.from(
  new Set([
    ...configuredOrigins,
    ...(IS_PRODUCTION ? [] : DEFAULT_DEV_ORIGINS),
  ]),
);

const CLOUDINARY = {
  cloudName: process.env.CLOUDINARY_CLOUD_NAME || "",
  apiKey: process.env.CLOUDINARY_API_KEY || "",
  apiSecret: process.env.CLOUDINARY_API_SECRET || "",
};

function validateEnvironment() {
  const missingVariables = [];

  if (!MONGO_URI) {
    missingVariables.push("MONGO_URI");
  }

  if (!JWT_SECRET) {
    missingVariables.push("JWT_SECRET");
  }

  if (IS_PRODUCTION && ALLOWED_ORIGINS.length === 0) {
    missingVariables.push("ALLOWED_ORIGINS");
  }

  if (IS_PRODUCTION) {
    if (!CLOUDINARY.cloudName) {
      missingVariables.push("CLOUDINARY_CLOUD_NAME");
    }

    if (!CLOUDINARY.apiKey) {
      missingVariables.push("CLOUDINARY_API_KEY");
    }

    if (!CLOUDINARY.apiSecret) {
      missingVariables.push("CLOUDINARY_API_SECRET");
    }
  }

  if (missingVariables.length) {
    throw new Error(
      `Missing required environment variables: ${missingVariables.join(", ")}`,
    );
  }
}

module.exports = {
  ALLOWED_ORIGINS,
  CLOUDINARY,
  IS_PRODUCTION,
  JWT_SECRET,
  MONGO_URI,
  NODE_ENV,
  PORT,
  normalizeOrigin,
  validateEnvironment,
};
