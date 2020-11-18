const Sequelize = require('sequelize');

const sequelize = new Sequelize(
	'sys',
	'root',
	'admin',
	{
		host: 'localhost',
		dialect: 'mysql',
		logging: true
	}
);

const db = {};
const model = require('../models/user.model')(sequelize, Sequelize.DataTypes);

db.sequelize = sequelize;
db.Sequelize = Sequelize;
db.user = model;

module.exports = db;