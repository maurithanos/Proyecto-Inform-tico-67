import { useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import './apuntes.css'

function CrearApunte() {
    const [form, setForm] = useState({
        Descripcion: '',
        Archivo: '',
        EsPrivado: true
    })

    const [mensaje, setMensaje] = useState('')
    const [tipoMensaje, setTipoMensaje] = useState('')
    const [guardando, setGuardando] = useState(false)

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
            await axios.post(
                'http://localhost:3000/apuntes',
                form,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                }
            )

            setMensaje('¡Tu apunte fue creado correctamente!')
            setTipoMensaje('exito')

            setForm({
                Descripcion: '',
                Archivo: '',
                EsPrivado: true
            })

        } catch (err) {
            setMensaje(
                err.response?.data?.error ||
                'No se pudo conectar con el servidor.'
            )

            setTipoMensaje('error')
        } finally {
            setGuardando(false)
        }
    }

    return (
        <div className="apuntes-pagina">

            <div className="apuntes-encabezado">
                <h2 className="apuntes-titulo">Crear un apunte</h2>
                <p>Guardá tus conocimientos y organizá tus materiales de estudio.</p>
            </div>

            <div className="crear-apunte-card">

                <div className="crear-apunte-card-titulo">
                    <h3>Nuevo apunte</h3>
                    <p>Completá los siguientes campos para guardar tu apunte.</p>
                </div>

                <form onSubmit={handleSubmit} className="apunte-form">

                    <div className="apunte-form-grupo">
                        <label htmlFor="descripcion">
                            Título o descripción
                        </label>

                        <input
                            id="descripcion"
                            name="Descripcion"
                            type="text"
                            placeholder="Ej: Resumen de matemática - Funciones"
                            value={form.Descripcion}
                            onChange={handleChange}
                        />

                    </div>

                    <div className="apunte-form-grupo">
                        <label htmlFor="archivo">
                            Contenido del apunte
                        </label>

                        <textarea
                            id="archivo"
                            name="Archivo"
                            rows="9"
                            placeholder="Escribí acá el contenido de tu apunte..."
                            value={form.Archivo}
                            onChange={handleChange}
                        />

                        <span className="apunte-ayuda">
                            Podés agregar texto, explicaciones y contenido de estudio.
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
                        <p className={`apunte-mensaje apunte-mensaje-${tipoMensaje}`} role="status">
                            {mensaje}
                        </p>
                    )}

                    <div className="apunte-form-botones">

                        <Link to="/verapuntes" className="apunte-btn-volver">
                            Volver a mis apuntes
                        </Link>

                        <button
                            type="submit"
                            className="apunte-btn-guardar"
                            disabled={guardando}
                        >
                            {guardando ? 'Guardando...' : 'Guardar apunte'}
                        </button>

                    </div>

                </form>

            </div>

        </div>
    )
}

export default CrearApunte