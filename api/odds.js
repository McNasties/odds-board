export default async function handler(req, res) {
  // Allow requests from your own site only
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');

  const apiKey = process.env.ODDS_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'API key not configured' });
  }

  const { sport, market, region } = req.query;

  if (!sport || !market || !region) {
    return res.status(400).json({ error: 'Missing required query params: sport, market, region' });
  }

  const sportPath = sport === 'upcoming' ? 'upcoming' : sport;
  const url = `https://api.the-odds-api.com/v4/sports/${sportPath}/odds/?apiKey=${apiKey}&regions=${region}&markets=${market}&oddsFormat=american&dateFormat=iso`;

  try {
    const oddsRes = await fetch(url);
    const data = await oddsRes.json();

    // Forward quota headers to the client
    res.setHeader('x-requests-remaining', oddsRes.headers.get('x-requests-remaining') || '');
    res.setHeader('x-requests-used', oddsRes.headers.get('x-requests-used') || '');

    return res.status(oddsRes.status).json(data);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch from Odds API', details: err.message });
  }
}
