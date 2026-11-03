const { Apunte, Usuario, Calificacion } = require('../models')
const sequelize = require('../config/database')
const { registrarBitacora } = require('../services/integridad')
const {Op} = require('sequelize')
const jwt = require('jsonwebtoken')
const secreto = 'misecreto'

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


const obtenerApuntes = async (req,res)=>{
    const header = req.headers.authorization
    let userId = null
    if (header) {
        const [tipo, token] = header.split(' ')
     
        if (tipo === 'Bearer' && token) {
            try {
                const decode = jwt.verify(token, secreto)
                userId = decode.id 

            }catch (error) {
                userId = null
                }
        }
    }
    const condicion = {
        EsPrivado:false
    }
    if (userId) {
        condicion.usuarioId = {[Op.ne]:userId}
    }

    
    
    try {
        const apuntes = await Apunte.findAll({
        where:condicion,
        include:{
            model: Calificacion, as:'calificaciones'
            }
        })
        const apuntesPromedio = apuntes.map(apunte =>{
            const listaCalificaciones = apunte.calificaciones || []
            let promedio = 0
            if (listaCalificaciones.length > 0) {
                
                for (let i = 0; i < listaCalificaciones.length; i++) {
                    promedio += listaCalificaciones[i].calificacion
                } 
                promedio = promedio /listaCalificaciones.length
            }
            promedio = Number(promedio.toFixed(1))
            return {apunte, promedio }

        })
        return res.status(200).json(apuntesPromedio)
    } catch (error) {
        console.error(error)
        return res.status(500).json({error: 'Error interno'})
    }
    
    
}

const obtenerApunte = async (req, res) => {
    try {
        const apunte = await Apunte.findOne({
            where: { 
                id: req.params.id,
                [Op.or]:[
                    {EsPrivado:false},
                    {usuarioId: req.user.id || 0}
                ]

            },
            include:[
                {model: Calificacion, as: 'calificaciones'},
                {model: Usuario , attributes: 'name'}
            ]
        })
        if (!apunte) {
            return res.status(404).json({ error: 'Apunte no encontrado' })
        }
        const listaCalificaciones = apunte.calificaciones || []
        let promedio = 0
        if (listaCalificaciones.length > 0) {
            for (let i = 0; i < listaCalificaciones.length; i++) {
                promedio += listaCalificaciones[i].calificacion
            } 
            promedio = promedio /listaCalificaciones.length
        }
        promedio = Number(promedio.toFixed(1))
        return res.status(200).json({apunte, promedio })
        
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

const calificarApunte = async (req,res)=>{
    try {
        const {id} = req.params
        const {calificacion} = req.body
        const userId = req.user.id
        const apunte = await Apunte.findByPk(id)
        if (!apunte) {
            return res.status(404).json("Apunte no encontrado")
        }
        if (calificacion > 5 || calificacion < 1 ) {
            return res.status(400).json("Calificacion invalida")
        }
        let calificacioActual = await Calificacion.findOne({where:{idApunte:id, usuarioId:userId}})
        if (calificacioActual) {
            calificacioActual.calificacion = calificacion
            await calificacioActual.save()
            return res.status(200).json("Calificacion modificada con exito")
        }else{
            await Calificacion.create({
                calificacion,
                idApunte: id,
                usuarioId: userId
            })
            return res.status(200).json("Calificacion realizada con exito")
        }
    } catch (error) {
        return res.status(500).json("Errorm interno al calificar un apunte")
    }

}



module.exports = { crearApunte , getApuntesPrivados,obtenerApunte,actualizarApunte, obtenerApuntes, calificarApunte}