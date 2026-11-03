import { useState, useEffect } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'

function ApuntesPublicos() {
    const [apuntes, setApuntes] = useState([])
    const [mensaje, setMensaje] = useState('')
    const [cargando, setCargando] = useState(true)

    useEffect(() => {
        const cargarApuntes = async () => {
            try {
                const { data } = await axios.get('http://localhost:3000/apuntes/publicos', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                })
                setApuntes(data)
            } catch (err) {
                setMensaje(err.response?.data?.error || 'No se pudo conectar con el servidor')
            } finally {
                setCargando(false)
            }
        }

        cargarApuntes()
    }, [])

    return (
        <div>
            <h2>Apuntes Publicos</h2>

            {cargando && <p>Cargando...</p>}
            {mensaje && <p>{mensaje}</p>}
            {!cargando && !mensaje && apuntes.length === 0 && <p>Todavía no hay apuntes.</p>}

            <ul>
                {apuntes.map(apuntePublico => (
                    <li key={apuntePublico.apunte.id}>
                        <strong>Descripción:</strong> {apuntePublico.apunte.Descripcion} <br />
                        <strong>Archivo:</strong> {apuntePublico.apunte.Archivo} <br />
                        <strong>Calificacion:</strong> {apuntePublico.promedio} <br />
                        <Link to={`/apuntespublicos/${apuntePublico.apunte.id}`} >Ver Detalles</Link>

                    </li>
                ))}
            </ul>

        </div>
    )
}

export default ApuntesPublicos