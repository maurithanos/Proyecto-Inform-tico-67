const { Usuario, Rol, Permisos } = require('../models')

const tienePermiso = (tabla, accion) => async (req, res, next) => {
    try {
        const usuario = await Usuario.findByPk(req.user.id, {
            include: { model: Rol, include: Permisos }
        })

        const ok = usuario?.Rol?.Permisos.some((p) => p.tabla === tabla && p.accion === accion)
        if (!ok) return res.status(403).json({ error: 'no tenes permisos' })

        next()
    } catch (err) {
        res.status(500).json({ error: 'error verificando permisos' })
    }
}

module.exports = { tienePermiso }