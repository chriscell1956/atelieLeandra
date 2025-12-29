import * as React from 'react';
import { createContext, useState, useContext } from 'react';

interface User {
    id: number;
    email: string;
    name: string;
    role: 'admin' | 'user';
}

interface AuthContextType {
    user: User | null;
    login: (email: string, password: string) => Promise<boolean>;
    logout: () => void;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    // Mock login for now
    const login = async (email: string, password: string) => {
        setIsLoading(true);
        // Simulate API call
        return new Promise<boolean>((resolve) => {
            setTimeout(() => {
                if (email === 'Leandra@Painel.com' && password === 'Chris195608#') {
                    setUser({ id: 1, email, name: 'Leandra', role: 'admin' });
                    resolve(true);
                } else {
                    resolve(false);
                }
                setIsLoading(false);
            }, 1000);
        });
    };

    const logout = () => {
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
