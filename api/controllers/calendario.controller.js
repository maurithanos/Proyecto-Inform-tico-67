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

const actualizarEvento = async (req, res) => {
    const { titulo, descripcion, fecha } = req.body
    if (!titulo || !fecha || isNaN(new Date(fecha))) {
        return res.status(400).json({ error: 'Faltan datos o la fecha no es válida' })
    }

    const t = await sequelize.transaction()
    try {
        const evento = await Evento.findOne({
            where: { id: req.params.id, usuarioId: req.user.id },
            transaction: t
        })
        if (!evento) {
            await t.rollback()
            return res.status(404).json({ error: 'Evento no encontrado' })
        }

        await evento.update({ titulo, descripcion, fecha }, { transaction: t })
        await registrarBitacora('Evento modificado', `Evento ${evento.id} modificado por ${req.user.email}`, req.user.id, t)
        await t.commit()
        res.json(evento)
    } catch (err) {
        await t.rollback()
        console.error(err)
        res.status(500).json({ error: 'Error interno' })
    }
}

const eliminarEvento = async (req, res) => {
    const t = await sequelize.transaction()
    try {
        const evento = await Evento.findOne({
            where: { id: req.params.id, usuarioId: req.user.id },
            transaction: t
        })
        if (!evento) {
            await t.rollback()
            return res.status(404).json({ error: 'Evento no encontrado' })
        }

        await evento.destroy({ transaction: t })
        await registrarBitacora('Evento eliminado', `Evento ${req.params.id} eliminado por ${req.user.email}`, req.user.id, t)
        await t.commit()
        res.json({ mensaje: 'Evento eliminado' })
    } catch (err) {
        await t.rollback()
        console.error(err)
        res.status(500).json({ error: 'Error interno' })
    }
}

module.exports = { crearEvento, listarEventos, actualizarEvento, eliminarEvento }