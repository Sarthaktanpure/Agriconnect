import api from "./api";

export async function fetchListings() {
  const response = await api.get("/listings");
  return response.data.data;
}

export async function fetchListingById(id) {
  const response = await api.get(`/listings/${id}`);
  return response.data.data;
}

export async function fetchListingContactById(id) {
  const response = await api.get(`/listings/${id}/contact`);
  return response.data.data;
}

export async function createListing(formData) {
  const response = await api.post("/listings", formData);
  return response.data.data;
}

export async function updateListing(id, formData) {
  const response = await api.put(`/listings/${id}`, formData);
  return response.data.data;
}

export async function deleteListing(id) {
  const response = await api.delete(`/listings/${id}`);
  return response.data.data;
}
