const express = require('express');
const router = express.Router();
const User = require('../models/User'); // Update the path to your User model

// POST route to handle subscription
router.post('/', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).send('Email is required');

  try {
    const user = await User.findOneAndUpdate(
      { email },
      { isSubscribed: true },
      { new: true }
    );

    if (!user) return res.status(404).send('User not found');

    res.status(200).json({ message: 'Successfully subscribed!' });
  } catch (error) {
    console.error('Subscription error:', error);
    res.status(500).send('Server error');
  }
});

// routes/subscribe.js
router.post('/unsubscribe', async (req, res) => {
  const { email } = req.body;

  if (!email) return res.status(400).send('Email is required');

  try {
    const user = await User.findOneAndUpdate(
      { email },
      { isSubscribed: false },
      { new: true }
    );

    if (!user) return res.status(404).send('User not found');

    res.json({ message: 'Unsubscribed successfully' });
  } catch (err) {
    console.error('Unsubscribe error:', err);
    res.status(500).send('Server error');
  }
});
router.post('/status', async (req, res) => {
  const { email } = req.body;

  if (!email) return res.status(400).send('Email is required');

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).send('User not found');

    res.json({ isSubscribed: user.isSubscribed });
  } catch (err) {
    console.error('Status error:', err);
    res.status(500).send('Server error');
  }
});

module.exports = router;
