import React, { createContext, useState, useEffect, useContext } from 'react';
import {
    signInWithPopup,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    onAuthStateChanged
} from 'firebase/auth';
import { auth, googleProvider, facebookProvider } from '../firebase';
import api from '../services/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [backendUser, setBackendUser] = useState(null);

    // Función para cargar/refrescar los datos del usuario desde el backend
    const loadBackendUser = async (firebaseUser) => {
        if (!firebaseUser) {
            setBackendUser(null);
            return;
        }
        try {
            const token = await firebaseUser.getIdToken();
            const response = await api.post('/auth/verify', {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setBackendUser(response.data);
        } catch (error) {
            console.error('Error verificando usuario en backend:', error);
            setBackendUser(null);
        }
    };

    // Escuchar cambios de autenticación
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            setUser(firebaseUser);
            await loadBackendUser(firebaseUser);
            setLoading(false);
        });
        return unsubscribe;
    }, []);

    // Refrescar manualmente (útil después de registrar rol)
    const refreshBackendUser = async () => {
        if (user) {
            await loadBackendUser(user);
        }
    };

    const loginWithGoogle = async () => {
        const result = await signInWithPopup(auth, googleProvider);
        return result.user;
    };

    const loginWithFacebook = async () => {
        const result = await signInWithPopup(auth, facebookProvider);
        return result.user;
    };

    const loginWithEmail = async (email, password) => {
        const result = await signInWithEmailAndPassword(auth, email, password);
        return result.user;
    };

    const registerWithEmail = async (email, password) => {
        const result = await createUserWithEmailAndPassword(auth, email, password);
        return result.user;
    };

    const logout = async () => {
        await signOut(auth);
        setBackendUser(null);
    };

    // Helper para saber si el usuario necesita completar registro (no tiene rol)
    const needsRegistration = backendUser?.necesitaRegistro === true || !backendUser?.tipoUsuario;

    const value = {
        user,
        backendUser,
        loading,
        needsRegistration,
        loginWithGoogle,
        loginWithFacebook,
        loginWithEmail,
        registerWithEmail,
        logout,
        refreshBackendUser,   // <-- importante para actualizar después de asignar rol
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};