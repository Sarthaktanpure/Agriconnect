import React from "react";
import { ArrowRight, BadgeCheck, Globe2, MapPin } from "lucide-react";
import { formatPrice, getListingImage, getLocationLabel } from "../../utils/listingUtils";

const ListingCard = ({ listing, onView }) => (
  <article className="group overflow-hidden rounded-[2rem] border border-gray-100 bg-white shadow-xl shadow-green-950/5 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-green-900/10">
    <div className="relative h-72 overflow-hidden bg-gray-100">
      <img
        src={getListingImage(listing)}
        alt={listing?.crop || "Crop image"}
        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-gray-950/75 via-gray-950/10 to-transparent" />

      <div className="absolute left-5 top-5 inline-flex items-center gap-2 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-gray-700 backdrop-blur-sm">
        <BadgeCheck className="h-3.5 w-3.5 text-green-600" />
        Marketplace listing
      </div>

      {listing?.country ? (
        <div className="absolute right-5 top-5 inline-flex items-center gap-1 rounded-full bg-green-500/90 px-3 py-1 text-xs font-bold text-white shadow-lg shadow-green-700/20 backdrop-blur-sm">
          <Globe2 className="h-3.5 w-3.5" />
          {listing.country}
        </div>
      ) : null}
    </div>

    <div className="space-y-5 p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-green-700">
            {getLocationLabel(listing)}
          </p>
          <h3 className="mt-2 text-2xl font-black tracking-tight text-gray-900 transition-colors group-hover:text-green-700">
            {listing?.crop || "Unnamed crop"}
          </h3>
        </div>

        <div className="rounded-2xl bg-green-50 px-4 py-3 text-right">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-green-700">
            Price
          </p>
          <p className="mt-1 text-lg font-black text-green-700">{formatPrice(listing?.price)}</p>
          <p className="text-xs font-semibold text-green-700/70">per unit</p>
        </div>
      </div>

      <div className="flex items-center gap-2 rounded-2xl bg-gray-50 px-4 py-3 text-sm font-medium text-gray-600">
        <MapPin className="h-4 w-4 text-green-700" />
        <span className="truncate">{getLocationLabel(listing)}</span>
      </div>

      <p className="min-h-[84px] text-sm leading-7 text-gray-600">
        {listing?.description || "No description has been added for this crop yet."}
      </p>

      <button
        type="button"
        onClick={() => onView(listing)}
        className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gray-900 px-6 py-4 text-base font-bold text-white shadow-lg transition-all duration-200 hover:bg-green-600 hover:shadow-green-600/25"
      >
        View details
        <ArrowRight className="h-5 w-5" />
      </button>
    </div>
  </article>
);

export default ListingCard;
