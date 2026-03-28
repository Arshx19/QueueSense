const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());


// app.use('/api/queue', require('./routes/queue'));
app.use('/api/auth', require('./routes/auth'));

app.get('/', (req,res)=>{
    res.json({message: 'QueueSense server is running!' })
});

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('MongoDB connected');
        app.listen(process.env.PORT || 5000, () => {
        console.log(`Server running on port ${process.env.PORT || 5000}`);
    });
    })
    .catch(err => console.log('MongoDB connection error:', err));