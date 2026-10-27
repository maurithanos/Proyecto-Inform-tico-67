const Usuario = require('./usuario')
const Bitacora = require('./bitacora')
const DigitoVerificador = require('./digitoVerificador')
const Apunte = require('./apunte')
const Rol = require('./rol')
const Permisos = require('./permisos')
const Evento = require('./evento')

Usuario.hasMany(Bitacora, { foreignKey: 'usuarioId' })
Bitacora.belongsTo(Usuario, { foreignKey: 'usuarioId' })

Usuario.hasMany(Apunte, { foreignKey: 'usuarioId' })
Apunte.belongsTo(Usuario, { foreignKey: 'usuarioId' })

Usuario.hasMany(Evento, { foreignKey: 'usuarioId' })
Evento.belongsTo(Usuario, { foreignKey: 'usuarioId' })

Usuario.belongsTo(Rol, { foreignKey: 'rolId' })
Rol.hasMany(Usuario, { foreignKey: 'rolId' })
Rol.belongsToMany(Permisos, { through: 'RolPermisos' })
Permisos.belongsToMany(Rol, { through: 'RolPermisos' })

module.exports = { Usuario, Bitacora, DigitoVerificador, Apunte, Rol, Permisos, Evento }