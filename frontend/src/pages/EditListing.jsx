import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Globe2,
  ImageIcon,
  IndianRupee,
  LoaderCircle,
  MapPin,
  RefreshCcw,
  Save,
  Sparkles,
  Sprout,
  TextCursorInput,
  UploadCloud,
  X,
} from "lucide-react";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import {
  ACCEPTED_IMAGE_EXTENSIONS,
  formatFileSize,
  MAX_IMAGE_SIZE_LABEL,
  validateImageFile,
} from "../utils/imageUpload";
import FeedbackState from "../components/common/FeedbackState";
import {
  getStoredUser,
  isAdmin,
  isListingOwner,
} from "../services/authService";
import { fetchListingById, updateListing } from "../services/listingService";

const DEFAULT_IMAGE =
  "https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?auto=format&fit=crop&w=900&q=80";

const initialCropState = {
  crop: "",
  description: "",
  image: {
    filename: "",
    url: "",
  },
  price: "",
  location: "",
  country: "",
};

const fieldBaseClass =
  "w-full rounded-2xl border border-gray-200 bg-white px-4 py-3.5 text-gray-900 shadow-sm outline-none transition-all duration-200 placeholder:text-gray-400 focus:border-green-500 focus:ring-4 focus:ring-green-500/10";

const tips = [
  "Tighten the title and description together so the listing feels consistent and intentional.",
  "Update pricing and location carefully. Buyers often decide in seconds using just those two details.",
  "Refresh the image if the batch quality, freshness, or appearance has changed since the original post.",
];

function normalizeListing(listing) {
  return {
    crop: listing?.crop || "",
    description: listing?.description || "",
    image: {
      filename:
        typeof listing?.image === "object" ? listing?.image?.filename || "" : "",
      url:
        typeof listing?.image === "string"
          ? listing.image
          : listing?.image?.url || "",
    },
    price:
      listing?.price === 0 || listing?.price
        ? String(listing.price)
        : "",
    location: listing?.location || "",
    country: listing?.country || "",
  };
}

function createSnapshot(listing) {
  return JSON.stringify({
    crop: listing.crop.trim(),
    description: listing.description.trim(),
    imageUrl: listing.image.url.trim(),
    price: String(listing.price).trim(),
    location: listing.location.trim(),
    country: listing.country.trim(),
  });
}

const EditListing = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const currentUser = getStoredUser();
  const imageInputRef = useRef(null);
  const [crop, setCrop] = useState(initialCropState);
  const [originalCrop, setOriginalCrop] = useState(initialCropState);
  const [sourceListing, setSourceListing] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(DEFAULT_IMAGE);
  const [imageError, setImageError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const descriptionCount = crop.description.length;
  const isReadyToSubmit =
    crop.crop.trim() &&
    crop.description.trim().length >= 20 &&
    crop.price !== "" &&
    crop.location.trim() &&
    crop.country.trim();

  useEffect(() => {
    if (selectedImage) {
      const objectUrl = URL.createObjectURL(selectedImage);
      setPreviewImage(objectUrl);

      return () => {
        URL.revokeObjectURL(objectUrl);
      };
    }

    setPreviewImage(crop.image.url.trim() || DEFAULT_IMAGE);
  }, [selectedImage, crop.image.url]);

  const hasChanges = useMemo(
    () =>
      selectedImage !== null ||
      createSnapshot(crop) !== createSnapshot(originalCrop),
    [crop, originalCrop, selectedImage],
  );

  const changedFields = useMemo(() => {
    const allFields = [
      {
        label: "Crop name",
        current: crop.crop.trim(),
        original: originalCrop.crop.trim(),
      },
      {
        label: "Description",
        current: crop.description.trim(),
        original: originalCrop.description.trim(),
      },
      {
        label: "Image",
        current: selectedImage ? `New file: ${selectedImage.name}` : crop.image.url.trim(),
        original: originalCrop.image.url.trim(),
      },
      {
        label: "Price",
        current: String(crop.price).trim(),
        original: String(originalCrop.price).trim(),
      },
      {
        label: "Location",
        current: crop.location.trim(),
        original: originalCrop.location.trim(),
      },
      {
        label: "Country",
        current: crop.country.trim(),
        original: originalCrop.country.trim(),
      },
    ];

    return allFields.filter((field) => field.current !== field.original);
  }, [crop, originalCrop, selectedImage]);

  const loadListing = useCallback(async () => {
    setIsLoading(true);
    setLoadError("");

    try {
      const listingData = await fetchListingById(id);
      const normalizedListing = normalizeListing(listingData);
      setSourceListing(listingData);
      setCrop(normalizedListing);
      setOriginalCrop(normalizedListing);
    } catch (err) {
      setLoadError(
        err.userMessage ||
          err.message ||
          "We could not load this listing right now.",
      );
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadListing();
  }, [loadListing]);

  const canEditListing = useMemo(() => {
    if (!sourceListing || !currentUser) {
      return false;
    }

    return isListingOwner(sourceListing, currentUser) || isAdmin(currentUser);
  }, [currentUser, sourceListing]);

  function handleChange(e) {
    const { name, value } = e.target;

    setCrop((prevCrop) => ({
      ...prevCrop,
      [name]: value,
    }));

    if (submitError) {
      setSubmitError("");
    }
  }

  function handleImageChange(e) {
    const file = e.target.files?.[0];

    if (!file) {
      setSelectedImage(null);
      setImageError("");
      return;
    }

    const validationMessage = validateImageFile(file);

    if (validationMessage) {
      setImageError(validationMessage);
      setSelectedImage(null);
      e.target.value = "";
      return;
    }

    setSelectedImage(file);
    setImageError("");

    if (submitError) {
      setSubmitError("");
    }
  }

  function clearSelectedImage() {
    setSelectedImage(null);
    setImageError("");
    if (imageInputRef.current) {
      imageInputRef.current.value = "";
    }
  }

  function handleReset() {
    setCrop(originalCrop);
    setSelectedImage(null);
    setImageError("");
    setSubmitError("");
    if (imageInputRef.current) {
      imageInputRef.current.value = "";
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();

    setIsSubmitting(true);
    setSubmitError("");

    try {
      const formData = new FormData();
      formData.append("crop", crop.crop.trim());
      formData.append("description", crop.description.trim());
      formData.append("price", String(Number(crop.price)));
      formData.append("location", crop.location.trim());
      formData.append("country", crop.country.trim());

      if (selectedImage) {
        formData.append("image", selectedImage);
      }

      await updateListing(id, formData);

      navigate(`/listings/${id}/manage`);
    } catch (err) {
      setSubmitError(
        err.userMessage ||
          "We could not save your changes right now. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <NavBar />

      <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(167,243,208,0.35),_transparent_26%),linear-gradient(180deg,_#f7fff8_0%,_#f4f6f4_46%,_#edf5ef_100%)] pt-28 pb-16 selection:bg-green-100 selection:text-green-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => navigate(`/listings/${id}/manage`)}
            className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 text-sm font-semibold text-gray-600 shadow-sm transition-colors hover:text-green-700"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to workspace
          </button>

          {isLoading ? (
            <div className="space-y-8">
              <div className="animate-pulse overflow-hidden rounded-[2rem] border border-green-900/10 bg-white p-8 shadow-xl shadow-green-950/5">
                <div className="h-5 w-32 rounded-full bg-gray-200" />
                <div className="mt-4 h-12 w-3/4 rounded-2xl bg-gray-200" />
                <div className="mt-4 h-6 w-2/3 rounded-xl bg-gray-100" />
              </div>

              <div className="grid gap-8 lg:grid-cols-[1.08fr_0.92fr]">
                <div className="animate-pulse rounded-[2rem] border border-gray-100 bg-white p-8 shadow-xl shadow-green-950/5">
                  <div className="h-10 w-1/2 rounded-xl bg-gray-200" />
                  <div className="mt-8 space-y-5">
                    <div className="h-14 rounded-2xl bg-gray-100" />
                    <div className="h-40 rounded-2xl bg-gray-100" />
                    <div className="grid gap-5 md:grid-cols-2">
                      <div className="h-14 rounded-2xl bg-gray-100" />
                      <div className="h-14 rounded-2xl bg-gray-100" />
                    </div>
                    <div className="h-14 rounded-2xl bg-gray-100" />
                    <div className="h-20 rounded-[1.75rem] bg-gray-100" />
                  </div>
                </div>

                <div className="animate-pulse rounded-[2rem] border border-gray-100 bg-white p-8 shadow-xl shadow-green-950/5">
                  <div className="h-72 rounded-[1.75rem] bg-gray-100" />
                  <div className="mt-6 h-8 w-1/2 rounded-xl bg-gray-200" />
                  <div className="mt-4 h-20 rounded-2xl bg-gray-100" />
                </div>
              </div>
            </div>
          ) : loadError ? (
            <div className="rounded-[2rem] border border-red-100 bg-white p-10 text-center shadow-xl shadow-red-950/5">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-red-600">
                <RefreshCcw className="h-6 w-6" />
              </div>
              <h2 className="mt-6 text-2xl font-black text-gray-900">
                We could not open this listing for editing
              </h2>
              <p className="mx-auto mt-3 max-w-xl text-gray-500">{loadError}</p>
              <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                <button
                  onClick={loadListing}
                  className="rounded-2xl bg-gray-900 px-6 py-3 font-bold text-white transition-colors hover:bg-green-600"
                >
                  Try again
                </button>
                <button
                  onClick={() => navigate("/listings")}
                  className="rounded-2xl border border-gray-200 bg-white px-6 py-3 font-bold text-gray-700 transition-colors hover:border-green-300 hover:text-green-700"
                >
                  Go to marketplace
                </button>
              </div>
            </div>
          ) : !canEditListing ? (
            <FeedbackState
              icon={RefreshCcw}
              title="You do not have access to edit this listing"
              description="Only the listing owner or an admin can open the editor for this item."
              tone="error"
              actions={[
                <button
                  key="workspace"
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
              <div className="relative overflow-hidden rounded-[2rem] border border-green-900/10 bg-[linear-gradient(135deg,_rgba(4,120,87,1)_0%,_rgba(20,83,45,0.96)_54%,_rgba(132,204,22,0.88)_100%)] px-6 py-8 text-white shadow-2xl shadow-green-950/10 sm:px-8 sm:py-10 lg:px-10">
                <div className="absolute -right-10 -top-12 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
                <div className="absolute bottom-0 right-0 h-32 w-32 translate-x-8 translate-y-8 rounded-full bg-emerald-200/10 blur-3xl" />

                <div className="relative flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
                  <div className="max-w-3xl">
                    <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold text-green-50 backdrop-blur-sm">
                      <Sparkles className="h-4 w-4" />
                      Refine your listing with confidence
                    </div>

                    <h1 className="text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
                      Edit the details buyers notice first.
                    </h1>
                    <p className="mt-4 max-w-2xl text-base leading-7 text-green-50/90 sm:text-lg">
                      Sharpen the title, update pricing, and replace the image
                      with a better upload whenever the current crop batch looks
                      different.
                    </p>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-3 lg:min-w-[420px]">
                    <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-sm">
                      <p className="text-sm text-green-50/75">Current mode</p>
                      <p className="mt-1 text-xl font-extrabold">Editing live</p>
                    </div>
                    <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-sm">
                      <p className="text-sm text-green-50/75">Detected changes</p>
                      <p className="mt-1 text-xl font-extrabold">
                        {changedFields.length}
                      </p>
                    </div>
                    <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-sm">
                      <p className="text-sm text-green-50/75">Status</p>
                      <p className="mt-1 text-xl font-extrabold">
                        {hasChanges ? "Unsaved edits" : "Synced"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 grid gap-8 lg:grid-cols-[1.08fr_0.92fr]">
                <div className="rounded-[2rem] border border-gray-100 bg-white p-6 shadow-xl shadow-green-950/5 sm:p-8">
                  <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                      <p className="text-sm font-bold uppercase tracking-[0.18em] text-green-700">
                        Edit form
                      </p>
                      <h2 className="mt-2 text-2xl font-black tracking-tight text-gray-900 sm:text-3xl">
                        Upgrade the listing without losing what already works
                      </h2>
                    </div>

                    <div className="inline-flex items-center gap-2 rounded-full bg-green-50 px-4 py-2 text-sm font-semibold text-green-700">
                      <BadgeCheck className="h-4 w-4" />
                      Direct image replacement ready
                    </div>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-8">
                    <section className="grid gap-6">
                      <div>
                        <label
                          htmlFor="crop"
                          className="mb-2 flex items-center gap-2 text-sm font-bold text-gray-800"
                        >
                          <Sprout className="h-4 w-4 text-green-600" />
                          Crop name
                        </label>
                        <input
                          type="text"
                          id="crop"
                          name="crop"
                          value={crop.crop}
                          onChange={handleChange}
                          className={fieldBaseClass}
                          placeholder="Ex. Premium Tomato"
                          minLength="2"
                          required
                        />
                        <p className="mt-2 text-sm text-gray-500">
                          Strong listings use names buyers already expect to
                          search for.
                        </p>
                      </div>

                      <div>
                        <div className="mb-2 flex items-center justify-between gap-3">
                          <label
                            htmlFor="description"
                            className="flex items-center gap-2 text-sm font-bold text-gray-800"
                          >
                            <TextCursorInput className="h-4 w-4 text-green-600" />
                            Description
                          </label>
                          <span className="text-xs font-semibold text-gray-400">
                            {descriptionCount}/280
                          </span>
                        </div>

                        <textarea
                          id="description"
                          name="description"
                          value={crop.description}
                          onChange={handleChange}
                          rows="5"
                          minLength="20"
                          maxLength="280"
                          className={`${fieldBaseClass} min-h-[150px] resize-none`}
                          placeholder="Mention freshness, grade, harvest stage, packing, and readiness for transport."
                          required
                        />
                        <p className="mt-2 text-sm text-gray-500">
                          Refresh the wording if the stock condition or quality
                          has changed.
                        </p>
                      </div>
                    </section>

                    <section className="grid gap-6">
                      <div>
                        <div className="mb-2 flex items-center gap-2 text-sm font-bold text-gray-800">
                          <ImageIcon className="h-4 w-4 text-green-600" />
                          Replace current image
                        </div>

                        <div className="rounded-[1.75rem] border border-gray-200 bg-gray-50 p-4">
                          <input
                            id="listing-image"
                            type="file"
                            ref={imageInputRef}
                            accept={ACCEPTED_IMAGE_EXTENSIONS}
                            onChange={handleImageChange}
                            className="hidden"
                          />

                          <label
                            htmlFor="listing-image"
                            className="block cursor-pointer rounded-[1.5rem] border border-dashed border-green-200 bg-white px-5 py-6 transition-colors hover:border-green-400 hover:bg-green-50/60"
                          >
                            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-green-100 text-green-700">
                                <UploadCloud className="h-6 w-6" />
                              </div>
                              <div>
                                <p className="text-base font-bold text-gray-900">
                                  Upload a new image directly
                                </p>
                                <p className="mt-1 text-sm text-gray-500">
                                  PNG, JPG, JPEG, and WEBP supported up to
                                  {` ${MAX_IMAGE_SIZE_LABEL}.`}
                                </p>
                              </div>
                            </div>
                          </label>

                          {selectedImage ? (
                            <div className="mt-4 flex flex-col gap-3 rounded-2xl border border-green-100 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
                              <div>
                                <p className="text-sm font-bold text-gray-900">
                                  {selectedImage.name}
                                </p>
                                <p className="mt-1 text-sm text-gray-500">
                                  {formatFileSize(selectedImage.size)}
                                </p>
                              </div>
                              <button
                                type="button"
                                onClick={clearSelectedImage}
                                className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-600 transition-colors hover:border-red-200 hover:text-red-600"
                              >
                                <X className="h-4 w-4" />
                                Keep current image
                              </button>
                            </div>
                          ) : (
                            <div className="mt-4 rounded-2xl border border-gray-100 bg-white p-4">
                              <p className="text-sm font-bold text-gray-900">
                                Current saved image
                              </p>
                              <p className="mt-1 break-words text-sm text-gray-500">
                                {crop.image.url || "Default image in use"}
                              </p>
                            </div>
                          )}

                          {imageError ? (
                            <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                              {imageError}
                            </div>
                          ) : (
                            <p className="mt-4 text-sm text-gray-500">
                              Leave this unchanged if you want to keep the current
                              Cloudinary image.
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="grid gap-6 md:grid-cols-2">
                        <div>
                          <label
                            htmlFor="price"
                            className="mb-2 flex items-center gap-2 text-sm font-bold text-gray-800"
                          >
                            <IndianRupee className="h-4 w-4 text-green-600" />
                            Price per unit
                          </label>
                          <input
                            type="number"
                            id="price"
                            name="price"
                            value={crop.price}
                            onChange={handleChange}
                            className={fieldBaseClass}
                            placeholder="Ex. 1200"
                            min="0"
                            step="0.01"
                            required
                          />
                        </div>

                        <div>
                          <label
                            htmlFor="location"
                            className="mb-2 flex items-center gap-2 text-sm font-bold text-gray-800"
                          >
                            <MapPin className="h-4 w-4 text-green-600" />
                            Location
                          </label>
                          <input
                            type="text"
                            id="location"
                            name="location"
                            value={crop.location}
                            onChange={handleChange}
                            className={fieldBaseClass}
                            placeholder="Ex. Nashik"
                            minLength="2"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label
                          htmlFor="country"
                          className="mb-2 flex items-center gap-2 text-sm font-bold text-gray-800"
                        >
                          <Globe2 className="h-4 w-4 text-green-600" />
                          Country
                        </label>
                        <input
                          type="text"
                          id="country"
                          name="country"
                          value={crop.country}
                          onChange={handleChange}
                          className={fieldBaseClass}
                          placeholder="Ex. India"
                          minLength="2"
                          required
                        />
                      </div>
                    </section>

                    {submitError ? (
                      <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                        {submitError}
                      </div>
                    ) : null}

                    <div className="rounded-[1.75rem] border border-green-100 bg-gradient-to-r from-green-50 to-lime-50 p-5">
                      <div className="flex flex-col gap-4">
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                          <div>
                            <p className="text-sm font-bold uppercase tracking-[0.18em] text-green-700">
                              Save panel
                            </p>
                            <p className="mt-1 text-sm text-gray-600">
                              Keep refining until the preview feels marketplace
                              ready, then save the update.
                            </p>
                          </div>

                          <div className="inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-sm font-semibold text-gray-700">
                            <Save className="h-4 w-4 text-green-600" />
                            {hasChanges ? "Unsaved changes" : "No pending changes"}
                          </div>
                        </div>

                        <div className="flex flex-col gap-3 sm:flex-row">
                          <button
                            type="submit"
                            disabled={
                              isSubmitting ||
                              !isReadyToSubmit ||
                              !hasChanges ||
                              !!imageError
                            }
                            className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-gray-900 px-6 py-4 text-base font-bold text-white shadow-lg transition-all duration-200 hover:bg-green-600 hover:shadow-green-600/25 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:shadow-none"
                          >
                            {isSubmitting ? (
                              <>
                                <LoaderCircle className="h-5 w-5 animate-spin" />
                                Saving changes...
                              </>
                            ) : (
                              <>
                                Save changes
                                <ArrowRight className="h-5 w-5" />
                              </>
                            )}
                          </button>

                          <button
                            type="button"
                            onClick={handleReset}
                            disabled={!hasChanges || isSubmitting}
                            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-white px-6 py-4 text-base font-bold text-gray-700 transition-colors hover:border-green-300 hover:text-green-700 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            <RefreshCcw className="h-5 w-5" />
                            Reset edits
                          </button>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
                <div className="space-y-6 lg:sticky lg:top-28 lg:self-start">
                  <div className="overflow-hidden rounded-[2rem] border border-gray-100 bg-white shadow-xl shadow-green-950/5">
                    <div className="border-b border-gray-100 bg-gray-50 px-6 py-4">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="text-sm font-bold uppercase tracking-[0.18em] text-gray-500">
                            Live preview
                          </p>
                          <h3 className="mt-1 text-xl font-black text-gray-900">
                            Buyer-facing card after this update
                          </h3>
                        </div>
                        <div className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">
                          Auto-updating
                        </div>
                      </div>
                    </div>

                    <div className="p-5 sm:p-6">
                      <div className="overflow-hidden rounded-[1.75rem] border border-gray-100 bg-white shadow-sm">
                        <div className="relative h-72 overflow-hidden bg-gray-100">
                          <img
                            src={previewImage}
                            alt={crop.crop || "Crop preview"}
                            className="h-full w-full object-cover"
                          />
                          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-gray-950/80 via-gray-950/10 to-transparent p-5">
                            <div className="inline-flex items-center gap-2 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-gray-700 backdrop-blur-sm">
                              <BadgeCheck className="h-3.5 w-3.5 text-green-600" />
                              Updated listing preview
                            </div>
                          </div>
                        </div>

                        <div className="space-y-4 p-5">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <h4 className="text-2xl font-black tracking-tight text-gray-900">
                                {crop.crop.trim() || "Your crop name will appear here"}
                              </h4>
                              <div className="mt-2 flex flex-wrap gap-2 text-sm">
                                <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-3 py-1 font-semibold text-green-700">
                                  <MapPin className="h-3.5 w-3.5" />
                                  {crop.location.trim() || "City"}
                                </span>
                                <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 font-semibold text-gray-600">
                                  <Globe2 className="h-3.5 w-3.5" />
                                  {crop.country.trim() || "Country"}
                                </span>
                              </div>
                            </div>

                            <div className="rounded-2xl bg-green-50 px-4 py-3 text-right">
                              <p className="text-xs font-bold uppercase tracking-[0.18em] text-green-700">
                                Price
                              </p>
                              <p className="mt-1 text-2xl font-black text-green-700">
                                {crop.price || "0"}
                              </p>
                              <p className="text-xs font-semibold text-green-700/70">
                                per unit
                              </p>
                            </div>
                          </div>

                          <p className="text-sm leading-7 text-gray-600">
                            {crop.description.trim() ||
                              "Your updated description will show how this crop should be understood by buyers before they contact you."}
                          </p>

                          <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
                            <p className="text-sm font-bold text-gray-800">
                              Change summary
                            </p>

                            {changedFields.length > 0 ? (
                              <div className="mt-3 space-y-3">
                                {changedFields.map((field) => (
                                  <div
                                    key={field.label}
                                    className="rounded-2xl bg-white p-3 shadow-sm"
                                  >
                                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-green-700">
                                      {field.label}
                                    </p>
                                    <p className="mt-2 text-sm text-gray-500 line-through">
                                      {field.original || "Empty"}
                                    </p>
                                    <p className="mt-1 text-sm font-semibold text-gray-900">
                                      {field.current || "Empty"}
                                    </p>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className="mt-2 text-sm leading-6 text-gray-600">
                                No unsaved edits yet. Start updating fields and
                                the differences will show here instantly.
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-[2rem] border border-gray-100 bg-white p-6 shadow-xl shadow-green-950/5">
                    <p className="text-sm font-bold uppercase tracking-[0.18em] text-gray-500">
                      Refinement tips
                    </p>
                    <h3 className="mt-2 text-xl font-black text-gray-900">
                      Keep the edit purposeful
                    </h3>

                    <div className="mt-5 space-y-4">
                      {tips.map((tip) => (
                        <div
                          key={tip}
                          className="flex items-start gap-3 rounded-2xl bg-gray-50 p-4"
                        >
                          <div className="mt-0.5 rounded-full bg-green-100 p-2 text-green-700">
                            <Sparkles className="h-4 w-4" />
                          </div>
                          <p className="text-sm leading-6 text-gray-600">{tip}</p>
                        </div>
                      ))}
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

export default EditListing;
