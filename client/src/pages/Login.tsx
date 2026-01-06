import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login, isLoading } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const success = await login(email, password);
        if (success === true) {
            navigate('/admin');
        } else {
            setError(typeof success === 'string' ? success : 'Credenciais inválidas');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-wood-800 to-wood-600 p-4">
            <div className="bg-wood-50 p-6 md:p-8 rounded-lg shadow-2xl w-full max-w-md border-2 border-wood-400">
                <h2 className="text-3xl font-bold text-wood-800 text-center mb-8">Painel Admin</h2>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-wood-700 font-bold mb-2" htmlFor="email">
                            E-mail
                        </label>
                        <input
                            type="text" // Using text to allow custom format if needed, but email is safer
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-3 py-2 border border-wood-300 rounded focus:outline-none focus:ring-2 focus:ring-wood-500 bg-wood-100"
                            placeholder="ex: Leandra@Painel.com"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-wood-700 font-bold mb-2" htmlFor="password">
                            Senha
                        </label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-3 py-2 border border-wood-300 rounded focus:outline-none focus:ring-2 focus:ring-wood-500 bg-wood-100"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-gradient-to-b from-wood-600 to-wood-700 text-white font-bold py-3 px-4 rounded hover:from-wood-700 hover:to-wood-800 transition duration-300 shadow-md uppercase tracking-wider"
                    >
                        {isLoading ? 'Entrando...' : 'Entrar'}
                    </button>
                </form>

                <div className="mt-6 text-center space-y-2">
                    <p className="text-sm">Não tem conta? <a href="/cadastro" className="text-wood-800 font-bold hover:underline">Cadastre-se</a></p>
                    <a href="/" className="text-wood-600 hover:underline text-sm font-semibold block">Voltar para o site</a>
                </div>
            </div>
        </div>
    );
};
