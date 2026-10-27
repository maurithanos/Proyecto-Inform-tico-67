const { DataTypes } = require('sequelize')
const sequelize = require('../config/database')

const Evento = sequelize.define('evento', {
    titulo: { type: DataTypes.STRING, allowNull: false },
    descripcion: { type: DataTypes.STRING },
    fecha: { type: DataTypes.DATEONLY, allowNull: false }
}, { tableName: 'eventos', timestamps: false })

module.exports = Evento