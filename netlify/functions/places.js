/**
 * Netlify Function: proxy GET /api/places?city=... → Google Places Text Search.
 * Set GOOGLE_PLACES_API_KEY in Netlify environment variables.
 */
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

exports.handler = async (event) => {
  if (event.httpMethod !== 'GET') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
  }
  const city = event.queryStringParameters?.city;
  const key = process.env.GOOGLE_PLACES_API_KEY;
  if (!city || !key) {
    return {
      statusCode: 400,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'INVALID_REQUEST', error: 'Missing city or API key' }),
    };
  }
  try {
    const allResults = [];
    let nextPageToken = null;
    let status = 'OK';
    do {
      const url = nextPageToken
        ? `https://maps.googleapis.com/maps/api/place/textsearch/json?pagetoken=${encodeURIComponent(nextPageToken)}&key=${key}`
        : `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent('places to visit in ' + city)}&key=${key}`;
      const res = await fetch(url);
      const data = await res.json();
      status = data.status || status;
      if (data.results && Array.isArray(data.results)) allResults.push(...data.results);
      nextPageToken = data.next_page_token || null;
      if (nextPageToken) await delay(2000);
    } while (nextPageToken);
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, results: allResults }),
    };
  } catch (err) {
    console.error('Places proxy error:', err);
    return {
      statusCode: 502,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'ERROR', error: err.message }),
    };
  }
};
