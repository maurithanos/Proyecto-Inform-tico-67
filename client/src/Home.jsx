import { Link, useNavigate } from 'react-router-dom'

function Home() {
    const navigate = useNavigate()

    const cerrarSesion = () => {
        localStorage.removeItem('token')
        navigate('/login')
    }

    return (
        <div>
            <h2>Inicio</h2>
            <nav>
                <ul>
                    <li><Link to="/perfil">Mi perfil</Link></li>
                    <li><Link to="/apuntes">Apuntes</Link></li>
                    <li><Link to="/calendario">Calendario</Link></li>
                </ul>
            </nav>
            <button onClick={cerrarSesion}>Cerrar sesión</button>
        </div>
    )
}

export default Home
