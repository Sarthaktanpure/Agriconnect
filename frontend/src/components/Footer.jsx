import React from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Heart,
  LayoutGrid,
  Leaf,
  LogIn,
  PlusCircle,
  ShieldCheck,
} from "lucide-react";

const Footer = () => {
  const quickLinks = [
    {
      label: "Home",
      to: "/",
    },
    {
      label: "Marketplace",
      to: "/listings",
    },
    {
      label: "Add Crop",
      to: "/listings/new",
    },
  ];

  const accountLinks = [
    {
      label: "Log In",
      to: "/login",
    },
    {
      label: "Create Account",
      to: "/signup",
    },
  ];

  const promises = [
    "Direct farmer-to-buyer flow with no fake navigation links.",
    "Modern listing, management, and edit screens that feel connected.",
    "Image upload flow ready for Cloudinary-backed crop photos.",
  ];

  return (
    <footer className="relative overflow-hidden bg-gray-950 pb-10 pt-20 text-gray-300">
      <div className="absolute top-0 left-1/2 h-1 w-full max-w-4xl -translate-x-1/2 bg-gradient-to-r from-transparent via-green-500 to-transparent opacity-50" />
      <div className="absolute -left-20 top-20 h-64 w-64 rounded-full bg-green-500/10 blur-3xl" />
      <div className="absolute -right-20 bottom-10 h-64 w-64 rounded-full bg-lime-500/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-6">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_0.7fr_0.7fr_1fr]">
          <div>
            <Link to="/" className="inline-flex items-center gap-3 group">
              <div className="rounded-2xl bg-gradient-to-br from-green-500 to-green-700 p-2.5 shadow-lg shadow-green-600/20 transition-transform duration-300 group-hover:-translate-y-0.5">
                <Leaf className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-black tracking-tight text-white transition-colors group-hover:text-green-300">
                AgriConnect
              </span>
            </Link>

            <p className="mt-6 max-w-md text-sm leading-7 text-gray-400">
              A cleaner agriculture marketplace for publishing crops, reviewing
              backend listing data, and moving through the full listing flow
              without the older frontend gaps.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-gray-200">
                <ShieldCheck className="h-4 w-4 text-green-400" />
                Trusted listing flow
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-gray-200">
                <LayoutGrid className="h-4 w-4 text-green-400" />
                Premium marketplace UI
              </span>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-[0.18em] text-gray-400">
              Explore
            </h3>
            <div className="mt-6 space-y-3">
              {quickLinks.map((link) => (
                <Link
                  key={link.label}
                  to={link.to}
                  className="flex items-center gap-3 rounded-2xl bg-white/5 px-4 py-3 text-sm font-semibold text-gray-200 transition-colors hover:bg-white/10 hover:text-white"
                >
                  {link.label === "Marketplace" ? (
                    <LayoutGrid className="h-4 w-4 text-green-400" />
                  ) : link.label === "Add Crop" ? (
                    <PlusCircle className="h-4 w-4 text-green-400" />
                  ) : (
                    <Leaf className="h-4 w-4 text-green-400" />
                  )}
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-[0.18em] text-gray-400">
              Account
            </h3>
            <div className="mt-6 space-y-3">
              {accountLinks.map((link) => (
                <Link
                  key={link.label}
                  to={link.to}
                  className="flex items-center gap-3 rounded-2xl bg-white/5 px-4 py-3 text-sm font-semibold text-gray-200 transition-colors hover:bg-white/10 hover:text-white"
                >
                  <LogIn className="h-4 w-4 text-green-400" />
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="mt-6 rounded-[1.5rem] border border-white/10 bg-white/5 p-4">
              <p className="text-sm font-bold text-white">Current frontend focus</p>
              <p className="mt-2 text-sm leading-6 text-gray-400">
                The full listing journey now feels more production-ready from
                browse to manage to edit.
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-[0.18em] text-gray-400">
              Why it feels better
            </h3>

            <div className="mt-6 space-y-3">
              {promises.map((promise) => (
                <div
                  key={promise}
                  className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4"
                >
                  <p className="text-sm leading-6 text-gray-300">{promise}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-[1.75rem] bg-gradient-to-r from-green-500 to-lime-500 p-[1px]">
              <div className="rounded-[1.7rem] bg-gray-950 p-5">
                <p className="text-sm font-bold uppercase tracking-[0.18em] text-green-300">
                  Start now
                </p>
                <p className="mt-2 text-lg font-black text-white">
                  Publish a new crop listing in minutes.
                </p>
                <Link
                  to="/listings/new"
                  className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-green-300 transition-colors hover:text-white"
                >
                  Go to new listing
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-white/10 pt-8 md:flex-row md:items-center md:justify-between">
          <p className="text-sm text-gray-500">
            Copyright {new Date().getFullYear()} AgriConnect. All rights reserved.
          </p>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            Made with <Heart className="h-4 w-4 text-red-500" /> for farmers and buyers
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
