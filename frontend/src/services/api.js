import axios from "axios";

const REQUEST_TIMEOUT_MS = 15_000;

function normalizeUrl(value) {
  return String(value || "").trim().replace(/\/+$/, "");
}

const configuredApiUrl = normalizeUrl(
  import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL,
);
const baseURL = configuredApiUrl || (import.meta.env.DEV ? "/api" : "");

if (!baseURL) {
  throw new Error(
    "Missing VITE_API_URL. Set it to your deployed backend URL for production builds.",
  );
}

export function getApiErrorMessage(
  error,
  fallback = "Something went wrong. Please try again.",
) {
  if (error?.code === "ECONNABORTED") {
    return "The server took too long to respond. Please try again.";
  }

  if (typeof error?.response?.data?.message === "string" && error.response.data.message.trim()) {
    return error.response.data.message;
  }

  if (typeof error?.message === "string" && error.message.trim() && error.message !== "Network Error") {
    return error.message;
  }

  if (error?.message === "Network Error") {
    return "We could not reach the server. Please check your connection and try again.";
  }

  return fallback;
}

const api = axios.create({
  baseURL,
  timeout: REQUEST_TIMEOUT_MS,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  config.headers = config.headers || {};

  if (!config.headers.Accept) {
    config.headers.Accept = "application/json";
  }

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    error.userMessage = getApiErrorMessage(error);
    return Promise.reject(error);
  },
);

export default api;
