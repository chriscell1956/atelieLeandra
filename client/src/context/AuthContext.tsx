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
    signup: (name: string, email: string, password: string, phone: string) => Promise<boolean | string>;
    logout: () => void;
    isLoading: boolean;
}

const ADMIN_EMAIL = 'leandraribeiro.lr.lr@gmail.com';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const formatUser = (sessionUser: any): User => ({
        id: sessionUser.id,
        email: sessionUser.email || '',
        name: sessionUser.user_metadata?.name || 'Usuário',
        role: sessionUser.email === ADMIN_EMAIL ? 'admin' : 'user'
    });

    // Check for existing session on mount
    React.useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session?.user) {
                setUser(formatUser(session.user));
            }
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            if (session?.user) {
                setUser(formatUser(session.user));
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

    const signup = async (name: string, email: string, password: string, phone: string) => {
        setIsLoading(true);
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: { name }
            }
        });

        if (error) {
            setIsLoading(false);
            return error.message;
        }

        if (data.user) {
            // Create public user profile
            const { error: profileError } = await supabase
                .from('users')
                .insert({
                    id: data.user.id,
                    email: email,
                    name: name,
                    phone: phone
                });

            if (profileError) console.error('Error creating profile:', profileError);
        }

        setIsLoading(false);
        return true;
    };

    const logout = async () => {
        await supabase.auth.signOut();
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, signup, logout, isLoading }}>
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
