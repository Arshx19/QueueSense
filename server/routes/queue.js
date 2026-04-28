const express = require('express');
const Queue = require('../models/Queue');
const History = require('../models/history');
const router = express.Router();
const axios = require("axios");

// 🔮 ML Wait Time (SAFE)
const calculateWaitTime = async (length, serviceRate) => {
  try {
    const mlRes = await axios.post("http://localhost:5001/predict", {
      length,
      serviceRate
    });

    return (
      mlRes.data.waitTime ||
      mlRes.data.prediction ||
      mlRes.data.predicted_wait ||
      0
    );

  } catch (err) {
    console.log("ML ERROR:", err.message);

    return serviceRate > 0
      ? Number((length / serviceRate).toFixed(1))
      : 0;
  }
};

// ✅ GET ALL QUEUES
router.get('/', async (req, res) => {
  try {
    const queues = await Queue.find();

    const result = await Promise.all(
      queues.map(async (q) => {
        const waitTime = await calculateWaitTime(
          q.currentLength,
          q.serviceRate
        );
        return { ...q.toObject(), waitTime };
      })
    );

    res.json(result);
  } catch (err) {
    console.error("GET ALL ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ 🔥 IMPORTANT FIX (ADMIN DASHBOARD)
router.get('/org/:org', async (req, res) => {
  try {
    const queues = await Queue.find({
      organization: req.params.org
    });

    const result = await Promise.all(
      queues.map(async (q) => {
        const waitTime = await calculateWaitTime(
          q.currentLength,
          q.serviceRate
        );
        return { ...q.toObject(), waitTime };
      })
    );

    res.json(result);

  } catch (err) {
    console.error("ORG ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ CREATE QUEUE
router.post('/create', async (req, res) => {
  try {
    const { name, maxCapacity, serviceRate, location, organization } = req.body;

    if (!name || !maxCapacity || !serviceRate || !organization) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const queue = new Queue({
      name,
      maxCapacity,
      serviceRate,
      location,
      organization,
      currentLength: 0,
      history: []
    });

    await queue.save();

    res.status(201).json(queue);
  } catch (err) {
    console.error("CREATE ERROR:", err);
    res.status(400).json({ error: err.message });
  }
});

// ✅ GET SINGLE QUEUE (must be AFTER /org)
router.get('/:id', async (req, res) => {
  try {
    const queue = await Queue.findById(req.params.id);

    if (!queue) {
      return res.status(404).json({ error: 'Queue not found' });
    }

    const waitTime = await calculateWaitTime(
      queue.currentLength,
      queue.serviceRate
    );

    res.json({ ...queue.toObject(), waitTime });
  } catch (err) {
    console.error("GET ONE ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ JOIN QUEUE
router.post('/:id/join', async (req, res) => {
  try {
    const queue = await Queue.findById(req.params.id);

    if (!queue) {
      return res.status(404).json({ error: 'Queue not found' });
    }

    if (queue.isPaused) {
      return res.status(400).json({ error: 'Queue is paused' });
    }

    if (queue.currentLength >= queue.maxCapacity) {
      return res.status(400).json({ error: 'Queue is full' });
    }

    queue.currentLength = queue.currentLength || 0;
    queue.history = queue.history || [];

    queue.currentLength += 1;

    const waitTime = await calculateWaitTime(
      queue.currentLength,
      queue.serviceRate || 1
    );

    queue.history.push({
      timestamp: new Date(),
      length: queue.currentLength,
      waitTime
    });

    await queue.save();

    // ✅ SAFE HISTORY
    if (req.body.userId) {
      try {
        await History.create({
          userId: req.body.userId,
          queueId: queue._id,
          action: "joined",
          queueLength: queue.currentLength,
          waitTime
        });
      } catch (err) {
        console.log("History JOIN failed:", err.message);
      }
    }

    res.json({ message: 'Joined queue', waitTime });

  } catch (err) {
    console.error("JOIN ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ LEAVE QUEUE
router.post('/:id/leave', async (req, res) => {
  try {
    const queue = await Queue.findById(req.params.id);

    if (!queue) {
      return res.status(404).json({ error: 'Queue not found' });
    }

    queue.currentLength = queue.currentLength || 0;

    if (queue.currentLength > 0) {
      queue.currentLength -= 1;
    }

    const waitTime = await calculateWaitTime(
      queue.currentLength,
      queue.serviceRate || 1
    );

    queue.history.push({
      timestamp: new Date(),
      length: queue.currentLength,
      waitTime
    });

    await queue.save();

    // ✅ SAFE HISTORY
    if (req.body.userId) {
      try {
        await History.create({
          userId: req.body.userId,
          queueId: queue._id,
          action: "left",
          queueLength: queue.currentLength,
          waitTime
        });
      } catch (err) {
        console.log("History LEAVE failed:", err.message);
      }
    }

    res.json({ message: 'Left queue' });

  } catch (err) {
    console.error("LEAVE ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ DELETE QUEUE
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Queue.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ error: 'Queue not found' });
    }

    res.json({ message: 'Queue deleted successfully' });
  } catch (err) {
    console.error("DELETE ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ PAUSE / RESUME
router.post('/:id/pause', async (req, res) => {
  try {
    const queue = await Queue.findById(req.params.id);

    if (!queue) {
      return res.status(404).json({ error: 'Queue not found' });
    }

    queue.isPaused = !queue.isPaused;

    await queue.save();

    res.json({
      message: `Queue ${queue.isPaused ? 'paused' : 'resumed'}`,
      isPaused: queue.isPaused
    });
  } catch (err) {
    console.error("PAUSE ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;