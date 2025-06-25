const express = require('express');
const sequelize = require('./config/db');
const authRoutes = require('./Routes/auth');
const taskRoutes = require('./Routes/tasks');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

app.use('/api', authRoutes);
app.use('/api', taskRoutes);

app.get('/', (req, res) => {
    res.send('Task Manager API is running');
});


sequelize.sync().then(() => console.log('Database synced')).catch(err => console.error(err));

app.listen(5000, () => console.log('Server running on port 5000'));
