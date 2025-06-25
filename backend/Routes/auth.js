const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../Models');

const router = express.Router();

router.post('/signup', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        await User.create({ name, email, password: hashedPassword });
        res.json({ message: 'User created successfully' });
    } catch (err) {
        res.status(400).json({ error: 'Email already exists or invalid data' });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ where: { email } });
        if (!user) return res.status(404).json({ error: 'User not found' });

        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(400).json({ error: 'Invalid password' });

        const token = jwt.sign({ id: user.id }, 'secretkey', { expiresIn: '1d' });
        res.json({ token, userId: user.id });
    } catch (err) {
        res.status(500).json({ error: 'Login error' });
    }
});

module.exports = router;
