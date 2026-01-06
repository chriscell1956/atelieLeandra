import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export const Signup: React.FC = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { signup, isLoading } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        const success = await signup(name, email, password, phone);
        if (success === true) {
            alert('Cadastro realizado com sucesso! Bem-vindo(a).');
            navigate('/');
        } else {
            setError(typeof success === 'string' ? success : 'Erro ao criar conta');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <div className="bg-white p-6 md:p-8 rounded-lg shadow-2xl w-full max-w-md border border-wood-200">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-wood-900 font-serif">Criar Conta</h2>
                    <p className="text-wood-600 mt-2">Junte-se ao Ateliê Leandra</p>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded mb-6 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-wood-800 font-bold mb-1 text-sm">Nome Completo</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-wood-500 focus:border-wood-500 outline-none transition"
                            placeholder="Seu nome"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-wood-800 font-bold mb-1 text-sm">WhatsApp / Telefone</label>
                        <input
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-wood-500 focus:border-wood-500 outline-none transition"
                            placeholder="(11) 99999-9999"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-wood-800 font-bold mb-1 text-sm">E-mail</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-wood-500 focus:border-wood-500 outline-none transition"
                            placeholder="seu@email.com"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-wood-800 font-bold mb-1 text-sm">Senha</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-wood-500 focus:border-wood-500 outline-none transition"
                            placeholder="Mínimo 6 caracteres"
                            minLength={6}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-wood-800 text-gold-400 font-bold py-3 px-4 rounded-lg hover:bg-wood-900 transition duration-300 shadow-md transform active:scale-95"
                    >
                        {isLoading ? 'Criando conta...' : 'CADASTRAR'}
                    </button>
                </form>

                <div className="mt-6 text-center text-sm text-gray-600">
                    Já tem uma conta? <a href="/login" className="text-wood-800 font-bold hover:underline">Fazer Login</a>
                </div>
            </div>
        </div>
    );
};
