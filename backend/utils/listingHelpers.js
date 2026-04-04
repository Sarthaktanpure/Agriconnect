const DEFAULT_IMAGE_URL =
  "https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?auto=format&fit=crop&w=800&q=60";

function toListingObject(listingDocument) {
  if (!listingDocument) {
    return null;
  }

  return listingDocument.toJSON ? listingDocument.toJSON() : { ...listingDocument };
}

function buildFarmerResponse(farmerSource, { includePhone = false } = {}) {
  if (!farmerSource || typeof farmerSource !== "object") {
    return null;
  }

  const farmer = {
    _id: farmerSource._id,
    name: farmerSource.name,
    email: farmerSource.email,
    role: farmerSource.role,
  };

  if (includePhone) {
    farmer.phone = farmerSource.phone || "";
  }

  return farmer;
}

function buildListingResponse(listingDocument) {
  const listing = toListingObject(listingDocument);

  if (!listing) {
    return null;
  }

  const farmerSource = listing.farmerId || listing.owner || null;
  const farmer = buildFarmerResponse(farmerSource);

  return {
    _id: listing._id,
    crop: listing.crop,
    description: listing.description,
    image: {
      filename: listing.image?.filename || "",
      url: listing.image?.url || DEFAULT_IMAGE_URL,
    },
    price: listing.price,
    location: listing.location,
    country: listing.country,
    farmerId: farmer?._id || listing.farmerId || null,
    farmer,
    createdAt: listing.createdAt,
    updatedAt: listing.updatedAt,
  };
}

function buildListingContactResponse(listingDocument) {
  const listing = toListingObject(listingDocument);

  if (!listing) {
    return null;
  }

  const listingResponse = buildListingResponse(listing);
  const farmerSource = listing.farmerId || listing.owner || null;
  const farmer = buildFarmerResponse(farmerSource, { includePhone: true });
  const phoneDigits = String(farmer?.phone || "").replace(/\D/g, "");
  const locationLabel = [listing.location, listing.country].filter(Boolean).join(", ");
  const farmerName = farmer?.name || "there";
  const cropName = listing.crop || "crop";
  const listedPrice = Number.isFinite(Number(listing.price))
    ? `INR ${Number(listing.price)}`
    : "";
  const emailSubject = `Inquiry about ${cropName} on AgriConnect`;
  const emailBody = [
    `Hello ${farmerName},`,
    "",
    `I found your ${cropName} listing on AgriConnect and would like to know if it is still available.`,
    locationLabel ? `Listing location: ${locationLabel}` : "",
    listedPrice ? `Listed price: ${listedPrice}` : "",
    "",
    "Please let me know the next steps.",
    "",
    "Thank you,",
  ]
    .filter(Boolean)
    .join("\n");
  const whatsappMessage = [
    `Hello ${farmerName},`,
    `I am interested in your ${cropName} listing on AgriConnect.`,
    locationLabel ? `Location: ${locationLabel}.` : "",
    listedPrice ? `Price: ${listedPrice}.` : "",
    "Please let me know if it is still available.",
  ]
    .filter(Boolean)
    .join(" ");

  return {
    listing: {
      _id: listingResponse._id,
      crop: listingResponse.crop,
      description: listingResponse.description,
      image: listingResponse.image,
      price: listingResponse.price,
      location: listingResponse.location,
      country: listingResponse.country,
      createdAt: listingResponse.createdAt,
      updatedAt: listingResponse.updatedAt,
    },
    farmer,
    draft: {
      emailSubject,
      emailBody,
      whatsappMessage,
    },
    actions: {
      email: {
        available: Boolean(farmer?.email),
        href: farmer?.email
          ? `mailto:${farmer.email}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`
          : "",
        value: farmer?.email || "",
      },
      whatsapp: {
        available: Boolean(phoneDigits),
        href: phoneDigits
          ? `https://wa.me/${phoneDigits}?text=${encodeURIComponent(whatsappMessage)}`
          : "",
        value: farmer?.phone || "",
      },
      call: {
        available: Boolean(farmer?.phone),
        href: farmer?.phone ? `tel:${farmer.phone}` : "",
        value: farmer?.phone || "",
      },
    },
  };
}

module.exports = {
  DEFAULT_IMAGE_URL,
  buildListingContactResponse,
  buildListingResponse,
};
