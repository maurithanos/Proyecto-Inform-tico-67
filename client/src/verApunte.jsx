import { useState, useEffect, useCallback } from 'react'
import axios from 'axios'
import { Link, useNavigate, useParams } from 'react-router-dom'
import './comunidad.css'

function VerApunte() {
    const [apuntePublico, setApunte] = useState(null)
    const [mensaje, setMensaje] = useState('')
    const [tipoMensaje, setTipoMensaje] = useState('')
    const [cargando, setCargando] = useState(true)
    const [calificando, setCalificando] = useState(false)
    const [nuevaCalificacion, setNuevaCalificacion] = useState(5)

    const { id } = useParams()
    const navigate = useNavigate()

    const cargarApunte = useCallback(async () => {
        try {
            const { data } = await axios.get(
                `http://localhost:3000/apuntes/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                }
            )

            setApunte(data)

        } catch (error) {
            if (error.response?.status === 401) {
                localStorage.removeItem('token')
                navigate('/login')
                return
            }

            setMensaje(
                error.response?.data?.error ||
                'No se pudo cargar el apunte.'
            )

            setTipoMensaje('error')

        } finally {
            setCargando(false)
        }
    }, [id, navigate])

    useEffect(() => {
        cargarApunte()
    }, [cargarApunte])

    const enviarCalificacion = async e => {
        e.preventDefault()

        setMensaje('')
        setCalificando(true)

        try {
            await axios.post(
                `http://localhost:3000/apuntes/calificar/${id}`,
                {
                    calificacion: Number(nuevaCalificacion)
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                }
            )

            setMensaje('¡Tu calificación fue enviada correctamente!')
            setTipoMensaje('exito')

            await cargarApunte()

        } catch (error) {
            if (error.response?.status === 401) {
                localStorage.removeItem('token')
                navigate('/login')
                return
            }

            setMensaje(
                error.response?.data?.error ||
                'No se pudo enviar la calificación.'
            )

            setTipoMensaje('error')

        } finally {
            setCalificando(false)
        }
    }

    if (cargando) {
        return (
            <div className="comunidad-pagina">
                <div className="comunidad-estado">
                    Cargando apunte...
                </div>
            </div>
        )
    }

    const apunte = apuntePublico?.apunte

    if (!apunte) {
        return (
            <div className="comunidad-pagina">

                <div className="comunidad-error">
                    {mensaje || 'No se pudo encontrar el apunte.'}
                </div>

                <Link
                    to="/apuntespublicos"
                    className="comunidad-btn-volver"
                >
                    Volver a la comunidad
                </Link>

            </div>
        )
    }

    const promedio = Number(apuntePublico.promedio ?? 0)

    return (
        <div className="comunidad-pagina">

            <div className="comunidad-detalle-encabezado">

                <Link
                    to="/apuntespublicos"
                    className="comunidad-link-volver"
                >
                    ← Volver a la comunidad
                </Link>

                <span className="comunidad-etiqueta">
                    DETALLES DEL MATERIAL
                </span>

                <h2 className="comunidad-titulo">
                    {apunte.Descripcion || 'Apunte sin título'}
                </h2>

                <p>
                    Consultá el contenido y dejá tu calificación.
                </p>

            </div>

            <div className="comunidad-detalle-grilla">

                <section className="comunidad-detalle-card">

                    <div className="comunidad-detalle-superior">

                        <span className="comunidad-card-etiqueta">
                            APUNTE #{apunte.id}
                        </span>

                        <span className="comunidad-publico">
                            Público
                        </span>

                    </div>

                    <div className="comunidad-detalle-info">

                        <span>DESCRIPCIÓN</span>

                        <h3>
                            {apunte.Descripcion || 'Sin descripción'}
                        </h3>

                    </div>

                    <div className="comunidad-detalle-separador"></div>

                    <div className="comunidad-detalle-info">

                        <span>CONTENIDO DEL APUNTE</span>

                        <div className="comunidad-contenido-completo">
                            {apunte.Archivo || 'Este apunte no tiene contenido.'}
                        </div>

                    </div>

                    <div className="comunidad-detalle-separador"></div>

                    <div className="comunidad-autor">
                        <div className="comunidad-autor-avatar">
                            {apunte.usuario?.name?.charAt(0).toUpperCase() || 'U'}
                        </div>

                        <div>
                            <span>PUBLICADO POR</span>
                            <strong>
                                {apunte.usuario?.name || 'Usuario de la comunidad'}
                            </strong>
                        </div>
                    </div>

                </section>

                <aside className="comunidad-calificar-card">

                    <div className="comunidad-calificar-icono">
                        ★
                    </div>

                    <h3>Calificación</h3>

                    <div className="comunidad-promedio">
                        {promedio.toFixed(1)}
                        <span>/ 5</span>
                    </div>

                    <div className="comunidad-estrellas-grandes">
                        {'★'.repeat(Math.round(promedio))}
                        {'☆'.repeat(5 - Math.round(promedio))}
                    </div>

                    <p className="comunidad-promedio-descripcion">
                        {promedio > 0
                            ? 'Promedio de las calificaciones recibidas.'
                            : 'Todavía no hay calificaciones.'}
                    </p>

                    <div className="comunidad-detalle-separador"></div>

                    <form
                        className="comunidad-form-calificar"
                        onSubmit={enviarCalificacion}
                    >

                        <label htmlFor="calificacion">
                            Tu puntuación
                        </label>

                        <select
                            id="calificacion"
                            value={nuevaCalificacion}
                            onChange={e => setNuevaCalificacion(Number(e.target.value))}
                        >
                            <option value="1">1 - Muy malo</option>
                            <option value="2">2 - Malo</option>
                            <option value="3">3 - Regular</option>
                            <option value="4">4 - Bueno</option>
                            <option value="5">5 - Excelente</option>
                        </select>

                        <button
                            type="submit"
                            disabled={calificando}
                        >
                            {calificando ? 'Enviando...' : 'Enviar calificación'}
                        </button>

                    </form>

                    {mensaje && (
                        <p className={`apunte-mensaje apunte-mensaje-${tipoMensaje}`}>
                            {mensaje}
                        </p>
                    )}

                </aside>

            </div>

        </div>
    )
}

export default VerApunte