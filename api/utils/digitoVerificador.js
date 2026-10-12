const crypto = require('crypto')
const hash = s => crypto.createHash('sha256').update(s).digest('hex')

const calcularDVH = (...campos) => hash(campos.join('|'))
const calcularDVV = dvhs => hash(dvhs.join(''))

module.exports = { calcularDVH, calcularDVV }