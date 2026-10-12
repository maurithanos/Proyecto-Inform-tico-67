const { DataTypes } = require('sequelize')
const sequelize = require('../config/database')

const Usuario = sequelize.define('usuario', {
    name: { type: DataTypes.STRING, allowNull: false },
    escuela: { type: DataTypes.STRING },
    anio: { type: DataTypes.INTEGER },
    email: { type: DataTypes.STRING, allowNull: false, unique: true, validate: { isEmail: true } },
    password: { type: DataTypes.STRING, allowNull: false },
    dvh: { type: DataTypes.STRING }
}, { tableName: 'users', timestamps: false })

module.exports = Usuario