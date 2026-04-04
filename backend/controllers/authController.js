const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Listing = require("../models/Listings");
const User = require("../models/User");
const { JWT_SECRET } = require("../config/env");
const ApiError = require("../utils/apiError");
const asyncHandler = require("../utils/asyncHandler");
const sendSuccess = require("../utils/sendSuccess");
const {
  USER_ROLES,
  validateLoginPayload,
  validateProfilePayload,
  validateSignupPayload,
} = require("../utils/validators");

const PASSWORD_SALT_ROUNDS = 12;

function createToken(user) {
  return jwt.sign(
    {
      id: user._id,
      role: user.role,
      email: user.email,
      phone: user.phone,
      name: user.name,
    },
    JWT_SECRET,
    { expiresIn: "1d" },
  );
}

function buildRecentListingSummary(listing) {
  return {
    _id: listing._id,
    crop: listing.crop,
    price: listing.price,
    location: listing.location,
    country: listing.country,
    image: {
      filename: listing.image?.filename || "",
      url:
        listing.image?.url ||
        "https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?auto=format&fit=crop&w=800&q=60",
    },
    createdAt: listing.createdAt,
    updatedAt: listing.updatedAt,
  };
}

function buildProfileResponse(userDocument, { listingCount = 0, recentListings = [] } = {}) {
  const user = userDocument?.toJSON ? userDocument.toJSON() : { ...userDocument };
  const profileFields = [
    Boolean(user?.name),
    Boolean(user?.email),
    user?.role === USER_ROLES.FARMER ? Boolean(user?.phone) : true,
  ];
  const totalFields = user?.role === USER_ROLES.FARMER ? 3 : 2;
  const completedFields = profileFields.filter(Boolean).length;

  return {
    user,
    stats: {
      listingCount,
      profileCompletion: Math.round((completedFields / totalFields) * 100),
      contactReady: Boolean(user?.email) && (user?.role !== USER_ROLES.FARMER || Boolean(user?.phone)),
      memberSince: user?.createdAt || null,
    },
    recentListings,
  };
}

async function getUserOrThrow(userId) {
  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(404, "User account not found.", "USER_NOT_FOUND");
  }

  return user;
}

async function loadProfileData(user) {
  const canOwnListings = [USER_ROLES.FARMER, USER_ROLES.ADMIN].includes(user.role);

  if (!canOwnListings) {
    return {
      listingCount: 0,
      recentListings: [],
    };
  }

  const [listingCount, recentListingDocuments] = await Promise.all([
    Listing.countDocuments({ farmerId: user._id }),
    Listing.find({ farmerId: user._id })
      .select("crop price location country image createdAt updatedAt")
      .sort({ updatedAt: -1 })
      .limit(3)
      .lean(),
  ]);

  return {
    listingCount,
    recentListings: recentListingDocuments.map((listing) => buildRecentListingSummary(listing)),
  };
}

const signup = asyncHandler(async (req, res) => {
  const { isValid, errors, values } = validateSignupPayload(req.body);

  if (!isValid) {
    throw new ApiError(400, errors[0], errors.join(" "));
  }

  const existingUser = await User.findOne({ email: values.email });

  if (existingUser) {
    throw new ApiError(409, "An account with this email already exists.", "DUPLICATE_EMAIL");
  }

  const hashedPassword = await bcrypt.hash(values.password, PASSWORD_SALT_ROUNDS);
  const user = await User.create({
    name: values.name,
    email: values.email,
    phone: values.phone,
    password: hashedPassword,
    role: values.role || USER_ROLES.BUYER,
  });

  const token = createToken(user);

  return sendSuccess(res, 201, "Account created successfully.", {
    token,
    user,
  });
});

const login = asyncHandler(async (req, res) => {
  const { isValid, errors, values } = validateLoginPayload(req.body);

  if (!isValid) {
    throw new ApiError(400, errors[0], errors.join(" "));
  }

  const user = await User.findOne({ email: values.email }).select("+password");

  if (!user) {
    throw new ApiError(401, "Invalid email or password.", "INVALID_CREDENTIALS");
  }

  const isPasswordValid = await bcrypt.compare(values.password, user.password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid email or password.", "INVALID_CREDENTIALS");
  }

  const token = createToken(user);

  return sendSuccess(res, 200, "Logged in successfully.", {
    token,
    user,
  });
});

const getProfile = asyncHandler(async (req, res) => {
  const user = await getUserOrThrow(req.user.id);
  const profileData = await loadProfileData(user);

  return sendSuccess(res, 200, "Profile fetched successfully.", buildProfileResponse(user, profileData));
});

const updateProfile = asyncHandler(async (req, res) => {
  const user = await getUserOrThrow(req.user.id);
  const { isValid, errors, values } = validateProfilePayload(req.body, user.role);

  if (!isValid) {
    throw new ApiError(400, errors[0], errors.join(" "));
  }

  if (values.email !== user.email) {
    const existingUser = await User.findOne({ email: values.email });

    if (existingUser && String(existingUser._id) !== String(user._id)) {
      throw new ApiError(409, "An account with this email already exists.", "DUPLICATE_EMAIL");
    }
  }

  user.name = values.name;
  user.email = values.email;
  user.phone = values.phone;

  await user.save();

  const token = createToken(user);
  const profileData = await loadProfileData(user);
  const profileResponse = buildProfileResponse(user, profileData);

  return sendSuccess(res, 200, "Profile updated successfully.", {
    token,
    user: profileResponse.user,
    stats: profileResponse.stats,
    recentListings: profileResponse.recentListings,
  });
});

module.exports = {
  getProfile,
  login,
  signup,
  updateProfile,
};
