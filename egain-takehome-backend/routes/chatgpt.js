const express = require('express');
const axios = require('../node_modules/axios/index.d.cts');

const router = express.Router();

router.post('/', async (req, res, next) => {
  try {
    const { messages } = req.body;
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4o',
        messages,
        max_tokens: 500,
      },
      {
        headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
      }
    );
    res.json(response.data);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
