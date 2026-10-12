const {DataTypes} = require("sequelize");
const sequelize = require('../config/database');

const Examen = sequelize.define('examen',{
    fecha_examen:{
        type: DataTypes.DATE,
        allowNull: false,
    },
    
})