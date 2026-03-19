const express = require('express');
const router = express.Router();
const Queue = require('../models/Queue');

// Create a queue
router.post('/create', async (req, res) => {
  const queue = new Queue(req.body);
  await queue.save();
  res.json(queue);
});

// Get all queues
router.get('/', async (req, res) => {
  const queues = await Queue.find();
  res.json(queues);
});

// Add person to queue
router.post('/:id/add', async (req, res) => {
  const queue = await Queue.findById(req.params.id);
  queue.currentLength += 1;
  await queue.save();
  res.json(queue);
});

// Serve next person
router.post('/:id/serve', async (req, res) => {
  const queue = await Queue.findById(req.params.id);
  queue.currentLength -= 1;
  await queue.save();
  res.json(queue);
});

// Reset queue
router.post('/:id/reset', async (req, res) => {
  const queue = await Queue.findById(req.params.id);
  queue.currentLength = 0;
  await queue.save();
  res.json(queue);
});

module.exports = router;