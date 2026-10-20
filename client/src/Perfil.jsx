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
            const token = localStorage.getItem('token')

            console.log('Token guardado:', token ? 'Existe' : 'No existe')

            try {
                console.log('Cargando perfil desde el backend')
                console.log('URL:', 'http://localhost:3000/perfil')
                console.log('Token existe:', !!localStorage.getItem('token'))
                const respuesta = await axios.get(
                    'http://localhost:3000/perfil',
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                )

                console.log('Perfil recibido:', respuesta.data)
                setUser(respuesta.data)
                setMensaje('')
            } catch (err) {
                console.log('Estado HTTP:', err.response?.status)
                console.log('Respuesta backend:', err.response?.data)
                console.log('Error completo:', err.message)

                setMensaje(
                    err.response?.data?.error ||
                    (typeof err.response?.data === 'string' ? err.response.data : '') ||
                    err.message
                )
            }
            /*
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
*/
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
             console.error('Error al actualizar perfil:', err)

            if (err.response?.status === 401) {
                localStorage.removeItem('token')
                navigate('/login')
                return
            }

            setMensaje(
                err.response
                    ? `Error al modificar: ${err.response.status} - ${JSON.stringify(err.response.data)}`
                    : 'No se encuentra el servidor. Revisá el backend.'
            )
        
        }
    }

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
                value={formCambio.escuela} 
                onChange={handleChange} 
            />
            <button onClick={() => actualizarCampo('escuela')}>Cambiar escuela</button>
            <p>Año: {user.anio}</p>
            <input
                className="cambio-anio"
                type="text" 
                name="anio" 
                placeholder="Nuevo año" 
                value={formCambio.anio} 
                onChange={handleChange} 
            />
            <button onClick={() => actualizarCampo('anio')}>Cambiar año</button>
            
            <button onClick={cerrarSesion}>Cerrar sesión</button>
            <p>{mensaje}</p>
        </div>
    )
}

export default Perfil
