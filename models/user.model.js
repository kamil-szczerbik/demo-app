const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const user = sequelize.define('user', {
        iduser: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            unique: true,
            autoIncrement: true
        },
        email: {
            type: DataTypes.STRING, //Domyœlnie 255, trzeba by to odpowiednio zmniejszyæ
            allowNull: false,
            unique: true
        },
        username: {
            type: DataTypes.STRING, //string to domyœlnie varchar, w nawiasie d³ugoœæ po prostu
            allowNull: false,
            unique: true
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
    },
        {
            timestamps: true,
            createdAt: 'createdat',
            updatedAt: 'updatedat',
        });
    return user;
}