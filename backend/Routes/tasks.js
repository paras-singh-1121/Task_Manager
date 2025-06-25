const express = require('express');
const { Task } = require('../Models');
const jwt = require('jsonwebtoken');

const router = express.Router();

function authMiddleware(req, res, next) {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Unauthorized' });
    jwt.verify(token, 'secretkey', (err, decoded) => {
        if (err) return res.status(401).json({ error: 'Invalid token' });
        req.userId = decoded.id;
        next();
    });
}

router.post('/tasks', async (req, res) => {
    try {
        const { userId } = req.body;

        if (!userId) {
            return res.status(400).json({ error: 'userId is required in the request body' });
        }

        const tasks = await Task.findAll({ where: { user_id: userId } });
        res.json(tasks);
    } catch (error) {
        console.error('Error fetching tasks:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.post('/add', async (req, res) => {
    const { title,userId } = req.body;
    const task = await Task.create({ title, user_id: userId });
    res.json(task);
});

router.put('/tasks/:id', async (req, res) => {
    const { status,userId } = req.body;
    const task = await Task.findOne({ where: { id: req.params.id, user_id: userId } });
    if (!task) return res.status(404).json({ error: 'Task not found' });
    task.status = status;
    await task.save();
    res.json(task);
});

router.delete('/tasks/:id', async (req, res) => {
    try {
        const taskId = req.params.id;
        await Task.destroy({ where: { id: taskId } });
        res.json({ message: 'Task deleted successfully' });
    } catch (err) {
        console.error('Error deleting task:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});


module.exports = router;