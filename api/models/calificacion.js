const { DataTypes } = require("sequelize")
const sequelize = require('../config/database')

const Calificacion = sequelize.define('calificacion', {
    calificacion: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'Calificacion',
        validate: {
            min: 1,
            max: 5,
            isInt: true
        }
    },
    usuarioId: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
})

module.exports = Calificacion