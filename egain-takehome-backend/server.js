const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const validateEnv = require('./utils/validateEnv');

// Load environment variables
dotenv.config();
validateEnv();

const app = express();
app.use(cors());
app.use(express.json());

// Import routes
const propertyRoutes = require('./routes/property');
const valueRoutes = require('./routes/value');
const schoolsRoutes = require('./routes/schools');
const chatGptRoutes = require('./routes/chatgpt');

// Use routes
app.use('/api/property', propertyRoutes);
app.use('/api/value', valueRoutes);
app.use('/api/schools', schoolsRoutes);
app.use('/api/chatgpt', chatGptRoutes);

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
});

// Start the server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
