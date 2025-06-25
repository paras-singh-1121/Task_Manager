const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('postgres', 'postgres', 'Qwerty#123', {
    host: 'localhost',
    dialect: 'postgres',
});

module.exports = sequelize;
