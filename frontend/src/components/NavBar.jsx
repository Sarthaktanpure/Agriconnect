import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Home, LayoutGrid, Leaf, LogOut, PlusCircle, User } from "lucide-react";
import {
  clearAuthSession,
  getAuthEventName,
  getStoredUser,
  getToken,
  isFarmer,
} from "../services/authService";

const NavBar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(getStoredUser());
  const isLoggedIn = Boolean(getToken());

  useEffect(() => {
    const syncAuth = () => {
      setCurrentUser(getStoredUser());
    };

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("storage", syncAuth);
    window.addEventListener(getAuthEventName(), syncAuth);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("storage", syncAuth);
      window.removeEventListener(getAuthEventName(), syncAuth);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "unset";

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [mobileMenuOpen]);

  const navLinks = useMemo(() => {
    const links = [
      { name: "Home", path: "/", icon: <Home className="w-5 h-5" /> },
      {
        name: "Marketplace",
        path: "/listings",
        icon: <LayoutGrid className="w-5 h-5" />,
      },
    ];

    if (isFarmer(currentUser)) {
      links.push({
        name: "New Listing",
        path: "/listings/new",
        icon: <PlusCircle className="w-5 h-5" />,
      });
    }

    return links;
  }, [currentUser]);

  const isActive = (path) => {
    if (path === "/listings") {
      return (
        location.pathname.startsWith("/listings") ||
        location.pathname.startsWith("/listing/")
      );
    }

    if (path === "/listings/new") {
      return (
        location.pathname === "/listings/new" ||
        location.pathname === "/newListing"
      );
    }

    return location.pathname === path;
  };

  function handleLogout() {
    clearAuthSession();
    setMobileMenuOpen(false);
    navigate("/");
  }

  const roleLabel = currentUser?.role
    ? `${currentUser.role.charAt(0).toUpperCase()}${currentUser.role.slice(1)}`
    : "Guest";

  return (
    <nav
      className={`fixed left-0 right-0 top-0 z-50 w-full transition-all duration-500 ease-in-out ${
        isScrolled
          ? "border-b border-gray-100 bg-white/95 py-3 shadow-sm backdrop-blur-xl"
          : "border-b border-transparent bg-white/50 py-5 backdrop-blur-sm"
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <Link to="/" className="group relative z-50 flex items-center gap-3">
            <div className="transform rounded-2xl bg-gradient-to-br from-green-500 to-green-700 p-2.5 shadow-sm transition-all duration-300 group-hover:-translate-y-0.5 group-hover:shadow-lg group-hover:shadow-green-500/30">
              <Leaf className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-black tracking-tight text-gray-900 transition-colors duration-300 group-hover:text-green-800">
              AgriConnect
            </span>
          </Link>

          <div className="hidden items-center gap-2 lg:flex">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`group relative overflow-hidden rounded-xl px-4 py-2.5 text-[15px] font-bold transition-all duration-300 ${
                  isActive(link.path)
                    ? "bg-green-50/80 text-green-700"
                    : "text-gray-600 hover:bg-gray-50 hover:text-green-700"
                }`}
              >
                <span className="relative z-10">{link.name}</span>
                {isActive(link.path) ? (
                  <span className="absolute bottom-0 left-1/2 h-1 w-1/2 -translate-x-1/2 rounded-t-full bg-gradient-to-r from-green-400 to-green-600 shadow-[0_-2px_10px_rgba(34,197,94,0.5)]" />
                ) : null}
              </Link>
            ))}
          </div>
           <div>
            <Link to="/predict"  className="group relative overflow-hidden rounded-xl px-4 py-2.5 text-[15px] font-bold transition-all duration-300">
            <p>
              Predict Crop Prises
            </p>
            </Link>
           </div>

          <div className="hidden items-center gap-4 lg:flex">
            <div className="mx-2 h-8 w-px bg-gray-200" />
            {isLoggedIn ? (
              <div className="flex items-center gap-4">
                <Link
                  to="/profile"
                  className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-gray-50 px-4 py-2.5 transition-colors hover:border-green-200 hover:bg-green-50"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-green-700 shadow-sm">
                    <User className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">
                      {currentUser?.name || "My account"}
                    </p>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">
                      {roleLabel}
                    </p>
                  </div>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 rounded-xl px-5 py-2.5 font-bold text-red-600 shadow-sm transition-colors hover:bg-red-50 hover:text-red-700"
                >
                  <LogOut className="h-5 w-5 stroke-[2.5]" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="rounded-xl border border-transparent px-6 py-2.5 font-bold text-gray-700 transition-all hover:border-green-100 hover:bg-green-50 hover:text-green-700"
                >
                  Log In
                </Link>
                <Link
                  to="/signup"
                  className="rounded-xl bg-gray-900 px-6 py-2.5 font-bold text-white shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:bg-green-600 hover:shadow-green-600/30 active:translate-y-0"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setMobileMenuOpen((open) => !open)}
              className="relative z-50 rounded-2xl bg-gray-50/80 p-3 text-gray-800 backdrop-blur-md transition-colors hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500/40"
              aria-expanded={mobileMenuOpen}
              aria-label="Toggle navigation menu"
            >
              <div className="relative flex h-5 w-5 flex-col items-center justify-center">
                <span
                  className={`absolute block h-[2.5px] w-full rounded-full bg-current transition-all duration-300 ease-in-out ${mobileMenuOpen ? "rotate-45" : "-translate-y-2"}`}
                />
                <span
                  className={`absolute block h-[2.5px] w-full rounded-full bg-current transition-all duration-300 ease-in-out ${mobileMenuOpen ? "scale-x-0 opacity-0" : "scale-x-100 opacity-100"}`}
                />
                <span
                  className={`absolute block h-[2.5px] w-full rounded-full bg-current transition-all duration-300 ease-in-out ${mobileMenuOpen ? "-rotate-45" : "translate-y-2"}`}
                />
              </div>
            </button>
          </div>
        </div>
      </div>

      <div
        className={`fixed inset-0 z-40 bg-gray-900/40 backdrop-blur-sm transition-all duration-400 ease-in-out lg:hidden ${
          mobileMenuOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
        onClick={() => setMobileMenuOpen(false)}
        aria-hidden="true"
      />

      <div
        className={`fixed right-0 top-0 z-40 flex h-[100dvh] w-[85%] max-w-sm transform flex-col bg-white shadow-2xl transition-transform duration-500 lg:hidden ${
          mobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-1 flex-col overflow-y-auto px-6 pb-8 pt-28">
          <h4 className="mb-4 ml-2 text-xs font-bold uppercase tracking-wider text-gray-400">
            Navigation
          </h4>

          <div className="mb-8 space-y-1.5">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-4 rounded-2xl px-5 py-4 text-[17px] font-bold transition-all duration-200 ${
                  isActive(link.path)
                    ? "bg-green-50 text-green-700 shadow-sm"
                    : "text-gray-700 hover:bg-gray-50 active:bg-gray-100"
                }`}
              >
                <div
                  className={`${isActive(link.path) ? "scale-110 text-green-600" : "text-gray-400"} transition-transform duration-300`}
                >
                  {link.icon}
                </div>
                {link.name}
              </Link>
            ))}
          </div>

          <div className="mt-auto flex flex-col gap-4 border-t border-gray-100 pb-4 pt-8">
            <h4 className="mb-1 ml-2 text-xs font-bold uppercase tracking-wider text-gray-400">
              Account
            </h4>

            {isLoggedIn ? (
              <>
                <Link
                  to="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="mb-2 flex items-center gap-4 rounded-2xl border border-gray-100 bg-gray-50 px-5 py-4 transition-colors hover:border-green-200 hover:bg-green-50"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-full border border-gray-200 bg-white text-green-700 shadow-sm">
                    <User className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="leading-tight font-extrabold text-gray-900">
                      {currentUser?.name || "My Account"}
                    </p>
                    <p className="text-sm font-medium text-gray-500">
                      {roleLabel}
                    </p>
                  </div>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-red-50 py-4 font-bold text-red-600 transition-colors hover:bg-red-100"
                >
                  <LogOut className="h-5 w-5 stroke-[2.5]" /> Log out
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center rounded-2xl bg-gray-50 py-4 font-bold text-gray-800 shadow-sm transition-colors hover:bg-gray-100"
                >
                  Log In
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center rounded-2xl bg-gray-900 py-4 font-bold text-white shadow-md transition-colors hover:bg-gray-800"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
