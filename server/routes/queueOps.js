const express = require("express");
const router = express.Router();
const Queue = require("../models/Queue");

// Add person
router.post("/:id/add", async (req, res) => {
  const queue = await Queue.findById(req.params.id);
  if (!queue) return res.status(404).json({ message: "Not found" });

  queue.currentLength++;

  queue.history.push({
    length: queue.currentLength,
    waitTime: queue.currentLength * (queue.serviceRate || 1),
    timestamp: new Date()
  });

  await queue.save();

  res.json(queue);
});

// Serve next
router.post("/:id/serve", async (req, res) => {
  const queue = await Queue.findById(req.params.id);
  if (!queue) return res.status(404).json({ message: "Not found" });

  if (queue.currentLength > 0) queue.currentLength--;

  queue.history.push({
    length: queue.currentLength,
    waitTime: queue.currentLength * (queue.serviceRate || 1),
    timestamp: new Date()
  });

  await queue.save();

  res.json(queue);
});

// Reset
router.post("/:id/reset", async (req, res) => {
  const queue = await Queue.findById(req.params.id);
  if (!queue) return res.status(404).json({ message: "Not found" });

  queue.currentLength = 0;

  queue.history.push({
    length: 0,
    waitTime: 0,
    timestamp: new Date()
  });

  await queue.save();

  res.json(queue);
});

// Pause/Resume
router.post("/:id/pause", async (req, res) => {
  const queue = await Queue.findById(req.params.id);
  if (!queue) return res.status(404).json({ message: "Not found" });

  queue.isPaused = !queue.isPaused;
  await queue.save();

  res.json(queue);
});

//test route
router.get("/create-test", async (req, res) => {
  try {
    const queue = await Queue.create({
      name: "Test Queue",
      currentLength: 5,
      maxCapacity: 20,
      serviceRate: 2, // 
      isPaused: false,
      history: []
    });

    res.json(queue);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get queue by ID (IMPORTANT for frontend)
router.get("/:id", async (req, res) => {
  try {
    const queue = await Queue.findById(req.params.id);

    if (!queue) {
      return res.status(404).json({ message: "Queue not found" });
    }

    res.json({ queue });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;