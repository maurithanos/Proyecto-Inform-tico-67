const express = require('express')
const sequelize = require('./config/database')
require('./models')
const { register, login, perfil } = require('./controllers/user.controller')
const { verificarIntegridad } = require('./services/integridad')
const { verificarToken } = require('./services/auth.js')

const server = express()
server.use(express.json())

server.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    res.setHeader('Access-Control-Allow-Credentials', 'true')
    if (req.method === 'OPTIONS') return res.sendStatus(200)
    next()
})

server.post('/register', register)
server.post('/login', login)
server.get('/perfil',verificarToken, perfil)


sequelize.sync().then(async () => {
    const errores = await verificarIntegridad()
    if (errores.length) console.error('Integridad comprometida:', errores)
    server.listen(3000, () => console.log('Server ON en el puerto 3000'))
})