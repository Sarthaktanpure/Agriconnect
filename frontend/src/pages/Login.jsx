import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  BadgeCheck,
  Leaf,
  Lock,
  Mail,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import NavBar from "../components/NavBar";
import { loginUser } from "../services/authService";

const highlights = [
  "Access the marketplace without scattered token logic across the app.",
  "Open listing details, management, and edit flows from one authenticated session.",
  "Use the same account to publish crops, update pricing, and manage uploads.",
];

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  function handleChange(event) {
    const { name, value } = event.target;

    setUser((currentUser) => ({
      ...currentUser,
      [name]: value,
    }));

    if (errorMessage) {
      setErrorMessage("");
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    try {
      await loginUser(user);
      const redirectPath =
        typeof location.state?.from === "string" ? location.state.from : "/listings";
      navigate(redirectPath, { replace: true });
    } catch (err) {
      setErrorMessage(
        err.userMessage ||
          "We could not sign you in right now. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <NavBar />

      <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(187,247,208,0.45),_transparent_24%),linear-gradient(180deg,_#f8fff8_0%,_#f4f6f4_46%,_#edf5ef_100%)] px-4 pb-16 pt-28 selection:bg-green-100 selection:text-green-900 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="relative overflow-hidden rounded-[2rem] border border-green-900/10 bg-[linear-gradient(135deg,_rgba(6,95,70,1)_0%,_rgba(20,83,45,0.96)_54%,_rgba(132,204,22,0.88)_100%)] p-8 text-white shadow-2xl shadow-green-950/10 sm:p-10">
            <div className="absolute -right-10 -top-12 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
            <div className="absolute bottom-0 right-0 h-32 w-32 translate-x-8 translate-y-8 rounded-full bg-lime-300/10 blur-3xl" />

            <div className="relative">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold text-green-50 backdrop-blur-sm">
                <Sparkles className="h-4 w-4" />
                Account access, refined
              </div>

              <h1 className="mt-6 text-3xl font-black tracking-tight sm:text-4xl">
                Welcome back to the AgriConnect marketplace.
              </h1>
              <p className="mt-4 max-w-xl text-base leading-7 text-green-50/90">
                Sign in to browse live crop listings, manage your backend data,
                and move through the cleaner listing workflow across the app.
              </p>

              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-sm">
                  <p className="text-sm text-green-50/75">Marketplace access</p>
                  <p className="mt-1 text-xl font-extrabold">Public browse, smart actions</p>
                </div>
                <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-sm">
                  <p className="text-sm text-green-50/75">Session state</p>
                  <p className="mt-1 text-xl font-extrabold">Centralized and stable</p>
                </div>
              </div>

              <div className="mt-8 space-y-4">
                {highlights.map((highlight) => (
                  <div
                    key={highlight}
                    className="flex items-start gap-3 rounded-2xl bg-white/10 p-4 backdrop-blur-sm"
                  >
                    <div className="mt-0.5 rounded-full bg-white/15 p-2 text-green-100">
                      <ShieldCheck className="h-4 w-4" />
                    </div>
                    <p className="text-sm leading-6 text-green-50/90">{highlight}</p>
                  </div>
                ))}
              </div>

              <div className="mt-8 rounded-[1.75rem] border border-white/15 bg-white/10 p-5 backdrop-blur-sm">
                <p className="text-sm font-bold uppercase tracking-[0.18em] text-green-100">
                  New to AgriConnect
                </p>
                <p className="mt-2 text-lg font-black text-white">
                  Create an account to start trading as a farmer or buyer.
                </p>
                <Link
                  to="/signup"
                  className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-green-100 transition-colors hover:text-white"
                >
                  Go to sign up
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-gray-100 bg-white p-6 shadow-xl shadow-green-950/5 sm:p-8 lg:p-10">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-green-100 p-3 text-green-700">
                <Leaf className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.18em] text-green-700">
                  Sign in
                </p>
                <h2 className="mt-1 text-2xl font-black tracking-tight text-gray-900 sm:text-3xl">
                  Access your AgriConnect workspace
                </h2>
              </div>
            </div>

            <p className="mt-4 text-sm leading-6 text-gray-500">
              Use the same account to browse the marketplace, publish crop
              listings, and manage saved backend data.
            </p>

            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
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
                    value={user.email}
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
                  Password
                </label>
                <div className="relative">
                  <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400">
                    <Lock className="h-5 w-5" />
                  </span>
                  <input
                    type="password"
                    name="password"
                    value={user.password}
                    required
                    autoComplete="current-password"
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-gray-200 bg-gray-50 py-3.5 pl-12 pr-4 text-gray-900 outline-none transition-all duration-200 placeholder:text-gray-400 focus:border-green-500 focus:bg-white focus:ring-4 focus:ring-green-500/10"
                    placeholder="Enter your password"
                  />
                </div>
              </div>

              {errorMessage ? (
                <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                  {errorMessage}
                </div>
              ) : (
                <div className="rounded-2xl border border-green-100 bg-green-50 px-4 py-3 text-sm text-green-800">
                  <div className="flex items-center gap-2 font-semibold">
                    <BadgeCheck className="h-4 w-4" />
                    Frontend status
                  </div>
                  <p className="mt-2 leading-6">
                    Authentication now uses the same service layer and stored user
                    session across the app.
                  </p>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gray-900 px-6 py-4 text-base font-bold text-white shadow-lg transition-all duration-200 hover:bg-green-600 hover:shadow-green-600/25 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:shadow-none"
              >
                {isLoading ? "Signing in..." : "Sign in to marketplace"}
                {!isLoading ? <ArrowRight className="h-5 w-5" /> : null}
              </button>
            </form>

            <p className="mt-6 text-sm text-gray-500">
              Do not have an account yet?{" "}
              <Link
                to="/signup"
                className="font-bold text-green-700 transition-colors hover:text-green-600"
              >
                Create one here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
