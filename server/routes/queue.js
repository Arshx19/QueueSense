const express = require('express');
const Queue = require('../models/Queue');
const History = require('../models/history');
const router = express.Router();
const axios = require("axios");

// 🔮 ML Wait Time
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
    return serviceRate > 0
      ? Number((length / serviceRate).toFixed(1))
      : 0;
  }
};

// GET ALL
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
    res.status(500).json({ error: err.message });
  }
});

// GET BY ORG
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
    res.status(500).json({ error: err.message });
  }
});

// CREATE
router.post('/create', async (req, res) => {
  try {
    const { name, maxCapacity, serviceRate, location, organization } = req.body;

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
    res.status(400).json({ error: err.message });
  }
});

// GET ONE
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
    res.status(500).json({ error: err.message });
  }
});


// ✅🔥 THIS IS THE MISSING PART (YOUR BUG FIX)
router.put('/:id', async (req, res) => {
  try {
    const { name, maxCapacity, serviceRate } = req.body;

    const updatedQueue = await Queue.findByIdAndUpdate(
      req.params.id,
      {
        name,
        maxCapacity: Number(maxCapacity),
        serviceRate: Number(serviceRate)
      },
      { new: true }
    );

    if (!updatedQueue) {
      return res.status(404).json({ error: 'Queue not found' });
    }

    res.json(updatedQueue);

  } catch (err) {
    console.error("UPDATE ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});


// JOIN
router.post('/:id/join', async (req, res) => {
  try {
    const queue = await Queue.findById(req.params.id);

    if (!queue) {
      return res.status(404).json({ error: 'Queue not found' });
    }

    if (queue.currentLength >= queue.maxCapacity) {
      return res.status(400).json({ error: 'Queue is full' });
    }

    queue.currentLength += 1;

    await queue.save();

    res.json({ message: 'Joined queue' });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// LEAVE
router.post('/:id/leave', async (req, res) => {
  try {
    const queue = await Queue.findById(req.params.id);

    if (!queue) {
      return res.status(404).json({ error: 'Queue not found' });
    }

    if (queue.currentLength > 0) {
      queue.currentLength -= 1;
    }

    await queue.save();

    res.json({ message: 'Left queue' });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE
router.delete('/:id', async (req, res) => {
  try {
    await Queue.findByIdAndDelete(req.params.id);
    res.json({ message: 'Queue deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;