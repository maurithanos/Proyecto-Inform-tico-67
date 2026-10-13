const { Usuario } = require('../models')
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

const login = async(req,res)=>{
    const {email,password} = req.body
    
    if (!email || !password ) {
        return res.status(400).json("Faltan datos")
    }
    try {
        const user = await Usuario.findOne({where:{email}});
        if (!user) {
            return res.status(404).json("datos invalidos")
        }
        
        const isContrasenia = await bcrypt.compare(password, user.password)

        if(!isContrasenia){
            await registrarBitacora('Login fallido',`login fallido por contraseña ${password} invalida de ${email}`, user.id)
            return res.status(400).json("datos invalidos")
        }

        const dvhCalculado = calcularDVH(...camposUsuario(user))
        if (dvhCalculado !== user.dvh) {
            await registrarBitacora('Fallo de dvh', `DVH modificado para el usuario ${email}`, user.id, null)
            return res.status(500).json({ error: 'Error de integridad en los datos del usuario' })
        }

        const token = jwt.sign(
            {
                id: user.id, email: user.email
            },secreto,{expiresIn:'8h'}
        )
        
        await registrarBitacora('Login exitoso',`login exitoso de ${email}`, user.id, null)

        const userD = user.toJSON()
        const seguro = {id:userD.id , name: userD.name, email: userD.email ,escuela: userD.escuela,anio: userD.anio }

        res.json({ token, user: seguro })


        
    } catch (error) {
        res.status(500).json({ error: 'Error interno' })
        
    }
    

}

const perfil = async(req,res)=>{
    try {
        const user = await Usuario.findByPk(req.user.id, {attributes:{exclude:['password','dvh']}})
        if (!user) {
            return res.status(404).json("Usuario no encontrado")
        }

        return res.status(200).json(user)
        
    } catch (error) {
        return res.status(500).json({ error: 'Error interno' })
    }
    
}

module.exports = { register, login, perfil}