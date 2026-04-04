import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  BadgeCheck,
  Globe2,
  ImageIcon,
  IndianRupee,
  LoaderCircle,
  MapPin,
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
import { createListing } from "../services/listingService";

const DEFAULT_IMAGE =
  "https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?auto=format&fit=crop&w=900&q=80";

const initialCropState = {
  crop: "",
  description: "",
  price: "",
  location: "",
  country: "",
};

const fieldBaseClass =
  "w-full rounded-2xl border border-gray-200 bg-white px-4 py-3.5 text-gray-900 shadow-sm outline-none transition-all duration-200 placeholder:text-gray-400 focus:border-green-500 focus:ring-4 focus:ring-green-500/10";

const tips = [
  "Use the crop name buyers actually search for, like Tomato, Wheat, or Green Chilli.",
  "Write the condition clearly: fresh harvest, organic, sorted, cleaned, or ready for transport.",
  "Use a bright photo that shows quality at a glance so your listing feels trustworthy.",
];

const NewListing = () => {
  const navigate = useNavigate();
  const imageInputRef = useRef(null);
  const [crop, setCrop] = useState(initialCropState);
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(DEFAULT_IMAGE);
  const [imageError, setImageError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const descriptionCount = crop.description.length;
  const isReadyToSubmit =
    crop.crop.trim() &&
    crop.description.trim().length >= 20 &&
    crop.price !== "" &&
    crop.location.trim() &&
    crop.country.trim();

  useEffect(() => {
    if (!selectedImage) {
      setPreviewImage(DEFAULT_IMAGE);
      return;
    }

    const objectUrl = URL.createObjectURL(selectedImage);
    setPreviewImage(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [selectedImage]);

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

      const createdListing = await createListing(formData);
      navigate(`/listings/${createdListing._id}/manage`);
    } catch (err) {
      setSubmitError(
        err.userMessage ||
          "We could not publish the listing right now. Please review the details and try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <NavBar />

      <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(187,247,208,0.55),_transparent_28%),linear-gradient(180deg,_#f8fff8_0%,_#f5f7f6_48%,_#eef6f0_100%)] pt-28 pb-16 selection:bg-green-100 selection:text-green-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-[2rem] border border-green-900/10 bg-[linear-gradient(135deg,_rgba(6,95,70,1)_0%,_rgba(20,83,45,0.96)_52%,_rgba(101,163,13,0.92)_100%)] px-6 py-8 text-white shadow-2xl shadow-green-950/10 sm:px-8 sm:py-10 lg:px-10">
            <div className="absolute -right-10 -top-12 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
            <div className="absolute bottom-0 right-0 h-32 w-32 translate-x-8 translate-y-8 rounded-full bg-lime-300/10 blur-3xl" />

            <div className="relative flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-3xl">
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold text-green-50 backdrop-blur-sm">
                  <Sparkles className="h-4 w-4" />
                  Make your listing stand out
                </div>

                <h1 className="text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
                  Add a crop listing buyers can trust in seconds.
                </h1>
                <p className="mt-4 max-w-2xl text-base leading-7 text-green-50/90 sm:text-lg">
                  Clean details, a strong image, and the right pricing help your
                  product feel reliable before a buyer even opens the card.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-3 lg:min-w-[420px]">
                <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-sm">
                  <p className="text-sm text-green-50/75">Faster trust</p>
                  <p className="mt-1 text-xl font-extrabold">Clear details</p>
                </div>
                <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-sm">
                  <p className="text-sm text-green-50/75">Better clicks</p>
                  <p className="mt-1 text-xl font-extrabold">Strong preview</p>
                </div>
                <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-sm">
                  <p className="text-sm text-green-50/75">Simple publish</p>
                  <p className="mt-1 text-xl font-extrabold">One clean form</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 grid gap-8 lg:grid-cols-[1.08fr_0.92fr]">
            <div className="rounded-[2rem] border border-gray-100 bg-white p-6 shadow-xl shadow-green-950/5 sm:p-8">
              <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-sm font-bold uppercase tracking-[0.18em] text-green-700">
                    Listing form
                  </p>
                  <h2 className="mt-2 text-2xl font-black tracking-tight text-gray-900 sm:text-3xl">
                    Tell buyers what makes this crop worth choosing
                  </h2>
                </div>
                <div className="inline-flex items-center gap-2 rounded-full bg-green-50 px-4 py-2 text-sm font-semibold text-green-700">
                  <BadgeCheck className="h-4 w-4" />
                  Direct image upload ready
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
                      Keep it short and recognizable so it looks strong in the
                      marketplace grid.
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
                      placeholder="Mention freshness, crop quality, packaging, harvest stage, or delivery readiness."
                      required
                    />
                    <p className="mt-2 text-sm text-gray-500">
                      Buyers respond better when they understand quality and
                      condition at a glance.
                    </p>
                  </div>
                </section>

                <section className="grid gap-6">
                  <div>
                    <div className="mb-2 flex items-center gap-2 text-sm font-bold text-gray-800">
                      <ImageIcon className="h-4 w-4 text-green-600" />
                      Upload crop image
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
                              Click to upload an image directly
                            </p>
                            <p className="mt-1 text-sm text-gray-500">
                              PNG, JPG, JPEG, and WEBP supported up to{" "}
                              {MAX_IMAGE_SIZE_LABEL}.
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
                            Remove file
                          </button>
                        </div>
                      ) : (
                        <p className="mt-4 text-sm text-gray-500">
                          If you skip the upload, the default crop image will be
                          used for now.
                        </p>
                      )}

                      {imageError ? (
                        <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                          {imageError}
                        </div>
                      ) : null}
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
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm font-bold uppercase tracking-[0.18em] text-green-700">
                        Ready to publish
                      </p>
                      <p className="mt-1 text-sm text-gray-600">
                        Your listing will be added to the marketplace with the
                        details shown in the preview panel.
                      </p>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting || !isReadyToSubmit || !!imageError}
                      className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gray-900 px-6 py-4 text-base font-bold text-white shadow-lg transition-all duration-200 hover:bg-green-600 hover:shadow-green-600/25 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:shadow-none"
                    >
                      {isSubmitting ? (
                        <>
                          <LoaderCircle className="h-5 w-5 animate-spin" />
                          Publishing...
                        </>
                      ) : (
                        <>
                          Publish listing
                          <ArrowRight className="h-5 w-5" />
                        </>
                      )}
                    </button>
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
                        This is how buyers will feel your listing
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
                          Buyer-facing preview
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
                          "Your description will help buyers understand freshness, grade, and readiness before they contact you."}
                      </p>

                      <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
                        <p className="text-sm font-bold text-gray-800">
                          Quick buyer impression
                        </p>
                        <p className="mt-2 text-sm leading-6 text-gray-600">
                          {selectedImage
                            ? "The listing already feels stronger because you have attached a real image instead of relying on a manual URL."
                            : crop.crop.trim() && crop.description.trim()
                              ? "This listing already looks credible. Adding a real uploaded photo will make it feel even more trustworthy."
                              : "Complete the crop name and description first. Those two fields do most of the trust-building work."}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-[2rem] border border-gray-100 bg-white p-6 shadow-xl shadow-green-950/5">
                <p className="text-sm font-bold uppercase tracking-[0.18em] text-gray-500">
                  Listing tips
                </p>
                <h3 className="mt-2 text-xl font-black text-gray-900">
                  Small details that make a big difference
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
        </div>
      </div>

      <Footer />
    </>
  );
};

export default NewListing;
