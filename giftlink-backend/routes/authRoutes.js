const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const connectToDatabase = require('../models/db');

const router = express.Router();

router.post('/register', async (req, res, next) => {
    try {
        const db = await connectToDatabase();
        const users = db.collection('users');
        const { email, password, firstName, lastName } = req.body;

        const currentUser = await users.findOne({ email });
        if (currentUser) {
            return res.status(409).json({ message: 'User already exists' });
        }

        const passwordHash = await bcrypt.hash(password, 10);
        const result = await users.insertOne({ email, password: passwordHash, firstName, lastName });
        res.status(201).json({ message: 'User registered successfully', userId: result.insertedId });
    } catch (error) {
        next(error);
    }
});

router.post('/login', async (req, res, next) => {
    try {
        const db = await connectToDatabase();
        const users = db.collection('users');
        const { email, password } = req.body;

        const currentUser = await users.findOne({ email });
        if (!currentUser || !(await bcrypt.compare(password, currentUser.password))) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { userId: currentUser._id, email: currentUser.email },
            process.env.JWT_SECRET || 'giftlink-secret',
            { expiresIn: '1h' }
        );
        res.json({ token, email: currentUser.email });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
