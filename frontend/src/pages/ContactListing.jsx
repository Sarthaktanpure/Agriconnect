import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  AlertCircle,
  ArrowLeft,
  ArrowUpRight,
  BadgeCheck,
  Globe2,
  Mail,
  MapPin,
  MessageCircle,
  PhoneCall,
  RefreshCcw,
  ShieldCheck,
  Sparkles,
  Sprout,
  UserRound,
} from "lucide-react";
import Footer from "../components/Footer";
import NavBar from "../components/NavBar";
import FeedbackState from "../components/common/FeedbackState";
import { fetchListingContactById } from "../services/listingService";
import { formatPrice, getListingImage, getLocationLabel } from "../utils/listingUtils";

const channelMeta = {
  email: {
    label: "Email",
    title: "Drafted email",
    description: "Open your mail app with a prefilled subject and message.",
    icon: Mail,
    wrapper:
      "border-slate-200 bg-[linear-gradient(180deg,_rgba(248,250,252,1)_0%,_rgba(241,245,249,0.82)_100%)]",
    iconWrapper: "bg-slate-900 text-white",
    cta: "Open email draft",
  },
  whatsapp: {
    label: "WhatsApp",
    title: "Direct WhatsApp",
    description: "Launch a ready-to-send WhatsApp message for this listing.",
    icon: MessageCircle,
    wrapper:
      "border-emerald-200 bg-[linear-gradient(180deg,_rgba(236,253,245,1)_0%,_rgba(209,250,229,0.82)_100%)]",
    iconWrapper: "bg-emerald-600 text-white",
    cta: "Open WhatsApp",
  },
  call: {
    label: "Call",
    title: "Call seller",
    description: "Start a phone call using the seller's saved marketplace number.",
    icon: PhoneCall,
    wrapper:
      "border-amber-200 bg-[linear-gradient(180deg,_rgba(255,251,235,1)_0%,_rgba(254,243,199,0.88)_100%)]",
    iconWrapper: "bg-amber-500 text-white",
    cta: "Call now",
  },
};

function formatPhoneNumber(value) {
  const rawValue = String(value || "").trim();
  const digits = rawValue.replace(/\D/g, "");

  if (!digits) {
    return "Not added yet";
  }

  if (rawValue.startsWith("+") && digits.length > 10) {
    const countryCodeLength = digits.length - 10;
    return `+${digits.slice(0, countryCodeLength)} ${digits.slice(
      countryCodeLength,
      countryCodeLength + 5,
    )} ${digits.slice(countryCodeLength + 5)}`;
  }

  if (digits.length === 10) {
    return `${digits.slice(0, 5)} ${digits.slice(5)}`;
  }

  return rawValue.startsWith("+") ? `+${digits}` : digits;
}

const ContactListing = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [contactData, setContactData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const loadContactData = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const data = await fetchListingContactById(id);
      setContactData(data);
    } catch (err) {
      setErrorMessage(
        err.userMessage ||
          "We could not load the seller contact page right now. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadContactData();
  }, [loadContactData]);

  const channels = useMemo(
    () =>
      Object.entries(channelMeta).map(([key, meta]) => ({
        key,
        meta,
        action: contactData?.actions?.[key] || {
          available: false,
          href: "",
          value: "",
        },
      })),
    [contactData],
  );

  const listing = contactData?.listing || null;
  const farmer = contactData?.farmer || null;
  const draft = contactData?.draft || null;
  const availableChannelCount = channels.filter(({ action }) => action.available).length;
  const hasPhoneChannel = Boolean(
    contactData?.actions?.call?.available || contactData?.actions?.whatsapp?.available,
  );

  return (
    <>
      <NavBar />

      <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(187,247,208,0.42),_transparent_24%),linear-gradient(180deg,_#f8fff8_0%,_#f4f6f4_46%,_#edf5ef_100%)] pt-28 pb-16 font-sans selection:bg-green-100 selection:text-green-900">
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
                <div className="h-5 w-48 rounded-full bg-gray-200" />
                <div className="mt-4 h-14 w-3/4 rounded-2xl bg-gray-200" />
                <div className="mt-4 h-6 w-2/3 rounded-xl bg-gray-100" />
              </div>
              <div className="grid gap-8 xl:grid-cols-[1.02fr_0.98fr]">
                <div className="space-y-8">
                  <div className="animate-pulse rounded-[2rem] border border-gray-100 bg-white p-8 shadow-xl shadow-green-950/5">
                    <div className="h-[360px] rounded-[1.75rem] bg-gray-100" />
                    <div className="mt-6 h-10 w-1/2 rounded-xl bg-gray-200" />
                    <div className="mt-4 h-24 rounded-2xl bg-gray-100" />
                  </div>
                  <div className="animate-pulse rounded-[2rem] border border-gray-100 bg-white p-8 shadow-xl shadow-green-950/5">
                    <div className="h-10 w-1/3 rounded-xl bg-gray-200" />
                    <div className="mt-4 h-32 rounded-2xl bg-gray-100" />
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="animate-pulse rounded-[2rem] border border-gray-100 bg-white p-8 shadow-xl shadow-green-950/5">
                    <div className="h-32 rounded-[1.75rem] bg-gray-100" />
                  </div>
                  <div className="animate-pulse rounded-[2rem] border border-gray-100 bg-white p-8 shadow-xl shadow-green-950/5">
                    <div className="h-24 rounded-[1.75rem] bg-gray-100" />
                    <div className="mt-4 h-24 rounded-[1.75rem] bg-gray-100" />
                    <div className="mt-4 h-24 rounded-[1.75rem] bg-gray-100" />
                  </div>
                </div>
              </div>
            </div>
          ) : errorMessage ? (
            <FeedbackState
              icon={AlertCircle}
              title="We could not open this contact page"
              description={errorMessage}
              tone="error"
              actions={[
                <button
                  key="retry"
                  type="button"
                  onClick={loadContactData}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gray-900 px-6 py-3 font-bold text-white transition-colors hover:bg-green-600"
                >
                  <RefreshCcw className="h-5 w-5" />
                  Try again
                </button>,
                <button
                  key="back"
                  type="button"
                  onClick={() => navigate(`/listings/${id}`)}
                  className="inline-flex items-center justify-center rounded-2xl border border-gray-200 bg-white px-6 py-3 font-bold text-gray-700 transition-colors hover:border-green-300 hover:text-green-700"
                >
                  Back to listing
                </button>,
              ]}
            />
          ) : !listing || !farmer ? (
            <FeedbackState
              icon={AlertCircle}
              title="Contact details unavailable"
              description="We could not find enough seller information for this listing."
              actions={[
                <button
                  key="back"
                  type="button"
                  onClick={() => navigate(`/listings/${id}`)}
                  className="inline-flex items-center justify-center rounded-2xl border border-gray-200 bg-white px-6 py-3 font-bold text-gray-700 transition-colors hover:border-green-300 hover:text-green-700"
                >
                  Return to listing
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
                      Seller contact workspace
                    </div>
                    <h1 className="text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
                      Connect with {farmer.name || "this farmer"}
                    </h1>
                    <p className="mt-4 max-w-2xl text-base leading-7 text-green-50/90 sm:text-lg">
                      Choose the right outreach path for this listing. Email and
                      WhatsApp drafts are ready, and calling opens the saved seller
                      number when available.
                    </p>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-3 lg:min-w-[460px]">
                    <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-sm">
                      <p className="text-sm text-green-50/75">Channels ready</p>
                      <p className="mt-1 text-xl font-extrabold">
                        {availableChannelCount}/3 active
                      </p>
                    </div>
                    <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-sm">
                      <p className="text-sm text-green-50/75">Listed price</p>
                      <p className="mt-1 text-xl font-extrabold">{formatPrice(listing.price)}</p>
                    </div>
                    <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-sm">
                      <p className="text-sm text-green-50/75">Region</p>
                      <p className="mt-1 text-xl font-extrabold">{listing.country}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid gap-8 xl:grid-cols-[1.02fr_0.98fr]">
                <div className="space-y-8">
                  <div className="overflow-hidden rounded-[2rem] border border-gray-100 bg-white shadow-xl shadow-green-950/5">
                    <div className="relative h-[320px] overflow-hidden bg-gray-100 sm:h-[400px]">
                      <img
                        src={getListingImage(listing)}
                        alt={listing.crop || "Crop image"}
                        className="h-full w-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-gray-950/75 via-gray-950/5 to-transparent" />

                      <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
                        <div className="inline-flex items-center gap-2 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-gray-700 backdrop-blur-sm">
                          <BadgeCheck className="h-3.5 w-3.5 text-green-600" />
                          Contact-ready listing
                        </div>

                        <div className="mt-4 flex flex-wrap gap-2 text-sm">
                          <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-3 py-1 font-semibold text-white backdrop-blur-sm">
                            <MapPin className="h-3.5 w-3.5" />
                            {getLocationLabel(listing)}
                          </span>
                          <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-3 py-1 font-semibold text-white backdrop-blur-sm">
                            <ShieldCheck className="h-3.5 w-3.5" />
                            {farmer.role ? `${farmer.role} account` : "Verified seller"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="p-6 sm:p-8">
                      <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
                        <div className="max-w-2xl">
                          <p className="text-sm font-bold uppercase tracking-[0.18em] text-green-700">
                            Listing snapshot
                          </p>
                          <h2 className="mt-3 text-3xl font-black text-gray-900">
                            {listing.crop}
                          </h2>
                          <p className="mt-4 text-base leading-8 text-gray-600 sm:text-lg">
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
                          <p className="mt-3 text-sm leading-6 text-gray-600">
                            {getLocationLabel(listing)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-[2rem] border border-gray-100 bg-white p-6 shadow-xl shadow-green-950/5 sm:p-8">
                    <p className="text-sm font-bold uppercase tracking-[0.18em] text-gray-500">
                      Draft preview
                    </p>
                    <h3 className="mt-2 text-2xl font-black text-gray-900">
                      Start with a clear, listing-aware message
                    </h3>

                    <div className="mt-6 grid gap-4">
                      <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
                        <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
                          Email subject
                        </p>
                        <p className="mt-3 text-base font-semibold text-slate-900">
                          {draft?.emailSubject || "Inquiry about this listing"}
                        </p>
                      </div>
                      <div className="rounded-[1.5rem] border border-gray-100 bg-gray-50 p-5">
                        <p className="text-xs font-bold uppercase tracking-[0.18em] text-gray-500">
                          Email body / WhatsApp intent
                        </p>
                        <pre className="mt-3 whitespace-pre-wrap font-sans text-sm leading-7 text-gray-600">
                          {draft?.emailBody || draft?.whatsappMessage || "Draft unavailable."}
                        </pre>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-6 lg:sticky lg:top-28 lg:self-start">
                  <div className="rounded-[2rem] border border-gray-100 bg-white p-6 shadow-xl shadow-green-950/5">
                    <p className="text-sm font-bold uppercase tracking-[0.18em] text-gray-500">
                      Seller profile
                    </p>
                    <h3 className="mt-2 text-2xl font-black text-gray-900">
                      Farmer details for this listing
                    </h3>

                    <div className="mt-6 rounded-[1.5rem] border border-gray-100 bg-gray-50 p-5">
                      <div className="flex items-start gap-3">
                        <div className="rounded-full bg-green-100 p-3 text-green-700">
                          <UserRound className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-lg font-black text-gray-900">
                            {farmer.name || "Farmer profile unavailable"}
                          </p>
                          <p className="mt-1 text-sm font-semibold uppercase tracking-[0.18em] text-gray-500">
                            {farmer.role || "Farmer"}
                          </p>
                        </div>
                      </div>

                      <div className="mt-5 grid gap-3">
                        <div className="rounded-2xl bg-white px-4 py-3 shadow-sm">
                          <p className="text-xs font-bold uppercase tracking-[0.18em] text-gray-500">
                            Email
                          </p>
                          <p className="mt-2 text-sm font-semibold text-gray-900">
                            {farmer.email || "Email unavailable"}
                          </p>
                        </div>
                        <div className="rounded-2xl bg-white px-4 py-3 shadow-sm">
                          <p className="text-xs font-bold uppercase tracking-[0.18em] text-gray-500">
                            Phone
                          </p>
                          <p className="mt-2 text-sm font-semibold text-gray-900">
                            {formatPhoneNumber(farmer.phone)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-[2rem] border border-gray-100 bg-white p-6 shadow-xl shadow-green-950/5">
                    <p className="text-sm font-bold uppercase tracking-[0.18em] text-gray-500">
                      Contact actions
                    </p>
                    <h3 className="mt-2 text-2xl font-black text-gray-900">
                      Choose your outreach channel
                    </h3>

                    <div className="mt-6 space-y-4">
                      {channels.map(({ key, meta, action }) => {
                        const Icon = meta.icon;

                        if (!action.available) {
                          return (
                            <div
                              key={key}
                              className={`rounded-[1.75rem] border p-5 opacity-70 ${meta.wrapper}`}
                            >
                              <div className="flex items-start gap-4">
                                <div className={`rounded-2xl p-3 ${meta.iconWrapper}`}>
                                  <Icon className="h-5 w-5" />
                                </div>
                                <div className="flex-1">
                                  <div className="flex flex-wrap items-center gap-2">
                                    <p className="text-lg font-black text-gray-900">
                                      {meta.title}
                                    </p>
                                    <span className="rounded-full bg-white/80 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-gray-500">
                                      Unavailable
                                    </span>
                                  </div>
                                  <p className="mt-2 text-sm leading-6 text-gray-600">
                                    {meta.description}
                                  </p>
                                  <p className="mt-3 text-sm font-medium text-gray-500">
                                    {key === "email"
                                      ? "This seller does not have an email address available."
                                      : "This seller has not added a phone number for this channel yet."}
                                  </p>
                                </div>
                              </div>
                            </div>
                          );
                        }

                        return (
                          <a
                            key={key}
                            href={action.href}
                            target={key === "whatsapp" ? "_blank" : undefined}
                            rel={key === "whatsapp" ? "noreferrer" : undefined}
                            className={`group block rounded-[1.75rem] border p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg ${meta.wrapper}`}
                          >
                            <div className="flex items-start gap-4">
                              <div className={`rounded-2xl p-3 ${meta.iconWrapper}`}>
                                <Icon className="h-5 w-5" />
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center justify-between gap-3">
                                  <div>
                                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-gray-500">
                                      {meta.label}
                                    </p>
                                    <p className="mt-1 text-lg font-black text-gray-900">
                                      {meta.title}
                                    </p>
                                  </div>
                                  <ArrowUpRight className="h-5 w-5 text-gray-500 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-green-700" />
                                </div>

                                <p className="mt-2 text-sm leading-6 text-gray-600">
                                  {meta.description}
                                </p>
                                <p className="mt-3 text-sm font-semibold text-gray-900">
                                  {key === "call"
                                    ? formatPhoneNumber(action.value)
                                    : action.value}
                                </p>

                                <span className="mt-4 inline-flex items-center rounded-full bg-white/85 px-3 py-2 text-sm font-bold text-gray-900 shadow-sm">
                                  {meta.cta}
                                </span>
                              </div>
                            </div>
                          </a>
                        );
                      })}
                    </div>

                    <p className="mt-4 text-sm leading-6 text-gray-500">
                      Email is always drafted from the listing context. Call and
                      WhatsApp use the farmer&apos;s saved marketplace number.
                      {!hasPhoneChannel
                        ? " This seller has not added a phone number yet, so email is currently the live contact path."
                        : ""}
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

export default ContactListing;
