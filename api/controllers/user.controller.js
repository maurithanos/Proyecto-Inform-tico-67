const { Usuario, Rol, Permisos } = require('../models')
const sequelize = require('../config/database')
const bcrypt = require('bcrypt')
const { calcularDVH } = require('../utils/digitoVerificador')
const { camposUsuario, actualizarDVV, registrarBitacora } = require('../services/integridad')
const jwt = require('jsonwebtoken')
const secreto = 'misecreto'

const register = async (req, res) => {
    const { name, email, password, escuela, anio } = req.body
    if (!name || !email || !password) {
        return res.status(400).json({ error: 'Faltan datos' })
    }

    const t = await sequelize.transaction()
    try {
        const rolUsuario = await Rol.findOne({ where: { nombre: 'usuario' } })
        if (!rolUsuario) {
            await t.rollback()
            return res.status(500).json({ error: 'Rol por defecto inexistente' })
        }

        const hashedPassword = await bcrypt.hash(password, 10)
        const user = await Usuario.create(
            { name, email, password: hashedPassword, escuela, anio, rolId: rolUsuario.id },
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

const login = async (req, res) => {
    const { email, password } = req.body

    if (!email || !password) {
        return res.status(400).json("Faltan datos")
    }
    try {
        const user = await Usuario.findOne({ where: { email } })
        if (!user) {
            return res.status(404).json("datos invalidos")
        }

        const isContrasenia = await bcrypt.compare(password, user.password)

        if (!isContrasenia) {
            await registrarBitacora('Login fallido', `login fallido por contraseña invalida de ${email}`, user.id)
            return res.status(400).json("datos invalidos")
        }

        const dvhCalculado = calcularDVH(...camposUsuario(user))
        if (dvhCalculado !== user.dvh) {
            await registrarBitacora('Fallo de dvh', `DVH modificado para el usuario ${email}`, user.id, null)
            return res.status(500).json({ error: 'Error de integridad en los datos del usuario' })
        }

        // Rol y permisos (consulta aparte para no alterar el objeto user del DVH)
        const rol = await Rol.findByPk(user.rolId, { include: Permisos })
        const permisos = rol ? rol.Permisos.map((p) => `${p.tabla}:${p.accion}`) : []

        const token = jwt.sign(
            { id: user.id, email: user.email },
            secreto,
            { expiresIn: '8h' }
        )

        await registrarBitacora('Login exitoso', `login exitoso de ${email}`, user.id, null)

        const userD = user.toJSON()
        const seguro = {
            id: userD.id, name: userD.name, email: userD.email,
            escuela: userD.escuela, anio: userD.anio,
            rol: rol?.nombre, permisos
        }

        res.json({ token, user: seguro })

    } catch (error) {
        res.status(500).json({ error: 'Error interno' })
    }
}

const perfil = async (req, res) => {
    try {
        const user = await Usuario.findByPk(req.user.id, { attributes: { exclude: ['password', 'dvh'] } })
        if (!user) {
            return res.status(404).json("Usuario no encontrado")
        }

        return res.status(200).json(user)

    } catch (error) {
        return res.status(500).json({ error: 'Error interno' })
    }
}

const modificarPerfil = async (req, res) => {
    try {
        const user = await Usuario.findByPk(req.user.id)
        if (!user) {
            return res.status(404).json("Usuario no encontrado")
        }

        // Solo estos campos se pueden modificar (evita que alguien se cambie el rolId)
        const { name, escuela, anio } = req.body
        const cambios = { name, escuela, anio }
        Object.keys(cambios).forEach((k) => cambios[k] === undefined && delete cambios[k])

        await user.update(cambios)
        await registrarBitacora('Cuenta modificada', `se modifico los campos del usuario ${user.email}`, user.id, null)

        const dvhCalculado = calcularDVH(...camposUsuario(user))
        user.dvh = dvhCalculado
        await user.save()

        const usuarioRespuesta = await Usuario.findByPk(user.id, {
            attributes: { exclude: ['password', 'dvh'] }
        })

        return res.status(200).json(usuarioRespuesta)

    } catch (error) {
        return res.status(500).json({ error: 'Error interno' })
    }
}

module.exports = { register, login, perfil, modificarPerfil }