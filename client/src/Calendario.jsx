import { useState, useEffect } from 'react'
import axios from 'axios'
import './calendario.css'

const DIAS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']

const aISO = (anio, mes, dia) =>
    `${anio}-${String(mes + 1).padStart(2, '0')}-${String(dia).padStart(2, '0')}`

function Calendario() {
    const hoy = new Date()
    const hoyISO = aISO(hoy.getFullYear(), hoy.getMonth(), hoy.getDate())

    const [mesActual, setMesActual] = useState(new Date(hoy.getFullYear(), hoy.getMonth(), 1))
    const [form, setForm] = useState({ titulo: '', descripcion: '', fecha: '' })
    const [eventos, setEventos] = useState([])
    const [mensaje, setMensaje] = useState('')

    const config = {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    }

    const cargarEventos = async () => {
        try {
            const { data } = await axios.get('http://localhost:3000/calendario', config)
            setEventos(data)
        } catch (err) {
            setMensaje(err.response?.data?.error || 'No se pudo conectar con el servidor')
        }
    }

    useEffect(() => {
        cargarEventos()
    }, [])

    const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value })

    const handleSubmit = async e => {
        e.preventDefault()
        setMensaje('')
        try {
            await axios.post('http://localhost:3000/calendario', form, config)
            setMensaje('Evento agregado')
            setForm({ titulo: '', descripcion: '', fecha: '' })
            cargarEventos()
        } catch (err) {
            setMensaje(err.response?.data?.error || 'No se pudo conectar con el servidor')
        }
    }

    const anio = mesActual.getFullYear()
    const mes = mesActual.getMonth()

    const cambiarMes = delta => setMesActual(new Date(anio, mes + delta, 1))

    const porFecha = {}
    eventos.forEach(ev => {
        if (!porFecha[ev.fecha]) porFecha[ev.fecha] = []
        porFecha[ev.fecha].push(ev)
    })

    const primerDia = (new Date(anio, mes, 1).getDay() + 6) % 7
    const diasMes = new Date(anio, mes + 1, 0).getDate()
    const celdas = []
    for (let i = 0; i < primerDia; i++) celdas.push(null)
    for (let d = 1; d <= diasMes; d++) celdas.push(d)
    while (celdas.length % 7 !== 0) celdas.push(null)
    const semanas = []
    for (let i = 0; i < celdas.length; i += 7) semanas.push(celdas.slice(i, i + 7))

    return (
        <div className="cal-pagina">
            <h2 className="cal-titulo">Calendario</h2>

            <form className="cal-form" onSubmit={handleSubmit}>
                <input name="titulo" placeholder="Título" value={form.titulo} onChange={handleChange} />
                <input name="descripcion" placeholder="Descripción" value={form.descripcion} onChange={handleChange} />
                <input name="fecha" type="date" value={form.fecha} onChange={handleChange} />
                <button type="submit">Agregar</button>
                <p className="cal-mensaje">{mensaje}</p>
            </form>

            <div className="cal-nav">
                <button type="button" onClick={() => cambiarMes(-1)}>‹</button>
                <span className="cal-mes">
                    {mesActual.toLocaleDateString('es-AR', { month: 'long', year: 'numeric' })}
                </span>
                <button type="button" onClick={() => cambiarMes(1)}>›</button>
            </div>

            <table className="cal-tabla">
                <thead>
                    <tr>
                        {DIAS.map(d => <th key={d}>{d}</th>)}
                    </tr>
                </thead>
                <tbody>
                    {semanas.map((semana, i) => (
                        <tr key={i}>
                            {semana.map((dia, j) => {
                                if (!dia) return <td key={j} className="cal-vacio" />
                                const iso = aISO(anio, mes, dia)
                                const lista = porFecha[iso] || []
                                const clases = [
                                    iso === hoyISO ? 'cal-hoy' : '',
                                    iso === form.fecha ? 'cal-seleccionado' : ''
                                ].join(' ')
                                return (
                                    <td key={j} className={clases} onClick={() => setForm({ ...form, fecha: iso })}>
                                        <span className="cal-num">{dia}</span>
                                        {lista.map(ev => (
                                            <div key={ev.id} className="cal-evento" title={ev.descripcion || ev.titulo}>
                                                {ev.titulo}
                                            </div>
                                        ))}
                                    </td>
                                )
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default Calendario