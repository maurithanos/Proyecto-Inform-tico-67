import { useEffect, useState } from 'react'
import axios from 'axios'
import { Link, useNavigate, useParams } from 'react-router-dom'



function EditarApunte() {
    const { id } = useParams() 
    const navigate = useNavigate()
    const [form, setForm] = useState({ Descripcion: '', Archivo: '',EsPrivado:true })
    const [cargando, setCargando] = useState(true)
    const [mensaje, setMensaje] = useState('')

    const handleChange = e => {
        const { name, type, checked, value } = e.target
        setForm({
            ...form,
            [name]: type === 'checkbox' ? checked : value
        })
    }
    const sesionVencida = () => {
        localStorage.removeItem('token')
        navigate('/login')
    }

    useEffect(() => {
        const cargarApunte = async () => {
            try {
                const { data } = await axios.get(`http://localhost:3000/apuntes/${id}`, { 
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
                setForm({ 
                    Descripcion: data.Descripcion ?? '', 
                    Archivo: data.Archivo ?? '',
                    EsPrivado:data.EsPrivado 
                })
            } catch (err) {
                if (err.response?.status === 401) return sesionVencida()
                setMensaje(err.response?.data?.error || 'No se pudo conectar con el servidor')
            } finally {
                setCargando(false)
            }
        }
        cargarApunte()
       
    }, [id])

    const handleSubmit = async e => {
        e.preventDefault()
        setMensaje('')
        try {
            await axios.patch(`http://localhost:3000/apuntes/${id}`, form, { 
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
            navigate('/verapuntes')
        } catch (err) {
            if (err.response?.status === 401) return sesionVencida()
            setMensaje(err.response?.data?.error || 'No se pudo conectar con el servidor')
        }
    }

    if (cargando) return <p>Cargando...</p>

    return (
        <form onSubmit={handleSubmit}>
            <h2>Modificar apunte</h2>
            <input name="Descripcion" placeholder="Descripcion" value={form.Descripcion} onChange={handleChange} />
            <textarea name="Archivo" placeholder="Archivo" value={form.Archivo} onChange={handleChange} />
            <label>
                <input name="EsPrivado" type="checkbox" checked={form.EsPrivado} onChange={handleChange} />
                Privado
            </label>
            <button type="submit">Guardar cambios</button>
            <p>{mensaje}</p>
            <Link to="/verapuntes">Cancelar</Link>
        </form>
    )
}

export default EditarApunte
