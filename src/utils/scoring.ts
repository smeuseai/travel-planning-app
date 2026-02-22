import { Place, ScoreCategory } from '../types';

/**
 * Calculate popularity score: rating * ln(1 + user_ratings_total)
 */
export function calculatePopularityScore(rating: number, user_ratings_total: number): number {
  return rating * Math.log(1 + user_ratings_total);
}

/**
 * Calculate hidden gem score: rating / ln(1 + user_ratings_total)
 */
export function calculateHiddenGemScore(rating: number, user_ratings_total: number): number {
  return rating / Math.log(1 + user_ratings_total);
}

/**
 * Process places: calculate scores, sort, and tag with scoreCategory
 * Returns mixed feed of Popular and Under-rated places
 */
export function processPlaces(places: Omit<Place, 'scoreCategory'>[]): Place[] {
  // Calculate scores for all places
  const placesWithScores = places.map(place => ({
    ...place,
    popularityScore: calculatePopularityScore(place.rating, place.user_ratings_total),
    hiddenGemScore: calculateHiddenGemScore(place.rating, place.user_ratings_total)
  }));

  // Sort by popularity score DESC
  const popularPlaces = [...placesWithScores]
    .sort((a, b) => b.popularityScore - a.popularityScore)
    .slice(0, Math.ceil(places.length / 2))
    .map(place => ({
      ...place,
      scoreCategory: "Popular" as ScoreCategory
    }));

  // Sort by hidden gem score DESC
  const underRatedPlaces = [...placesWithScores]
    .sort((a, b) => b.hiddenGemScore - a.hiddenGemScore)
    .slice(0, Math.ceil(places.length / 2))
    .map(place => ({
      ...place,
      scoreCategory: "Under-rated" as ScoreCategory
    }));

  // Mix both lists (alternating or random order)
  const mixed: Place[] = [];
  const maxLength = Math.max(popularPlaces.length, underRatedPlaces.length);
  
  for (let i = 0; i < maxLength; i++) {
    if (i < popularPlaces.length) {
      mixed.push(popularPlaces[i]);
    }
    if (i < underRatedPlaces.length) {
      mixed.push(underRatedPlaces[i]);
    }
  }

  return mixed;
}
