/**
 * Netlify Function: proxy GET /api/place-photo?maxwidth=...&photoreference=... → Google Place Photo (image).
 * Set GOOGLE_PLACES_API_KEY in Netlify environment variables.
 */
exports.handler = async (event) => {
  if (event.httpMethod !== 'GET') {
    return { statusCode: 405, body: 'Method not allowed' };
  }
  const q = event.queryStringParameters || {};
  const photoreference = q.photoreference;
  const maxwidth = q.maxwidth || '800';
  const key = process.env.GOOGLE_PLACES_API_KEY;
  if (!photoreference || !key) {
    return { statusCode: 400, body: 'Missing photoreference or API key' };
  }
  try {
    const params = new URLSearchParams({ maxwidth, photoreference, key });
    const url = `https://maps.googleapis.com/maps/api/place/photo?${params}`;
    const res = await fetch(url, { redirect: 'follow' });
    if (!res.ok) {
      return { statusCode: res.status, body: 'Photo fetch failed' };
    }
    const buffer = await res.arrayBuffer();
    const base64 = Buffer.from(buffer).toString('base64');
    const contentType = res.headers.get('content-type') || 'image/jpeg';
    return {
      statusCode: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': res.headers.get('cache-control') || 'public, max-age=86400',
      },
      body: base64,
      isBase64Encoded: true,
    };
  } catch (err) {
    console.error('Place photo proxy error:', err);
    return { statusCode: 502, body: 'Photo unavailable' };
  }
};
