const { Apunte } = require('../models')
const sequelize = require('../config/database')
const { registrarBitacora } = require('../services/integridad')

const crearApunte = async (req, res) => {
    const { Descripcion, Archivo, EsPrivado } = req.body
    if (!Descripcion && !Archivo) {
        return res.status(400).json({ error: 'Faltan datos' })
    }

    const t = await sequelize.transaction()
    try {
        const apunte = await Apunte.create(
            { Descripcion, Archivo, EsPrivado: EsPrivado ?? true, usuarioId: req.user.id },
            { transaction: t }
        )
        await registrarBitacora('Apunte creado', `Apunte ${apunte.id} creado por ${req.user.email}`, req.user.id, t)
        await t.commit()
        res.status(201).json(apunte)
    } catch (err) {
        await t.rollback()
        console.error(err)
        res.status(500).json({ error: 'Error interno' })
    }
}
const  getApuntesPrivados = async (req, res) => {
    const { id } = req.user
    try {
        const apuntes = await Apunte.findAll({ where: { usuarioId: id} })
        return res.status(200).json(apuntes)
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Error interno' })
    }
}

module.exports = { crearApunte , getApuntesPrivados}