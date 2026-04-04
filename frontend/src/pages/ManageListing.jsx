import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Database,
  Eye,
  FileText,
  Globe2,
  ImageIcon,
  MapPin,
  PencilLine,
  RefreshCcw,
  ShieldAlert,
  Sparkles,
  Sprout,
  Trash2,
  UserRound,
} from "lucide-react";
import Footer from "../components/Footer";
import NavBar from "../components/NavBar";
import FeedbackState from "../components/common/FeedbackState";
import {
  deleteListing,
  fetchListingById,
} from "../services/listingService";
import {
  getStoredUser,
  isAdmin,
  isListingOwner,
} from "../services/authService";
import {
  formatPrice,
  getListingImage,
  getLocationLabel,
} from "../utils/listingUtils";

const ManageListing = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const currentUser = getStoredUser();
  const [listing, setListing] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
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
          "We could not load this listing workspace right now.",
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

  const details = useMemo(
    () => [
      {
        label: "Crop name",
        value: listing?.crop || "Not added",
        icon: <Sprout className="h-4 w-4" />,
      },
      {
        label: "Description",
        value: listing?.description || "No description available yet.",
        icon: <FileText className="h-4 w-4" />,
      },
      {
        label: "Price",
        value: listing ? formatPrice(listing.price) : "Not set",
        icon: <BadgeCheck className="h-4 w-4" />,
      },
      {
        label: "Location",
        value: listing ? getLocationLabel(listing) : "Not set",
        icon: <MapPin className="h-4 w-4" />,
      },
      {
        label: "Farmer",
        value: listing?.farmer?.name || "Not available",
        icon: <UserRound className="h-4 w-4" />,
      },
      {
        label: "Image source",
        value: listing?.image?.url || "Default image in use",
        icon: <ImageIcon className="h-4 w-4" />,
      },
    ],
    [listing],
  );

  async function handleDelete() {
    const confirmed = window.confirm(
      "Delete this listing permanently? This will also remove the uploaded image.",
    );

    if (!confirmed) {
      return;
    }

    setIsDeleting(true);
    setErrorMessage("");

    try {
      await deleteListing(id);
      navigate("/listings", { replace: true });
    } catch (err) {
      setErrorMessage(
        err.userMessage ||
          "We could not delete this listing right now. Please try again.",
      );
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <>
      <NavBar />

      <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(187,247,208,0.45),_transparent_24%),linear-gradient(180deg,_#f8fff8_0%,_#f4f6f4_48%,_#edf5ef_100%)] pt-28 pb-16 selection:bg-green-100 selection:text-green-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => navigate(`/listings/${id}`)}
            className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 text-sm font-semibold text-gray-600 shadow-sm transition-colors hover:text-green-700"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to listing
          </button>

          {isLoading ? (
            <div className="space-y-8">
              <div className="animate-pulse overflow-hidden rounded-[2rem] border border-green-900/10 bg-white p-8 shadow-xl shadow-green-950/5">
                <div className="h-5 w-36 rounded-full bg-gray-200" />
                <div className="mt-4 h-14 w-2/3 rounded-2xl bg-gray-200" />
                <div className="mt-4 h-6 w-1/2 rounded-xl bg-gray-100" />
              </div>
              <div className="grid gap-8 lg:grid-cols-[1.08fr_0.92fr]">
                <div className="animate-pulse rounded-[2rem] border border-gray-100 bg-white p-8 shadow-xl shadow-green-950/5">
                  <div className="h-80 rounded-[1.75rem] bg-gray-100" />
                  <div className="mt-6 h-10 w-1/2 rounded-xl bg-gray-200" />
                  <div className="mt-4 h-24 rounded-2xl bg-gray-100" />
                </div>
                <div className="animate-pulse rounded-[2rem] border border-gray-100 bg-white p-8 shadow-xl shadow-green-950/5">
                  <div className="h-40 rounded-[1.75rem] bg-gray-100" />
                  <div className="mt-6 h-14 rounded-2xl bg-gray-100" />
                  <div className="mt-4 h-14 rounded-2xl bg-gray-100" />
                </div>
              </div>
            </div>
          ) : errorMessage && !listing ? (
            <FeedbackState
              icon={AlertCircle}
              title="We could not load your listing workspace"
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
              description="The listing workspace is not available because the item does not exist anymore."
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
          ) : !canManageListing ? (
            <FeedbackState
              icon={ShieldAlert}
              title="You do not have access to this workspace"
              description="Only the listing owner or an admin can open the management workspace for this item."
              tone="error"
              actions={[
                <button
                  key="view"
                  type="button"
                  onClick={() => navigate(`/listings/${id}`)}
                  className="inline-flex items-center justify-center rounded-2xl border border-gray-200 bg-white px-6 py-3 font-bold text-gray-700 transition-colors hover:border-green-300 hover:text-green-700"
                >
                  View public listing
                </button>,
              ]}
            />
          ) : (
            <>
              <div className="relative overflow-hidden rounded-[2rem] border border-green-900/10 bg-[linear-gradient(135deg,_rgba(6,95,70,1)_0%,_rgba(21,128,61,0.96)_52%,_rgba(132,204,22,0.88)_100%)] px-6 py-8 text-white shadow-2xl shadow-green-950/10 sm:px-8 sm:py-10 lg:px-10">
                <div className="absolute -right-10 -top-12 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
                <div className="absolute bottom-0 right-0 h-32 w-32 translate-x-8 translate-y-8 rounded-full bg-lime-300/10 blur-3xl" />

                <div className="relative flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
                  <div className="max-w-3xl">
                    <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold text-green-50 backdrop-blur-sm">
                      <Database className="h-4 w-4" />
                      Backend-connected listing workspace
                    </div>

                    <h1 className="text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
                      Manage this listing before you edit it.
                    </h1>
                    <p className="mt-4 max-w-2xl text-base leading-7 text-green-50/90 sm:text-lg">
                      Review the current backend data, confirm what buyers are
                      seeing, and then move into editing or deletion with a clear
                      owner-aware workflow.
                    </p>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-3 lg:min-w-[420px]">
                    <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-sm">
                      <p className="text-sm text-green-50/75">Current price</p>
                      <p className="mt-1 text-xl font-extrabold">{formatPrice(listing.price)}</p>
                    </div>
                    <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-sm">
                      <p className="text-sm text-green-50/75">Farmer</p>
                      <p className="mt-1 text-xl font-extrabold">{listing.farmer?.name || "Owner"}</p>
                    </div>
                    <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-sm">
                      <p className="text-sm text-green-50/75">Workspace</p>
                      <p className="mt-1 text-xl font-extrabold">Ready to edit</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 grid gap-8 lg:grid-cols-[1.08fr_0.92fr]">
                <div className="overflow-hidden rounded-[2rem] border border-gray-100 bg-white shadow-xl shadow-green-950/5">
                  <div className="relative h-[360px] overflow-hidden bg-gray-100 sm:h-[420px]">
                    <img
                      src={getListingImage(listing)}
                      alt={listing.crop || "Listing image"}
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-950/75 via-gray-950/5 to-transparent" />

                    <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
                      <div className="inline-flex items-center gap-2 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-gray-700 backdrop-blur-sm">
                        <BadgeCheck className="h-3.5 w-3.5 text-green-600" />
                        Backend data preview
                      </div>

                      <h2 className="mt-4 text-3xl font-black tracking-tight text-white sm:text-4xl">
                        {listing.crop}
                      </h2>

                      <div className="mt-3 flex flex-wrap gap-2 text-sm">
                        <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-3 py-1 font-semibold text-white backdrop-blur-sm">
                          <MapPin className="h-3.5 w-3.5" />
                          {getLocationLabel(listing)}
                        </span>
                        <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-3 py-1 font-semibold text-white backdrop-blur-sm">
                          <Globe2 className="h-3.5 w-3.5" />
                          {listing.country}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 sm:p-8">
                    <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
                      <div className="max-w-2xl">
                        <p className="text-sm font-bold uppercase tracking-[0.18em] text-green-700">
                          Current description
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
                        <p className="text-sm font-bold text-gray-900">Listing ID</p>
                        <p className="mt-2 break-all text-sm leading-6 text-gray-500">{listing._id}</p>
                      </div>

                      <div className="rounded-[1.5rem] border border-gray-100 bg-gray-50 p-5">
                        <p className="text-sm font-bold text-gray-900">Farmer email</p>
                        <p className="mt-2 text-sm leading-6 text-gray-500">{listing.farmer?.email || "Unavailable"}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="rounded-[2rem] border border-gray-100 bg-white p-6 shadow-xl shadow-green-950/5">
                    <p className="text-sm font-bold uppercase tracking-[0.18em] text-gray-500">Actions</p>
                    <h3 className="mt-2 text-2xl font-black text-gray-900">Choose what to do next</h3>

                    <div className="mt-6 space-y-3">
                      <button
                        type="button"
                        onClick={() => navigate(`/listings/${id}/edit`)}
                        className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gray-900 px-6 py-4 text-base font-bold text-white shadow-lg transition-all duration-200 hover:bg-green-600 hover:shadow-green-600/25"
                      >
                        <PencilLine className="h-5 w-5" />
                        Open editor
                        <ArrowRight className="h-5 w-5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => navigate(`/listings/${id}`)}
                        className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-white px-6 py-4 text-base font-bold text-gray-700 transition-colors hover:border-green-300 hover:text-green-700"
                      >
                        <Eye className="h-5 w-5" />
                        View public page
                      </button>

                      <button
                        type="button"
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-red-200 bg-red-50 px-6 py-4 text-base font-bold text-red-700 transition-colors hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        <Trash2 className="h-5 w-5" />
                        {isDeleting ? "Deleting..." : "Delete listing"}
                      </button>
                    </div>

                    {errorMessage ? (
                      <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                        {errorMessage}
                      </div>
                    ) : null}
                  </div>

                  <div className="rounded-[2rem] border border-gray-100 bg-white p-6 shadow-xl shadow-green-950/5">
                    <p className="text-sm font-bold uppercase tracking-[0.18em] text-gray-500">Current saved values</p>
                    <h3 className="mt-2 text-xl font-black text-gray-900">Backend fields at a glance</h3>

                    <div className="mt-5 space-y-4">
                      {details.map((detail) => (
                        <div key={detail.label} className="rounded-2xl bg-gray-50 p-4">
                          <div className="flex items-center gap-2 text-sm font-bold text-gray-800">
                            <span className="text-green-700">{detail.icon}</span>
                            {detail.label}
                          </div>
                          <p className="mt-2 break-words text-sm leading-6 text-gray-600">{detail.value}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-[2rem] border border-gray-100 bg-white p-6 shadow-xl shadow-green-950/5">
                    <p className="text-sm font-bold uppercase tracking-[0.18em] text-gray-500">Workspace note</p>
                    <h3 className="mt-2 text-xl font-black text-gray-900">Separate from the editor by design</h3>
                    <div className="mt-4 flex items-start gap-3 rounded-2xl bg-gray-50 p-4">
                      <div className="rounded-full bg-green-100 p-2 text-green-700">
                        <Sparkles className="h-4 w-4" />
                      </div>
                      <p className="text-sm leading-6 text-gray-600">
                        This page is for reviewing the saved backend data in a
                        polished UI. The edit form stays separate so the workflow
                        remains focused and safer for production use.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
};

export default ManageListing;
