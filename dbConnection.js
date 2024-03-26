/* 
Configuration file to create a sequelize instance to connect to our database using Sequelize ORM
*/
const { Sequelize } = require('sequelize');
require('dotenv').config();

// creating a new sequelize instance
const sequelize = new Sequelize({
    "username": process.env.DB_USER,
    "password": process.env.DB_PASSWORD,
    "database": process.env.DB_NAME,
    "host": process.env.DB_HOSTNAME,
    "dialect": 'postgres'
});

module.exports = sequelize;