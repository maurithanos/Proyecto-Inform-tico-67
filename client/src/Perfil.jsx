import { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

function Perfil() {
    const [user, setUser] = useState(null)
    const [mensaje, setMensaje] = useState('')
    const [formCambio, setFormCambio] = useState({name:'',email:'',escuela:'',anio:''})

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

    const handleChange = (e) => {
        setFormCambio({ ...formCambio, [e.target.name]: e.target.value })
    }


    const actualizarCampo = async (campo)=>{
        try {
            const campoNuevo = formCambio[campo]
            if (!campoNuevo) {
                setMensaje('El campo no puede estar vacio')
                return
            }
            const {data} =  await axios.patch('http://localhost:3000/perfil', {[campo]:campoNuevo},
                { 
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } 
                }
            )
            setUser(data)
            setMensaje('Campos modificados')
            setFormCambio({ ...formCambio, [campo]: '' })

        } catch (err) {
            if (err.response?.status === 401) {
                localStorage.removeItem('token')
                navigate('/login')
                return
            }
            setMensaje('Error al actualizar el dato')
        }
    }

    if (mensaje) return <p>{mensaje}</p>
    if (!user) return <p>Cargando...</p>

    return (
        <div>
            <h2>Mi perfil</h2>
            <p>Nombre: {user.name} </p>
            <input 
                className="cambio-nombre"
                type="text" 
                name="name" 
                placeholder="Nuevo nombre" 
                value={formCambio.name} 
                onChange={handleChange} 
            />
            <button onClick={() => actualizarCampo('name')}>Cambiar nombre</button>
            <p>Email: {user.email}</p>
            <input
                className="cambio-email"
                type="text" 
                name="email" 
                placeholder="Nuevo email" 
                value={formCambio.email} 
                onChange={handleChange} 
            />
            <button onClick={() => actualizarCampo('email')}>Cambiar email</button>
            <p>Escuela: {user.escuela}</p>
            <input
                className="cambio-escuela"
                type="text" 
                name="escuela" 
                placeholder="Nueva escuela" 
                value={formCambio.es} 
                onChange={handleChange} 
            />
            <button onClick={() => actualizarCampo('escuela')}>Cambiar escuela</button>
            <p>Año: {user.anio}</p>
            <input
                className="cambio-anio"
                type="text" 
                name="anio" 
                placeholder="Nuevo año" 
                value={formCambio.es} 
                onChange={handleChange} 
            />
            <button onClick={() => actualizarCampo('escuela')}>Cambiar año</button>
            
            <button onClick={cerrarSesion}>Cerrar sesión</button>
        </div>
    )
}

export default Perfil
