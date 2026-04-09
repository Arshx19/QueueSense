const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const cors = require('cors');

const app = express();
app.use(cors());

// middleware
app.use(express.json());

// routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api', require('./routes/settings'));
app.use('/api/queue', require('./routes/queue'));

// test route
app.get('/', (req, res) => {
    res.json({ message: 'QueueSense server is running!' });
});

// mongodb connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('MongoDB connected');
    })
    .catch((err) => {
        console.log('DB Error:', err);
    });

// port
const PORT = process.env.PORT || 5000;

// start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});