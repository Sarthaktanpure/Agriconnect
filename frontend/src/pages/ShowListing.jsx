import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Globe2,
  MapPin,
  PencilLine,
  RefreshCcw,
  ShieldCheck,
  Sparkles,
  Sprout,
  UserRound,
} from "lucide-react";
import Footer from "../components/Footer";
import NavBar from "../components/NavBar";
import FeedbackState from "../components/common/FeedbackState";
import { getStoredUser, isAdmin, isListingOwner } from "../services/authService";
import { fetchListingById } from "../services/listingService";
import {
  formatPrice,
  getFarmerLabel,
  getListingImage,
  getLocationLabel,
} from "../utils/listingUtils";

const ListingDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const currentUser = getStoredUser();
  const [listing, setListing] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const loadListing = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const data = await fetchListingById(id);
      setListing(data);
    } catch (err) {
      setErrorMessage(
        err.userMessage ||
          "We could not load this listing right now. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadListing();
  }, [loadListing]);

  const canManageListing = useMemo(() => {
    if (!listing || !currentUser) {
      return false;
    }

    return isListingOwner(listing, currentUser) || isAdmin(currentUser);
  }, [currentUser, listing]);

  const farmerInfo = listing?.farmer || null;

  return (
    <>
      <NavBar />

      <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(187,247,208,0.42),_transparent_24%),linear-gradient(180deg,_#f8fff8_0%,_#f4f6f4_46%,_#edf5ef_100%)] pt-28 pb-16 font-sans selection:bg-green-100 selection:text-green-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => navigate("/listings")}
            className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 text-sm font-semibold text-gray-600 shadow-sm transition-colors hover:text-green-700"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to marketplace
          </button>

          {isLoading ? (
            <div className="space-y-8">
              <div className="animate-pulse overflow-hidden rounded-[2rem] border border-green-900/10 bg-white p-8 shadow-xl shadow-green-950/5">
                <div className="h-5 w-40 rounded-full bg-gray-200" />
                <div className="mt-4 h-14 w-3/4 rounded-2xl bg-gray-200" />
                <div className="mt-4 h-6 w-2/3 rounded-xl bg-gray-100" />
              </div>
              <div className="grid gap-8 lg:grid-cols-[1.08fr_0.92fr]">
                <div className="animate-pulse rounded-[2rem] border border-gray-100 bg-white p-8 shadow-xl shadow-green-950/5">
                  <div className="h-[420px] rounded-[1.75rem] bg-gray-100" />
                  <div className="mt-6 h-10 w-1/2 rounded-xl bg-gray-200" />
                  <div className="mt-4 h-28 rounded-2xl bg-gray-100" />
                </div>
                <div className="animate-pulse rounded-[2rem] border border-gray-100 bg-white p-8 shadow-xl shadow-green-950/5">
                  <div className="h-36 rounded-[1.75rem] bg-gray-100" />
                  <div className="mt-6 h-28 rounded-2xl bg-gray-100" />
                  <div className="mt-4 h-14 rounded-2xl bg-gray-100" />
                </div>
              </div>
            </div>
          ) : errorMessage ? (
            <FeedbackState
              icon={AlertCircle}
              title="We could not open this listing"
              description={errorMessage}
              tone="error"
              actions={[
                <button
                  key="retry"
                  type="button"
                  onClick={loadListing}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gray-900 px-6 py-3 font-bold text-white transition-colors hover:bg-green-600"
                >
                  <RefreshCcw className="h-5 w-5" />
                  Try again
                </button>,
                <button
                  key="back"
                  type="button"
                  onClick={() => navigate("/listings")}
                  className="inline-flex items-center justify-center rounded-2xl border border-gray-200 bg-white px-6 py-3 font-bold text-gray-700 transition-colors hover:border-green-300 hover:text-green-700"
                >
                  Go to marketplace
                </button>,
              ]}
            />
          ) : !listing ? (
            <FeedbackState
              icon={AlertCircle}
              title="Listing not found"
              description="The crop you are looking for does not exist or has been removed."
              actions={[
                <button
                  key="back"
                  type="button"
                  onClick={() => navigate("/listings")}
                  className="inline-flex items-center justify-center rounded-2xl border border-gray-200 bg-white px-6 py-3 font-bold text-gray-700 transition-colors hover:border-green-300 hover:text-green-700"
                >
                  Browse marketplace
                </button>,
              ]}
            />
          ) : (
            <div className="space-y-8">
              <div className="relative overflow-hidden rounded-[2rem] border border-green-900/10 bg-[linear-gradient(135deg,_rgba(6,95,70,1)_0%,_rgba(20,83,45,0.96)_52%,_rgba(132,204,22,0.88)_100%)] px-6 py-8 text-white shadow-2xl shadow-green-950/10 sm:px-8 sm:py-10 lg:px-10">
                <div className="absolute -right-10 -top-12 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
                <div className="absolute bottom-0 right-0 h-32 w-32 translate-x-8 translate-y-8 rounded-full bg-lime-300/10 blur-3xl" />

                <div className="relative flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
                  <div className="max-w-3xl">
                    <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold text-green-50 backdrop-blur-sm">
                      <Sparkles className="h-4 w-4" />
                      Listing details experience
                    </div>

                    <h1 className="text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
                      {listing.crop}
                    </h1>
                    <p className="mt-4 max-w-2xl text-base leading-7 text-green-50/90 sm:text-lg">
                      A richer listing page with farmer information, clearer price
                      context, and role-aware next actions.
                    </p>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-3 lg:min-w-[420px]">
                    <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-sm">
                      <p className="text-sm text-green-50/75">Current price</p>
                      <p className="mt-1 text-xl font-extrabold">{formatPrice(listing.price)}</p>
                    </div>
                    <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-sm">
                      <p className="text-sm text-green-50/75">Farmer</p>
                      <p className="mt-1 text-xl font-extrabold">{getFarmerLabel(listing)}</p>
                    </div>
                    <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-sm">
                      <p className="text-sm text-green-50/75">Region</p>
                      <p className="mt-1 text-xl font-extrabold">{listing.country}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid gap-8 lg:grid-cols-[1.08fr_0.92fr]">
                <div className="overflow-hidden rounded-[2rem] border border-gray-100 bg-white shadow-xl shadow-green-950/5">
                  <div className="relative h-[360px] overflow-hidden bg-gray-100 sm:h-[440px]">
                    <img
                      src={getListingImage(listing)}
                      alt={listing.crop || "Crop image"}
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-950/75 via-gray-950/5 to-transparent" />

                    <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
                      <div className="inline-flex items-center gap-2 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-gray-700 backdrop-blur-sm">
                        <BadgeCheck className="h-3.5 w-3.5 text-green-600" />
                        Farmer listing
                      </div>

                      <div className="mt-4 flex flex-wrap gap-2 text-sm">
                        <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-3 py-1 font-semibold text-white backdrop-blur-sm">
                          <MapPin className="h-3.5 w-3.5" />
                          {getLocationLabel(listing)}
                        </span>
                        <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-3 py-1 font-semibold text-white backdrop-blur-sm">
                          <ShieldCheck className="h-3.5 w-3.5" />
                          {farmerInfo?.role ? `${farmerInfo.role} account` : "Verified seller"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 sm:p-8">
                    <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
                      <div className="max-w-2xl">
                        <p className="text-sm font-bold uppercase tracking-[0.18em] text-green-700">
                          Full description
                        </p>
                        <p className="mt-3 text-base leading-8 text-gray-600 sm:text-lg">
                          {listing.description}
                        </p>
                      </div>

                      <div className="rounded-[1.5rem] bg-green-50 px-5 py-4 text-right">
                        <p className="text-xs font-bold uppercase tracking-[0.18em] text-green-700">
                          Price
                        </p>
                        <p className="mt-1 text-3xl font-black text-green-700">
                          {formatPrice(listing.price)}
                        </p>
                        <p className="text-xs font-semibold text-green-700/70">per unit</p>
                      </div>
                    </div>

                    <div className="mt-8 grid gap-4 sm:grid-cols-2">
                      <div className="rounded-[1.5rem] border border-gray-100 bg-gray-50 p-5">
                        <div className="flex items-center gap-2 text-sm font-bold text-gray-900">
                          <Sprout className="h-4 w-4 text-green-700" />
                          Crop type
                        </div>
                        <p className="mt-3 text-sm leading-6 text-gray-600">{listing.crop}</p>
                      </div>

                      <div className="rounded-[1.5rem] border border-gray-100 bg-gray-50 p-5">
                        <div className="flex items-center gap-2 text-sm font-bold text-gray-900">
                          <Globe2 className="h-4 w-4 text-green-700" />
                          Region
                        </div>
                        <p className="mt-3 text-sm leading-6 text-gray-600">{getLocationLabel(listing)}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-6 lg:sticky lg:top-28 lg:self-start">
                  <div className="rounded-[2rem] border border-gray-100 bg-white p-6 shadow-xl shadow-green-950/5">
                    <p className="text-sm font-bold uppercase tracking-[0.18em] text-gray-500">
                      Farmer info
                    </p>
                    <h3 className="mt-2 text-2xl font-black text-gray-900">
                      Know who listed this crop
                    </h3>

                    <div className="mt-6 rounded-[1.5rem] border border-gray-100 bg-gray-50 p-5">
                      <div className="flex items-start gap-3">
                        <div className="rounded-full bg-green-100 p-3 text-green-700">
                          <UserRound className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-lg font-black text-gray-900">
                            {farmerInfo?.name || "Farmer profile unavailable"}
                          </p>
                          <p className="mt-1 text-sm font-semibold uppercase tracking-[0.18em] text-gray-500">
                            {farmerInfo?.role || "Farmer"}
                          </p>
                          <p className="mt-3 max-w-sm text-sm leading-6 text-gray-500">
                            Reach this seller through a dedicated contact page with
                            drafted email, WhatsApp, and call actions.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-[2rem] border border-gray-100 bg-white p-6 shadow-xl shadow-green-950/5">
                    <p className="text-sm font-bold uppercase tracking-[0.18em] text-gray-500">
                      Next action
                    </p>
                    <h3 className="mt-2 text-2xl font-black text-gray-900">
                      Move forward from the details page
                    </h3>

                    <div className="mt-6 space-y-3">
                      <button
                        type="button"
                        onClick={() => navigate(`/listings/${id}/contact`)}
                        className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gray-900 px-6 py-4 text-base font-bold text-white shadow-lg transition-all duration-200 hover:bg-green-600 hover:shadow-green-600/25"
                      >
                        {currentUser ? "Contact farmer" : "Log in to contact farmer"}
                        <ArrowRight className="h-5 w-5" />
                      </button>

                      {canManageListing ? (
                        <button
                          type="button"
                          onClick={() => navigate(`/listings/${id}/manage`)}
                          className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-white px-6 py-4 text-base font-bold text-gray-700 transition-colors hover:border-green-300 hover:text-green-700"
                        >
                          <PencilLine className="h-5 w-5" />
                          Manage listing
                        </button>
                      ) : null}
                    </div>

                    <p className="mt-4 text-sm leading-6 text-gray-500">
                      Open a dedicated seller contact page with prefilled email,
                      WhatsApp, and calling actions tied to this listing.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
};

export default ListingDetails;
