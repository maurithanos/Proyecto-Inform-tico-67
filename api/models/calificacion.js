const {DataTypes} = require("sequelize");
const sequelize = require('../config/database');

const Calificacion = sequelize.define('calificacion',{
    Calificacion:{
        type: DataTypes.INTEGER,
    },
})