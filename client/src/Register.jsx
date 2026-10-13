import { useState } from 'react'
import axios from 'axios'

function Register() {
    const [form, setForm] = useState({ name: '', email: '', password: '', escuela: '', anio: '' })
    const [mensaje, setMensaje] = useState('')

    const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value })

    const handleSubmit = async e => {
        e.preventDefault()
        try {
            await axios.post('http://localhost:3000/register', form)
            setMensaje('Usuario registrado correctamente')
        } catch (err) {
            setMensaje(err.response?.data?.error || 'No se pudo conectar con el servidor')
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <h2>Registro</h2>
            <input name="name" placeholder="Nombre" onChange={handleChange} />
            <input name="email" type="email" placeholder="Email" onChange={handleChange} />
            <input name="password" type="password" placeholder="Contraseña" onChange={handleChange} />
            <input name="escuela" placeholder="Escuela" onChange={handleChange} />
            <input name="anio" type="number" placeholder="Año" onChange={handleChange} />
            <button type="submit">Registrarse</button>
            <p>{mensaje}</p>
            <p>¿Ya estas registrado?<Link to="/login">Logeate aca</Link></p>
        </form>
    )
}

export default Register