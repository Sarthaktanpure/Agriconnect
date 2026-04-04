import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  AlertCircle,
  ArrowRight,
  BadgeCheck,
  CalendarDays,
  LayoutGrid,
  Leaf,
  Mail,
  Phone,
  RefreshCcw,
  Save,
  ShieldCheck,
  Sparkles,
  UserRound,
} from "lucide-react";
import Footer from "../components/Footer";
import NavBar from "../components/NavBar";
import FeedbackState from "../components/common/FeedbackState";
import { fetchCurrentProfile, updateCurrentProfile } from "../services/authService";
import { formatPrice, getListingImage, getLocationLabel } from "../utils/listingUtils";

function formatRoleLabel(role) {
  if (!role) {
    return "Member";
  }

  return `${role.charAt(0).toUpperCase()}${role.slice(1)}`;
}

function formatMemberSince(dateValue) {
  if (!dateValue) {
    return "Recently joined";
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(dateValue));
}

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [saveMessage, setSaveMessage] = useState("");

  const loadProfile = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const data = await fetchCurrentProfile();
      setProfile(data);
      setForm({
        name: data.user?.name || "",
        email: data.user?.email || "",
        phone: data.user?.phone || "",
      });
    } catch (err) {
      setErrorMessage(
        err.userMessage ||
          "We could not load your account right now. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const roleLabel = formatRoleLabel(profile?.user?.role);
  const isFarmerAccount = profile?.user?.role === "farmer";
  const isDirty =
    form.name !== (profile?.user?.name || "") ||
    form.email !== (profile?.user?.email || "") ||
    form.phone !== (profile?.user?.phone || "");

  const statCards = useMemo(
    () => [
      {
        label: "Account role",
        value: roleLabel,
      },
      {
        label: "Profile completion",
        value: `${profile?.stats?.profileCompletion || 0}%`,
      },
      {
        label: "Listings owned",
        value: String(profile?.stats?.listingCount || 0).padStart(2, "0"),
      },
    ],
    [profile?.stats?.listingCount, profile?.stats?.profileCompletion, roleLabel],
  );

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));

    if (errorMessage) {
      setErrorMessage("");
    }

    if (saveMessage) {
      setSaveMessage("");
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!isDirty) {
      return;
    }

    setIsSaving(true);
    setErrorMessage("");
    setSaveMessage("");

    try {
      const refreshedProfile = await updateCurrentProfile(form);
      setProfile(refreshedProfile);
      setForm({
        name: refreshedProfile.user?.name || "",
        email: refreshedProfile.user?.email || "",
        phone: refreshedProfile.user?.phone || "",
      });
      setSaveMessage("Profile updated successfully.");
    } catch (err) {
      setErrorMessage(
        err.userMessage ||
          "We could not save your changes right now. Please try again.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <>
      <NavBar />

      <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(187,247,208,0.42),_transparent_24%),linear-gradient(180deg,_#f8fff8_0%,_#f4f6f4_46%,_#edf5ef_100%)] pt-28 pb-16 font-sans selection:bg-green-100 selection:text-green-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="space-y-8">
              <div className="animate-pulse overflow-hidden rounded-[2rem] border border-green-900/10 bg-white p-8 shadow-xl shadow-green-950/5">
                <div className="h-5 w-40 rounded-full bg-gray-200" />
                <div className="mt-4 h-14 w-3/4 rounded-2xl bg-gray-200" />
                <div className="mt-4 h-6 w-2/3 rounded-xl bg-gray-100" />
              </div>
              <div className="grid gap-8 lg:grid-cols-[1.08fr_0.92fr]">
                <div className="animate-pulse rounded-[2rem] border border-gray-100 bg-white p-8 shadow-xl shadow-green-950/5">
                  <div className="h-12 rounded-2xl bg-gray-100" />
                  <div className="mt-6 h-12 rounded-2xl bg-gray-100" />
                  <div className="mt-6 h-12 rounded-2xl bg-gray-100" />
                  <div className="mt-6 h-12 rounded-2xl bg-gray-100" />
                  <div className="mt-8 h-14 rounded-2xl bg-gray-200" />
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
          ) : errorMessage && !profile ? (
            <FeedbackState
              icon={AlertCircle}
              title="We could not open your profile"
              description={errorMessage}
              tone="error"
              actions={[
                <button
                  key="retry"
                  type="button"
                  onClick={loadProfile}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gray-900 px-6 py-3 font-bold text-white transition-colors hover:bg-green-600"
                >
                  <RefreshCcw className="h-5 w-5" />
                  Try again
                </button>,
                <Link
                  key="marketplace"
                  to="/listings"
                  className="inline-flex items-center justify-center rounded-2xl border border-gray-200 bg-white px-6 py-3 font-bold text-gray-700 transition-colors hover:border-green-300 hover:text-green-700"
                >
                  Go to marketplace
                </Link>,
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
                      Account workspace
                    </div>

                    <h1 className="text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
                      {profile?.user?.name || "My profile"}
                    </h1>
                    <p className="mt-4 max-w-2xl text-base leading-7 text-green-50/90 sm:text-lg">
                      Keep your marketplace identity current, make your contact
                      details buyer-ready, and review the account signals that
                      matter from one place.
                    </p>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-3 lg:min-w-[460px]">
                    {statCards.map((card) => (
                      <div
                        key={card.label}
                        className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-sm"
                      >
                        <p className="text-sm text-green-50/75">{card.label}</p>
                        <p className="mt-1 text-xl font-extrabold">{card.value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid gap-8 lg:grid-cols-[1.08fr_0.92fr]">
                <div className="rounded-[2rem] border border-gray-100 bg-white p-6 shadow-xl shadow-green-950/5 sm:p-8">
                  <div className="flex items-center gap-3">
                    <div className="rounded-2xl bg-green-100 p-3 text-green-700">
                      <Leaf className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-sm font-bold uppercase tracking-[0.18em] text-green-700">
                        Profile details
                      </p>
                      <h2 className="mt-1 text-2xl font-black tracking-tight text-gray-900 sm:text-3xl">
                        Manage your account information
                      </h2>
                    </div>
                  </div>

                  <p className="mt-4 text-sm leading-6 text-gray-500">
                    Update the information buyers and marketplace flows rely on.
                    For farmer accounts, a phone number keeps WhatsApp and call
                    contact actions available.
                  </p>

                  <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div>
                      <label className="mb-2 block text-sm font-bold text-gray-800">
                        Full name
                      </label>
                      <div className="relative">
                        <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400">
                          <UserRound className="h-5 w-5" />
                        </span>
                        <input
                          type="text"
                          name="name"
                          value={form.name}
                          required
                          minLength="2"
                          autoComplete="name"
                          onChange={handleChange}
                          className="w-full rounded-2xl border border-gray-200 bg-gray-50 py-3.5 pl-12 pr-4 text-gray-900 outline-none transition-all duration-200 placeholder:text-gray-400 focus:border-green-500 focus:bg-white focus:ring-4 focus:ring-green-500/10"
                          placeholder="Your full name"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-bold text-gray-800">
                        Email address
                      </label>
                      <div className="relative">
                        <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400">
                          <Mail className="h-5 w-5" />
                        </span>
                        <input
                          type="email"
                          name="email"
                          value={form.email}
                          required
                          autoComplete="email"
                          onChange={handleChange}
                          className="w-full rounded-2xl border border-gray-200 bg-gray-50 py-3.5 pl-12 pr-4 text-gray-900 outline-none transition-all duration-200 placeholder:text-gray-400 focus:border-green-500 focus:bg-white focus:ring-4 focus:ring-green-500/10"
                          placeholder="you@example.com"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-bold text-gray-800">
                        Contact number
                      </label>
                      <div className="relative">
                        <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400">
                          <Phone className="h-5 w-5" />
                        </span>
                        <input
                          type="tel"
                          name="phone"
                          value={form.phone}
                          required={isFarmerAccount}
                          autoComplete="tel"
                          inputMode="tel"
                          onChange={handleChange}
                          className="w-full rounded-2xl border border-gray-200 bg-gray-50 py-3.5 pl-12 pr-4 text-gray-900 outline-none transition-all duration-200 placeholder:text-gray-400 focus:border-green-500 focus:bg-white focus:ring-4 focus:ring-green-500/10"
                          placeholder="+91 98765 43210"
                        />
                      </div>
                      <p className="mt-2 text-sm text-gray-500">
                        {isFarmerAccount
                          ? "Required for live seller contact options across email, WhatsApp, and call."
                          : "Optional for buyer accounts unless you want to keep a phone number on file."}
                      </p>
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-bold text-gray-800">
                        Account role
                      </label>
                      <div className="flex items-center justify-between rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3.5">
                        <div>
                          <p className="text-base font-bold text-gray-900">{roleLabel}</p>
                          <p className="mt-1 text-sm text-gray-500">
                            Role changes are controlled by platform onboarding rules.
                          </p>
                        </div>
                        <span className="rounded-full bg-white px-3 py-2 text-xs font-bold uppercase tracking-[0.18em] text-green-700 shadow-sm">
                          {roleLabel}
                        </span>
                      </div>
                    </div>

                    {errorMessage ? (
                      <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                        {errorMessage}
                      </div>
                    ) : saveMessage ? (
                      <div className="rounded-2xl border border-green-100 bg-green-50 px-4 py-3 text-sm text-green-800">
                        <div className="flex items-center gap-2 font-semibold">
                          <BadgeCheck className="h-4 w-4" />
                          Saved
                        </div>
                        <p className="mt-2 leading-6">{saveMessage}</p>
                      </div>
                    ) : (
                      <div className="rounded-2xl border border-green-100 bg-green-50 px-4 py-3 text-sm text-green-800">
                        <div className="flex items-center gap-2 font-semibold">
                          <ShieldCheck className="h-4 w-4" />
                          Account health
                        </div>
                        <p className="mt-2 leading-6">
                          Profile completeness and contact readiness now come from
                          your backend profile record, not just the local session.
                        </p>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={!isDirty || isSaving}
                      className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gray-900 px-6 py-4 text-base font-bold text-white shadow-lg transition-all duration-200 hover:bg-green-600 hover:shadow-green-600/25 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:shadow-none"
                    >
                      {isSaving ? "Saving profile..." : "Save profile changes"}
                      {!isSaving ? <Save className="h-5 w-5" /> : null}
                    </button>
                  </form>
                </div>

                <div className="space-y-6 lg:sticky lg:top-28 lg:self-start">
                  <div className="rounded-[2rem] border border-gray-100 bg-white p-6 shadow-xl shadow-green-950/5">
                    <p className="text-sm font-bold uppercase tracking-[0.18em] text-gray-500">
                      Account summary
                    </p>
                    <h3 className="mt-2 text-2xl font-black text-gray-900">
                      Marketplace identity at a glance
                    </h3>

                    <div className="mt-6 grid gap-4">
                      <div className="rounded-[1.5rem] border border-gray-100 bg-gray-50 p-5">
                        <div className="flex items-center gap-2 text-sm font-bold text-gray-900">
                          <CalendarDays className="h-4 w-4 text-green-700" />
                          Member since
                        </div>
                        <p className="mt-3 text-sm leading-6 text-gray-600">
                          {formatMemberSince(profile?.stats?.memberSince)}
                        </p>
                      </div>

                      <div className="rounded-[1.5rem] border border-gray-100 bg-gray-50 p-5">
                        <div className="flex items-center gap-2 text-sm font-bold text-gray-900">
                          <ShieldCheck className="h-4 w-4 text-green-700" />
                          Contact readiness
                        </div>
                        <p className="mt-3 text-sm leading-6 text-gray-600">
                          {profile?.stats?.contactReady
                            ? "Your account is ready for marketplace contact flows."
                            : "Complete the missing contact details to unlock the best account experience."}
                        </p>
                      </div>

                      <div className="rounded-[1.5rem] border border-gray-100 bg-gray-50 p-5">
                        <div className="flex items-center gap-2 text-sm font-bold text-gray-900">
                          <LayoutGrid className="h-4 w-4 text-green-700" />
                          Listing activity
                        </div>
                        <p className="mt-3 text-sm leading-6 text-gray-600">
                          {profile?.stats?.listingCount
                            ? `${profile.stats.listingCount} listing${profile.stats.listingCount === 1 ? "" : "s"} linked to this account.`
                            : "No listing activity has been recorded for this account yet."}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-[2rem] border border-gray-100 bg-white p-6 shadow-xl shadow-green-950/5">
                    <p className="text-sm font-bold uppercase tracking-[0.18em] text-gray-500">
                      Recent activity
                    </p>
                    <h3 className="mt-2 text-2xl font-black text-gray-900">
                      Latest listing updates
                    </h3>

                    <div className="mt-6 space-y-4">
                      {profile?.recentListings?.length ? (
                        profile.recentListings.map((listing) => (
                          <div
                            key={listing._id}
                            className="overflow-hidden rounded-[1.75rem] border border-gray-100 bg-gray-50"
                          >
                            <div className="flex gap-4 p-4">
                              <img
                                src={getListingImage(listing)}
                                alt={listing.crop || "Listing image"}
                                className="h-20 w-20 rounded-2xl object-cover"
                              />
                              <div className="min-w-0 flex-1">
                                <p className="truncate text-lg font-black text-gray-900">
                                  {listing.crop}
                                </p>
                                <p className="mt-1 text-sm font-semibold text-green-700">
                                  {formatPrice(listing.price)}
                                </p>
                                <p className="mt-2 text-sm leading-6 text-gray-500">
                                  {getLocationLabel(listing)}
                                </p>
                              </div>
                            </div>

                            <div className="flex flex-col gap-3 border-t border-gray-100 bg-white px-4 py-4 sm:flex-row">
                              <Link
                                to={`/listings/${listing._id}`}
                                className="inline-flex items-center justify-center rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm font-bold text-gray-700 transition-colors hover:border-green-300 hover:text-green-700"
                              >
                                View listing
                              </Link>
                              <Link
                                to={`/listings/${listing._id}/manage`}
                                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gray-900 px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-green-600"
                              >
                                Manage listing
                                <ArrowRight className="h-4 w-4" />
                              </Link>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="rounded-[1.75rem] border border-dashed border-gray-200 bg-gray-50 p-6 text-center">
                          <p className="text-lg font-black text-gray-900">
                            {isFarmerAccount
                              ? "No listings yet"
                              : "No seller activity yet"}
                          </p>
                          <p className="mt-3 text-sm leading-6 text-gray-500">
                            {isFarmerAccount
                              ? "Publish your first crop listing to start building visible marketplace activity."
                              : "Browse the marketplace and keep your profile current so account actions stay ready."}
                          </p>
                          <Link
                            to={isFarmerAccount ? "/listings/new" : "/listings"}
                            className="mt-5 inline-flex items-center justify-center gap-2 rounded-2xl bg-gray-900 px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-green-600"
                          >
                            {isFarmerAccount ? "Create first listing" : "Explore marketplace"}
                            <ArrowRight className="h-4 w-4" />
                          </Link>
                        </div>
                      )}
                    </div>
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

export default Profile;
