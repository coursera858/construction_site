import { createContext, useContext, useState } from "react";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => { 
    const [token, setTokenState] = useState(localStorage.getItem("token") || null)

    const setToken = (newToken) => {
        localStorage.setItem("token", newToken)
        setTokenState(newToken)
    }

    const getToken = () => {
        return localStorage.getItem("token")
    }

    const removeToken = () => {
        localStorage.removeItem("token")
        setTokenState(null)
    }

    return (
        <AuthContext.Provider value={{ token, setToken, getToken, removeToken }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error("useAuth must be used inside AuthProvider")
    }
    return context
}

export default AuthProvider