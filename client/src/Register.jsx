import { useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import './Register.css'
import './header.css'
import './footer.css'

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
        <form className="register-form" onSubmit={handleSubmit}>
            <h2>Registro</h2>
            <input className = "login-nombre" name="name" placeholder="Nombre" onChange={handleChange} />
            <input className = "login-email" name="email" type="email" placeholder="Email" onChange={handleChange} />
            <input className = "login-contrasenia" name="password" type="password" placeholder="Contraseña" onChange={handleChange} />
            <input className = "login-escuela" name="escuela" placeholder="Escuela" onChange={handleChange} />
            <input className = "login-anio"name="anio" type="number" placeholder="Año" onChange={handleChange} />
            <button className="btn btn-register" type="submit">Registrarse</button>
            <p>{mensaje}</p>
            <p>¿Ya estas registrado?<Link className = "link-logeate" to="/login">Logeate aca</Link></p>
        </form>
    )
}

export default Register