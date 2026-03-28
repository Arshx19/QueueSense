const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
app.use(express.json());
// app.use('/api/queue', require('./routes/queue'));
app.use('/api/auth', require('./routes/auth'));
app.get('/', (req,res)=>{
    res.json({message: 'QueueSense server is running!' })
});
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB connected ");
    })
    .catch((err) => {
        console.log("DB Error ", err);
    });

const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
    res.send("API is running 🚀");
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});