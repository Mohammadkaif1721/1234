import { createContext, useState, useEffect } from 'react';
import api from '../utils/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        try {
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                setUser(JSON.parse(storedUser));
            }
        } catch (err) {
            console.error("User parse error:", err);
            localStorage.removeItem('user');
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            const response = await api.post('/auth/login', { email, password });

            if (response?.data) {
                localStorage.setItem('user', JSON.stringify(response.data));
                setUser(response.data);
            }

            return response?.data || null;
        } catch (err) {
            console.error("Login failed:", err);
            return null;
        }
    };

    const signup = async (name, email, password) => {
        try {
            const response = await api.post('/auth/signup', { name, email, password });

            if (response?.data) {
                localStorage.setItem('user', JSON.stringify(response.data));
                setUser(response.data);
            }

            return response?.data || null;
        } catch (err) {
            console.error("Signup failed:", err);
            return null;
        }
    };

    const logout = () => {
        try {
            localStorage.removeItem('user');
        } catch (err) {
            console.error("Logout storage error:", err);
        }
        setUser(null);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                login,
                signup,
                logout,
                loading
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
