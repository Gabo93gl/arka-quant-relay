const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors({ origin: '*' }));

app.get('/health', (_, res) => {
  res.json({ status: 'ok', service: 'arka-quant-relay' });
});

app.get('/yahoo', async (req, res) => {
  const { ticker, range = '1y', interval = '1d' } = req.query;
  if (!ticker) return res.status(400).json({ error: 'ticker is required' });

  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(ticker)}?range=${range}&interval=${interval}&includePrePost=false&events=div%7Csplit`;

  try {
    const r = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        'Accept': 'application/json',
        'Referer': 'https://finance.yahoo.com/'
      }
    });
    if (!r.ok) throw new Error(`Yahoo returned HTTP ${r.status}`);
    const data = await r.json();
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`ARKA Quant Relay corriendo en puerto ${PORT}`));
