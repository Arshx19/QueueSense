const express = require("express");
const router = express.Router();
const Queue = require("../models/Queue");
const History = require("../models/history");

// ✅ 1. USER HISTORY (NEW - IMPORTANT)
router.get("/user/:userId", async (req, res) => {
  try {
    const history = await History.find({
      userId: req.params.userId
    })
    .populate("queueId", "name organization")
    .sort({ createdAt: -1 });

    res.json(history);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ 2. QUEUE HISTORY (YOUR ORIGINAL)
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

// ✅ 3. STATS (UNCHANGED)
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

// ✅ 4. DELETE
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