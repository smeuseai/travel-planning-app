import { Category } from '../types';

// Hungry category types (~200+)
const HUNGRY_TYPES = new Set([
  // Food and Drink types
  'acai_shop', 'afghani_restaurant', 'african_restaurant', 'american_restaurant',
  'argentinian_restaurant', 'asian_fusion_restaurant', 'asian_restaurant',
  'australian_restaurant', 'austrian_restaurant', 'bagel_shop', 'bakery',
  'bangladeshi_restaurant', 'bar', 'bar_and_grill', 'barbecue_restaurant',
  'basque_restaurant', 'bavarian_restaurant', 'beer_garden', 'belgian_restaurant',
  'bistro', 'brazilian_restaurant', 'breakfast_restaurant', 'brewery', 'brewpub',
  'british_restaurant', 'brunch_restaurant', 'buffet_restaurant', 'burmese_restaurant',
  'burrito_restaurant', 'cafe', 'cafeteria', 'cajun_restaurant', 'cake_shop',
  'californian_restaurant', 'cambodian_restaurant', 'candy_store', 'cantonese_restaurant',
  'caribbean_restaurant', 'cat_cafe', 'chicken_restaurant', 'chicken_wings_restaurant',
  'chilean_restaurant', 'chinese_noodle_restaurant', 'chinese_restaurant',
  'chocolate_factory', 'chocolate_shop', 'cocktail_bar', 'coffee_roastery',
  'coffee_shop', 'coffee_stand', 'colombian_restaurant', 'confectionery',
  'croatian_restaurant', 'cuban_restaurant', 'czech_restaurant', 'danish_restaurant',
  'deli', 'dessert_restaurant', 'dessert_shop', 'dim_sum_restaurant', 'diner',
  'dog_cafe', 'donut_shop', 'dumpling_restaurant', 'dutch_restaurant',
  'eastern_european_restaurant', 'ethiopian_restaurant', 'european_restaurant',
  'falafel_restaurant', 'family_restaurant', 'fast_food_restaurant', 'filipino_restaurant',
  'fine_dining_restaurant', 'fish_and_chips_restaurant', 'fondue_restaurant',
  'food_court', 'french_restaurant', 'fusion_restaurant', 'gastropub',
  'german_restaurant', 'greek_restaurant', 'gyro_restaurant', 'halal_restaurant',
  'hamburger_restaurant', 'hawaiian_restaurant', 'hookah_bar', 'hot_dog_restaurant',
  'hot_dog_stand', 'hot_pot_restaurant', 'hungarian_restaurant', 'ice_cream_shop',
  'indian_restaurant', 'indonesian_restaurant', 'irish_pub', 'irish_restaurant',
  'israeli_restaurant', 'italian_restaurant', 'japanese_curry_restaurant',
  'japanese_izakaya_restaurant', 'japanese_restaurant', 'juice_shop', 'kebab_shop',
  'korean_barbecue_restaurant', 'korean_restaurant', 'latin_american_restaurant',
  'lebanese_restaurant', 'lounge_bar', 'malaysian_restaurant', 'meal_delivery',
  'meal_takeaway', 'mediterranean_restaurant', 'mexican_restaurant',
  'middle_eastern_restaurant', 'mongolian_barbecue_restaurant', 'moroccan_restaurant',
  'noodle_shop', 'north_indian_restaurant', 'oyster_bar_restaurant',
  'pakistani_restaurant', 'pastry_shop', 'persian_restaurant', 'peruvian_restaurant',
  'pizza_delivery', 'pizza_restaurant', 'polish_restaurant', 'portuguese_restaurant',
  'pub', 'ramen_restaurant', 'restaurant', 'romanian_restaurant', 'russian_restaurant',
  'salad_shop', 'sandwich_shop', 'scandinavian_restaurant', 'seafood_restaurant',
  'shawarma_restaurant', 'snack_bar', 'soul_food_restaurant', 'soup_restaurant',
  'south_american_restaurant', 'south_indian_restaurant', 'southwestern_us_restaurant',
  'spanish_restaurant', 'sports_bar', 'sri_lankan_restaurant', 'steak_house',
  'sushi_restaurant', 'swiss_restaurant', 'taco_restaurant', 'taiwanese_restaurant',
  'tapas_restaurant', 'tea_house', 'tex_mex_restaurant', 'thai_restaurant',
  'tibetan_restaurant', 'tonkatsu_restaurant', 'turkish_restaurant',
  'ukrainian_restaurant', 'vegan_restaurant', 'vegetarian_restaurant',
  'vietnamese_restaurant', 'western_restaurant', 'wine_bar', 'winery',
  'yakiniku_restaurant', 'yakitori_restaurant', 'food',
  // Food stores
  'butcher_shop', 'food_store', 'grocery_store', 'asian_grocery_store',
  'health_food_store', 'convenience_store', 'farmers_market'
]);

// Sight Seeing category types (~100+)
const SIGHT_SEEING_TYPES = new Set([
  // Entertainment and Recreation
  'adventure_sports_center', 'amphitheatre', 'amusement_center', 'amusement_park',
  'aquarium', 'banquet_hall', 'barbecue_area', 'botanical_garden', 'bowling_alley',
  'casino', 'childrens_camp', 'city_park', 'comedy_club', 'community_center',
  'concert_hall', 'convention_center', 'cultural_center', 'cycling_park',
  'dance_hall', 'dog_park', 'event_venue', 'ferris_wheel', 'garden',
  'go_karting_venue', 'hiking_area', 'historical_landmark', 'indoor_playground',
  'internet_cafe', 'karaoke', 'live_music_venue', 'marina', 'miniature_golf_course',
  'movie_rental', 'movie_theater', 'national_park', 'night_club', 'observation_deck',
  'off_roading_area', 'opera_house', 'paintball_center', 'park', 'philharmonic_hall',
  'picnic_ground', 'planetarium', 'plaza', 'roller_coaster', 'skateboard_park',
  'state_park', 'tourist_attraction', 'video_arcade', 'vineyard', 'visitor_center',
  'water_park', 'wedding_venue', 'wildlife_park', 'wildlife_refuge', 'zoo',
  // Culture
  'art_gallery', 'art_museum', 'art_studio', 'auditorium', 'castle',
  'cultural_landmark', 'fountain', 'historical_place', 'history_museum',
  'monument', 'museum', 'performing_arts_theater', 'sculpture',
  // Natural Features
  'beach', 'island', 'lake', 'mountain_peak', 'nature_preserve', 'river',
  'scenic_spot', 'woods',
  // Places of Worship
  'buddhist_temple', 'church', 'hindu_temple', 'mosque', 'shinto_shrine',
  'synagogue',
  // Sports (recreational/viewing)
  'arena', 'athletic_field', 'fishing_charter', 'fishing_pier', 'fishing_pond',
  'fitness_center', 'golf_course', 'gym', 'ice_skating_rink', 'indoor_golf_course',
  'playground', 'race_course', 'ski_resort', 'sports_activity_location',
  'sports_club', 'sports_coaching', 'sports_complex', 'sports_school', 'stadium',
  'swimming_pool', 'tennis_court',
  // Transportation (scenic/landmark)
  'bridge', 'ferry_service', 'ferry_terminal',
  // Table B
  'landmark', 'natural_feature', 'point_of_interest'
]);

// Shopping category types (~50+)
const SHOPPING_TYPES = new Set([
  'asian_grocery_store', 'auto_parts_store', 'bicycle_store', 'book_store',
  'building_materials_store', 'cell_phone_store', 'clothing_store',
  'convenience_store', 'cosmetics_store', 'department_store', 'discount_store',
  'discount_supermarket', 'electronics_store', 'farmers_market', 'flea_market',
  'furniture_store', 'garden_center', 'general_store', 'gift_shop',
  'grocery_store', 'hardware_store', 'health_food_store', 'home_goods_store',
  'home_improvement_store', 'hypermarket', 'jewelry_store', 'liquor_store',
  'market', 'pet_store', 'shoe_store', 'shopping_mall', 'sporting_goods_store',
  'sportswear_store', 'store', 'supermarket', 'tea_store', 'thrift_store',
  'toy_store', 'warehouse_store', 'wholesaler', 'womens_clothing_store',
  // Services (retail-oriented)
  'beauty_salon', 'barber_shop', 'beautician', 'florist', 'nail_salon',
  'hair_care', 'hair_salon', 'makeup_artist', 'pet_care', 'pet_boarding_service',
  // Automotive (retail)
  'car_dealer', 'truck_dealer', 'tire_shop'
]);

/**
 * Maps Google Places API types array to our 3 categories
 * Priority order: Hungry → Sight Seeing → Shopping
 * Returns null if no match (exclude from feature)
 */
export function mapTypesToCategory(types: string[]): Category | null {
  if (!types || types.length === 0) return null;

  // Check in priority order
  for (const type of types) {
    if (HUNGRY_TYPES.has(type)) {
      return "Hungry";
    }
  }

  for (const type of types) {
    if (SIGHT_SEEING_TYPES.has(type)) {
      return "Sight Seeing";
    }
  }

  for (const type of types) {
    if (SHOPPING_TYPES.has(type)) {
      return "Shopping";
    }
  }

  return null; // No match, exclude from feature
}
