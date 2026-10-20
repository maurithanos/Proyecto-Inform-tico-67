const {DataTypes} = require("sequelize");
const sequelize = require('../config/database');

const Apuntes = sequelize.define('apuntes',{
    EsPrivado:{
        type: DataTypes.BOOLEAN,
        allowNull:false,
    },
    Descripcion:{
        type: DataTypes.STRING,
    },
    Archivo:{
        type: DataTypes.STRING,
    },
})

module.exports = Apuntes