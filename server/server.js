const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const cors = require('cors');

const queueOpsRoutes = require('./routes/queueOps');

const app = express();

// middleware
app.use(cors());
app.use(express.json());

// routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api', require('./routes/settings'));
app.use('/api/queue', queueOpsRoutes);

// test route
app.get('/', (req, res) => {
    res.json({ message: 'QueueSense server is running!' });
});

// port
const PORT = process.env.PORT || 5000;


// ✅ CONNECT DB FIRST → THEN START SERVER
mongoose.connect("mongodb://127.0.0.1:27017/queuesense")
.then(() => {
    console.log("MongoDB Connected");

    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
})
.catch(err => {
    console.error("MongoDB connection error:", err);
});