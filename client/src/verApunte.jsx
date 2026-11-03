import { useState, useEffect } from 'react'
import axios from 'axios'
import { Link, useParams } from 'react-router-dom'

function VerApunte() {
    const [apuntePublico, setApunte] = useState(null)
    const [mensaje, setMensaje] = useState('')
    const [cargando, setCargando] = useState(true)
    const [nuevaCalificacion, setNuevaCalificacion] = useState(5)
    const {id} = useParams()

    const cargarApunte = async () => {
            try {
                const { data } = await axios.get(`http://localhost:3000/apuntes/${id}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                })
                setApunte(data)
            } catch (error) {
                setMensaje(error.response?.data?.error || 'No se pudo conectar con el servidor')
            } finally {
                setCargando(false)
            }
        }

    useEffect(() => {
        

        cargarApunte()
    }, [id])

    const enviarCalificacion = async (e)=>{
        e.preventDefault()
        try {
            await axios.post(`http://localhost:3000/apuntes/calificar/${id}`,
                {calificacion: Number(nuevaCalificacion)}, 
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                }
             )
            setMensaje("Apunte calificado con exito")
            cargarApunte()
        } catch (error) {
            setMensaje(error.response?.data?.error || 'No se pudo conectar con el servidor')
        }
    }

    return (
        <div>
            <h2>Apunte</h2>

            {cargando && <p>Cargando...</p>}
            {mensaje && <p>{mensaje}</p>}
            <div>
                <strong>Descripción:</strong> {apuntePublico.apunte.Descripcion} <br />
                <strong>Archivo:</strong> {apuntePublico.apunte.Archivo} <br />
                <strong>Autor:</strong> {apuntePublico.apunte.usuario?.name || 'Desconocido'} <br />                   
                <strong>Calificacion:</strong> {apuntePublico.promedio} <br />
            </div>
            <br></br>
            <form onSubmit={enviarCalificacion}>
                <h3>Calificar apunte </h3>
                <label>Puntuacion:</label>
                <select value={nuevaCalificacion} onChange={(e)=>setNuevaCalificacion(e.target.value)}>
                    <option value="1">1 muy malo</option>
                    <option value="2">2 malo</option>
                    <option value="3">3 decente/bueno</option>
                    <option value="4">4 bueno</option>
                    <option value="5">5 excelente</option>
                </select>
                <button type="submit">Enviar calificacion</button>
            </form>
                
            

        </div>
    )
}

export default VerApunte