// src/AuthContext.js
import React, { createContext, useContext, useEffect, useState } from 'react';
import { account } from './appwrite'; // Import account from appwrite.js

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const login = async (email, password) => {
        try {
            await account.createEmailPasswordSession({ email, password });
            const user = await account.get();
            setCurrentUser(user);
        } catch (error) {
            console.error("Login error:", error);
            throw error;
        }
    };

    const logout = async () => {
        try {
            await account.deleteSession('current');
            setCurrentUser(null);
        } catch (error) {
            console.error("Logout error:", error);
            throw error;
        }
    };

    const getCurrentUser = async () => {
        try {
            const user = await account.get();
            setCurrentUser(user);
            setLoading(false);
        } catch (error) {
            setCurrentUser(null);
            setLoading(false);
        }
    };

    useEffect(() => {
        getCurrentUser();
    }, []);

    const value = {
        currentUser,
        login,
        logout,
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};