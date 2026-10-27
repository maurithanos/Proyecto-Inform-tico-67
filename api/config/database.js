const {Sequelize} = require("sequelize")

const sequelize = new Sequelize("apuntes_pro","root","",{
    host:'localhost',
    dialect: 'mysql',
    logging: false,
});

module.exports = sequelize;