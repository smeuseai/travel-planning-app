/**
 * Backend proxy for Google Places API.
 * Keeps the API key server-side only (never sent to the browser).
 */
import 'dotenv/config';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const GOOGLE_PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY || process.env.VITE_GOOGLE_PLACES_API_KEY || '';
const PORT = process.env.PORT || 3001;
const isProduction = process.env.NODE_ENV === 'production';

const app = express();

// Helper: delay for Google pagination (must wait before using next_page_token)
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Proxy: GET /api/places?city=Singapore → Google Text Search with pagination (all pages merged)
app.get('/api/places', async (req, res) => {
  const city = req.query.city;
  if (!city || !GOOGLE_PLACES_API_KEY) {
    return res.status(400).json({ status: 'INVALID_REQUEST', error: 'Missing city or API key' });
  }
  try {
    const allResults = [];
    let nextPageToken = null;
    let status = 'OK';

    do {
      let url;
      if (nextPageToken) {
        url = `https://maps.googleapis.com/maps/api/place/textsearch/json?pagetoken=${encodeURIComponent(nextPageToken)}&key=${GOOGLE_PLACES_API_KEY}`;
      } else {
        const query = encodeURIComponent(`places to visit in ${city}`);
        url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${query}&key=${GOOGLE_PLACES_API_KEY}`;
      }
      const response = await fetch(url);
      const data = await response.json();

      status = data.status || status;
      if (data.results && Array.isArray(data.results)) {
        allResults.push(...data.results);
      }
      nextPageToken = data.next_page_token || null;

      if (nextPageToken) {
        await delay(2000); // Google requires a short delay before using next_page_token
      }
    } while (nextPageToken);

    res.json({ status, results: allResults });
  } catch (err) {
    console.error('Places proxy error:', err);
    res.status(502).json({ status: 'ERROR', error: err.message });
  }
});

// Proxy: GET /api/place-details?place_id=...&fields=... → Google Place Details
app.get('/api/place-details', async (req, res) => {
  const { place_id, fields } = req.query;
  if (!place_id || !GOOGLE_PLACES_API_KEY) {
    return res.status(400).json({ error: 'Missing place_id or API key' });
  }
  try {
    const params = new URLSearchParams({
      place_id,
      key: GOOGLE_PLACES_API_KEY,
      ...(fields && { fields }),
    });
    const url = `https://maps.googleapis.com/maps/api/place/details/json?${params}`;
    const response = await fetch(url);
    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error('Place details proxy error:', err);
    res.status(502).json({ error: err.message });
  }
});

// Proxy: GET /api/place-photo?maxwidth=...&photoreference=... → stream image (key never in URL to client)
app.get('/api/place-photo', async (req, res) => {
  const { maxwidth = 800, photoreference } = req.query;
  if (!photoreference || !GOOGLE_PLACES_API_KEY) {
    return res.status(400).send('Missing photoreference or API key');
  }
  try {
    const params = new URLSearchParams({
      maxwidth: String(maxwidth),
      photoreference,
      key: GOOGLE_PLACES_API_KEY,
    });
    const url = `https://maps.googleapis.com/maps/api/place/photo?${params}`;
    const response = await fetch(url, { redirect: 'follow' });
    if (!response.ok) {
      return res.status(response.status).send('Photo fetch failed');
    }
    const contentType = response.headers.get('content-type') || 'image/jpeg';
    res.set('content-type', contentType);
    res.set('cache-control', response.headers.get('cache-control') || 'public, max-age=86400');
    const buffer = await response.arrayBuffer();
    res.send(Buffer.from(buffer));
  } catch (err) {
    console.error('Place photo proxy error:', err);
    res.status(502).send('Photo unavailable');
  }
});

// In production, serve the built frontend
if (isProduction) {
  const distPath = path.join(__dirname, '..', 'dist');
  app.use(express.static(distPath));
  app.get('*', (req, res) => {
    if (req.path.startsWith('/api')) return res.status(404).json({ error: 'Not found' });
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}${isProduction ? ' (production)' : ''}`);
  if (!GOOGLE_PLACES_API_KEY) {
    console.warn('Warning: GOOGLE_PLACES_API_KEY not set. Add it to .env to use real places data.');
  }
});
