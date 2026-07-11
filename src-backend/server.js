require('dotenv').config();
const express = require('express');
const cors    = require('cors');
const morgan  = require('morgan');
const connectDB = require('./config/database');

const app  = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

connectDB();

app.use('/api/metrics',  require('./routes/metricsRoutes'));
app.use('/api/hotspots', require('./routes/hotspotRoutes'));
app.use('/api/auth',     require('./routes/authRoutes'));

app.get('/', (req, res) =>
  res.json({ status: 'ok', app: 'Kotosh 360 API v1.0' })
);

app.listen(PORT, () =>
  console.log(`🏛️  Kotosh 360 API corriendo en puerto ${PORT}`)
);
