import { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

function Perfil() {
    const [user, setUser] = useState(null)
    const [mensaje, setMensaje] = useState('')
    const navigate = useNavigate()

    const cerrarSesion = () => {
        localStorage.removeItem('token')
        navigate('/login')
    }

    useEffect(() => {
        const cargarPerfil = async () => {
            try {
                const { data } = await axios.get('http://localhost:3000/perfil', {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                })
                setUser(data)
            } catch (err) {
                if (err.response?.status === 401) {
                    localStorage.removeItem('token')
                    navigate('/login')
                    return
                }
                setMensaje(err.response?.data?.error || 'No se pudo conectar con el servidor')
            }
        }
        cargarPerfil()
    }, [navigate])

    if (mensaje) return <p>{mensaje}</p>
    if (!user) return <p>Cargando...</p>

    return (
        <div>
            <h2>Mi perfil</h2>
            <p>Nombre: {user.name}</p>
            <p>Email: {user.email}</p>
            <p>Escuela: {user.escuela}</p>
            <p>Año: {user.anio}</p>
            <button onClick={cerrarSesion}>Cerrar sesión</button>
        </div>
    )
}

export default Perfil
