const { Evento } = require('../models')
const sequelize = require('../config/database')
const { registrarBitacora } = require('../services/integridad')

const crearEvento = async (req, res) => {
    const { titulo, descripcion, fecha } = req.body
    if (!titulo || !fecha || isNaN(new Date(fecha))) {
        return res.status(400).json({ error: 'Faltan datos o la fecha no es válida' })
    }

    const t = await sequelize.transaction()
    try {
        const evento = await Evento.create(
            { titulo, descripcion, fecha, usuarioId: req.user.id },
            { transaction: t }
        )
        await registrarBitacora('Evento creado', `Evento ${evento.id} creado por ${req.user.email}`, req.user.id, t)
        await t.commit()
        res.status(201).json(evento)
    } catch (err) {
        await t.rollback()
        console.error(err)
        res.status(500).json({ error: 'Error interno' })
    }
}

const listarEventos = async (req, res) => {
    try {
        const eventos = await Evento.findAll({
            where: { usuarioId: req.user.id },
            order: [['fecha', 'ASC']]
        })
        res.json(eventos)
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Error interno' })
    }
}

module.exports = { crearEvento, listarEventos }