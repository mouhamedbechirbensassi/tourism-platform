import { apiFetch } from "./api";

export interface Hotel {
  id: string;
  name: string;
  city: string;
  stars: number;
  createdAt: string;
}

export function getHotels() {
  return apiFetch<Hotel[]>("/hotels");
}

export function createHotel(data: {
  name: string;
  city: string;
  stars: number;
}) {
  return apiFetch<Hotel>("/hotels", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function updateHotel(
  id: string,
  data: Partial<{ name: string; city: string; stars: number }>
) {
  return apiFetch<Hotel>(`/hotels/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export function deleteHotel(id: string) {
  return apiFetch<Hotel>(`/hotels/${id}`, {
    method: "DELETE",
  });
}