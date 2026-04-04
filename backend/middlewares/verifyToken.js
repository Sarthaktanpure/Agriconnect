const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/env");
const ApiError = require("../utils/apiError");

function verifyToken(req, _res, next) {
  const authHeader = req.headers.authorization || "";

  if (!authHeader.startsWith("Bearer ")) {
    return next(new ApiError(401, "Authentication token is required.", "UNAUTHORIZED"));
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (_error) {
    next(new ApiError(401, "Invalid or expired token.", "INVALID_TOKEN"));
  }
}

module.exports = verifyToken;
