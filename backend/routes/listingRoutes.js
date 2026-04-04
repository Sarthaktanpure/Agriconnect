const express = require("express");
const {
  createListing,
  deleteListing,
  getAllListings,
  getListingContactById,
  getListingById,
  updateListing,
} = require("../controllers/listingController");
const allowRoles = require("../middlewares/allowRoles");
const upload = require("../middlewares/upload");
const verifyToken = require("../middlewares/verifyToken");
const { USER_ROLES } = require("../utils/validators");

const router = express.Router();

router.get("/listings", getAllListings);
router.get("/listings/:id/contact", verifyToken, getListingContactById);
router.get("/listings/:id", getListingById);
router.post(
  "/listings",
  verifyToken,
  allowRoles(USER_ROLES.FARMER),
  upload.single("image"),
  createListing,
);
router.put(
  "/listings/:id",
  verifyToken,
  allowRoles(USER_ROLES.FARMER, USER_ROLES.ADMIN),
  upload.single("image"),
  updateListing,
);
router.delete(
  "/listings/:id",
  verifyToken,
  allowRoles(USER_ROLES.FARMER, USER_ROLES.ADMIN),
  deleteListing,
);

module.exports = router;
