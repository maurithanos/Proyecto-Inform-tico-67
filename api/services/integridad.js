const { Usuario, Bitacora, DigitoVerificador } = require('../models')
const { calcularDVH, calcularDVV } = require('../utils/digitoVerificador')

const camposUsuario = u => [u.id, u.name, u.email, u.password]
const camposBitacora = b => [b.id, b.Fecha.toISOString(), b.Accion, b.descripcion, b.usuarioId]

const tablas = [
    { modelo: Usuario, tabla: 'users', campos: camposUsuario },
    { modelo: Bitacora, tabla: 'bitacora', campos: camposBitacora },
]

const actualizarDVV = async (modelo, tabla, t) => {
    const filas = await modelo.findAll({ attributes: ['dvh'], order: [['id', 'ASC']], transaction: t })
    await DigitoVerificador.upsert(
        { tabla, dvv: calcularDVV(filas.map(f => f.dvh)) },
        { transaction: t }
    )
}

const registrarBitacora = async (accion, descripcion, usuarioId, t) => {
    const fila = await Bitacora.create({
        Fecha: new Date(Math.floor(Date.now() / 1000) * 1000),
        Accion: accion,
        descripcion,
        usuarioId
    }, { transaction: t })
    fila.dvh = calcularDVH(...camposBitacora(fila))
    await fila.save({ transaction: t })
    await actualizarDVV(Bitacora, 'bitacora', t)
}

const verificarIntegridad = async () => {
    const errores = []
    for (const { modelo, tabla, campos } of tablas) {
        const filas = await modelo.findAll({ order: [['id', 'ASC']] })

        for (const f of filas) {
            if (calcularDVH(...campos(f)) !== f.dvh) {
                errores.push(`${tabla}: la fila ${f.id} fue modificada`)
            }
        }

        const reg = await DigitoVerificador.findByPk(tabla)
        if (!reg && filas.length === 0) continue
        if (!reg || reg.dvv !== calcularDVV(filas.map(f => f.dvh))) {
            errores.push(`${tabla}: el DVV no coincide (filas borradas o agregadas)`)
        }
    }
    return errores
}

module.exports = { camposUsuario, actualizarDVV, registrarBitacora, verificarIntegridad }