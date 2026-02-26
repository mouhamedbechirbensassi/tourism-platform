export interface Hotel {
  id: string;
  name: string;
  city: string;
  stars: number; // 1 à 5
  createdAt: string;
}

export interface CreateHotelDto {
  name: string;
  city: string;
  stars: number; // 1 à 5
}

export interface UpdateHotelDto {
  name?: string;
  city?: string;
  stars?: number; // 1 à 5
}