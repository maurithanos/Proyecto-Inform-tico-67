const Usuario = require('./usuario')
const Bitacora = require('./bitacora')
const DigitoVerificador = require('./digitoVerificador')

Usuario.hasMany(Bitacora, { foreignKey: 'usuarioId' })
Bitacora.belongsTo(Usuario, { foreignKey: 'usuarioId' })

module.exports = { Usuario, Bitacora, DigitoVerificador }