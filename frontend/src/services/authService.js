import api from "./api";

const AUTH_USER_KEY = "agriconnect_user";
const AUTH_EVENT = "auth-changed";

function dispatchAuthChange() {
  window.dispatchEvent(new Event(AUTH_EVENT));
}

export function getStoredUser() {
  const rawUser = localStorage.getItem(AUTH_USER_KEY);

  if (!rawUser) {
    return null;
  }

  try {
    return JSON.parse(rawUser);
  } catch {
    localStorage.removeItem(AUTH_USER_KEY);
    return null;
  }
}

export function getToken() {
  return localStorage.getItem("token");
}

export function isAuthenticated() {
  return Boolean(getToken());
}

export function saveAuthSession(session) {
  localStorage.setItem("token", session.token);
  localStorage.setItem(AUTH_USER_KEY, JSON.stringify(session.user));
  dispatchAuthChange();
}

export function clearAuthSession() {
  localStorage.removeItem("token");
  localStorage.removeItem(AUTH_USER_KEY);
  dispatchAuthChange();
}

export function hasRole(user, roles = []) {
  if (!roles.length) {
    return true;
  }

  return roles.includes(user?.role);
}

export function isFarmer(user) {
  return user?.role === "farmer";
}

export function isAdmin(user) {
  return user?.role === "admin";
}

export function isListingOwner(listing, user) {
  if (!listing || !user) {
    return false;
  }

  const farmerId = listing.farmerId?._id || listing.farmerId || listing.farmer?._id;
  return String(farmerId || "") === String(user._id || user.id || "");
}

export function getAuthEventName() {
  return AUTH_EVENT;
}

export async function loginUser(payload) {
  const response = await api.post("/login", payload);
  saveAuthSession(response.data.data);
  return response.data.data;
}

export async function signupUser(payload) {
  const response = await api.post("/signup", payload);
  saveAuthSession(response.data.data);
  return response.data.data;
}

export async function fetchCurrentProfile() {
  const response = await api.get("/profile");
  return response.data.data;
}

export async function updateCurrentProfile(payload) {
  const response = await api.put("/profile", payload);
  const session = response.data.data;
  saveAuthSession({
    token: session.token,
    user: session.user,
  });
  return session;
}
