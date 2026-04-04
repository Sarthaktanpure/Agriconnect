const Listing = require("../models/Listings");
const { cloudinary } = require("../cloudConfig");
const ApiError = require("../utils/apiError");
const asyncHandler = require("../utils/asyncHandler");
const {
  buildListingContactResponse,
  buildListingResponse,
} = require("../utils/listingHelpers");
const sendSuccess = require("../utils/sendSuccess");
const {
  USER_ROLES,
  isValidObjectId,
  validateListingPayload,
} = require("../utils/validators");

const POPULATE_FIELDS = [
  { path: "farmerId", select: "name email role phone" },
  { path: "owner", select: "name email role phone" },
];

function populateListing(query) {
  POPULATE_FIELDS.forEach((field) => {
    query.populate(field.path, field.select);
  });

  return query;
}

function getListingOwnerId(listing) {
  if (!listing) {
    return null;
  }

  if (listing.farmerId?._id) {
    return String(listing.farmerId._id);
  }

  if (listing.farmerId) {
    return String(listing.farmerId);
  }

  if (listing.owner?._id) {
    return String(listing.owner._id);
  }

  if (listing.owner) {
    return String(listing.owner);
  }

  return null;
}

async function cleanupUploadedImage(file) {
  if (!file?.filename) {
    return;
  }

  await cloudinary.uploader.destroy(file.filename).catch(() => null);
}

async function fetchListingOrThrow(id, { lean = false } = {}) {
  if (!isValidObjectId(id)) {
    throw new ApiError(400, "Listing id is invalid.", "INVALID_LISTING_ID");
  }

  const query = Listing.findById(id);

  if (lean) {
    query.lean();
  }

  populateListing(query);
  const listing = await query;

  if (!listing) {
    throw new ApiError(404, "Listing not found.", "LISTING_NOT_FOUND");
  }

  return listing;
}

const getAllListings = asyncHandler(async (_req, res) => {
  const query = Listing.find({}).sort({ createdAt: -1 }).lean();
  populateListing(query);
  const listings = await query;

  return sendSuccess(
    res,
    200,
    "Listings fetched successfully.",
    listings.map((listing) => buildListingResponse(listing)),
  );
});

const getListingById = asyncHandler(async (req, res) => {
  const listing = await fetchListingOrThrow(req.params.id, { lean: true });

  return sendSuccess(res, 200, "Listing fetched successfully.", buildListingResponse(listing));
});

const getListingContactById = asyncHandler(async (req, res) => {
  const listing = await fetchListingOrThrow(req.params.id, { lean: true });

  return sendSuccess(
    res,
    200,
    "Listing contact details fetched successfully.",
    buildListingContactResponse(listing),
  );
});

const createListing = asyncHandler(async (req, res) => {
  const { isValid, errors, values } = validateListingPayload(req.body);

  if (!isValid) {
    await cleanupUploadedImage(req.file);
    throw new ApiError(400, errors[0], errors.join(" "));
  }

  const listing = await Listing.create({
    ...values,
    farmerId: req.user.id,
    owner: req.user.id,
    image: req.file
      ? {
          filename: req.file.filename,
          url: req.file.path,
        }
      : undefined,
  });

  const populatedListing = await fetchListingOrThrow(listing._id);

  return sendSuccess(res, 201, "Listing created successfully.", buildListingResponse(populatedListing));
});

const updateListing = asyncHandler(async (req, res) => {
  const listing = await fetchListingOrThrow(req.params.id);
  const ownerId = getListingOwnerId(listing);
  const isAdmin = req.user.role === USER_ROLES.ADMIN;

  if (!isAdmin && ownerId !== String(req.user.id)) {
    await cleanupUploadedImage(req.file);
    throw new ApiError(403, "Only the listing owner or admin can update this listing.", "FORBIDDEN");
  }

  const { isValid, errors, values } = validateListingPayload(req.body);

  if (!isValid) {
    await cleanupUploadedImage(req.file);
    throw new ApiError(400, errors[0], errors.join(" "));
  }

  const previousImageFilename = listing.image?.filename;

  listing.crop = values.crop;
  listing.description = values.description;
  listing.price = values.price;
  listing.location = values.location;
  listing.country = values.country;

  if (req.file) {
    listing.image = {
      filename: req.file.filename,
      url: req.file.path,
    };
  }

  await listing.save();

  if (req.file && previousImageFilename && previousImageFilename !== req.file.filename) {
    await cloudinary.uploader.destroy(previousImageFilename).catch(() => null);
  }

  const updatedListing = await fetchListingOrThrow(listing._id);

  return sendSuccess(res, 200, "Listing updated successfully.", buildListingResponse(updatedListing));
});

const deleteListing = asyncHandler(async (req, res) => {
  const listing = await fetchListingOrThrow(req.params.id);
  const ownerId = getListingOwnerId(listing);
  const isAdmin = req.user.role === USER_ROLES.ADMIN;

  if (!isAdmin && ownerId !== String(req.user.id)) {
    throw new ApiError(403, "Only the listing owner or admin can delete this listing.", "FORBIDDEN");
  }

  const imageFilename = listing.image?.filename;
  await Listing.findByIdAndDelete(listing._id);

  if (imageFilename) {
    await cloudinary.uploader.destroy(imageFilename).catch(() => null);
  }

  return sendSuccess(res, 200, "Listing deleted successfully.", { id: req.params.id });
});

module.exports = {
  createListing,
  deleteListing,
  getAllListings,
  getListingContactById,
  getListingById,
  updateListing,
};
