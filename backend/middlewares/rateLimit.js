const ApiError = require("../utils/apiError");

function getClientKey(req) {
  const forwardedFor = req.headers["x-forwarded-for"];

  if (typeof forwardedFor === "string" && forwardedFor.trim()) {
    return forwardedFor.split(",")[0].trim();
  }

  return req.ip || req.socket?.remoteAddress || "unknown";
}

function createRateLimiter({
  windowMs,
  max,
  message,
  errorCode = "TOO_MANY_REQUESTS",
  keyGenerator = getClientKey,
}) {
  const store = new Map();

  setInterval(() => {
    const now = Date.now();

    for (const [key, entry] of store.entries()) {
      if (entry.resetTime <= now) {
        store.delete(key);
      }
    }
  }, windowMs).unref();

  return (req, res, next) => {
    const key = keyGenerator(req);
    const now = Date.now();
    const currentEntry = store.get(key);

    if (!currentEntry || currentEntry.resetTime <= now) {
      store.set(key, {
        count: 1,
        resetTime: now + windowMs,
      });

      res.setHeader("RateLimit-Limit", max);
      res.setHeader("RateLimit-Remaining", max - 1);
      res.setHeader("RateLimit-Reset", Math.ceil((now + windowMs) / 1000));
      return next();
    }

    currentEntry.count += 1;
    store.set(key, currentEntry);

    res.setHeader("RateLimit-Limit", max);
    res.setHeader("RateLimit-Remaining", Math.max(0, max - currentEntry.count));
    res.setHeader("RateLimit-Reset", Math.ceil(currentEntry.resetTime / 1000));

    if (currentEntry.count > max) {
      return next(new ApiError(429, message, errorCode));
    }

    return next();
  };
}

const apiRateLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 300,
  message: "Too many requests. Please try again in a few minutes.",
});

const authRateLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 15,
  message: "Too many authentication attempts. Please wait before trying again.",
  errorCode: "AUTH_RATE_LIMITED",
  keyGenerator: (req) => `${getClientKey(req)}:${req.path}`,
});

module.exports = {
  apiRateLimiter,
  authRateLimiter,
  createRateLimiter,
};
