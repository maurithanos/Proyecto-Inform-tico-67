const express = require("express")
const server = express()

const users = [
    {
        id: 1,
        name: "Juan"
    },
    {
        id: 2,
        name: "Pepe"
    },
    {
        id: 3,
        name: "Gael"
    }
]


server.use((req, res, next) => {
  // 👇 Acá decís qué origen tiene permiso
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173')
  // 👇 Métodos HTTP permitidos
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  // 👇 Qué headers puede mandar el frontend
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  // 👇 Si querés permitir cookies/tokens en las peticiones
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  // Si es una petición OPTIONS (preflight), respondemos rápido
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200)
  }
  next()
})


server.get("/users", (req, res) => {
    res.status(200).json(users)
})

server.listen(3000, () => {
    console.log("Server ON en el puerto 3000");

})