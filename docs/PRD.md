# Travel Planning App — Product Requirements Document

## 1. Objective and Goals

- **Objective:** Discover places in chosen city (popular + under-rated), by category. Like/dislike selection. Revisit liked places.
- **Goals:** City select → places by **category** (**Hungry**, **Sight Seeing**, **Shopping**) and by popularity/under-rated → 3 images carousel + description + category badge per card → like/dislike icons, click advances to next card → saved list to refer back.

---

## 2. Features

| Feature          | Description                                                                                                                                                                                                                                                  |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| City selection   | Pick one city. Drives all results.                                                                                                                                                                                                                           |
| Places discovery | By **category**: **Hungry**, **Sight Seeing**, **Shopping**. **One feed** mixing popular + under-rated. Each card shows badges: category ("Hungry"/"Sight Seeing"/"Shopping") + "Popular" or "Under-rated" based on which score ranked it. No filter needed. |
| Place card       | Carousel (3 images, good quality from API only) + description + **category badge** ("Hungry" / "Sight Seeing" / "Shopping") + **"Popular" or "Under-rated" badge**.                                                                                          |
| Like / Dislike   | Click like icon = save (requires auth). Click dislike icon = pass. Persist likes only. Click either advances to next card.                                                                                                                                   |
| Saved list       | View "Liked" places **per city** (user's own only, via RLS). Thumbnail + text. Refer back; optional remove.                                                                                                                                                               |

---

## 3. UX Flow and Design Notes

**Flow:** Sign up/Sign in (Supabase Auth) → City select → Browse cards (one feed, Popular + Under-rated mixed) → Click Like or Dislike (next card) → Saved list per city (refer back).

**Design (inspired by modern data/analytics UI):**

- **Card layout:** Clean, card-based design. One place per card; carousel (3 img, dots/arrows, **good quality from API only**) + description + **category badge** ("Hungry"/"Sight Seeing"/"Shopping") + **"Popular" or "Under-rated" badge**. Description truncate + "Read more" if long. **Responsive** (desktop + mobile).
- **Like/Dislike:** Two icons (heart / X) prominently placed; click either → persist like or pass, then show next card. Clear visual feedback.
- **Feed:** **One feed only** mixing Popular + Under-rated places. Each card shows badge indicating which category it belongs to. No filter/tabs needed.
- **Saved list:** Thumbnail + name + short desc; **per city**; tap = full/detail. Optional: remove action.
- **Empty states:** No results; no likes yet — clear copy + CTAs.
- **Visual style:** Clean, modern aesthetic (minimal chrome, clear typography, ample whitespace). **Responsive design** for desktop and mobile. Reference: modern analytics/dashboard UI patterns for clean, functional design.

---

## 4. System and Environment Requirements

- **Envs:** Dev (local FE + optional BE/store), Staging (UAT), Prod (hosted).
- **Backend:** API: places per city (popular + under-rated). Third-party: rate limits, keys.
- **Data:** **Google Places API** (this round). Cities list + place search by city. Places: name, description, **3 image URLs (good quality only, filter low-res)**, rating, user_ratings_total, **types** (array from Google). **Map Google `types` array to 3 categories:** **Hungry**, **Sight Seeing**, **Shopping** (see mapping below). **Popular:** `popularity_score = rating * ln(1 + user_ratings_total)` (sort DESC). **Under-rated:** `hidden_gem_score = rating / ln(1 + user_ratings_total)` (sort DESC). **Note:** `ln` = natural logarithm (base e). Code: JS `Math.log(1 + user_ratings_total)`, Python `math.log(1 + user_ratings_total)`. Images supplied by API; only show good quality images. Other sources (Foursquare, etc.) in a later round.
- **Storage:** Liked places stored in **Supabase** (PostgreSQL DB via auto-generated REST API). Per authenticated user (**Supabase Auth** required). **Per city** (saved list scoped to selected city).
- **Perf:** Images on demand; CDN/sizes.

### Google Places API Type Mapping

Map Google Places `types[]` array to 3 categories. **Priority order:** Check types array → if any type matches Hungry list → "Hungry"; else if any matches Sight Seeing → "Sight Seeing"; else if any matches Shopping → "Shopping"; else exclude from feature.

**HUNGRY** (~200+ types):
- All Food and Drink types: `acai_shop`, `afghani_restaurant`, `african_restaurant`, `american_restaurant`, `argentinian_restaurant`, `asian_fusion_restaurant`, `asian_restaurant`, `australian_restaurant`, `austrian_restaurant`, `bagel_shop`, `bakery`, `bangladeshi_restaurant`, `bar`, `bar_and_grill`, `barbecue_restaurant`, `basque_restaurant`, `bavarian_restaurant`, `beer_garden`, `belgian_restaurant`, `bistro`, `brazilian_restaurant`, `breakfast_restaurant`, `brewery`, `brewpub`, `british_restaurant`, `brunch_restaurant`, `buffet_restaurant`, `burmese_restaurant`, `burrito_restaurant`, `cafe`, `cafeteria`, `cajun_restaurant`, `cake_shop`, `californian_restaurant`, `cambodian_restaurant`, `candy_store`, `cantonese_restaurant`, `caribbean_restaurant`, `cat_cafe`, `chicken_restaurant`, `chicken_wings_restaurant`, `chilean_restaurant`, `chinese_noodle_restaurant`, `chinese_restaurant`, `chocolate_factory`, `chocolate_shop`, `cocktail_bar`, `coffee_roastery`, `coffee_shop`, `coffee_stand`, `colombian_restaurant`, `confectionery`, `croatian_restaurant`, `cuban_restaurant`, `czech_restaurant`, `danish_restaurant`, `deli`, `dessert_restaurant`, `dessert_shop`, `dim_sum_restaurant`, `diner`, `dog_cafe`, `donut_shop`, `dumpling_restaurant`, `dutch_restaurant`, `eastern_european_restaurant`, `ethiopian_restaurant`, `european_restaurant`, `falafel_restaurant`, `family_restaurant`, `fast_food_restaurant`, `filipino_restaurant`, `fine_dining_restaurant`, `fish_and_chips_restaurant`, `fondue_restaurant`, `food_court`, `french_restaurant`, `fusion_restaurant`, `gastropub`, `german_restaurant`, `greek_restaurant`, `gyro_restaurant`, `halal_restaurant`, `hamburger_restaurant`, `hawaiian_restaurant`, `hookah_bar`, `hot_dog_restaurant`, `hot_dog_stand`, `hot_pot_restaurant`, `hungarian_restaurant`, `ice_cream_shop`, `indian_restaurant`, `indonesian_restaurant`, `irish_pub`, `irish_restaurant`, `israeli_restaurant`, `italian_restaurant`, `japanese_curry_restaurant`, `japanese_izakaya_restaurant`, `japanese_restaurant`, `juice_shop`, `kebab_shop`, `korean_barbecue_restaurant`, `korean_restaurant`, `latin_american_restaurant`, `lebanese_restaurant`, `lounge_bar`, `malaysian_restaurant`, `meal_delivery`, `meal_takeaway`, `mediterranean_restaurant`, `mexican_restaurant`, `middle_eastern_restaurant`, `mongolian_barbecue_restaurant`, `moroccan_restaurant`, `noodle_shop`, `north_indian_restaurant`, `oyster_bar_restaurant`, `pakistani_restaurant`, `pastry_shop`, `persian_restaurant`, `peruvian_restaurant`, `pizza_delivery`, `pizza_restaurant`, `polish_restaurant`, `portuguese_restaurant`, `pub`, `ramen_restaurant`, `restaurant`, `romanian_restaurant`, `russian_restaurant`, `salad_shop`, `sandwich_shop`, `scandinavian_restaurant`, `seafood_restaurant`, `shawarma_restaurant`, `snack_bar`, `soul_food_restaurant`, `soup_restaurant`, `south_american_restaurant`, `south_indian_restaurant`, `southwestern_us_restaurant`, `spanish_restaurant`, `sports_bar`, `sri_lankan_restaurant`, `steak_house`, `sushi_restaurant`, `swiss_restaurant`, `taco_restaurant`, `taiwanese_restaurant`, `tapas_restaurant`, `tea_house`, `tex_mex_restaurant`, `thai_restaurant`, `tibetan_restaurant`, `tonkatsu_restaurant`, `turkish_restaurant`, `ukrainian_restaurant`, `vegan_restaurant`, `vegetarian_restaurant`, `vietnamese_restaurant`, `western_restaurant`, `wine_bar`, `winery`, `yakiniku_restaurant`, `yakitori_restaurant`, `food` (Table B).
- Food stores: `butcher_shop`, `food_store`, `grocery_store`, `asian_grocery_store`, `health_food_store`, `convenience_store`, `farmers_market`, `market` (when food-focused).

**SIGHT SEEING** (~100+ types):
- Entertainment and Recreation: `adventure_sports_center`, `amphitheatre`, `amusement_center`, `amusement_park`, `aquarium`, `banquet_hall`, `barbecue_area`, `botanical_garden`, `bowling_alley`, `casino`, `childrens_camp`, `city_park`, `comedy_club`, `community_center`, `concert_hall`, `convention_center`, `cultural_center`, `cycling_park`, `dance_hall`, `dog_park`, `event_venue`, `ferris_wheel`, `garden`, `go_karting_venue`, `hiking_area`, `historical_landmark`, `indoor_playground`, `internet_cafe`, `karaoke`, `live_music_venue`, `marina`, `miniature_golf_course`, `movie_rental`, `movie_theater`, `national_park`, `night_club`, `observation_deck`, `off_roading_area`, `opera_house`, `paintball_center`, `park`, `philharmonic_hall`, `picnic_ground`, `planetarium`, `plaza`, `roller_coaster`, `skateboard_park`, `state_park`, `tourist_attraction`, `video_arcade`, `vineyard`, `visitor_center`, `water_park`, `wedding_venue`, `wildlife_park`, `wildlife_refuge`, `zoo`.
- Culture: `art_gallery`, `art_museum`, `art_studio`, `auditorium`, `castle`, `cultural_landmark`, `fountain`, `historical_place`, `history_museum`, `monument`, `museum`, `performing_arts_theater`, `sculpture`.
- Natural Features: `beach`, `island`, `lake`, `mountain_peak`, `nature_preserve`, `river`, `scenic_spot`, `woods`.
- Places of Worship: `buddhist_temple`, `church`, `hindu_temple`, `mosque`, `shinto_shrine`, `synagogue`.
- Sports (recreational/viewing): `arena`, `athletic_field`, `fishing_charter`, `fishing_pier`, `fishing_pond`, `fitness_center`, `golf_course`, `gym`, `ice_skating_rink`, `indoor_golf_course`, `playground`, `race_course`, `ski_resort`, `sports_activity_location`, `sports_club`, `sports_coaching`, `sports_complex`, `sports_school`, `stadium`, `swimming_pool`, `tennis_court`.
- Transportation (scenic/landmark): `bridge`, `ferry_service`, `ferry_terminal`.
- Table B: `landmark`, `natural_feature`, `point_of_interest`.

**SHOPPING** (~50+ types):
- Shopping: `asian_grocery_store`, `auto_parts_store`, `bicycle_store`, `book_store`, `building_materials_store`, `cell_phone_store`, `clothing_store`, `convenience_store`, `cosmetics_store`, `department_store`, `discount_store`, `discount_supermarket`, `electronics_store`, `farmers_market`, `flea_market`, `furniture_store`, `garden_center`, `general_store`, `gift_shop`, `grocery_store`, `hardware_store`, `health_food_store`, `home_goods_store`, `home_improvement_store`, `hypermarket`, `jewelry_store`, `liquor_store`, `market`, `pet_store`, `shoe_store`, `shopping_mall`, `sporting_goods_store`, `sportswear_store`, `store`, `supermarket`, `tea_store`, `thrift_store`, `toy_store`, `warehouse_store`, `wholesaler`, `womens_clothing_store`.
- Services (retail-oriented): `beauty_salon`, `barber_shop`, `beautician`, `florist`, `nail_salon`, `hair_care`, `hair_salon`, `makeup_artist`, `pet_care`, `pet_boarding_service`.
- Automotive (retail): `car_dealer`, `truck_dealer`, `tire_shop`.

**Implementation:** Create mapping function `mapTypesToCategory(types: string[]): "Hungry" | "Sight Seeing" | "Shopping" | null`. Check types array in priority order (Hungry → Sight Seeing → Shopping). Return null if no match (exclude from feature).

---

## 5. Tech Stack

- **Frontend:** Web (React/Vue/Svelte), **responsive** (desktop + mobile). Carousel: Swiper/Embla. Like/Dislike: button or icon components. **Auth:** Supabase Auth UI (sign up, sign in, sign out). State: local UI state; **likes persist via backend API** (no localStorage for likes).
- **Backend:** **Supabase** (PostgreSQL + auto REST API + **Supabase Auth**). (1) Places: proxy/aggregate Google Places API (via Supabase Edge Functions or separate API server). (2) Likes: Supabase table + auto REST API for save/fetch; **Row Level Security (RLS)** required — users can only access their own likes. User identity: **user_id from Supabase Auth** (`auth.users.id`).
- **Data:** **Google Places API** for places (this round). Backend proxies/caches; API key server-side. Map Google `types[]` array to 3 categories: **Hungry**, **Sight Seeing**, **Shopping** (see mapping in Section 4). **Popular:** `popularity_score = rating * ln(1 + user_ratings_total)` (sort DESC). **Under-rated:** `hidden_gem_score = rating / ln(1 + user_ratings_total)` (sort DESC). **Implementation:** `ln` = natural logarithm. JS: `Math.log(1 + user_ratings_total)`, Python: `math.log(1 + user_ratings_total)`, SQL: `LN(1 + user_ratings_total)`. Other sources (Foursquare, etc.) in next round.
- **Hosting:** Vercel/Netlify (FE); **Supabase** (hosted PostgreSQL + REST API + optional Edge Functions) for likes and backend.

---

## 6. Implementation and deployment context (as built)

- **Status:** Feature implemented and deployed. App runs locally (`npm run dev`) and in production (see below).
- **Repo:** [github.com/smeuseai/travel-planning-app](https://github.com/smeuseai/travel-planning-app).
- **Stack as built:** React 18, TypeScript, Vite 5, Supabase (Auth + `likes` table with RLS), Swiper. Places: Google Places API via optional Express proxy (dev) or mock data when no API is configured.
- **Production hosting:** **Netlify** is the recommended and working host. The app is built as a **single HTML file** (all JS/CSS inlined via `vite-plugin-singlefile`) so there are no separate asset requests that can 404.
  - **Vercel:** Deployment was attempted; built JS/CSS assets often returned 404, causing a stuck "Loading…" screen. Single-file build and Netlify were used to resolve this.
- **Build:** `npm run build` → `dist/index.html` only (single-file). Config: `vite.config.ts` with `base: './'` and `vite-plugin-singlefile`.
- **Environment variables (production):** Set in Netlify (or host) **Environment variables**:
  - **Required for auth and likes:** `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`.
  - **Optional:** `VITE_API_BASE_URL` — when set, the app calls this base URL for `/api/places` and `/api/place-details` (real Google Places). When unset, the app uses **mock place data**.
- **Places data in production:** Without a server-side API and `VITE_API_BASE_URL`, the app uses built-in mock places (no Google API key in the browser). To use real Google Places in production, add a server or serverless API that proxies requests and keeps the API key server-side, then set `VITE_API_BASE_URL` to that API’s URL.
- **Deploy flow:** Push to `main` → Netlify builds and deploys automatically. Ensure `netlify.toml` is present (build command: `npm run build`, publish: `dist`).

---

## Summary

This PRD defines a Travel Planning App feature for discovering places in a chosen city. Users authenticate via Supabase, select a city, browse places categorized as Hungry, Sight Seeing, or Shopping, with each place tagged as Popular or Under-rated. Users can like/dislike places, and view their saved places per city. **The feature is implemented and deployed** (see Section 6 for build, hosting on Netlify, and environment variables).
