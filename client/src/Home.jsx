import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from './AuthContext'
import './home.css'

const OPCIONES = [
    { to: '/perfil', icono: '👤', titulo: 'Mi perfil', texto: 'Mirá y modificá tus datos' },
    { to: '/verapuntes', icono: '📚', titulo: 'Mis apuntes', texto: 'Los apuntes que creaste' },
    { to: '/apuntes/nuevo', icono: '➕', titulo: 'Crear apunte', texto: 'Cargá un apunte nuevo' },
    { to: '/apuntespublicos', icono: '🌐', titulo: 'Apuntes de la comunidad', texto: 'Mirá y calificá apuntes públicos' },
    { to: '/calendario', icono: '📅', titulo: 'Calendario', texto: 'Tus fechas importantes' },
]

function Home() {
    const { usuario, logout } = useAuth()
    const navigate = useNavigate()

    const cerrarSesion = () => {
        logout()
        navigate('/login')
    }

    return (
        <div className="home-pagina">
            <div className="home-encabezado">
                <h2 className="home-titulo">Inicio</h2>
                {usuario?.name && <p className="home-saludo">¡Hola, {usuario.name}!</p>}
            </div>

            <nav className="home-grilla">
                {OPCIONES.map(op => (
                    <Link key={op.to} to={op.to} className="home-tarjeta">
                        <span className="home-icono">{op.icono}</span>
                        <span className="home-tarjeta-titulo">{op.titulo}</span>
                        <span className="home-tarjeta-texto">{op.texto}</span>
                    </Link>
                ))}
            </nav>

            <button type="button" className="home-salir" onClick={cerrarSesion}>
                Cerrar sesión
            </button>
        </div>
    )
}

export default Home