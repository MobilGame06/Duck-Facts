const express = require('express');
const router = express.Router();
const { loadFactsByLanguage } = require('../utils/dataLoader');
const { validateFactId } = require('../middleware/validation');

/**
 * @swagger
 * /api/facts/random:
 *   get:
 *     summary: Returns a random duck fact
 *     parameters:
 *       - in: query
 *         name: lang
 *         schema:
 *           type: string
 *           enum: [en, de]
 *         description: Language code for the fact (defaults to 'en')
 *     responses:
 *       200:
 *         description: Successfully retrieved a random duck fact
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 fact:
 *                   type: string
 *                 lang:
 *                   type: string
 */
router.get('/facts/random', async (req, res, _next) => {
  try {
    const lang = req.query.lang && ['en', 'de'].includes(req.query.lang) ? req.query.lang : 'en';
    const data = await loadFactsByLanguage('./data/facts.json', lang);
    const randomIndex = Math.floor(Math.random() * data.length);
    res.json({
      id: randomIndex,
      fact: data[randomIndex],
      lang: lang
    });
  } catch {
    res.status(500).json({ error: 'Failed to load facts' });
  }
});

/**
 * @swagger
 * /api/facts/{id}:
 *   get:
 *     summary: Returns a duck fact by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Identifier of the duck fact to retrieve
 *       - in: query
 *         name: lang
 *         schema:
 *           type: string
 *           enum: [en, de]
 *         description: Language code for the fact (defaults to 'en')
 *     responses:
 *       200:
 *         description: Successfully retrieved the duck fact
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 fact:
 *                   type: string
 *                 lang:
 *                   type: string
 *       400:
 *         description: Unable to process the request due to invalid input
 *       404:
 *         description: Duck fact not found
 */
router.get('/facts/:id', validateFactId, async (req, res, _next) => {
  const id = req.params.id; // Already validated and converted to integer by middleware

  try {
    const lang = req.query.lang && ['en', 'de'].includes(req.query.lang) ? req.query.lang : 'en';
    const data = await loadFactsByLanguage('./data/facts.json', lang);
    if (id < 0 || id >= data.length) {
      return res.status(404).json({ error: 'Fact not found' });
    }
    res.json({
      id: id,
      fact: data[id],
      lang: lang
    });
  } catch {
    res.status(500).json({ error: 'Failed to load facts' });
  }
});

module.exports = router;
