# Travel Planning App

A travel planning application that helps users discover places in cities, categorized as Hungry, Sight Seeing, or Shopping. Users can browse places, like/dislike them, and save their favorites.

## Features

- **Authentication**: Sign up/Sign in with Supabase Auth
- **City Selection**: Choose from popular cities or search
- **Place Discovery**: Browse places categorized as:
  - **Hungry**: Restaurants, cafes, food stores
  - **Sight Seeing**: Museums, parks, attractions, natural features
  - **Shopping**: Retail stores, malls, markets
- **Scoring**: Places are tagged as "Popular" or "Under-rated" based on calculated scores
- **Like/Dislike**: Swipe through places and save favorites
- **Saved Places**: View and manage your saved places per city

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Backend**: Supabase (PostgreSQL + Auth + RLS)
- **Places API**: Google Places API
- **UI Components**: Swiper for image carousels
- **Styling**: CSS with responsive design

## Setup Instructions

### Prerequisites

- Node.js 18+ and npm/yarn
- Supabase account and project
- Google Places API key

### Installation

1. Clone the repository and install dependencies:
```bash
npm install
```

2. Set up environment variables:
   - Copy `.env.example` to `.env`
   - Fill in your Supabase credentials:
     ```
     VITE_SUPABASE_URL=your_supabase_project_url
     VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
     VITE_GOOGLE_PLACES_API_KEY=your_google_places_api_key
     ```

3. Set up Supabase database:
   - Run the migration file `supabase/migrations/001_create_likes_table.sql` in your Supabase SQL editor
   - This creates the `likes` table with Row Level Security policies

4. Start the development server:
```bash
npm run dev
```

5. Open your browser to `http://localhost:5173`

## Project Structure

```
src/
├── components/
│   ├── auth/          # Authentication components
│   ├── city/          # City selector component
│   ├── layout/        # Header, Navigation
│   ├── place/          # Place card and like/dislike stack
│   └── saved/         # Saved places list
├── contexts/          # React contexts (Auth)
├── lib/               # Supabase client
├── services/          # API services (Places, Likes)
├── types/             # TypeScript type definitions
├── utils/             # Utilities (type mapping, scoring)
└── App.tsx            # Main app component
```

## Google Places API Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a project or select an existing one
3. Enable the Places API
4. Create credentials (API Key)
5. Add the API key to your `.env` file

**Note**: The app will use mock data if no API key is provided, which is useful for development.

## Supabase Setup

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to SQL Editor and run the migration file
3. Copy your project URL and anon key to `.env`

## Development

- The app uses mock data when Google Places API key is not configured
- All components are responsive and work on desktop and mobile
- Type mapping automatically categorizes places from Google Places API types

## Building for Production

```bash
npm run build
```

The built files will be in the `dist/` directory, ready to deploy to Vercel, Netlify, or any static hosting service.

## Deploy to the Web (Vercel)

1. **Push your code** to GitHub (you already have [github.com/smeuseai/travel-planning-app](https://github.com/smeuseai/travel-planning-app)).

2. **Sign in to [Vercel](https://vercel.com)** (free account; you can use “Continue with GitHub”).

3. **Import the project**
   - Click **Add New… → Project**
   - Select the **smeuseai/travel-planning-app** repo
   - Leave **Framework Preset** as Vite (or auto-detected)
   - **Build Command**: `npm run build`  
   - **Output Directory**: `dist`

4. **Set environment variables** (required for auth and optional for real places):
   - In the import screen (or later in **Project → Settings → Environment Variables**), add:
     - `VITE_SUPABASE_URL` = your Supabase project URL  
     - `VITE_SUPABASE_ANON_KEY` = your Supabase anon (public) key  
   - Without these, sign-in and saved likes will not work.

5. **Deploy**
   - Click **Deploy**. Vercel will build and host the app and give you a URL like `https://travel-planning-app-xxx.vercel.app`.

**Note:** The app uses **mock place data** when no backend is configured. To use **real Google Places** data in production, you’d need to add a small API (e.g. Vercel serverless functions) that proxy requests and keep your API key server-side, then set `VITE_API_BASE_URL` to that API’s URL.

### Deploy with Netlify (if Vercel keeps showing "Loading…")

If the app on Vercel only shows "Loading Travel Planning App…" and never loads, try **Netlify** with the same repo:

1. **Push your latest code** to GitHub (including `vite.config.ts` with `vite-plugin-singlefile` and `netlify.toml`).
2. Go to **[app.netlify.com](https://app.netlify.com)** and sign in with GitHub.
3. **Add new site → Import an existing project** → choose **GitHub** → **smeuseai/travel-planning-app**.
4. Netlify will read `netlify.toml`: **Build command** `npm run build`, **Publish directory** `dist`. Leave as-is.
5. **Add environment variables** (Site settings → Environment variables):
   - `VITE_SUPABASE_URL` = your Supabase project URL  
   - `VITE_SUPABASE_ANON_KEY` = your Supabase anon key  
   - `GOOGLE_PLACES_API_KEY` = your Google Places API key (for real places in production; optional — app uses mock data if unset)  
6. Click **Deploy site**. When the build finishes, open the site URL. The app should load (sign-in screen or city selector). With `GOOGLE_PLACES_API_KEY` set, the production app will use **real Google Places data** via Netlify Functions (`/api/places`, `/api/place-details`, `/api/place-photo`).

### Supabase configuration for production

After the app is live on Netlify, update Supabase so auth (sign-in, sign-up, password reset, email confirmation) works correctly on the production URL:

1. Open the **[Supabase Dashboard](https://supabase.com/dashboard)** and select your project.
2. Go to **Authentication** → **URL Configuration**.
3. **Site URL:** Set to your production app URL, e.g.  
   `https://your-site-name.netlify.app`  
   (Replace with your actual Netlify URL. This is used for email confirmation and password reset links.)
4. **Redirect URLs:** Add your production URL so Supabase allows redirects back to your app. Click **Add URL** and add:
   - `https://your-site-name.netlify.app`
   - `https://your-site-name.netlify.app/**`  
   You can keep `http://localhost:5173` and `http://localhost:5173/**` in the list for local development.
5. Click **Save**.

No code or database changes are required; the app already uses the env vars set in Netlify.

## License

MIT
