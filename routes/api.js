const express = require('express');
const router = express.Router();

const loadData = async (filename) => {
  const { promises: fs } = require('fs');
  try {
    const data = await fs.readFile(filename, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading file ${filename}:`, error);
    throw error;
  }
};

/**
 * @swagger
 * /api/facts/random:
 *   get:
 *     summary: Returns a random duck fact
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
 */
router.get('/facts/random', async (req, res, _next) => {
  try {
    const data = await loadData('./data/facts.json');
    const randomIndex = Math.floor(Math.random() * data.length);
    res.json({
      id: randomIndex,
      fact: data[randomIndex],
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
 *       400:
 *         description: Unable to process the request due to invalid input
 *       404:
 *         description: Duck fact not found
 */
router.get('/facts/:id', async (req, res, _next) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    return res.status(400).json({ error: 'Invalid ID format' });
  }

  try {
    const data = await loadData('./data/facts.json');
    if (id < 0 || id >= data.length) {
      return res.status(404).json({ error: 'Fact not found' });
    }
    res.json({
      id: id,
      fact: data[id],
    });
  } catch {
    res.status(500).json({ error: 'Failed to load facts' });
  }
});

module.exports = router;
