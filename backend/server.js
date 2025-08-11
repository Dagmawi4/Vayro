const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// health check
app.get('/api/health', (req, res) => res.json({ ok: true }));

// mock price estimates
app.get('/api/transport/estimate-price', (req, res) => {
  res.json({ uber: 24.12, lyft: 21.87 });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));
