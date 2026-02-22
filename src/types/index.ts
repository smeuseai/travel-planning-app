export type Category = "Hungry" | "Sight Seeing" | "Shopping";
export type ScoreCategory = "Popular" | "Under-rated";

export interface Place {
  id: string;
  name: string;
  description: string;
  imageUrls: string[];
  rating: number;
  user_ratings_total: number;
  category: Category;
  scoreCategory: ScoreCategory;
  placeId: string; // Google Places place_id
  website?: string; // Optional URL to the place's official website
}

export interface LikedPlace {
  id: string;
  place_id: string;
  user_id: string;
  city: string;
  created_at: string;
  place?: Place; // Joined place data
}
