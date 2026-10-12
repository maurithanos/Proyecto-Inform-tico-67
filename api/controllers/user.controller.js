const { Usuario } = require('../models')
const sequelize = require('../config/database')
const bcrypt = require('bcrypt')
const { calcularDVH } = require('../utils/digitoVerificador')
const { camposUsuario, actualizarDVV, registrarBitacora } = require('../services/integridad')

const register = async (req, res) => {
    const { name, email, password, escuela, anio } = req.body
    if (!name || !email || !password) {
        return res.status(400).json({ error: 'Faltan datos' })
    }

    const t = await sequelize.transaction()
    try {
        const hashedPassword = await bcrypt.hash(password, 10)
        const user = await Usuario.create(
            { name, email, password: hashedPassword, escuela, anio },
            { transaction: t }
        )
        user.dvh = calcularDVH(...camposUsuario(user))
        await user.save({ transaction: t })

        await actualizarDVV(Usuario, 'users', t)
        await registrarBitacora('REGISTRO', `Se registró ${email}`, user.id, t)

        await t.commit()
        const { password: _p, dvh: _d, ...seguro } = user.toJSON()
        res.status(201).json(seguro)
    } catch (err) {
        await t.rollback()
        if (err.name === 'SequelizeUniqueConstraintError') {
            return res.status(409).json({ error: 'El email ya está registrado' })
        }
        console.error(err)
        res.status(500).json({ error: 'Error interno' })
    }
}

module.exports = { register }