import { Place } from '../types';
import { mapTypesToCategory } from '../utils/typeMapping';
import { processPlaces } from '../utils/scoring';

/** Base URL for API (same-origin by default; key is never sent to the client). */
const getApiBase = () => (import.meta.env.VITE_API_BASE_URL ?? '');

interface GooglePlacePhoto {
  photo_reference: string;
  width: number;
  height: number;
}

interface GooglePlaceResult {
  place_id: string;
  name: string;
  rating?: number;
  user_ratings_total?: number;
  types: string[];
  photos?: GooglePlacePhoto[];
  formatted_address?: string;
  editorial_summary?: {
    overview: string;
  };
}

interface GooglePlacesResponse {
  results: GooglePlaceResult[];
  status: string;
}

/**
 * Photo URL via backend proxy so the API key is never exposed to the browser.
 */
function getPhotoUrl(photoReference: string, maxWidth: number = 800): string {
  const params = new URLSearchParams({
    maxwidth: String(maxWidth),
    photoreference: photoReference,
  });
  return `${getApiBase()}/api/place-photo?${params.toString()}`;
}

/**
 * Filter low-quality images (minimum width/height threshold)
 */
function filterGoodQualityImages(photos: GooglePlacePhoto[] | undefined, minWidth: number = 400): string[] {
  if (!photos || photos.length === 0) return [];
  
  const goodQualityPhotos = photos
    .filter(photo => photo.width >= minWidth && photo.height >= minWidth)
    .slice(0, 15); // Take up to 15 images
  
  return goodQualityPhotos.map(photo => getPhotoUrl(photo.photo_reference));
}

/**
 * Fetch places for a city via backend proxy (API key stays server-side).
 */
export async function getPlaces(city: string): Promise<Place[]> {
  const apiBase = getApiBase();
  try {
    const searchUrl = `${apiBase}/api/places?city=${encodeURIComponent(city)}`;
    const response = await fetch(searchUrl);
    if (!response.ok) {
      console.warn('Places API unavailable, using mock data.');
      return getMockPlaces(city);
    }
    const data: GooglePlacesResponse = await response.json();

    if (data.status !== 'OK' || !data.results) {
      console.error('Google Places API error:', data.status);
      return getMockPlaces(city);
    }

    const places: Omit<Place, 'scoreCategory'>[] = [];
    const detailsFields = 'name,rating,user_ratings_total,photos,editorial_summary,types,website';

    for (const result of data.results) {
      const category = mapTypesToCategory(result.types || []);
      if (!category) continue;

      try {
        const detailsUrl = `${apiBase}/api/place-details?place_id=${encodeURIComponent(result.place_id)}&fields=${encodeURIComponent(detailsFields)}`;
        const detailsResponse = await fetch(detailsUrl);
        const detailsData = await detailsResponse.json();

        if (detailsData.status === 'OK' && detailsData.result) {
          const placeDetails = detailsData.result;
          const imageUrls = filterGoodQualityImages(placeDetails.photos);
          if (imageUrls.length === 0) continue;

          places.push({
            id: result.place_id,
            placeId: result.place_id,
            name: placeDetails.name || result.name,
            description: placeDetails.editorial_summary?.overview || `A ${category.toLowerCase()} location in ${city}`,
            imageUrls,
            rating: placeDetails.rating || result.rating || 0,
            user_ratings_total: placeDetails.user_ratings_total || result.user_ratings_total || 0,
            category,
            website: placeDetails.website,
          });
        }
      } catch (error) {
        console.error('Error fetching place details:', error);
        continue;
      }
    }

    return processPlaces(places);
  } catch (error) {
    console.error('Error fetching places:', error);
    return getMockPlaces(city);
  }
}

/**
 * Mock data for development/testing when API key is not available
 */
function getMockPlaces(_city: string): Place[] {
  const mockPlaces: Omit<Place, 'scoreCategory'>[] = [
    {
      id: '1',
      placeId: 'mock_1',
      name: 'Central Park Restaurant',
      description: 'A popular dining spot in the heart of the city with excellent cuisine and ambiance. The menu features seasonal dishes and a carefully selected wine list. Reservations are recommended for weekend evenings.',
      imageUrls: [
        'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80',
        'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&q=80',
        'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80',
      ],
      rating: 4.5,
      user_ratings_total: 1250,
      category: 'Hungry',
    },
    {
      id: '2',
      placeId: 'mock_2',
      name: 'Historic Museum',
      description: 'Explore the rich history and culture of the region through fascinating exhibits. The museum hosts rotating collections and offers guided tours. Plan to spend at least two hours to see the main galleries.',
      imageUrls: [
        'https://images.unsplash.com/photo-1536924940846-227afb31e2a5?w=800&q=80',
        'https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=800&q=80',
        'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&q=80',
      ],
      rating: 4.8,
      user_ratings_total: 3200,
      category: 'Sight Seeing',
    },
    {
      id: '3',
      placeId: 'mock_3',
      name: 'Downtown Shopping Mall',
      description: 'A modern shopping destination with a wide variety of stores and dining options.',
      imageUrls: [
        'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80',
        'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=800&q=80',
        'https://images.unsplash.com/photo-1604719314656-395a7b0272d2?w=800&q=80',
      ],
      rating: 4.2,
      user_ratings_total: 890,
      category: 'Shopping',
    },
    {
      id: '4',
      placeId: 'mock_4',
      name: 'Hidden Gem Cafe',
      description: 'A cozy neighborhood cafe known for its artisanal coffee and pastries.',
      imageUrls: [
        'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&q=80',
        'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80',
        'https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=800&q=80',
      ],
      rating: 4.7,
      user_ratings_total: 150,
      category: 'Hungry',
    },
    {
      id: '5',
      placeId: 'mock_5',
      name: 'Scenic Overlook',
      description: 'Breathtaking views of the city skyline and surrounding landscape.',
      imageUrls: [
        'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&q=80',
        'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=800&q=80',
        'https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=800&q=80',
      ],
      rating: 4.6,
      user_ratings_total: 420,
      category: 'Sight Seeing',
    },
    {
      id: '6',
      placeId: 'mock_6',
      name: 'Boutique Clothing Store',
      description: 'Unique fashion finds and curated collections from local designers.',
      imageUrls: [
        'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80',
        'https://images.unsplash.com/photo-1556906781-9a412961c28c?w=800&q=80',
        'https://images.unsplash.com/photo-1558769132-cb1aea3c4f44?w=800&q=80',
      ],
      rating: 4.4,
      user_ratings_total: 280,
      category: 'Shopping',
    },
    {
      id: '7',
      placeId: 'mock_7',
      name: 'Riverside Bistro',
      description: 'Waterfront dining with seasonal menus and local ingredients.',
      imageUrls: [
        'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80',
        'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&q=80',
      ],
      rating: 4.5,
      user_ratings_total: 520,
      category: 'Hungry',
    },
    {
      id: '8',
      placeId: 'mock_8',
      name: 'Art Gallery & Garden',
      description: 'Contemporary art and sculpture in a peaceful garden setting.',
      imageUrls: [
        'https://images.unsplash.com/photo-1536924940846-227afb31e2a5?w=800&q=80',
      ],
      rating: 4.7,
      user_ratings_total: 180,
      category: 'Sight Seeing',
    },
    {
      id: '9',
      placeId: 'mock_9',
      name: 'Local Market Hall',
      description: 'Indoor market with fresh produce, crafts, and street food.',
      imageUrls: [
        'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=800&q=80',
      ],
      rating: 4.3,
      user_ratings_total: 2100,
      category: 'Shopping',
    },
    {
      id: '10',
      placeId: 'mock_10',
      name: 'Sunset Rooftop Bar',
      description: 'Cocktails and small plates with panoramic city views.',
      imageUrls: [
        'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800&q=80',
      ],
      rating: 4.6,
      user_ratings_total: 890,
      category: 'Hungry',
    },
    {
      id: '11',
      placeId: 'mock_11',
      name: 'Heritage Walking Trail',
      description: 'Guided walks through historic districts and landmarks.',
      imageUrls: [
        'https://images.unsplash.com/photo-1524661135-423995f22d0b?w=800&q=80',
      ],
      rating: 4.8,
      user_ratings_total: 340,
      category: 'Sight Seeing',
    },
    {
      id: '12',
      placeId: 'mock_12',
      name: 'Designer Outlet',
      description: 'Brand-name fashion and accessories at discount prices.',
      imageUrls: [
        'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80',
      ],
      rating: 4.2,
      user_ratings_total: 1650,
      category: 'Shopping',
    },
  ];

  return processPlaces(mockPlaces);
}
