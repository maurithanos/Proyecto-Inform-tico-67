import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
    const [usuario, setUsuario] = useState(() => {
        const guardado = localStorage.getItem('usuario')
        return guardado ? JSON.parse(guardado) : null
    })

    const login = ({ token, usuario }) => {
        localStorage.setItem('token', token)
        localStorage.setItem('usuario', JSON.stringify(usuario))
        setUsuario(usuario)
    }

    const logout = () => {
        localStorage.removeItem('token')
        localStorage.removeItem('usuario')
        setUsuario(null)
    }

    const puede = (permiso) => usuario?.permisos?.includes(permiso) ?? false

    return (
        <AuthContext.Provider value={{ usuario, login, logout, puede }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)