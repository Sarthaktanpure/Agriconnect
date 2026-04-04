const mongoose = require("mongoose");

const DEFAULT_IMAGE_URL =
  "https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?auto=format&fit=crop&w=800&q=60";

const listingSchema = new mongoose.Schema(
  {
    crop: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 120,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },
    image: {
      filename: {
        type: String,
        default: "",
      },
      url: {
        type: String,
        default: DEFAULT_IMAGE_URL,
      },
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    location: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 120,
    },
    country: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 120,
    },
    farmerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

listingSchema.index({ createdAt: -1 });
listingSchema.index({ farmerId: 1, updatedAt: -1 });
listingSchema.index({ country: 1, location: 1 });

listingSchema.pre("validate", function syncOwnerFields() {
  if (!this.farmerId && this.owner) {
    this.farmerId = this.owner;
  }

  if (!this.owner && this.farmerId) {
    this.owner = this.farmerId;
  }
});

listingSchema.set("toJSON", {
  virtuals: true,
  transform: (_doc, ret) => {
    if (!ret.farmerId && ret.owner) {
      ret.farmerId = ret.owner;
    }

    delete ret.owner;
    return ret;
  },
});

module.exports = mongoose.model("Listing", listingSchema);
