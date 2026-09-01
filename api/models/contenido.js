const {DataTypes} = require("sequelize");
const sequelize = require('../config/database');

const Contenido = sequelize.define('contenido',{
    descripcion:{
        type: DataTypes.STRING
    },
});

