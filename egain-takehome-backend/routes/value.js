const express = require('express');
const axios = require('../node_modules/axios/index.d.cts');

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const { latitude, longitude } = req.query;
    const response = await axios.get('https://api.rentcast.io/v1/avm/value', {
      params: { latitude, longitude },
      headers: { "X-Api-Key": process.env.RENTCAST_API_KEY },
    });
    res.json(response.data);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
