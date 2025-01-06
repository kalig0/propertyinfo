const express = require('express');
const axios = require('../node_modules/axios/index.d.cts');

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const { lat, lon } = req.query;
    const response = await axios.get('https://gs-api.greatschools.org/v2/nearby-schools', {
      params: { lat, lon },
      headers: { "X-API-Key": process.env.NEARBYSCHOOLS_API_KEY },
    });
    res.json(response.data);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
