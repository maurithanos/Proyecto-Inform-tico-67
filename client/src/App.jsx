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

                    {/* Página inicial */}

                    <Route
                        path="/"
                        element={
                            <Navigate
                                to={usuario ? '/home' : '/login'}
                                replace
                            />
                        }
                    />

                    {/* Rutas antiguas que ahora utilizan el perfil */}

                    <Route
                        path="/modificar"
                        element={
                            <RutaProtegida>
                                <Navigate to="/perfil" replace />
                            </RutaProtegida>
                        }
                    />

                    <Route
                        path="/detalles"
                        element={
                            <RutaProtegida>
                                <Navigate to="/perfil" replace />
                            </RutaProtegida>
                        }
                    />

                    {/* Login y registro */}

                    <Route path="/login" element={<Login />} />

                    <Route path="/register" element={<Register />} />

                    {/* Página principal */}

                    <Route
                        path="/home"
                        element={
                            <RutaProtegida>
                                <Home />
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

                    {/* Calendario */}

                    <Route
                        path="/calendario"
                        element={
                            <RutaProtegida>
                                <Calendario />
                            </RutaProtegida>
                        }
                    />

                    {/* Apuntes privados */}

                    <Route
                        path="/verapuntes"
                        element={
                            <RutaProtegida>
                                <Verapuntes />
                            </RutaProtegida>
                        }
                    />

                    <Route
                        path="/apuntes/nuevo"
                        element={
                            <RutaProtegida>
                                <CrearApunte />
                            </RutaProtegida>
                        }
                    />

                    <Route
                        path="/apuntes/:id/editar"
                        element={
                            <RutaProtegida>
                                <EditarApunte />
                            </RutaProtegida>
                        }
                    />

                    {/* Comunidad */}

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

                    {/* Página inexistente */}

                    <Route
                        path="*"
                        element={<Navigate to="/" replace />}
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