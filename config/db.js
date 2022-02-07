const Sequelize = require('sequelize');

const sequelize = new Sequelize(`${process.env.DATABASE_URL}`);

const db = {};
const model = require('../models/user.model')(sequelize, Sequelize.DataTypes);

db.sequelize = sequelize;
db.Sequelize = Sequelize;
db.user = model;

module.exports = db;