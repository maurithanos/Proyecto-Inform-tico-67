const Usuario = require('./usuario')
const Bitacora = require('./bitacora')
const DigitoVerificador = require('./digitoVerificador')
const Apunte = require('./apunte')

Usuario.hasMany(Bitacora, { foreignKey: 'usuarioId' })
Bitacora.belongsTo(Usuario, { foreignKey: 'usuarioId' })

Usuario.hasMany(Apunte, { foreignKey: 'usuarioId' })
Apunte.belongsTo(Usuario, { foreignKey: 'usuarioId' })

module.exports = { Usuario, Bitacora, DigitoVerificador, Apunte }