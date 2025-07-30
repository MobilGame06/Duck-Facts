const express = require('express');
const router = express.Router();
const { loadFactsByLanguage } = require('../utils/dataLoader');
const { validateFactId } = require('../middleware/validation');

/**
 * @swagger
 * /api/facts/random:
 *   get:
 *     summary: Get a random duck fact
 *     description: Returns a randomly selected duck fact from the database. Supports multiple languages with English as the default.
 *     tags: [facts]
 *     parameters:
 *       - $ref: '#/components/parameters/LanguageQuery'
 *     responses:
 *       200:
 *         $ref: '#/components/responses/DuckFactResponse'
 *         content:
 *           application/json:
 *             examples:
 *               english_fact:
 *                 summary: English duck fact
 *                 value:
 *                   id: 42
 *                   fact: "Ducks have waterproof feathers thanks to an oil gland near their tails."
 *                   lang: "en"
 *               german_fact:
 *                 summary: German duck fact
 *                 value:
 *                   id: 15
 *                   fact: "Enten haben wasserdichte Federn dank einer Öldrüse in der Nähe ihrer Schwänze."
 *                   lang: "de"
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get('/facts/random', async (req, res, _next) => {
  try {
    const lang =
      req.query.lang && ['en', 'de'].includes(req.query.lang)
        ? req.query.lang
        : 'en';
    const data = await loadFactsByLanguage('./data/facts.json', lang);
    const randomIndex = Math.floor(Math.random() * data.length);
    res.json({
      id: randomIndex,
      fact: data[randomIndex],
      lang: lang,
    });
  } catch {
    res.status(500).json({ error: 'Failed to load facts' });
  }
});

/**
 * @swagger
 * /api/facts/{id}:
 *   get:
 *     summary: Get a specific duck fact by ID
 *     description: Returns a specific duck fact identified by its unique ID. The ID must be a valid integer within the available range (0-170).
 *     tags: [facts]
 *     parameters:
 *       - $ref: '#/components/parameters/FactId'
 *       - $ref: '#/components/parameters/LanguageQuery'
 *     responses:
 *       200:
 *         $ref: '#/components/responses/DuckFactResponse'
 *         content:
 *           application/json:
 *             examples:
 *               english_fact:
 *                 summary: English duck fact by ID
 *                 value:
 *                   id: 0
 *                   fact: "Ducks have waterproof feathers thanks to an oil gland near their tails."
 *                   lang: "en"
 *               german_fact:
 *                 summary: German duck fact by ID
 *                 value:
 *                   id: 0
 *                   fact: "Enten haben wasserdichte Federn dank einer Öldrüse in der Nähe ihrer Schwänze."
 *                   lang: "de"
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *         content:
 *           application/json:
 *             examples:
 *               invalid_format:
 *                 summary: Invalid ID format
 *                 value:
 *                   error: "Invalid fact ID format"
 *               decimal_id:
 *                 summary: Decimal ID not allowed
 *                 value:
 *                   error: "Invalid fact ID format"
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *         content:
 *           application/json:
 *             examples:
 *               out_of_range:
 *                 summary: ID out of range
 *                 value:
 *                   error: "Fact not found"
 *               negative_id:
 *                 summary: Negative ID
 *                 value:
 *                   error: "Fact not found"
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get('/facts/:id', validateFactId, async (req, res, _next) => {
  const id = req.params.id; // Already validated and converted to integer by middleware

  try {
    const lang =
      req.query.lang && ['en', 'de'].includes(req.query.lang)
        ? req.query.lang
        : 'en';
    const data = await loadFactsByLanguage('./data/facts.json', lang);
    if (id < 0 || id >= data.length) {
      return res.status(404).json({ error: 'Fact not found' });
    }
    res.json({
      id: id,
      fact: data[id],
      lang: lang,
    });
  } catch {
    res.status(500).json({ error: 'Failed to load facts' });
  }
});

module.exports = router;
