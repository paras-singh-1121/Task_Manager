const User = require('./user');
const Task = require('./task');

User.hasMany(Task, { foreignKey: 'user_id' });
Task.belongsTo(User, { foreignKey: 'user_id' });

module.exports = { User, Task };
