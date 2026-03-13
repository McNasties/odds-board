export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');

  const apiKey = process.env.ODDS_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'API key not configured' });
  }

  try {
    const oddsRes = await fetch(`https://api.the-odds-api.com/v4/sports/?apiKey=${apiKey}`);
    const data = await oddsRes.json();
    return res.status(oddsRes.status).json(data);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch sports', details: err.message });
  }
}
