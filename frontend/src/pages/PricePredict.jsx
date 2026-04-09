import { useState } from "react";
import axios from "axios";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";

export default function PricePrediction() {
  const [form, setForm] = useState({
    cropName: "",
    quantity: "",
    unit: "kg",
    location: "",
    season: "",
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const predict = async () => {
    if (!form.cropName) return setError("Please enter a crop name");

    setError("");
    setLoading(true);
    setResult(null);

    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/ai/predict-price`,
        form,
      );
      setResult(data);
    } catch {
      setError("Prediction failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <NavBar />

      {/* ✅ MAIN PAGE WRAPPER (FIXED) */}
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#f0f6ee] via-[#6cf762] to-green pt-20">
        {/* ✅ CENTER CONTENT PROPERLY */}
        <div className="flex-grow flex items-center justify-center px-4 py-10">
          {/* CARD */}
          <div className="w-full max-w-xl backdrop-blur-lg bg-white/5 border border-white/10 rounded-3xl shadow-2xl p-6">
            {/* HEADER */}
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-black">
                🤖 AI Crop Price Predictor
              </h2>
              <p className="text-gray-800 text-sm mt-1">
                Smart pricing powered by AI insights
              </p>
            </div>

            {/* FORM */}
            <div className="space-y-4">
              <input
                className="w-full bg-white/10 border border-white/20 text-black placeholder-gray-400 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-green-500 outline-none"
                placeholder="Crop name (Tomato, Wheat, Rice)"
                value={form.cropName}
                onChange={(e) => setForm({ ...form, cropName: e.target.value })}
              />

              <div className="flex gap-2">
                <input
                  type="number"
                  className="flex-1 bg-white/10 border border-white/20 text-black placeholder-gray-400 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-green-100 outline-none"
                  placeholder="Quantity"
                  value={form.quantity}
                  onChange={(e) =>
                    setForm({ ...form, quantity: e.target.value })
                  }
                />

                <select
                  className="bg-white/10 border border-white/20 text-black rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 outline-none"
                  value={form.unit}
                  onChange={(e) => setForm({ ...form, unit: e.target.value })}
                >
                  <option className="text-black">kg</option>
                  <option className="text-black">quintal</option>
                  <option className="text-black">ton</option>
                </select>
              </div>

              <input
                className="w-full bg-white/10 border border-white/20 text-black placeholder-gray-400 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-green-500 outline-none"
                placeholder="Location (Pune, Maharashtra)"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
              />

              <select
                className="w-full bg-white/10 border border-white/20 text-black rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-green-500 outline-none"
                value={form.season}
                onChange={(e) => setForm({ ...form, season: e.target.value })}
              >
                <option value="" className="text-black">
                  Select season
                </option>
                <option className="text-black">Kharif (Jun–Oct)</option>
                <option className="text-black">Rabi (Nov–Apr)</option>
                <option className="text-black">Zaid (Mar–Jun)</option>
              </select>

              {error && <p className="text-red-400 text-xs">{error}</p>}

              <button
                onClick={predict}
                disabled={loading}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:scale-105 transition-all text-black rounded-xl py-2 text-sm font-semibold shadow-lg"
              >
                {loading ? "Predicting..." : "🚀 Predict Price"}
              </button>
            </div>

            {/* RESULT */}
            {result && (
              <div className="mt-6 space-y-4">
                <div className="grid grid-cols-3 gap-3 text-center">
                  {[
                    ["Min", result.minPrice],
                    ["Recommended", result.recommendedPrice],
                    ["Max", result.maxPrice],
                  ].map(([label, val]) => (
                    <div
                      key={label}
                      className={`rounded-xl p-3 ${
                        label === "Recommended"
                          ? "bg-green-600 text-white scale-105"
                          : "bg-white/10 text-gray-200"
                      }`}
                    >
                      <div className="text-xs opacity-70">{label}</div>
                      <div className="text-lg font-bold">₹{val}</div>
                      <div className="text-xs opacity-70">per kg</div>
                    </div>
                  ))}
                </div>

                <div className="bg-blue-500/10 border border-blue-400/20 rounded-xl p-3 text-xs text-blue-300">
                  <span className="font-semibold">
                    Confidence: {result.confidence}
                  </span>{" "}
                  — {result.reasoning}
                </div>

                <div className="bg-yellow-500/10 border border-yellow-400/20 rounded-xl p-3">
                  <p className="text-xs font-semibold text-yellow-300 mb-1">
                    💡 Selling Tips
                  </p>
                  <ul className="text-xs text-yellow-200 space-y-1">
                    {result.tips?.map((tip, i) => (
                      <li key={i}>• {tip}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
}
