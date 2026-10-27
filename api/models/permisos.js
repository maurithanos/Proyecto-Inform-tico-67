const { DataTypes } = require('sequelize')
const sequelize = require('../config/database')

const Permisos = sequelize.define('Permisos', {
    tabla: { type: DataTypes.STRING, allowNull: false },
    accion: { type: DataTypes.STRING, allowNull: false }
}, {
    indexes: [{ unique: true, fields: ['tabla', 'accion'] }]
})

module.exports = Permisos