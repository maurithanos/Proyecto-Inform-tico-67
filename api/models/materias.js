const {DataTypes} = require("sequelize");
const sequelize = require('../config/database');

const Materia = sequelize.define('materia',{
    nombre:{
        type: DataTypes.STRING,
    },
    descripcion:{
        Type: DateTypes.STRING,
    },
    
})