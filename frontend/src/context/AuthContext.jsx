import { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import apiClient from '../services/apiClient';
import { io } from 'socket.io-client';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useLocalStorage('ProgressHub_user', null);
    const [appSettings, setAppSettings] = useState({ totalLectures: 200 });
    const [userProgress, setUserProgress] = useState({});
    const [isInitialLoad, setIsInitialLoad] = useState(true);
    const [socket, setSocket] = useState(null);

    const ADMIN_EMAIL = "admin@gmail.com";
    const ADMIN_PASSWORD = "Admin@06";

    // Initialize Socket.io
    useEffect(() => {
        const socketInstance = io(import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000');
        setSocket(socketInstance);
        return () => socketInstance.disconnect();
    }, []);

    // ⚡ PRE-FETCH EVERYTHING ON MOUNT (Unified Hack)
    const fetchEverything = async (userId) => {
        try {
            console.log("⚡ [FastLoad] Initiated...");
            // Use the same unified endpoint if already logged in
            const res = await apiClient.get('/settings'); // For settings
            setAppSettings(res.data);
            
            if (userId) {
                const progRes = await apiClient.get(`/progress/${userId}`);
                setUserProgress(progRes.data);
            }
            setIsInitialLoad(false);
        } catch (err) {
            console.error("Unified Fetch Failed:", err);
            setIsInitialLoad(false);
        }
    };

    useEffect(() => {
        if (user) {
            fetchEverything(user.id || user._id);
            if (socket && user.role !== 'admin') {
                socket.emit('join_dashboard', user.id || user._id);
            }
        } else {
            setIsInitialLoad(false);
        }
    }, [user, socket]);

    const login = async (email, password) => {
        if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
            const adminUser = { role: 'admin', email: ADMIN_EMAIL, name: 'Admin' };
            setUser(adminUser);
            return { success: true, role: 'admin' };
        }

        try {
            const res = await apiClient.post('/auth/login', { email, password });
            const { user: userData, progress, settings } = res.data;
            
            // 🔥 UNIFIED INSTANT LOAD: Set everything from one response
            setUser(userData);
            setUserProgress(progress || {});
            setAppSettings(settings || { totalLectures: 200 });
            
            return { success: true, role: userData.role };
        } catch (err) {
            return { success: false, message: err.response?.data?.message || 'Login failed' };
        }
    };

    const register = async (name, email, password) => {
        try {
            const res = await apiClient.post('/auth/register', { name, email, password });
            const { user: userData, progress, settings } = res.data;

            // 🔥 UNIFIED INSTANT LOAD
            setUser(userData);
            setUserProgress(progress || {});
            setAppSettings(settings || { totalLectures: 200 });

            return { success: true, role: 'user' };
        } catch (err) {
            return { success: false, message: err.response?.data?.message || 'Registration failed' };
        }
    };

    const logout = () => {
        setUser(null);
        setUserProgress({});
    };

    // Optimistic Update (< 0.1s UI Response)
    const updateProgress = async (lectureId, data) => {
        if (!user || user.role === 'admin') return;

        const original = { ...userProgress };
        const updated = { ...userProgress, [lectureId]: { ...userProgress[lectureId], ...data } };
        
        setUserProgress(updated); // ⚡ Instant Refresh

        try {
            await apiClient.post('/progress', {
                userId: user.id || user._id,
                lectureId,
                ...data
            });
        } catch (err) {
            console.error("Backround Sync failed:", err);
            setUserProgress(original);
        }
    };

    const getAllUsersData = async () => {
        try {
            const res = await apiClient.get('/admin/users');
            return res.data;
        } catch (err) { return []; }
    };

    const updateAppSettings = async (newSettings) => {
        try {
            const res = await apiClient.put('/settings', newSettings);
            setAppSettings(res.data);
        } catch (err) { console.error(err); }
    };

    const deleteUser = async (userId) => {
        try {
            await apiClient.delete(`/admin/users/${userId}`);
        } catch (err) { console.error(err); }
    }

    const contextValue = useMemo(() => ({
        user,
        login,
        register,
        logout,
        appSettings,
        userProgress,
        isInitialLoad,
        updateProgress,
        setAppSettings: updateAppSettings,
        getAllUsersData,
        deleteUser,
        socket
    }), [user, appSettings, userProgress, isInitialLoad, socket]);

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
