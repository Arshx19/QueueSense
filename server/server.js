require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const queueRoutes = require('./routes/queue');
const historyRoutes = require('./routes/history');

const app = express();

// middleware
app.use(cors());
app.use(express.json());

// routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api', require('./routes/settings'));
app.use('/api/queue', queueRoutes);
app.use('/api/history', historyRoutes);

// test route
app.get('/', (req, res) => {
    res.json({ message: 'QueueSense server is running!' });
});

const PORT = process.env.PORT || 5000;

// ✅ CONNECT DB
mongoose.connect(process.env.MONGO_URI)
.then(() => {
    console.log("MongoDB Connected ✅");
    console.log("Database:", mongoose.connection.name); // 🔥 IMPORTANT DEBUG

    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
})
.catch(err => {
    console.error("MongoDB error ❌:", err);
});
