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

const obtenerApunte = async (req, res) => {
    try {
        const apunte = await Apunte.findOne({where: { id: req.params.id, usuarioId: req.user.id }
        })
        if (!apunte) {
            return res.status(404).json({ error: 'Apunte no encontrado' })
        }
        res.json(apunte)
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Error interno' })
    }
}

const actualizarApunte = async (req, res) => {
    try {
        const apunte = await Apunte.findOne({
            where: { id: req.params.id, usuarioId: req.user.id }
        })
        if (!apunte) {
            return res.status(404).json({ error: 'Apunte no encontrado' })
        }

        await apunte.update(req.body)
        await registrarBitacora('Apunte modificado', 
            `Apunte ${apunte.id} modificado por ${req.user.email}`, req.user.id, null)
 
        return res.status(200).json(apunte)
    } catch (err) {
        console.error(err)
        return res.status(500).json({ error: 'Error interno' })
    }
}



module.exports = { crearApunte , getApuntesPrivados,obtenerApunte,actualizarApunte}