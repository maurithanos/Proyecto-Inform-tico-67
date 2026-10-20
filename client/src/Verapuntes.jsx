import { useState, useEffect } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'

function Verapuntes() {
    const [apuntes, setApuntes] = useState([])
    const [mensaje, setMensaje] = useState('')
    const [cargando, setCargando] = useState(true)

    useEffect(() => {
        const cargarApuntes = async () => {
            try {
                const { data } = await axios.get('http://localhost:3000/apuntes', {
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
            <h2>Apuntes Privados</h2>

            {cargando && <p>Cargando...</p>}
            {mensaje && <p>{mensaje}</p>}
            {!cargando && !mensaje && apuntes.length === 0 && <p>Todavía no tenés apuntes.</p>}

            <ul>
                {apuntes.map(apunte => (
                    <li key={apunte.id}>
                        <strong>Descripción:</strong> {apunte.Descripcion} <br />
                        <strong>Archivo:</strong> {apunte.Archivo} <br />
                        <strong>Privado:</strong> {apunte.EsPrivado ? 'Sí' : 'No'}
                    </li>
                ))}
            </ul>

            <p><Link to="/apuntes/nuevo">Crear Apunte</Link></p>
        </div>
    )
}

export default Verapuntes