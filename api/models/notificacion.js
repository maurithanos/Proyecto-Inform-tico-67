const {DataTypes} = require("sequelize");
const sequelize = require('../config/database');

const Notificacion = sequelize.define('notificacion',{
    notificacion:{
        type: DataTypes.STRING,
    },
    laido:{
        Type: DateTypes.BOOLEAN,
    },
    
})