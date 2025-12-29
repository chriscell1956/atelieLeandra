const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const { initDb } = require('./db');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Initialize Database
initDb();

// Routes
// app.use('/api/products', require('./routes/products'));
// app.use('/api/auth', require('./routes/auth'));

app.get('/', (req, res) => {
  res.send('Ateliê Leandra API is running');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
