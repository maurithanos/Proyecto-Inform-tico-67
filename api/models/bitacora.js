const {DataTypes} = require("sequelize");
const sequelize = require('../config/database');

const Bitacora = sequelize.define('bitacora',{
    Fecha:{
        type: DataTypes.DATE,
    },
    descripcion:{
        Type: DateTypes.STRING,
    },
    Accion:{
        type: DataTypes.STRING
    },
})