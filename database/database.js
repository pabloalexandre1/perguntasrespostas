const { Sequelize } = require("sequelize");
const sequelize = require("sequelize");
const connection = new Sequelize('guiaperguntas', 'root', 'umburana2011', {
    host: 'localhost',
    dialect: 'mysql'
});

module.exports = connection;