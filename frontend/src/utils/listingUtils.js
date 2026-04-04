export const DEFAULT_LISTING_IMAGE =
  "https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?auto=format&fit=crop&w=900&q=80";

export function getListingImage(listing) {
  if (typeof listing?.image === "string" && listing.image.trim()) {
    return listing.image;
  }

  if (typeof listing?.image === "object" && listing?.image?.url?.trim()) {
    return listing.image.url;
  }

  return DEFAULT_LISTING_IMAGE;
}

export function formatPrice(value) {
  const numericValue = Number(value);

  if (!Number.isFinite(numericValue)) {
    return "Rs. 0";
  }

  const hasDecimals = numericValue % 1 !== 0;

  return `Rs. ${new Intl.NumberFormat("en-IN", {
    minimumFractionDigits: hasDecimals ? 2 : 0,
    maximumFractionDigits: hasDecimals ? 2 : 0,
  }).format(numericValue)}`;
}

export function getLocationLabel(listing) {
  return [listing?.location, listing?.country].filter(Boolean).join(", ") || "Location pending";
}

export function getFarmerLabel(listing) {
  if (!listing?.farmer?.name) {
    return "Verified AgriConnect farmer";
  }

  return listing.farmer.name;
}
