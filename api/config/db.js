const Sequelize = require('sequelize');

const sequelize = new Sequelize(
	/*process.env.MYSQL_DATABASE,
	process.env.MYSQL_ROOT_USERNAME,
	process.env.MYSQL_ROOT_PASSWORD,*/
	'default',
	'root',
	'admin',
	{
		host: 'localhost'/*process.env.MYSQL_HOST*/,
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