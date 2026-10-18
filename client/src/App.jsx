import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom'
import Register from './Register'
import Login from './Login'
import Perfil from './Perfil'

function RutaProtegida({ children }) {
    return localStorage.getItem('token') ? children : <Navigate to="/login" replace />
}

function App() {
    return (
        <BrowserRouter>
            <header className="site-header">
                <Link className='header-home' to="/">Home</Link>
                <Link className='header-iniciar-sesion' to="/login">Iniciar sesion</Link>
                <Link className='header-registro' to="/register">Registrarse</Link>
                <Link className='header-modificar' to="/modificar">Modificar usuario</Link>
                <Link className='header-detalles' to="/detalles">Detalles de cuenta</Link> 
            </header>

            <main>
                <Routes>
                    {/* Rutas añadidas para que los enlaces del header funcionen */}
                    <Route path="/" element={<div><h1>Página Principal (Home)</h1></div>} />
                    <Route path="/modificar" element={<div><h1>Modificar Usuario</h1></div>} />
                    <Route path="/detalles" element={<div><h1>Detalles de Cuenta</h1></div>} />
                    
                    {/* Rutas existentes */}
                    <Route path="/register" element={<Register />} />
                    <Route path="/login" element={<Login />} />
                    <Route
                        path="/perfil"
                        element={
                            <RutaProtegida>
                                <Perfil />
                            </RutaProtegida>
                        }
                    />
                    <Route path="*" element={<Navigate to="/login" replace />} />
                </Routes>
            </main>

            <br />
            <br />
            <footer className="site-footer">
            <p className='copyright'>© 2026. Todos los derechos reservados.</p>
            <p className='redes'>Nuestras redes sociales:</p>
            <p className='redes-sociales'>Youtube | Instagram | Tiktok</p>
            <p>Contactanos:</p>
            <p className='contacto'>Telefono: 1112341234<br/>Email: thiagocorti@gmail.com</p>
            <p className='ayuda'>Ayuda sobre el sitio</p>
            </footer>
        </BrowserRouter>
    )
}

export default App