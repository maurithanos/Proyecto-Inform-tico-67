import { useState } from 'react'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'
const navigate = useNavigate()

function Login() {
    
    const [form, setForm] = useState({ email: '', password: '' })
    const [mensaje, setMensaje] = useState('')

    const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value })

    const handleSubmit = async e => {
        e.preventDefault()
        setMensaje('')
        try {
            const { data } = await axios.post('http://localhost:3000/login', form)
            localStorage.setItem('token', data.token)
            navigate('/perfil')
        } catch (err) {
            setMensaje(err.response?.data?.error || 'No se pudo conectar con el servidor')

        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <h2>Iniciar sesión</h2>
            <input name="email" type="email" placeholder="Email" onChange={handleChange} />
            <input name="password" type="password" placeholder="Contraseña" onChange={handleChange} />
            <button type="submit">Ingresar</button>
            <p>{mensaje}</p>
            <p>¿No estas registrado? <Link to="/register">Registrate acá</Link></p>
        </form>
    )
}

export default Login
