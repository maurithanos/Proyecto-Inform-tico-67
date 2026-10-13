import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Register from './Register'
import Login from './Login'
import Perfil from './Perfil'


function RutaProtegida({ children }) {
    return localStorage.getItem('token') ? children : <Navigate to="/login" replace />
}

function App() {
    return (
        <BrowserRouter>
            <Routes>
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
        </BrowserRouter>
    )
}

export default App
