const ApiError = require("../utils/apiError");

function allowRoles(...allowedRoles) {
  return (req, _res, next) => {
    if (!req.user?.role) {
      return next(new ApiError(403, "You are not allowed to perform this action.", "FORBIDDEN"));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(new ApiError(403, "You do not have permission for this action.", "FORBIDDEN"));
    }

    next();
  };
}

module.exports = allowRoles;
