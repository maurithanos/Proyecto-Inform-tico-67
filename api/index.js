const express = require('express')
const sequelize = require('./config/database')
require('./models')
const { register, login, perfil, modificarPerfil, eliminarUsuario } = require('./controllers/user.controller')
const { verificarIntegridad } = require('./services/integridad')
const { verificarToken } = require('./services/auth.js')
const { tienePermiso } = require('./services/permisos')
const { seedRoles } = require('./seeders/seedRoles')
const { crearApunte, getApuntesPrivados, obtenerApunte, actualizarApunte, obtenerApuntes, calificarApunte } = require('./controllers/apunte.controller')
const { crearEvento, listarEventos, actualizarEvento, eliminarEvento } = require('./controllers/calendario.controller')
const Apuntes = require('./models/apunte.js')

const server = express()
server.use(express.json())

server.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    res.setHeader('Access-Control-Allow-Credentials', 'true')
    if (req.method === 'OPTIONS') return res.sendStatus(200)
    next()
})

server.post('/register', register)
server.post('/login', login)
server.get('/perfil', verificarToken, tienePermiso('Usuarios', 'read'), perfil)
server.patch('/perfil', verificarToken, tienePermiso('Usuarios', 'update'), modificarPerfil)
server.delete('/perfil', verificarToken, tienePermiso('Usuarios','delete'), eliminarUsuario )

server.post('/apuntes', verificarToken, tienePermiso('Apuntes', 'create'), crearApunte)
server.get('/apuntes', verificarToken, tienePermiso('Apuntes', 'read'), getApuntesPrivados)
server.get('/apuntes/publicos', obtenerApuntes)
server.get('/apuntes/:id', verificarToken, tienePermiso('Apuntes', 'read'), obtenerApunte)
server.patch('/apuntes/:id', verificarToken, tienePermiso('Apuntes', 'update'), actualizarApunte)

server.post('/apuntes/calificar/:id', verificarToken, tienePermiso('Apuntes','update'),calificarApunte )

server.post('/calendario', verificarToken, crearEvento)
server.get('/calendario', verificarToken, listarEventos)
server.patch('/calendario/:id', verificarToken, actualizarEvento)
server.delete('/calendario/:id', verificarToken, eliminarEvento)

sequelize.sync().then(async () => {
    await seedRoles()
    const errores = await verificarIntegridad()
    if (errores.length) console.error('Integridad comprometida:', errores)
    server.listen(3000, () => console.log('Server ON en el puerto 3000'))
}).catch((err) => {
    console.error('No se pudo iniciar el servidor:', err)
})