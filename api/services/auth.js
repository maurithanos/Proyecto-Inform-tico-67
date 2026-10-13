const jwt = require('jsonwebtoken')
const secreto = 'misecreto'
 
const verificarToken = (req, res, next) => {
    const header = req.headers.authorization
    if (!header) {
        return res.status(401).json('token no enviado')
    }

    const [tipo, token] = header.split(' ')
 
    if (tipo !== 'Bearer' || !token) {
        return res.status(401).json({ error: 'Token no enviado' })
    }
 
    try {
        const decode = jwt.verify(token, secreto) 
        req.user = decode
        next()
    } catch (err) {
        return res.status(401).json({error:'token invalido o expirado'})
    }
}
 
module.exports = { verificarToken }