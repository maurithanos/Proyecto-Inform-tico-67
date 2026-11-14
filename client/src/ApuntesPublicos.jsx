import { useState, useEffect } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import './comunidad.css'

function ApuntesPublicos() {
    const [apuntes, setApuntes] = useState([])
    const [mensaje, setMensaje] = useState('')
    const [cargando, setCargando] = useState(true)

    useEffect(() => {
        const cargarApuntes = async () => {
            try {
                const { data } = await axios.get(
                    'http://localhost:3000/apuntes/publicos',
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('token')}`
                        }
                    }
                )

                setApuntes(Array.isArray(data) ? data : [])

            } catch (err) {
                setMensaje(
                    err.response?.data?.error ||
                    'No se pudieron cargar los apuntes.'
                )
            } finally {
                setCargando(false)
            }
        }

        cargarApuntes()
    }, [])

    return (
        <div className="comunidad-pagina">

            <div className="comunidad-encabezado">

                <span className="comunidad-etiqueta">
                    ESPACIO COMPARTIDO
                </span>

                <h2 className="comunidad-titulo">
                    Apuntes de la comunidad
                </h2>

                <p>
                    Descubrí materiales de estudio creados por otros estudiantes.
                    Explorá, aprendé y compartí conocimientos.
                </p>

            </div>

            <div className="comunidad-resumen">

                <div>

                    <div>
                        <h3>Biblioteca pública</h3>
                        <p>Materiales disponibles para la comunidad.</p>
                    </div>
                </div>

                {!cargando && !mensaje && (
                    <span className="comunidad-cantidad">
                        {apuntes.length} {apuntes.length === 1 ? 'apunte' : 'apuntes'}
                    </span>
                )}

            </div>

            {cargando && (
                <div className="comunidad-estado">
                    Cargando apuntes de la comunidad...
                </div>
            )}

            {mensaje && (
                <div className="comunidad-error">
                    {mensaje}
                </div>
            )}

            {!cargando && !mensaje && apuntes.length === 0 && (
                <div className="comunidad-vacia">

                    <h3>Todavía no hay apuntes públicos</h3>

                    <p>
                        Cuando otros estudiantes compartan sus materiales,
                        vas a poder encontrarlos acá.
                    </p>

                </div>
            )}

            {!cargando && !mensaje && apuntes.length > 0 && (

                <div className="comunidad-grilla">

                    {apuntes.map(item => {
                        const apunte = item.apunte ?? item
                        const promedio = Number(item.promedio ?? 0)

                        return (
                            <article
                                className="comunidad-card"
                                key={apunte.id}
                            >

                                <div className="comunidad-card-superior">

                                    <span className="comunidad-card-etiqueta">
                                        MATERIAL COMPARTIDO
                                    </span>

                                    <span className="comunidad-publico">
                                        Público
                                    </span>

                                </div>

                                <h3>
                                    {apunte.Descripcion || 'Apunte sin título'}
                                </h3>

                                <p className="comunidad-card-contenido">
                                    {apunte.Archivo || 'Este apunte no tiene contenido.'}
                                </p>

                                <div className="comunidad-calificacion">

                                    <span className="comunidad-estrellas">
                                        {'★'.repeat(Math.round(promedio))}
                                        {'☆'.repeat(5 - Math.round(promedio))}
                                    </span>

                                    <strong>
                                        {promedio.toFixed(1)}
                                    </strong>

                                    <span>
                                        / 5
                                    </span>

                                </div>

                                <div className="comunidad-card-footer">

                                    <span>
                                        Apunte #{apunte.id}
                                    </span>

                                    <Link
                                        to={`/apuntespublicos/${apunte.id}`}
                                        className="comunidad-btn-ver"
                                    >
                                        Ver detalles →
                                    </Link>

                                </div>

                            </article>
                        )
                    })}

                </div>

            )}

        </div>
    )
}

export default ApuntesPublicos