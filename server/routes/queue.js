// const express = require('express');
// const Queue = require('../models/Queue');
// const router = express.Router();

// // GET all queues
// router.get('/', async (req, res) => {
//   const queues = await Queue.find();
//   res.json(queues);
// });

// // POST create queue
// router.post('/create', async (req, res) => {
//   const queue = new Queue(req.body);
//   await queue.save();
//   res.json(queue);
// });

// // GET single queue
// router.get('/:id', async (req, res) => {
//   const queue = await Queue.findById(req.params.id);
//   if (!queue) return res.status(404).json({ error: 'Queue not found' });
//   const waitTime = queue.currentLength / (queue.serviceRate || 1);
//   res.json({ ...queue.toObject(), waitTime });
// });

// // DELETE queue
// router.delete('/:id', async (req, res) => {
//   await Queue.findByIdAndDelete(req.params.id);
//   res.json({ message: 'Queue deleted' });
// });

// module.exports = router;

// const express = require('express');
// const Queue = require('../models/Queue');
// const router = express.Router();

// // GET all queues
// router.get('/', async (req, res) => {
//   try {
//     const queues = await Queue.find();
//     res.json(queues);
//   } catch (err) {
//     res.status(500).json({ error: 'Server error' });
//   }
// });

// // POST create new queue
// router.post('/create', async (req, res) => {
//   try {
//     const { name, maxCapacity, serviceRate, location } = req.body;

//     if (!name || !maxCapacity || !serviceRate) {
//       return res.status(400).json({ error: 'Missing required fields' });
//     }

//     const queue = new Queue({ name, maxCapacity, serviceRate, location });
//     // initial history entry
//     queue.history.push({
//       timestamp: new Date(),
//       length: queue.currentLength,
//       waitTime: queue.currentLength / serviceRate
//     });

//     await queue.save();
//     res.status(201).json(queue);
//   } catch (err) {
//     res.status(400).json({ error: 'Invalid data' });
//   }
// });

// // GET single queue with wait time
// router.get('/:id', async (req, res) => {
//   try {
//     const queue = await Queue.findById(req.params.id);
//     if (!queue) return res.status(404).json({ error: 'Queue not found' });

//     const waitTime = queue.serviceRate > 0
//       ? queue.currentLength / queue.serviceRate
//       : null;

//     res.json({ ...queue.toObject(), waitTime });
//   } catch (err) {
//     res.status(500).json({ error: 'Server error' });
//   }
// });

// // PUT update queue details
// router.put('/:id', async (req, res) => {
//   try {
//     const updatedQueue = await Queue.findByIdAndUpdate(
//       req.params.id,
//       req.body,
//       { new: true }
//     );
//     if (!updatedQueue) return res.status(404).json({ error: 'Queue not found' });

//     // log update in history
//     updatedQueue.history.push({
//       timestamp: new Date(),
//       length: updatedQueue.currentLength,
//       waitTime: updatedQueue.currentLength / updatedQueue.serviceRate
//     });
//     await updatedQueue.save();

//     res.json(updatedQueue);
//   } catch (err) {
//     res.status(500).json({ error: 'Server error' });
//   }
// });

// // DELETE a queue
// router.delete('/:id', async (req, res) => {
//   try {
//     const deleted = await Queue.findByIdAndDelete(req.params.id);
//     if (!deleted) return res.status(404).json({ error: 'Queue not found' });
//     res.json({ message: 'Queue deleted successfully' });
//   } catch (err) {
//     res.status(500).json({ error: 'Server error' });
//   }
// });

// // POST pause/resume queue
// router.post('/:id/pause', async (req, res) => {
//   try {
//     const queue = await Queue.findById(req.params.id);
//     if (!queue) return res.status(404).json({ error: 'Queue not found' });

//     queue.isPaused = !queue.isPaused;
//     await queue.save();

//     res.json({ message: `Queue ${queue.isPaused ? 'paused' : 'resumed'}`, queue });
//   } catch (err) {
//     res.status(500).json({ error: 'Server error' });
//   }
// });
// // POST join queue
// router.post('/:id/join', async (req, res) => {
//   try {
//     const queue = await Queue.findById(req.params.id);

//     if (!queue) return res.status(404).json({ error: 'Queue not found' });

//     if (queue.isPaused) {
//       return res.status(400).json({ error: 'Queue is paused' });
//     }

//     if (queue.currentLength >= queue.maxCapacity) {
//       return res.status(400).json({ error: 'Queue is full' });
//     }

//     // increase queue
//     queue.currentLength += 1;

//     const waitTime = queue.serviceRate > 0
//       ? queue.currentLength / queue.serviceRate
//       : null;

//     // add history
//     queue.history.push({
//       timestamp: new Date(),
//       length: queue.currentLength,
//       waitTime
//     });

//     await queue.save();

//     res.json({
//       message: 'Joined queue',
//       waitTime
//     });

//   } catch (err) {
//     res.status(500).json({ error: 'Server error' });
//   }
// });
// module.exports = router;



//------------------------------------------
const express = require('express');
const Queue = require('../models/Queue');
const router = express.Router();


// 🔹 GET all queues
router.get('/', async (req, res) => {
  try {
    const queues = await Queue.find();

    // add waitTime to each queue
    const result = queues.map(q => {
      const waitTime = q.serviceRate > 0
        ? (q.currentLength / q.serviceRate).toFixed(1)
        : null;

      return { ...q.toObject(), waitTime };
    });

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});


// 🔹 CREATE queue
router.post('/create', async (req, res) => {
  try {
    const { name, maxCapacity, serviceRate, location } = req.body;

    if (!name || !maxCapacity || !serviceRate) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const queue = new Queue({
      name,
      maxCapacity,
      serviceRate,
      location
    });

    // initial history
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


// 🔹 GET single queue
router.get('/:id', async (req, res) => {
  try {
    const queue = await Queue.findById(req.params.id);

    if (!queue) {
      return res.status(404).json({ error: 'Queue not found' });
    }

    const waitTime = queue.serviceRate > 0
      ? (queue.currentLength / queue.serviceRate).toFixed(1)
      : null;

    res.json({ ...queue.toObject(), waitTime });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});


// 🔹 JOIN queue (MOST IMPORTANT)
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

    // increase length
    queue.currentLength += 1;

    const waitTime = queue.serviceRate > 0
      ? (queue.currentLength / queue.serviceRate).toFixed(1)
      : null;

    // add history
    queue.history.push({
      timestamp: new Date(),
      length: queue.currentLength,
      waitTime
    });

    await queue.save();

    res.json({
      message: 'Joined queue',
      waitTime
    });

  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});


// 🔹 LEAVE queue (optional but useful)
router.post('/:id/leave', async (req, res) => {
  try {
    const queue = await Queue.findById(req.params.id);

    if (!queue) {
      return res.status(404).json({ error: 'Queue not found' });
    }

    if (queue.currentLength > 0) {
      queue.currentLength -= 1;
    }

    const waitTime = queue.serviceRate > 0
      ? (queue.currentLength / queue.serviceRate).toFixed(1)
      : null;

    queue.history.push({
      timestamp: new Date(),
      length: queue.currentLength,
      waitTime
    });

    await queue.save();

    res.json({ message: 'Left queue' });

  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});


// 🔹 UPDATE queue
router.put('/:id', async (req, res) => {
  try {
    const queue = await Queue.findById(req.params.id);

    if (!queue) {
      return res.status(404).json({ error: 'Queue not found' });
    }

    Object.assign(queue, req.body);

    const waitTime = queue.serviceRate > 0
      ? (queue.currentLength / queue.serviceRate).toFixed(1)
      : null;

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


// 🔹 DELETE queue
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


// 🔹 PAUSE / RESUME queue
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