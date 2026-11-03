import { useEffect, useState } from 'react'
import axios from 'axios'
import { Link, useNavigate, useParams } from 'react-router-dom'
import './apuntes.css'

function EditarApunte() {
    const { id } = useParams()
    const navigate = useNavigate()

    const [form, setForm] = useState({
        Descripcion: '',
        Archivo: '',
        EsPrivado: true
    })

    const [cargando, setCargando] = useState(true)
    const [guardando, setGuardando] = useState(false)
    const [mensaje, setMensaje] = useState('')
    const [tipoMensaje, setTipoMensaje] = useState('')

    const sesionVencida = () => {
        localStorage.removeItem('token')
        navigate('/login')
    }

    useEffect(() => {
        const cargarApunte = async () => {
            try {
                const { data } = await axios.get(
                    `http://localhost:3000/apuntes/${id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('token')}`
                        }
                    }
                )

                // El backend devuelve el apunte dentro de data.apunte
                const apunte = data.apunte ?? data

                setForm({
                    Descripcion: apunte.Descripcion ?? '',
                    Archivo: apunte.Archivo ?? '',
                    EsPrivado: apunte.EsPrivado ?? true
                })

            } catch (err) {
                if (err.response?.status === 401) {
                    return sesionVencida()
                }

                setMensaje(
                    err.response?.data?.error ||
                    'No se pudo cargar el apunte.'
                )

                setTipoMensaje('error')

            } finally {
                setCargando(false)
            }
        }

        cargarApunte()
    }, [id])

    const handleChange = e => {
        const { name, value, type, checked } = e.target

        setForm({
            ...form,
            [name]: type === 'checkbox' ? checked : value
        })
    }

    const handleSubmit = async e => {
        e.preventDefault()

        setMensaje('')
        setGuardando(true)

        try {
            await axios.patch(
                `http://localhost:3000/apuntes/${id}`,
                form,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                }
            )

            navigate('/verapuntes')

        } catch (err) {
            if (err.response?.status === 401) {
                return sesionVencida()
            }

            setMensaje(
                err.response?.data?.error ||
                'No se pudieron guardar los cambios.'
            )

            setTipoMensaje('error')

        } finally {
            setGuardando(false)
        }
    }

    if (cargando) {
        return (
            <div className="apuntes-pagina">
                <div className="apuntes-estado">
                    Cargando apunte...
                </div>
            </div>
        )
    }

    if (mensaje && tipoMensaje === 'error' && !form.Descripcion && !form.Archivo) {
        return (
            <div className="apuntes-pagina">

                <div className="apuntes-encabezado">
                    <h2 className="apuntes-titulo">Modificar apunte</h2>
                    <p>No se pudo acceder al contenido solicitado.</p>
                </div>

                <div className="editar-apunte-card">

                    <p className="apunte-mensaje apunte-mensaje-error">
                        {mensaje}
                    </p>

                    <Link to="/verapuntes" className="apunte-btn-volver">
                        Volver a mis apuntes
                    </Link>

                </div>

            </div>
        )
    }

    return (
        <div className="apuntes-pagina editar-apunte-pagina">

            <div className="apuntes-encabezado">
                <h2 className="apuntes-titulo">Modificar apunte</h2>

                <p>
                    Actualizá el contenido y la privacidad de tu material de estudio.
                </p>
            </div>

            <div className="editar-apunte-card">

                <div className="editar-apunte-encabezado">

                    <div>
                        <span className="editar-apunte-etiqueta">
                            EDITANDO APUNTE #{id}
                        </span>

                        <h3>Editar contenido</h3>

                        <p>
                            Los cambios se guardarán en tu biblioteca personal.
                        </p>
                    </div>

                    <div className="editar-apunte-icono">
                        ✎
                    </div>

                </div>

                <form onSubmit={handleSubmit} className="apunte-form">

                    <div className="apunte-form-grupo">

                        <label htmlFor="editar-descripcion">
                            Título o descripción
                        </label>

                        <input
                            id="editar-descripcion"
                            name="Descripcion"
                            type="text"
                            placeholder="Título de tu apunte"
                            value={form.Descripcion}
                            onChange={handleChange}
                        />

                    </div>

                    <div className="apunte-form-grupo">

                        <label htmlFor="editar-archivo">
                            Contenido del apunte
                        </label>

                        <textarea
                            id="editar-archivo"
                            name="Archivo"
                            rows="10"
                            placeholder="Escribí el contenido de tu apunte..."
                            value={form.Archivo}
                            onChange={handleChange}
                        />

                        <span className="apunte-ayuda">
                            Podés modificar libremente el contenido de tu material.
                        </span>

                    </div>

                    <div className="apunte-privacidad">

                        <label className="apunte-switch">

                            <input
                                name="EsPrivado"
                                type="checkbox"
                                checked={form.EsPrivado}
                                onChange={handleChange}
                            />

                            <span className="apunte-switch-visual"></span>

                        </label>

                        <div>

                            <strong>
                                {form.EsPrivado ? 'Apunte privado' : 'Apunte público'}
                            </strong>

                            <p>
                                {form.EsPrivado
                                    ? 'Solamente vos podrás acceder a este apunte.'
                                    : 'Tu apunte podrá aparecer en la comunidad.'}
                            </p>

                        </div>

                    </div>

                    {mensaje && (
                        <p className={`apunte-mensaje apunte-mensaje-${tipoMensaje}`}>
                            {mensaje}
                        </p>
                    )}

                    <div className="apunte-form-botones">

                        <Link
                            to="/verapuntes"
                            className="apunte-btn-volver"
                        >
                            Cancelar
                        </Link>

                        <button
                            type="submit"
                            className="apunte-btn-guardar"
                            disabled={guardando}
                        >
                            {guardando ? 'Guardando...' : 'Guardar cambios'}
                        </button>

                    </div>

                </form>

            </div>

        </div>
    )
}

export default EditarApunte