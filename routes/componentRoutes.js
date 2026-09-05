const express = require('express');
const router = express.Router();
const Component = require('../models/Component');

router.get('/', async (req, res) => {
  try {
    const components = await Component.find({});
    res.json(components);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const newComp = new Component(req.body);
    const saved = await newComp.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;