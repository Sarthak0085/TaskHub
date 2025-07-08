import type { User } from '@/types';
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { queryClient } from './react-query-provider';
import { useLocation, useNavigate } from 'react-router-dom';
import { publicRoutes } from '@/lib';

interface AuthContextType {
    user: User | null;
    setUser: (user: User | null) => void;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (data: any) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();
    const currentPath = useLocation().pathname;
    const isPublicRoute = publicRoutes.includes(currentPath);

    useEffect(() => {
        const checkAuth = async () => {
            setIsLoading(true);
            try {
                const storedUser = localStorage.getItem('user');

                if (storedUser) {
                    setUser(JSON.parse(storedUser));
                    setIsAuthenticated(true);
                } else {
                    setUser(null);
                    setIsAuthenticated(false);
                    if (!isPublicRoute) {
                        navigate('/auth/sign-in');
                    }
                }
            } catch (error) {
                console.error('Auth check failed:', error);
            } finally {
                setIsLoading(false);
            }
        };

        checkAuth();
    }, []);

    useEffect(() => {
        const handleLogout = () => {
            logout();
            navigate('/auth/sign-in');
        };

        window.addEventListener('force-logout', handleLogout);
        return () => window.removeEventListener('force-logout', handleLogout);
    }, []);

    const login = async (data: any) => {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));

        setUser(data.user);
        setIsAuthenticated(true);
    };

    const logout = async () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');

        setUser(null);
        setIsAuthenticated(false);
        queryClient.clear();
    };

    const values = {
        user,
        setUser,
        isAuthenticated,
        isLoading,
        login,
        logout,
    };

    return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error('Use Auth must be use within the Auth Provider');
    }

    return context;
};
