import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  AlertCircle,
  ArrowRight,
  BadgeCheck,
  FilterX,
  RefreshCcw,
  Search,
  SlidersHorizontal,
  Sparkles,
  Sprout,
} from "lucide-react";
import Footer from "../components/Footer";
import NavBar from "../components/NavBar";
import FeedbackState from "../components/common/FeedbackState";
import ListingCard from "../components/common/ListingCard";
import ListingGridSkeleton from "../components/common/ListingGridSkeleton";
import { getStoredUser, isFarmer } from "../services/authService";
import { fetchListings } from "../services/listingService";
import { formatPrice } from "../utils/listingUtils";
import "./AllListings.css";

const sortOptions = [
  { value: "featured", label: "Featured first" },
  { value: "low", label: "Price: Low to High" },
  { value: "high", label: "Price: High to Low" },
];

const categoryOptions = ["All", "Tomato", "Wheat", "Rice", "Potato", "Onion"];

const AllListings = () => {
  const navigate = useNavigate();
  const currentUser = getStoredUser();
  const [listings, setListings] = useState([]);
  const [search, setSearch] = useState("");
  const [sortOption, setSortOption] = useState("featured");
  const [activeCategory, setActiveCategory] = useState("All");
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const loadListings = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const data = await fetchListings();
      setListings(Array.isArray(data) ? data : []);
    } catch (err) {
      setErrorMessage(
        err.userMessage ||
          "We could not load the marketplace right now. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadListings();
  }, [loadListings]);

  const filteredListings = useMemo(() => {
    const query = search.trim().toLowerCase();

    const results = listings.filter((listing) => {
      const cropName = String(listing?.crop || "").toLowerCase();
      const matchesSearch = !query || cropName.includes(query);
      const matchesCategory =
        activeCategory === "All" || cropName.includes(activeCategory.toLowerCase());

      return matchesSearch && matchesCategory;
    });

    if (sortOption === "low") {
      results.sort((first, second) => Number(first.price || 0) - Number(second.price || 0));
    }

    if (sortOption === "high") {
      results.sort((first, second) => Number(second.price || 0) - Number(first.price || 0));
    }

    return results;
  }, [activeCategory, listings, search, sortOption]);

  const marketplaceStats = useMemo(() => {
    const locations = new Set(
      listings.map((listing) => `${listing.location}-${listing.country}`).filter(Boolean),
    );
    const topPrice = listings.reduce((highest, listing) => {
      const nextValue = Number(listing?.price || 0);
      return Number.isFinite(nextValue) && nextValue > highest ? nextValue : highest;
    }, 0);

    return [
      {
        label: "Live listings",
        value: String(listings.length).padStart(2, "0"),
      },
      {
        label: "Visible now",
        value: String(filteredListings.length).padStart(2, "0"),
      },
      {
        label: "Trading regions",
        value: String(locations.size).padStart(2, "0"),
      },
      {
        label: "Top asking price",
        value: formatPrice(topPrice),
      },
    ];
  }, [filteredListings.length, listings]);

  const resetFilters = () => {
    setSearch("");
    setSortOption("featured");
    setActiveCategory("All");
  };

  return (
    <>
      <NavBar />

      <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(187,247,208,0.5),_transparent_24%),linear-gradient(180deg,_#f8fff8_0%,_#f4f6f4_46%,_#edf5ef_100%)] pt-28 pb-16 font-sans selection:bg-green-100 selection:text-green-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-[2rem] border border-green-900/10 bg-[linear-gradient(135deg,_rgba(6,95,70,1)_0%,_rgba(20,83,45,0.96)_54%,_rgba(132,204,22,0.88)_100%)] px-6 py-8 text-white shadow-2xl shadow-green-950/10 sm:px-8 sm:py-10 lg:px-10">
            <div className="absolute -right-10 -top-12 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
            <div className="absolute bottom-0 right-0 h-32 w-32 translate-x-8 translate-y-8 rounded-full bg-lime-300/10 blur-3xl" />

            <div className="relative flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-3xl">
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold text-green-50 backdrop-blur-sm">
                  <Sparkles className="h-4 w-4" />
                  Public farmer-to-buyer marketplace
                </div>

                <h1 className="text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
                  Explore listings that already feel ready for trade.
                </h1>
                <p className="mt-4 max-w-2xl text-base leading-7 text-green-50/90 sm:text-lg">
                  Search by crop, compare prices, filter categories, and move from
                  marketplace discovery to a full listing details page with farmer
                  information and richer UI states.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4 xl:min-w-[560px]">
                {marketplaceStats.map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-sm"
                  >
                    <p className="text-sm text-green-50/75">{stat.label}</p>
                    <p className="mt-1 text-xl font-extrabold">{stat.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-8 rounded-[2rem] border border-gray-100 bg-white p-6 shadow-xl shadow-green-950/5 sm:p-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.18em] text-green-700">
                  Marketplace controls
                </p>
                <h2 className="mt-2 text-2xl font-black tracking-tight text-gray-900 sm:text-3xl">
                  Search faster, filter better, and browse with confidence
                </h2>
              </div>

              {isFarmer(currentUser) ? (
                <Link
                  to="/listings/new"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gray-900 px-6 py-4 text-base font-bold text-white shadow-lg transition-all duration-200 hover:bg-green-600 hover:shadow-green-600/25"
                >
                  Add your own listing
                  <ArrowRight className="h-5 w-5" />
                </Link>
              ) : (
                <Link
                  to={currentUser ? "/listings" : "/signup"}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-white px-6 py-4 text-base font-bold text-gray-700 transition-colors hover:border-green-300 hover:text-green-700"
                >
                  {currentUser ? "Browse all listings" : "Join AgriConnect"}
                </Link>
              )}
            </div>

            <div className="mt-8 grid gap-4 lg:grid-cols-[1fr_240px]">
              <label className="relative block">
                <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400">
                  <Search className="h-5 w-5" />
                </span>
                <input
                  type="text"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search by crop name"
                  className="w-full rounded-2xl border border-gray-200 bg-gray-50 py-4 pl-12 pr-4 text-gray-900 outline-none transition-all duration-200 placeholder:text-gray-400 focus:border-green-500 focus:bg-white focus:ring-4 focus:ring-green-500/10"
                />
              </label>

              <label className="relative block">
                <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400">
                  <SlidersHorizontal className="h-5 w-5" />
                </span>
                <select
                  value={sortOption}
                  onChange={(event) => setSortOption(event.target.value)}
                  className="w-full appearance-none rounded-2xl border border-gray-200 bg-gray-50 py-4 pl-12 pr-4 text-gray-900 outline-none transition-all duration-200 focus:border-green-500 focus:bg-white focus:ring-4 focus:ring-green-500/10"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              {categoryOptions.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => setActiveCategory(category)}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition-all ${
                    activeCategory === category
                      ? "bg-gray-900 text-white shadow-lg shadow-green-900/10"
                      : "border border-gray-200 bg-white text-gray-600 hover:border-green-300 hover:text-green-700"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-2 rounded-full bg-green-50 px-4 py-2 text-sm font-semibold text-green-700">
                  <BadgeCheck className="h-4 w-4" />
                  {filteredListings.length} listing{filteredListings.length === 1 ? "" : "s"} visible
                </span>
                {activeCategory !== "All" ? (
                  <span className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-600">
                    <Sprout className="h-4 w-4 text-green-700" />
                    Category: {activeCategory}
                  </span>
                ) : null}
              </div>

              {(search || activeCategory !== "All" || sortOption !== "featured") ? (
                <button
                  type="button"
                  onClick={resetFilters}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 transition-colors hover:text-green-700"
                >
                  <RefreshCcw className="h-4 w-4" />
                  Reset filters
                </button>
              ) : null}
            </div>
          </div>

          <div className="mt-8">
            {isLoading ? (
              <ListingGridSkeleton />
            ) : errorMessage ? (
              <FeedbackState
                icon={AlertCircle}
                title="Marketplace data could not be loaded"
                description={errorMessage}
                tone="error"
                actions={[
                  <button
                    key="retry"
                    type="button"
                    onClick={loadListings}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gray-900 px-6 py-3 font-bold text-white transition-colors hover:bg-green-600"
                  >
                    <RefreshCcw className="h-5 w-5" />
                    Try again
                  </button>,
                ]}
              />
            ) : filteredListings.length === 0 ? (
              <FeedbackState
                icon={FilterX}
                title="No listings match this search yet"
                description="Try another crop name, switch the category filter, or clear the controls to see more listings."
                actions={[
                  <button
                    key="clear"
                    type="button"
                    onClick={resetFilters}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gray-900 px-6 py-3 font-bold text-white transition-colors hover:bg-green-600"
                  >
                    <RefreshCcw className="h-5 w-5" />
                    Clear filters
                  </button>,
                  isFarmer(currentUser) ? (
                    <Link
                      key="add"
                      to="/listings/new"
                      className="inline-flex items-center justify-center rounded-2xl border border-gray-200 bg-white px-6 py-3 font-bold text-gray-700 transition-colors hover:border-green-300 hover:text-green-700"
                    >
                      Create a listing
                    </Link>
                  ) : null,
                ].filter(Boolean)}
              />
            ) : (
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {filteredListings.map((listing) => (
                  <ListingCard
                    key={listing._id}
                    listing={listing}
                    onView={() => navigate(`/listings/${listing._id}`)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default AllListings;
