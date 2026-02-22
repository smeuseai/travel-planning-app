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

## License

MIT
