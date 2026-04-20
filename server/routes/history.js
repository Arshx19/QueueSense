const express = require("express");
const router = express.Router();
const Queue = require("../models/Queue");

// 1. GET history of a queue
router.get("/:queueId", async (req, res) => {
  try {
    const queue = await Queue.findById(req.params.queueId);

    if (!queue) {
      return res.status(404).json({ message: "Queue not found" });
    }

    res.json(queue.history);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. GET stats of a queue
router.get("/stats/:queueId", async (req, res) => {
  try {
    const queue = await Queue.findById(req.params.queueId);

    if (!queue) {
      return res.status(404).json({ message: "Queue not found" });
    }

    const history = queue.history;

    if (history.length === 0) {
      return res.json({
        peakLength: 0,
        avgWait: 0,
        avgLength: 0
      });
    }

    let peakLength = 0;
    let totalWait = 0;
    let totalLength = 0;

    history.forEach((h) => {
      if (h.length > peakLength) peakLength = h.length;
      totalWait += h.waitTime || 0;
      totalLength += h.length;
    });

    const avgWait = totalWait / history.length;
    const avgLength = totalLength / history.length;

    res.json({
      peakLength,
      avgWait,
      avgLength
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. DELETE history
router.delete("/:queueId", async (req, res) => {
  try {
    const queue = await Queue.findById(req.params.queueId);

    if (!queue) {
      return res.status(404).json({ message: "Queue not found" });
    }

    queue.history = [];
    await queue.save();

    res.json({ message: "History cleared successfully" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;