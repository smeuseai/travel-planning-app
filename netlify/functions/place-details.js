/**
 * Netlify Function: proxy GET /api/place-details?place_id=...&fields=... → Google Place Details.
 * Set GOOGLE_PLACES_API_KEY in Netlify environment variables.
 */
exports.handler = async (event) => {
  if (event.httpMethod !== 'GET') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
  }
  const { place_id, fields } = event.queryStringParameters || {};
  const key = process.env.GOOGLE_PLACES_API_KEY;
  if (!place_id || !key) {
    return {
      statusCode: 400,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Missing place_id or API key' }),
    };
  }
  try {
    const params = new URLSearchParams({ place_id, key, ...(fields && { fields }) });
    const url = `https://maps.googleapis.com/maps/api/place/details/json?${params}`;
    const res = await fetch(url);
    const data = await res.json();
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    };
  } catch (err) {
    console.error('Place details proxy error:', err);
    return {
      statusCode: 502,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: err.message }),
    };
  }
};
