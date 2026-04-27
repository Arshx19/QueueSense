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
    return mlRes.data.predicted_wait;
  } catch (err) {
    return serviceRate > 0
      ? (length / serviceRate).toFixed(1)
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
    res.status(500).json({ error: 'Server error' });
  }
});

// ✅ GET BY ORGANIZATION
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
      organization
    });

    queue.history.push({
      timestamp: new Date(),
      length: queue.currentLength,
      waitTime: 0
    });

    await queue.save();

    res.status(201).json(queue);
  } catch (err) {
    res.status(400).json({ error: 'Invalid data' });
  }
});

// ✅ GET SINGLE QUEUE
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
    res.status(500).json({ error: 'Server error' });
  }
});

// ✅ JOIN QUEUE (UPDATED WITH HISTORY)
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

    queue.currentLength += 1;

    const waitTime = await calculateWaitTime(
      queue.currentLength,
      queue.serviceRate
    );

    queue.history.push({
      timestamp: new Date(),
      length: queue.currentLength,
      waitTime
    });

    await queue.save();

    // 🔥 SAVE USER HISTORY
    if (req.body.userId) {
      await History.create({
        userId: req.body.userId,
        queueId: queue._id,
        action: "joined",
        queueLength: queue.currentLength,
        waitTime
      });
    }

    res.json({ message: 'Joined queue', waitTime });

  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// ✅ LEAVE QUEUE (UPDATED WITH HISTORY)
router.post('/:id/leave', async (req, res) => {
  try {
    const queue = await Queue.findById(req.params.id);

    if (!queue) {
      return res.status(404).json({ error: 'Queue not found' });
    }

    if (queue.currentLength > 0) {
      queue.currentLength -= 1;
    }

    const waitTime = await calculateWaitTime(
      queue.currentLength,
      queue.serviceRate
    );

    queue.history.push({
      timestamp: new Date(),
      length: queue.currentLength,
      waitTime
    });

    await queue.save();

    // 🔥 SAVE USER HISTORY
    if (req.body.userId) {
      await History.create({
        userId: req.body.userId,
        queueId: queue._id,
        action: "left",
        queueLength: queue.currentLength,
        waitTime
      });
    }

    res.json({ message: 'Left queue' });

  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// ✅ UPDATE QUEUE
router.put('/:id', async (req, res) => {
  try {
    const queue = await Queue.findById(req.params.id);

    if (!queue) {
      return res.status(404).json({ error: 'Queue not found' });
    }

    Object.assign(queue, req.body);

    const waitTime = await calculateWaitTime(
      queue.currentLength,
      queue.serviceRate
    );

    queue.history.push({
      timestamp: new Date(),
      length: queue.currentLength,
      waitTime
    });

    await queue.save();

    res.json(queue);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
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
    res.status(500).json({ error: 'Server error' });
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
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;