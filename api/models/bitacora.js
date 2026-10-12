const { DataTypes } = require('sequelize')
const sequelize = require('../config/database')

const Bitacora = sequelize.define('bitacora', {
    Fecha: { type: DataTypes.DATE },
    descripcion: { type: DataTypes.STRING },
    Accion: { type: DataTypes.STRING },
    dvh: { type: DataTypes.STRING }
}, { tableName: 'bitacora', timestamps: false })

module.exports = Bitacora