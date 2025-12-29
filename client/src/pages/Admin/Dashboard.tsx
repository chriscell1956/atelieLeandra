import React, { useState } from 'react';
import { LayoutDashboard, Package, ShoppingCart, Users, Power, Settings, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

export const Dashboard: React.FC = () => {
    const { user, logout } = useAuth();
    const [activeTab, setActiveTab] = useState('overview');

    return (
        <div className="flex h-[calc(100vh-64px)] bg-wood-50">
            {/* Sidebar */}
            <aside className="w-64 bg-wood-800 text-wood-100 hidden md:flex flex-col">
                <div className="p-6 border-b border-wood-700">
                    <h2 className="text-xl font-bold text-gold-500">Administração</h2>
                </div>
                <nav className="flex-1 p-4 space-y-2">
                    <button
                        onClick={() => setActiveTab('overview')}
                        className={`flex items-center space-x-3 w-full p-3 rounded transition-colors ${activeTab === 'overview' ? 'bg-wood-700 text-gold-400' : 'hover:bg-wood-700/50'}`}
                    >
                        <LayoutDashboard size={20} />
                        <span>Visão Geral</span>
                    </button>
                    <Link
                        to="/admin/produtos"
                        className={`flex items-center space-x-3 w-full p-3 rounded transition-colors hover:bg-wood-700/50`}
                    >
                        <Package size={20} />
                        <span>Produtos</span>
                    </Link>
                    <button
                        onClick={() => setActiveTab('clients')}
                        className={`flex items-center space-x-3 w-full p-3 rounded transition-colors ${activeTab === 'clients' ? 'bg-wood-700 text-gold-400' : 'hover:bg-wood-700/50'}`}
                    >
                        <Users size={20} />
                        <span>Clientes</span>
                    </button>
                    <button className="flex items-center space-x-3 w-full p-3 rounded transition-colors hover:bg-wood-700/50 opacity-50 cursor-not-allowed">
                        <ShoppingCart size={20} />
                        <span>Pedidos (Em breve)</span>
                    </button>
                    <button className="flex items-center space-x-3 w-full p-3 rounded transition-colors hover:bg-wood-700/50 opacity-50 cursor-not-allowed">
                        <Settings size={20} />
                        <span>Configurações</span>
                    </button>
                </nav>
                <div className="p-4 border-t border-wood-700">
                    <Link to="/" className="flex items-center space-x-3 text-wood-300 hover:text-white mb-4 transition-colors">
                        <ArrowLeft size={20} />
                        <span>Voltar ao Site</span>
                    </Link>
                    <button onClick={logout} className="flex items-center space-x-3 text-red-400 hover:text-red-300 transition-colors w-full">
                        <Power size={20} />
                        <span>Sair</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8 overflow-y-auto bg-wood-50">
                <header className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-wood-900">
                            {activeTab === 'overview' ? 'Visão Geral' : 'Gerenciar Clientes'}
                        </h1>
                        <p className="text-wood-600">Bem-vinda, {user?.name}!</p>
                    </div>
                </header>

                {activeTab === 'overview' && (
                    <>
                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            <div className="bg-white p-6 rounded-lg shadow border border-wood-200">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-wood-600 font-bold uppercase text-sm tracking-wider">Vendas (Mês)</h3>
                                    <div className="p-2 bg-green-100 text-green-600 rounded-full"><ShoppingCart size={20} /></div>
                                </div>
                                <p className="text-3xl font-bold text-wood-900">R$ 1.250,00</p>
                                <p className="text-sm text-green-600 mt-2 font-semibold">+12% vs mês anterior</p>
                            </div>

                            <div className="bg-white p-6 rounded-lg shadow border border-wood-200">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-wood-600 font-bold uppercase text-sm tracking-wider">Produtos</h3>
                                    <div className="p-2 bg-blue-100 text-blue-600 rounded-full"><Package size={20} /></div>
                                </div>
                                <p className="text-3xl font-bold text-wood-900">45</p>
                                <Link to="/admin/produtos" className="text-sm text-blue-600 hover:underline mt-2 inline-block">Gerenciar produtos</Link>
                            </div>

                            <div className="bg-white p-6 rounded-lg shadow border border-wood-200">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-wood-600 font-bold uppercase text-sm tracking-wider">Clientes</h3>
                                    <div className="p-2 bg-orange-100 text-orange-600 rounded-full"><Users size={20} /></div>
                                </div>
                                <p className="text-3xl font-bold text-wood-900">128</p>
                                <button onClick={() => setActiveTab('clients')} className="text-sm text-orange-600 hover:underline mt-2">Ver lista</button>
                            </div>
                        </div>

                        {/* Feedback Section */}
                        <div className="bg-white border border-wood-200 rounded-lg p-6 shadow-sm">
                            <h2 className="text-xl font-bold text-wood-800 mb-4">Feedbacks Recentes</h2>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="border-b border-wood-200 bg-wood-50">
                                        <tr>
                                            <th className="p-3 font-bold text-wood-700">Cliente</th>
                                            <th className="p-3 font-bold text-wood-700">Mensagem</th>
                                            <th className="p-3 font-bold text-wood-700">Avaliação</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-wood-100">
                                        <tr>
                                            <td className="p-3">Joana Dark</td>
                                            <td className="p-3 italic text-gray-600">"Amei os produtos, acabamento impecável!"</td>
                                            <td className="p-3 text-gold-500">★★★★★</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </>
                )}

                {activeTab === 'clients' && (
                    <div className="bg-white border border-wood-200 rounded-lg shadow-sm overflow-hidden">
                        <table className="w-full text-left">
                            <thead className="bg-wood-100 border-b border-wood-200">
                                <tr>
                                    <th className="p-4 font-bold text-wood-800">Nome</th>
                                    <th className="p-4 font-bold text-wood-800">Email</th>
                                    <th className="p-4 font-bold text-wood-800">Data Cadastro</th>
                                    <th className="p-4 font-bold text-wood-800">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-wood-100">
                                <tr className="hover:bg-gray-50">
                                    <td className="p-4 font-medium">Maria Oliveira</td>
                                    <td className="p-4 text-gray-600">maria@email.com</td>
                                    <td className="p-4 text-gray-600">12/01/2024</td>
                                    <td className="p-4"><span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-bold">Ativo</span></td>
                                </tr>
                                <tr className="hover:bg-gray-50">
                                    <td className="p-4 font-medium">João Silva</td>
                                    <td className="p-4 text-gray-600">joao@email.com</td>
                                    <td className="p-4 text-gray-600">10/01/2024</td>
                                    <td className="p-4"><span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-bold">Ativo</span></td>
                                </tr>
                                <tr className="hover:bg-gray-50">
                                    <td className="p-4 font-medium">Ana Souza</td>
                                    <td className="p-4 text-gray-600">ana.souza@email.com</td>
                                    <td className="p-4 text-gray-600">05/01/2024</td>
                                    <td className="p-4"><span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full font-bold">Inativo</span></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                )}
            </main>
        </div>
    );
};
