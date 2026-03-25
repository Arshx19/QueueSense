const express = require('express');
const router = express.Router();
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

router.post('/register', async(req,res)=>{
    const {name,email,password} = req.body;
    const hashed = await bcrypt.hash(password,10);
    const user = ({user,email,password:hashed});
    await user.save();
    res.join({ message: 'User registered successfully' });
})
