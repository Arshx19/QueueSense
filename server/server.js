const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

// middleware
app.use(express.json());

// connect MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB connected ");
    })
    .catch((err) => {
        console.log("DB Error ", err);
    });

// port
const PORT = process.env.PORT || 5000;

// test route
app.get('/', (req, res) => {
    res.send("API is running 🚀");
});

// start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});