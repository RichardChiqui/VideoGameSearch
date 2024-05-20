// const Pool  = require('pg').Pool;

// const pool = new Pool({
//     user:'postgres',
//     host:'localhost',
//     database:'videoGame',
//     password:'test123',
//     port:'5432'
// })
const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize('videoGame', 'postgres', 'test123', {
  host: 'localhost',
  dialect: 'postgres'  // Choose one: 'mysql' | 'mariadb' | 'postgres' | 'mssql' | 'sqlite'
});

sequelize.authenticate()
  .then(() => console.log('Database connected...'))
  .catch(err => console.log('Error: ' + err));
//module.exports = pool;