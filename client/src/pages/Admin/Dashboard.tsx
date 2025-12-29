import React, { useState } from 'react';
import { LayoutDashboard, Package, ShoppingCart, Users, Power, Settings } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

export const Dashboard: React.FC = () => {
    const { user, logout } = useAuth();
    const [activeTab, setActiveTab] = useState('overview');

    return (
        <div className="flex h-[calc(100vh-64px)] bg-wood-50">
            {/* Sidebar */}
            <aside className="w-64 bg-gradient-to-b from-wood-200 to-wood-300 border-r border-wood-400 hidden md:block">
                <ul className="p-4 space-y-2">
                    <li>
                        <button
                            onClick={() => setActiveTab('overview')}
                            className={`flex items-center space-x-3 w-full p-3 rounded transition-colors ${activeTab === 'overview' ? 'bg-wood-400 text-white shadow-inner' : 'text-wood-800 hover:bg-wood-400/20'}`}
                        >
                            <LayoutDashboard size={20} />
                            <span className="font-semibold">Visão Geral</span>
                        </button>
                    </li>
                    <li>
                        <Link
                            to="/admin/produtos"
                            onClick={() => setActiveTab('products')}
                            className={`flex items-center space-x-3 w-full p-3 rounded transition-colors ${activeTab === 'products' ? 'bg-wood-400 text-white shadow-inner' : 'text-wood-800 hover:bg-wood-400/20'}`}
                        >
                            <Package size={20} />
                            <span className="font-semibold">Produtos</span>
                        </Link>
                    </li>
                    <li>
                        <button className="flex items-center space-x-3 w-full p-3 rounded text-wood-800 hover:bg-wood-400/20 transition-colors">
                            <ShoppingCart size={20} />
                            <span className="font-semibold">Pedidos</span>
                        </button>
                    </li>
                    <li>
                        <button className="flex items-center space-x-3 w-full p-3 rounded text-wood-800 hover:bg-wood-400/20 transition-colors">
                            <Users size={20} />
                            <span className="font-semibold">Clientes</span>
                        </button>
                    </li>
                    <li>
                        <button className="flex items-center space-x-3 w-full p-3 rounded text-wood-800 hover:bg-wood-400/20 transition-colors">
                            <Settings size={20} />
                            <span className="font-semibold">Configurações</span>
                        </button>
                    </li>
                </ul>
                <div className="p-4 border-t border-wood-400 mt-auto">
                    <button onClick={logout} className="flex items-center space-x-3 text-red-700 hover:text-red-900 font-bold w-full p-2">
                        <Power size={20} />
                        <span>Sair</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8 overflow-y-auto">
                <header className="flex justify-between items-center mb-8 border-b border-wood-300 pb-4">
                    <div>
                        <h1 className="text-3xl font-bold text-wood-800">Painel de Controle</h1>
                        <p className="text-wood-600">Bem-vinda, {user?.name}!</p>
                    </div>
                </header>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-gradient-to-br from-wood-100 to-wood-200 p-6 rounded-lg shadow border border-wood-300">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-wood-700 font-bold uppercase text-sm tracking-wider">Vendas (Mês)</h3>
                            <div className="p-2 bg-wood-300 rounded-full text-white"><ShoppingCart size={20} /></div>
                        </div>
                        <p className="text-3xl font-bold text-wood-900">R$ 1.250,00</p>
                        <p className="text-sm text-green-700 mt-2 font-semibold">+12% vs mês anterior</p>
                    </div>

                    <div className="bg-gradient-to-br from-wood-100 to-wood-200 p-6 rounded-lg shadow border border-wood-300">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-wood-700 font-bold uppercase text-sm tracking-wider">Novos Pedidos</h3>
                            <div className="p-2 bg-wood-300 rounded-full text-white"><Package size={20} /></div>
                        </div>
                        <p className="text-3xl font-bold text-wood-900">12</p>
                        <p className="text-sm text-wood-600 mt-2">4 pendentes de envio</p>
                    </div>

                    <div className="bg-gradient-to-br from-wood-100 to-wood-200 p-6 rounded-lg shadow border border-wood-300">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-wood-700 font-bold uppercase text-sm tracking-wider">Produtos Ativos</h3>
                            <div className="p-2 bg-wood-300 rounded-full text-white"><LayoutDashboard size={20} /></div>
                        </div>
                        <p className="text-3xl font-bold text-wood-900">45</p>
                        <Link to="/admin/produtos/novo" className="text-sm text-wood-800 underline mt-2 block hover:text-gold-600">Adicionar novo</Link>
                    </div>
                </div>

                {/* Recent Activity / Content based on activeTab */}
                <div className="bg-white/50 border border-wood-300 rounded-lg p-6 shadow-sm">
                    <h2 className="text-xl font-bold text-wood-800 mb-4">Últimos Pedidos</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="border-b border-wood-300">
                                <tr>
                                    <th className="pb-3 font-bold text-wood-700">#ID</th>
                                    <th className="pb-3 font-bold text-wood-700">Cliente</th>
                                    <th className="pb-3 font-bold text-wood-700">Status</th>
                                    <th className="pb-3 font-bold text-wood-700">Total</th>
                                    <th className="pb-3 font-bold text-wood-700">Ações</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-wood-200">
                                <tr className="hover:bg-wood-100/50 transition-colors">
                                    <td className="py-3 font-mono text-sm">#1023</td>
                                    <td className="py-3">Maria Silva</td>
                                    <td className="py-3"><span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-bold uppercase">Pago</span></td>
                                    <td className="py-3 font-bold">R$ 150,00</td>
                                    <td className="py-3"><button className="text-wood-600 hover:text-wood-900 font-medium text-sm">Detalhes</button></td>
                                </tr>
                                <tr className="hover:bg-wood-100/50 transition-colors">
                                    <td className="py-3 font-mono text-sm">#1022</td>
                                    <td className="py-3">Ana Costa</td>
                                    <td className="py-3"><span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-bold uppercase">Pendente</span></td>
                                    <td className="py-3 font-bold">R$ 89,90</td>
                                    <td className="py-3"><button className="text-wood-600 hover:text-wood-900 font-medium text-sm">Detalhes</button></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Feedback Section */}
                <div className="mt-8 bg-white/50 border border-wood-300 rounded-lg p-6 shadow-sm">
                    <h2 className="text-xl font-bold text-wood-800 mb-4">Feedbacks Recentes & Cashback</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="border-b border-wood-300">
                                <tr>
                                    <th className="pb-3 font-bold text-wood-700">Cliente</th>
                                    <th className="pb-3 font-bold text-wood-700">Mensagem</th>
                                    <th className="pb-3 font-bold text-wood-700">Cashback Gerado</th>
                                    <th className="pb-3 font-bold text-wood-700">Ação</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-wood-200">
                                <tr className="hover:bg-wood-100/50 transition-colors">
                                    <td className="py-3">Joana Dark</td>
                                    <td className="py-3 italic text-gray-600">"Amei os produtos, acabamento impecável!"</td>
                                    <td className="py-3 font-bold text-green-700">R$ 5,00</td>
                                    <td className="py-3"><button className="text-blue-600 hover:underline text-sm font-semibold">Editar Valor</button></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    );
};
