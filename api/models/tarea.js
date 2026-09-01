const {DataTypes} = require("sequelize");
const sequelize = require('../config/database');

const Tarea = sequelize.define('tarea',{
    fecha_entrega:{
        type: DataTypes.DATE,
    },
    tarea:{
        type: DataTypes.STRING,
        allowNull: false,
    },
    entregada:{
        type: DataTypes.BOOLEAN,
    },
})