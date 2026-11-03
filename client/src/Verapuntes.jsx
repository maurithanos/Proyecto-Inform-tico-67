import { useState, useEffect } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import './apuntes.css'

function Verapuntes() {
    const [apuntes, setApuntes] = useState([])
    const [mensaje, setMensaje] = useState('')
    const [cargando, setCargando] = useState(true)

    useEffect(() => {
        const cargarApuntes = async () => {
            try {
                const { data } = await axios.get(
                    'http://localhost:3000/apuntes',
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('token')}`
                        }
                    }
                )

                setApuntes(data)

            } catch (err) {
                setMensaje(
                    err.response?.data?.error ||
                    'No se pudo conectar con el servidor.'
                )
            } finally {
                setCargando(false)
            }
        }

        cargarApuntes()
    }, [])

    return (
        <div className="apuntes-pagina">

            <div className="apuntes-encabezado">
                <h2 className="apuntes-titulo">Mis apuntes</h2>

                <p>
                    Todos tus materiales de estudio en un mismo lugar.
                </p>
            </div>

            <div className="apuntes-lista-encabezado">

                <div>
                    <h3>Biblioteca personal</h3>
                    <p>Administrá y consultá tus apuntes.</p>
                </div>

                <Link to="/apuntes/nuevo" className="apuntes-btn-crear">
                    + Crear apunte
                </Link>

            </div>

            {!cargando && !mensaje && (
                <div className="apuntes-contador">
                    {apuntes.length} {apuntes.length === 1 ? 'apunte guardado' : 'apuntes guardados'}
                </div>
            )}

            {cargando && (
                <div className="apuntes-estado">
                    <p>Cargando tus apuntes...</p>
                </div>
            )}

            {mensaje && (
                <div className="apuntes-error">
                    {mensaje}
                </div>
            )}

            {!cargando && !mensaje && apuntes.length === 0 && (
                <div className="apuntes-vacio">

                    <div className="apuntes-vacio-icono">
                        +
                    </div>

                    <h3>Todavía no tenés apuntes</h3>

                    <p>
                        Cuando crees tu primer apunte, aparecerá acá.
                    </p>

                    <Link to="/apuntes/nuevo" className="apuntes-btn-crear">
                        Crear mi primer apunte
                    </Link>

                </div>
            )}

            {!cargando && !mensaje && apuntes.length > 0 && (

                <div className="apuntes-grid">

                    {apuntes.map(apunte => (

                        <article className="apunte-lista-card" key={apunte.id}>

                            <div className="apunte-lista-superior">

                                <span className="apunte-etiqueta">
                                    APUNTE #{apunte.id}
                                </span>

                                <span className={`apunte-estado-privacidad ${apunte.EsPrivado ? 'es-privado' : 'es-publico'}`}>
                                    {apunte.EsPrivado ? 'Privado' : 'Público'}
                                </span>

                            </div>

                            <h3>
                                {apunte.Descripcion || 'Apunte sin título'}
                            </h3>

                            <p className="apunte-lista-contenido">
                                {apunte.Archivo || 'Este apunte todavía no tiene contenido.'}
                            </p>

                            <div className="apunte-lista-footer">

                                <span>
                                    Material de estudio
                                </span>

                                <Link
                                    to={`/apuntes/${apunte.id}/editar`}
                                    className="apunte-btn-modificar"
                                >
                                    Modificar apunte →
                                </Link>

                            </div>

                        </article>

                    ))}

                </div>

            )}

        </div>
    )
}

export default Verapuntes