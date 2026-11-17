import { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import './perfil.css'

function Perfil() {
    const [user, setUser] = useState(null)
    const [mensaje, setMensaje] = useState('')
    const [cargando, setCargando] = useState(true)

    const [formCambio, setFormCambio] = useState({
        name: '',
        escuela: '',
        anio: ''
    })

    const navigate = useNavigate()

    const cerrarSesion = () => {
        localStorage.removeItem('token')
        navigate('/login')
    }

    useEffect(() => {
        const cargarPerfil = async () => {
            try {
                const { data } = await axios.get(
                    'http://localhost:3000/perfil',
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('token')}`
                        }
                    }
                )

                setUser(data)
            } catch (err) {
                if (err.response?.status === 401) {
                    localStorage.removeItem('token')
                    navigate('/login')
                    return
                }

                setMensaje(
                    err.response?.data?.error ||
                    'No se pudo cargar el perfil.'
                )
            } finally {
                setCargando(false)
            }
        }

        cargarPerfil()
    }, [navigate])

    const handleChange = (e) => {
        setFormCambio({
            ...formCambio,
            [e.target.name]: e.target.value
        })
    }

    const actualizarCampo = async (campo) => {
        setMensaje('')

        const campoNuevo = String(formCambio[campo] ?? '').trim()

        if (!campoNuevo) {
            setMensaje('El campo no puede estar vacío.')
            return
        }

        const valor = campo === 'anio'
            ? Number(campoNuevo)
            : campoNuevo

        if (campo === 'anio' && !Number.isInteger(valor)) {
            setMensaje('Ingresá un año válido.')
            return
        }

        try {
            const { data } = await axios.patch(
                'http://localhost:3000/perfil',
                { [campo]: valor },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                }
            )

            setUser(data)

            setFormCambio(prev => ({
                ...prev,
                [campo]: ''
            }))

            setMensaje('¡Tus datos fueron actualizados correctamente!')
        } catch (err) {
            if (err.response?.status === 401) {
                localStorage.removeItem('token')
                navigate('/login')
                return
            }

            setMensaje(
                err.response?.data?.error ||
                'No se pudo modificar el dato.'
            )
        }
    }

    const eliminarCuenta = async () => {
        const confirma = window.confirm(
            '¿Estás seguro de que querés eliminar tu cuenta? Esta acción no se puede deshacer.'
        )

        if (!confirma) return

        try {
            await axios.delete('http://localhost:3000/perfil', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })

            localStorage.removeItem('token')
            navigate('/login')
        } catch (err) {
            setMensaje(
                err.response?.data?.error ||
                'No se pudo eliminar la cuenta.'
            )
        }
    }

    if (cargando) {
        return (
            <div className="perfil-pagina">
                <p className="perfil-estado">Cargando perfil...</p>
            </div>
        )
    }

    if (!user) {
        return (
            <div className="perfil-pagina">
                <div className="perfil-mensaje">
                    {mensaje || 'No se pudo encontrar el perfil.'}
                </div>
            </div>
        )
    }

    return (
        <div className="perfil-pagina">

            <div className="perfil-encabezado">
                <h2 className="perfil-titulo">Mi perfil</h2>
                <p>Consultá y administrá la información de tu cuenta.</p>
            </div>

            <div className="perfil-contenido">

                {/* Tarjeta con información del usuario */}
                <section className="perfil-card perfil-resumen">

                    <div className="perfil-avatar">
                        {user.name?.trim().charAt(0).toUpperCase() || 'U'}
                    </div>

                    <h3>{user.name}</h3>

                    <p className="perfil-email-resumen">
                        {user.email}
                    </p>

                    <div className="perfil-separador"></div>

                    <div className="perfil-dato-resumen">
                        <span>Escuela</span>
                        <strong>{user.escuela || 'No especificada'}</strong>
                    </div>

                    <div className="perfil-dato-resumen">
                        <span>Año</span>
                        <strong>{user.anio || 'No especificado'}</strong>
                    </div>

                    <div className="perfil-separador"></div>

                    <p className="perfil-ayuda">
                        Mantené tus datos actualizados para tener tu cuenta organizada.
                    </p>

                </section>

                {/* Tarjeta para modificar información */}
                <section className="perfil-card perfil-edicion">

                    <div className="perfil-edicion-encabezado">
                        <h3>Información personal</h3>
                        <p>Modificá los datos que necesites.</p>
                    </div>

                    <div className="perfil-campo">

                        <div className="perfil-campo-info">
                            <label>Nombre completo</label>
                            <span>{user.name}</span>
                        </div>

                        <div className="perfil-campo-input">
                            <input
                                type="text"
                                name="name"
                                placeholder="Nuevo nombre"
                                value={formCambio.name}
                                onChange={handleChange}
                            />

                            <button onClick={() => actualizarCampo('name')}>
                                Guardar
                            </button>
                        </div>

                    </div>

                    <div className="perfil-campo">

                        <div className="perfil-campo-info">
                            <label>Correo electrónico</label>
                            <span>{user.email}</span>
                        </div>

                        <p className="perfil-solo-lectura">
                            El correo se muestra como dato de la cuenta y no se puede modificar desde esta sección.
                        </p>

                    </div>

                    <div className="perfil-campo">

                        <div className="perfil-campo-info">
                            <label>Institución educativa</label>
                            <span>{user.escuela || 'No especificada'}</span>
                        </div>

                        <div className="perfil-campo-input">
                            <input
                                type="text"
                                name="escuela"
                                placeholder="Nueva escuela"
                                value={formCambio.escuela}
                                onChange={handleChange}
                            />

                            <button onClick={() => actualizarCampo('escuela')}>
                                Guardar
                            </button>
                        </div>

                    </div>

                    <div className="perfil-campo">

                        <div className="perfil-campo-info">
                            <label>Año escolar</label>
                            <span>{user.anio || 'No especificado'}</span>
                        </div>

                        <div className="perfil-campo-input">
                            <input
                                type="number"
                                name="anio"
                                placeholder="Nuevo año"
                                min="1"
                                value={formCambio.anio}
                                onChange={handleChange}
                            />

                            <button onClick={() => actualizarCampo('anio')}>
                                Guardar
                            </button>
                        </div>

                    </div>

                    {mensaje && (
                        <p className="perfil-mensaje" role="status">
                            {mensaje}
                        </p>
                    )}

                </section>

            </div>

            {/* Acciones de cuenta */}
            <section className="perfil-acciones">

                <div>
                    <h3>Administración de cuenta</h3>
                    <p>Gestioná tu sesión o eliminá tu cuenta.</p>
                </div>

                <div className="perfil-botones-acciones">
                    <button
                        className="perfil-btn-salir"
                        onClick={cerrarSesion}
                    >
                        Cerrar sesión
                    </button>

                    <button
                        className="perfil-btn-eliminar"
                        onClick={eliminarCuenta}
                    >
                        Eliminar cuenta
                    </button>
                </div>

            </section>

        </div>
    )
}

export default Perfil