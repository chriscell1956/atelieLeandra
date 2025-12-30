import * as React from 'react';
import { createContext, useState, useContext } from 'react';
import { supabase } from '../lib/supabase';

interface User {
    id: string;
    email: string;
    name: string;
    role: 'admin' | 'user';
}

interface AuthContextType {
    user: User | null;
    login: (email: string, password: string) => Promise<boolean | string>;
    logout: () => void;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    // Check for existing session on mount
    React.useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session?.user) {
                setUser({
                    id: session.user.id,
                    email: session.user.email || '',
                    name: session.user.user_metadata?.name || 'Admin',
                    role: 'admin'
                });
            }
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            if (session?.user) {
                setUser({
                    id: session.user.id,
                    email: session.user.email || '',
                    name: session.user.user_metadata?.name || 'Admin',
                    role: 'admin'
                });
            } else {
                setUser(null);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    const login = async (email: string, password: string) => {
        setIsLoading(true);
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        setIsLoading(false);
        return error ? error.message : !!data.user;
    };

    const logout = async () => {
        await supabase.auth.signOut();
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
