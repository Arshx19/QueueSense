require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const queueRoutes = require('./routes/queue');
const historyRoutes = require('./routes/history');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/settings', require('./routes/settings'));

// middleware
app.use(cors());
app.use(express.json());

// routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api', require('./routes/settings'));
app.use('/api/queue', queueRoutes);
app.use('/api/history', historyRoutes);

app.get('/', (req, res) => {
    res.json({ message: 'QueueSense server is running!' });
});
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('MongoDB connected');
    })
    .catch((err) => {
        console.log('DB Error:', err);
    });
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

mongoose.connect(process.env.MONGO_URI)
.then(() => {
    console.log("MongoDB Connected");
    console.log("Database:", mongoose.connection.name);

    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
})
.catch(err => {
    console.error("MongoDB error:", err);
});
