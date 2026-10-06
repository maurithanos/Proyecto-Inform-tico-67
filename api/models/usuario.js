const {DataTypes} = require("sequelize");
const sequelize = require('../config/database');

const Usuario = sequelize.define('usuario',{
    Nombre_Usuario:{
        type: DataTypes.STRING,
        allowNull: false,
    },
    Escuela:{
        type: DataTypes.STRING,
    },
    anio:{
        type: DataTypes.INTEGER,
    },
    Email:{
        type: DateTypes.STRING,
        allowNull: false,
        unique:true,
    },
})