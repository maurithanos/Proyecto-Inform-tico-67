const {DataTypes} = require("sequelize");
const sequelize = require('../config/database');

const Rol = sequelize.define('rol',{
    nombre:{
        type: DataTypes.STRING,
        allowNull: false,
    },
})