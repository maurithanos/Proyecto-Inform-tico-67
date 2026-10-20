import { useState } from 'react'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'
import './login.css'

function Login() {
    const navigate = useNavigate()
    const [form, setForm] = useState({ email: '', password: '' })
    const [mensaje, setMensaje] = useState('')

    const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value })

    const handleSubmit = async e => {
        e.preventDefault()
        setMensaje('')
        try {
            const { data } = await axios.post('http://localhost:3000/login', form)

            if (data.token) {
                localStorage.setItem('token', data.token)
                navigate('/home', { replace: true })
            } else {
                setMensaje('El servidor no devolvió un token')
            }
            //localStorage.setItem('token', data.token)
            //navigate('/home')
        } catch (err) {
            setMensaje(err.response?.data?.error || 'No se pudo conectar con el servidor')

        }
    }

    return (
        <form className="login-form" onSubmit={handleSubmit}>
            <h2>Iniciar sesión</h2>
            <input className='email-login' name="email" type="email" placeholder="Email" onChange={handleChange} />
            <input className='contrasena-login' name="password" type="password" placeholder="Contraseña" onChange={handleChange} />
            <button className="btn btn-login" type="submit">Ingresar</button>
            <p>{mensaje}</p>
            <p>
                ¿No estas registrado? <Link className="no-registrado" to="/register">Registrate acá</Link>
            </p>
        </form>
    )
}

export default Login
