import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom'

import Register from './Register'
import Login from './Login'
import Perfil from './Perfil'
import Home from './Home'
import CrearApunte from './CrearApunte'
import Verapuntes from './Verapuntes'
import EditarApunte from './EditarApunte'
import { useAuth } from './AuthContext'
import Calendario from './Calendario'
import ApuntesPublicos from './ApuntesPublicos'
import VerApunte from './verApunte'


function RutaProtegida({ children, roles }) {
    const { usuario } = useAuth()

    if (!usuario) return <Navigate to="/login" replace />

    if (roles && !roles.includes(usuario.rol)) {
        return <Navigate to="/home" replace />
    }

    return children
}


function App() {
    const { usuario } = useAuth()

    return (
        <BrowserRouter>

            <header className="site-header">

                <Link className="header-home" to="/home">
                    Home
                </Link>

                {!usuario && (
                    <>
                        <Link className="header-iniciar-sesion" to="/login">
                            Iniciar sesión
                        </Link>

                        <Link className="header-registro" to="/register">
                            Registrarse
                        </Link>
                    </>
                )}

            </header>

            <main>

                <Routes>

                    <Route
                        path="/"
                        element={
                            <div>
                                <h1>Página Principal (Home)</h1>
                            </div>
                        }
                    />

                    <Route
                        path="/modificar"
                        element={
                            <div>
                                <h1>Modificar Usuario</h1>
                            </div>
                        }
                    />

                    <Route
                        path="/calendario"
                        element={
                            <RutaProtegida>
                                <Calendario />
                            </RutaProtegida>
                        }
                    />

                    <Route
                        path="/detalles"
                        element={
                            <div>
                                <h1>Detalles de Cuenta</h1>
                            </div>
                        }
                    />

                    {/* Registro e inicio de sesión */}

                    <Route path="/register" element={<Register />} />

                    <Route path="/login" element={<Login />} />

                    {/* Apuntes públicos */}

                    <Route
                        path="/apuntespublicos"
                        element={<ApuntesPublicos />}
                    />

                    <Route
                        path="/apuntespublicos/:id"
                        element={
                            <RutaProtegida>
                                <VerApunte />
                            </RutaProtegida>
                        }
                    />

                    {/* Perfil */}

                    <Route
                        path="/perfil"
                        element={
                            <RutaProtegida>
                                <Perfil />
                            </RutaProtegida>
                        }
                    />

                    {/* Crear apuntes */}

                    <Route
                        path="/apuntes/nuevo"
                        element={
                            <RutaProtegida>
                                <CrearApunte />
                            </RutaProtegida>
                        }
                    />

                    {/* Página principal */}

                    <Route
                        path="/home"
                        element={
                            <RutaProtegida>
                                <Home />
                            </RutaProtegida>
                        }
                    />

                    {/* Ver apuntes */}

                    <Route
                        path="/verapuntes"
                        element={
                            <RutaProtegida>
                                <Verapuntes />
                            </RutaProtegida>
                        }
                    />

                    {/* Modificar apuntes */}

                    <Route
                        path="/apuntes/:id/editar"
                        element={
                            <RutaProtegida>
                                <EditarApunte />
                            </RutaProtegida>
                        }
                    />

                    {/* Rutas inexistentes */}

                    <Route
                        path="*"
                        element={<Navigate to="/login" replace />}
                    />

                </Routes>

            </main>

            <br />
            <br />

            <footer className="site-footer">

                <p className="copyright">
                    © 2026. Todos los derechos reservados.
                </p>

                <p className="redes">
                    Nuestras redes sociales:
                </p>

                <p className="redes-sociales">
                    Youtube | Instagram | Tiktok
                </p>

                <p>
                    Contactanos:
                </p>

                <p className="contacto">
                    Telefono: 1112341234
                    <br />
                    Email: thiagocorti@gmail.com
                </p>

                <p className="ayuda">
                    Ayuda sobre el sitio
                </p>

            </footer>

        </BrowserRouter>
    )
}

export default App