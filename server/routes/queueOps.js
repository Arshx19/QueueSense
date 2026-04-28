const express = require("express");
const router = express.Router();
const Queue = require("../models/Queue");

// ➕ ADD PERSON
router.post("/:id/add", async (req, res) => {
  try {
    const queue = await Queue.findById(req.params.id);

    if (!queue) {
      return res.status(404).json({ message: "Queue not found" });
    }

    if (queue.isPaused) {
      return res.status(400).json({ message: "Queue is paused" });
    }

    queue.currentLength = queue.currentLength || 0;
    queue.history = queue.history || [];

    queue.currentLength += 1;

    const waitTime = queue.currentLength * (queue.serviceRate || 1);

    queue.history.push({
      length: queue.currentLength,
      waitTime,
      timestamp: new Date()
    });

    await queue.save();

    res.json({ message: "Person added", queue });

  } catch (err) {
    console.error("ADD ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

// ➖ SERVE NEXT
router.post("/:id/serve", async (req, res) => {
  try {
    const queue = await Queue.findById(req.params.id);

    if (!queue) {
      return res.status(404).json({ message: "Queue not found" });
    }

    queue.currentLength = queue.currentLength || 0;
    queue.history = queue.history || [];

    if (queue.currentLength > 0) {
      queue.currentLength -= 1;
    }

    const waitTime = queue.currentLength * (queue.serviceRate || 1);

    queue.history.push({
      length: queue.currentLength,
      waitTime,
      timestamp: new Date()
    });

    await queue.save();

    res.json({ message: "Served next", queue });

  } catch (err) {
    console.error("SERVE ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

// 🔁 RESET QUEUE
router.post("/:id/reset", async (req, res) => {
  try {
    const queue = await Queue.findById(req.params.id);

    if (!queue) {
      return res.status(404).json({ message: "Queue not found" });
    }

    queue.currentLength = 0;
    queue.history = queue.history || [];

    queue.history.push({
      length: 0,
      waitTime: 0,
      timestamp: new Date()
    });

    await queue.save();

    res.json({ message: "Queue reset", queue });

  } catch (err) {
    console.error("RESET ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

// ⏸ PAUSE / RESUME
router.post("/:id/pause", async (req, res) => {
  try {
    const queue = await Queue.findById(req.params.id);

    if (!queue) {
      return res.status(404).json({ message: "Queue not found" });
    }

    queue.isPaused = !queue.isPaused;

    await queue.save();

    res.json({
      message: queue.isPaused ? "Queue paused" : "Queue resumed",
      isPaused: queue.isPaused
    });

  } catch (err) {
    console.error("PAUSE ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

// 🧪 TEST ROUTE
router.get("/create-test", async (req, res) => {
  try {
    const queue = await Queue.create({
      name: "Test Queue",
      currentLength: 5,
      maxCapacity: 20,
      serviceRate: 2,
      isPaused: false,
      history: []
    });

    res.json(queue);
  } catch (err) {
    console.error("TEST ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

// 🔍 GET QUEUE BY ID
router.get("/:id", async (req, res) => {
  try {
    const queue = await Queue.findById(req.params.id);

    if (!queue) {
      return res.status(404).json({ message: "Queue not found" });
    }

    res.json({ queue });

  } catch (err) {
    console.error("GET ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;