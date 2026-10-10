const express = require('express');
const router = express.Router();
const { loadFactsByLanguage, getFactLanguage } = require('../utils/dataLoader');

/* GET home page. */
router.get('/', async (req, res, _next) => {
  const lang = getFactLanguage(req.query.lang);
  try {
    const facts = await loadFactsByLanguage(lang);

    // Get 4 example facts for display
    const exampleFacts = [facts[2], facts[17], facts[29], facts[16]]
      .filter(Boolean)
      .map((record) => record.fact); // Using different indices for variety

    res.render('index', {
      title: 'Duck Facts API',
      currentLang: lang,
      exampleFacts: exampleFacts,
    });
  } catch {
    // Fallback if data loading fails
    const fallbackFacts =
      lang === 'de'
        ? [
            'Männliche Enten werden Erpel genannt; weibliche sind einfach Enten.',
            'Enten können Vibrationen im Wasser durch ihre Schnäbel spüren.',
            'In Cartoons tragen Enten oft keine Hose - aber sie werden nie verhaftet.',
            'Die Stimme einer Ente kann bis zu einem halben Kilometer über offenes Wasser tragen.',
          ]
        : [
            'Male ducks are called drakes; females are simply ducks.',
            'Ducks can feel vibrations in the water through their bills.',
            "In cartoons, ducks often don't wear pants — but they never get arrested.",
            "A duck's voice can carry up to half a kilometer over open water.",
          ];

    res.render('index', {
      title: 'Duck Facts API',
      currentLang: lang,
      exampleFacts: fallbackFacts,
    });
  }
});

module.exports = router;
