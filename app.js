const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// LeetCode API Proxy Route
app.get('/api/leetcode/:username', async (req, res) => {
  const { username } = req.params;

  try {
    const fetch = (await import('node-fetch')).default; // Dynamic import
    const response = await fetch('http://localhost:3000/leetcode', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username }),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch LeetCode rating');
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Unable to fetch LeetCode rating' });
  }
});

app.listen(PORT, () => {
  console.log(`Portfolio website running at http://localhost:${PORT}`);
});
