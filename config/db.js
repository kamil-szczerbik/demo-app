const Sequelize = require('sequelize');

const sequelize = new Sequelize(
	process.env.POSTGRES_DATABASE,
	process.env.POSTGRES_ROOT_USERNAME,
	process.env.POSTGRES_ROOT_PASSWORD,
	{
		host: process.env.MYSQL_HOST,
		dialect: 'postgres',
		logging: true
	}
);

const db = {};
const model = require('../models/user.model')(sequelize, Sequelize.DataTypes);

db.sequelize = sequelize;
db.Sequelize = Sequelize;
db.user = model;

module.exports = db;