import { useState } from 'react'
import axios from 'axios'

function CrearApunte() {
    const [form, setForm] = useState({ Descripcion: '', Archivo: '', EsPrivado: true })
    const [mensaje, setMensaje] = useState('')

    const handleChange = e => {
        const { name, value, type, checked } = e.target
        setForm({ ...form, [name]: type === 'checkbox' ? checked : value })
    }

    const handleSubmit = async e => {
        e.preventDefault()
        setMensaje('')
        try {
            await axios.post('http://localhost:3000/apuntes', form, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            })
            setMensaje('Apunte creado correctamente')
        } catch (err) {
            setMensaje(err.response?.data?.error || 'No se pudo conectar con el servidor')
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <h2>Nuevo apunte</h2>
            <input name="Descripcion" placeholder="Descripción" onChange={handleChange} />
            <input name="Archivo" placeholder="Archivo" onChange={handleChange} />
            <label>
                <input name="EsPrivado" type="checkbox" checked={form.EsPrivado} onChange={handleChange} />
                Privado
            </label>
            <button type="submit">Guardar</button>
            <p>{mensaje}</p>

        </form>

    )
}

export default CrearApunte