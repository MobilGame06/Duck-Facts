var express = require('express');
var router = express.Router();

const loadData = async (filename) => {
  const fs = require('fs').promises;
  try {
    const data = await fs.readFile(filename, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading file ${filename}:`, error);
    throw error;
  }
};

router.get('/facts/random', function (req, res, next) {
  const facts = loadData('./data/facts.json')
    .then(data => {
      const randomIndex = Math.floor(Math.random() * data.length);
      res.json({
        id: randomIndex,
        fact: data[randomIndex]
      });
    })
    .catch(error => {
      res.status(500).json({ error: 'Failed to load facts' });
    });
});

router.get('/facts/:id', function (req, res, next) {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    return res.status(400).json({ error: 'Invalid ID format' });
  }

  loadData('./data/facts.json')
    .then(data => {
      if (id < 0 || id >= data.length) {
        return res.status(404).json({ error: 'Fact not found' });
      }
      res.json({
        id: id,
        fact: data[id]
      });
    })
    .catch(error => {
      res.status(500).json({ error: 'Failed to load facts' });
    });
});

module.exports = router;
