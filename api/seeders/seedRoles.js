const { Rol, Permisos } = require('../models')

const TABLAS = ['Apuntes', 'Usuarios', 'Roles', 'Bitacora']
const ACCIONES = ['create', 'read', 'update', 'delete']

const PERMISOS = TABLAS.flatMap((tabla) => ACCIONES.map((accion) => [tabla, accion]))

const ROLES = {
    usuario: [
        'Apuntes:create', 'Apuntes:read', 'Apuntes:update', 'Apuntes:delete',
        'Usuarios:read', 'Usuarios:update'
    ],
    administrador: '*'
}

const seedRoles = async () => {
    const permisos = {}
    for (const [tabla, accion] of PERMISOS) {
        const [permiso] = await Permisos.findOrCreate({ where: { tabla, accion } })
        permisos[`${tabla}:${accion}`] = permiso
    }

    for (const [nombre, lista] of Object.entries(ROLES)) {
        const [rol] = await Rol.findOrCreate({ where: { nombre } })
        const nombres = lista === '*' ? Object.keys(permisos) : lista

        const filas = [...new Set(nombres)].map((n) => {
            if (!permisos[n]) throw new Error(`el permiso "${n}" del rol ${nombre} no existe`)
            return permisos[n]
        })

        await rol.addPermisos(filas)
    }
}

module.exports = { seedRoles }