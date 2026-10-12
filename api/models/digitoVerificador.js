const { DataTypes } = require('sequelize')
const sequelize = require('../config/database')

const DigitoVerificador = sequelize.define('digito_verificador', {
    tabla: { type: DataTypes.STRING, primaryKey: true },
    dvv: { type: DataTypes.STRING, allowNull: false }
}, { tableName: 'digito_verificador', timestamps: false })

module.exports = DigitoVerificador