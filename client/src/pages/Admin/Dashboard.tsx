import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Package, ShoppingCart, Users, Power, ArrowLeft, Image as ImageIcon, X, Plus, BarChart2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useSiteContent } from '../../context/SiteContentContext';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';

export const Dashboard: React.FC = () => {
    const { user, logout } = useAuth();
    const { slides, updateSlide, addSlide, removeSlide } = useSiteContent();
    const [activeTab, setActiveTab] = useState('overview');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="flex h-[calc(100vh-80px)] relative">
            {/* Mobile Sidebar Toggle - Adjusted to be visible below fixed navbar if needed */}
            <button
                className="md:hidden fixed top-24 left-4 z-30 bg-gold-500 text-wood-900 p-3 rounded-full shadow-2xl border-2 border-wood-800"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
                {isSidebarOpen ? <ArrowLeft size={24} /> : <LayoutDashboard size={24} />}
            </button>

            {/* Sidebar */}
            <aside className={`
                w-64 bg-wood-800 text-wood-100 flex-col
                fixed md:relative z-40 h-full transition-transform duration-300 ease-in-out
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
                shadow-2xl md:shadow-none
            `}>
                <div className="p-6 border-b border-wood-700 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-gold-500">Administração</h2>
                    <button onClick={() => setIsSidebarOpen(false)} className="md:hidden text-gray-400 hover:text-white">
                        <X size={24} />
                    </button>
                </div>
                <nav className="flex-1 p-4 space-y-2">
                    <button
                        onClick={() => { setActiveTab('overview'); setIsSidebarOpen(false); }}
                        className={`flex items-center space-x-3 w-full p-3 rounded transition-colors ${activeTab === 'overview' ? 'bg-wood-700 text-gold-400' : 'hover:bg-wood-700/50'}`}
                    >
                        <LayoutDashboard size={20} />
                        <span>Visão Geral</span>
                    </button>
                    <Link
                        to="/admin/produtos"
                        onClick={() => setIsSidebarOpen(false)}
                        className={`flex items-center space-x-3 w-full p-3 rounded transition-colors hover:bg-wood-700/50`}
                    >
                        <Package size={20} />
                        <span>Produtos</span>
                    </Link>
                    <button
                        onClick={() => setActiveTab('carousel')}
                        className={`flex items-center space-x-3 w-full p-3 rounded transition-colors ${activeTab === 'carousel' ? 'bg-wood-700 text-gold-400' : 'hover:bg-wood-700/50'}`}
                    >
                        <ImageIcon size={20} />
                        <span>Destaques (Carrossel)</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('clients')}
                        className={`flex items-center space-x-3 w-full p-3 rounded transition-colors ${activeTab === 'clients' ? 'bg-wood-700 text-gold-400' : 'hover:bg-wood-700/50'}`}
                    >
                        <Users size={20} />
                        <span>Clientes</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('analytics')}
                        className={`flex items-center space-x-3 w-full p-3 rounded transition-colors ${activeTab === 'analytics' ? 'bg-wood-700 text-gold-400' : 'hover:bg-wood-700/50'}`}
                    >
                        <BarChart2 size={20} />
                        <span>Relatórios e Visitas</span>
                    </button>
                    <button className="flex items-center space-x-3 w-full p-3 rounded transition-colors hover:bg-wood-700/50 opacity-50 cursor-not-allowed">
                        <ShoppingCart size={20} />
                        <span>Pedidos (Em breve)</span>
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
                            {activeTab === 'overview' ? 'Visão Geral' : activeTab === 'clients' ? 'Gerenciar Clientes' : 'Gerenciar Destaques'}
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

                {activeTab === 'clients' && <ClientsView />}

                {activeTab === 'carousel' && (
                    <div className="space-y-6">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-yellow-50 border-l-4 border-gold-500 p-4 rounded shadow-sm gap-4">
                            <p className="text-wood-800 font-medium">Aqui você pode gerenciar as imagens e textos que aparecem no topo do site.</p>
                            <button
                                onClick={() => addSlide({
                                    title: 'Novo Título',
                                    subtitle: 'Subtítulo aqui',
                                    image: 'https://via.placeholder.com/1200x400',
                                    button_text: 'Ver Mais',
                                    link: '/produtos'
                                })}
                                className="bg-wood-800 text-gold-400 px-6 py-3 rounded-lg font-bold hover:bg-wood-900 transition flex items-center justify-center space-x-2 w-full sm:w-auto shadow-md"
                            >
                                <Plus size={24} />
                                <span>Adicionar Slide</span>
                            </button>
                        </div>

                        <div className="grid grid-cols-1 gap-6">
                            {slides.map((slide, index) => (
                                <CarouselSlideItem
                                    key={slide.id}
                                    slide={slide}
                                    index={index}
                                    onUpdate={updateSlide}
                                    onRemove={removeSlide}
                                />
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'analytics' && <AnalyticsView />}
            </main>
        </div>
    );
};

const ClientsView = () => {
    const [clients, setClients] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchClients();
    }, []);

    const fetchClients = async () => {
        setIsLoading(true);
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .order('created_at', { ascending: false });

        if (!error && data) {
            setClients(data);
        }
        setIsLoading(false);
    };

    return (
        <div className="bg-white border border-wood-200 rounded-lg shadow-sm overflow-hidden">
            <div className="p-4 border-b border-wood-100 flex justify-between items-center">
                <h3 className="font-bold text-wood-700">Lista de Clientes Cadastrados</h3>
                <span className="bg-wood-100 text-wood-800 px-3 py-1 rounded-full text-sm font-bold">{clients.length} Total</span>
            </div>
            <table className="w-full text-left">
                <thead className="bg-wood-100 border-b border-wood-200">
                    <tr>
                        <th className="p-4 font-bold text-wood-800">Nome</th>
                        <th className="p-4 font-bold text-wood-800">Email</th>
                        <th className="p-4 font-bold text-wood-800">Data Cadastro</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-wood-100">
                    {isLoading ? (
                        <tr><td colSpan={3} className="p-6 text-center text-gray-500">Carregando clientes...</td></tr>
                    ) : clients.length === 0 ? (
                        <tr><td colSpan={3} className="p-6 text-center text-gray-500">Nenhum cliente cadastrado ainda.</td></tr>
                    ) : (
                        clients.map(client => (
                            <tr key={client.id} className="hover:bg-gray-50">
                                <td className="p-4 font-medium text-wood-900">{client.name || 'Sem nome'}</td>
                                <td className="p-4 text-gray-600">{client.email}</td>
                                <td className="p-4 text-gray-600">{new Date(client.created_at).toLocaleDateString('pt-BR')}</td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};

const AnalyticsView = () => {
    const [logs, setLogs] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchLogs();
    }, []);

    const fetchLogs = async () => {
        setIsLoading(true);
        const { data, error } = await supabase
            .from('access_logs')
            .select('*')
            .order('visited_at', { ascending: false })
            .limit(50);

        if (!error && data) {
            setLogs(data);
        }
        setIsLoading(false);
    };

    return (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow border border-wood-200">
                <h3 className="text-xl font-bold text-wood-800 mb-4 flex items-center gap-2">
                    <BarChart2 className="text-gold-500" />
                    Últimas Visitas aos Produtos
                </h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-wood-100 border-b border-wood-200">
                            <tr>
                                <th className="p-3 font-bold text-wood-700">Produto</th>
                                <th className="p-3 font-bold text-wood-700">Data/Hora</th>
                                <th className="p-3 font-bold text-wood-700">Visitante</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-wood-100">
                            {isLoading ? (
                                <tr><td colSpan={3} className="p-4 text-center">Carregando dados...</td></tr>
                            ) : logs.length === 0 ? (
                                <tr><td colSpan={3} className="p-4 text-center text-gray-500">Nenhuma visita registrada ainda.</td></tr>
                            ) : (
                                logs.map(log => (
                                    <tr key={log.id} className="hover:bg-gray-50">
                                        <td className="p-3 font-medium text-wood-900">{log.product_name || 'Produto Removido'}</td>
                                        <td className="p-3 text-gray-600">{new Date(log.visited_at).toLocaleString('pt-BR')}</td>
                                        <td className="p-3 text-gray-500 text-sm">
                                            {log.user_email ? <span className="text-blue-600">{log.user_email}</span> : 'Anônimo'}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

// New Component for Slide Item to manage local state
const CarouselSlideItem: React.FC<{
    slide: any,
    index: number,
    onUpdate: (id: number, data: any) => Promise<void>,
    onRemove: (id: number) => Promise<void>
}> = ({ slide, index, onUpdate, onRemove }) => {
    const [localData, setLocalData] = useState(slide);
    const [isSaving, setIsSaving] = useState(false);
    const [hasChanges, setHasChanges] = useState(false);

    useEffect(() => {
        setLocalData(slide);
        setHasChanges(false);
    }, [slide]);

    const handleChange = (field: string, value: string) => {
        setLocalData((prev: any) => ({ ...prev, [field]: value }));
        setHasChanges(true);
    };

    const handleSave = async () => {
        setIsSaving(true);
        await onUpdate(slide.id, {
            title: localData.title,
            subtitle: localData.subtitle,
            button_text: localData.button_text,
            link: localData.link,
            image: localData.image
        });
        setIsSaving(false);
        setHasChanges(false);
    };

    return (
        <div className="bg-white rounded-lg shadow border border-wood-200 overflow-hidden flex flex-col md:flex-row relative group">
            <button
                onClick={() => {
                    if (window.confirm('Excluir este slide?')) {
                        onRemove(slide.id);
                    }
                }}
                className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition shadow-lg z-10"
                title="Remover Slide"
            >
                <Power size={16} />
            </button>

            <div className="w-full md:w-1/3 h-48 md:h-auto relative bg-gray-100">
                <img src={localData.image} alt={localData.title} className="w-full h-full object-cover" />
                <div className="absolute top-2 left-2 bg-black/50 text-white px-2 py-1 rounded text-xs font-bold">Slide {index + 1}</div>
            </div>
            <div className="p-6 flex-1 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-bold text-wood-700 mb-1">Título Principal</label>
                        <input
                            type="text"
                            value={localData.title}
                            onChange={(e) => handleChange('title', e.target.value)}
                            className="w-full border border-wood-300 rounded p-2 text-wood-900 font-serif"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-wood-700 mb-1">Texto do Botão</label>
                        <input
                            type="text"
                            value={localData.button_text}
                            onChange={(e) => handleChange('button_text', e.target.value)}
                            className="w-full border border-wood-300 rounded p-2 text-wood-900"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-bold text-wood-700 mb-1">Subtítulo</label>
                        <input
                            type="text"
                            value={localData.subtitle}
                            onChange={(e) => handleChange('subtitle', e.target.value)}
                            className="w-full border border-wood-300 rounded p-2 text-wood-900"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-wood-700 mb-1">Link (URL)</label>
                        <input
                            type="text"
                            value={localData.link || ''}
                            onChange={(e) => handleChange('link', e.target.value)}
                            placeholder="/produtos"
                            className="w-full border border-wood-300 rounded p-2 text-wood-900"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-bold text-wood-700 mb-1">Imagem do Banner</label>
                    <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
                        <div className="w-full h-32 md:w-48 bg-gray-100 rounded border border-gray-300 flex items-center justify-center overflow-hidden relative">
                            {localData.image ? (
                                <img src={localData.image} alt="Preview" className="w-full h-full object-cover" />
                            ) : (
                                <ImageIcon className="text-gray-400" size={32} />
                            )}
                        </div>
                        <div className="flex-1 w-full">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                        const reader = new FileReader();
                                        reader.onloadend = () => {
                                            handleChange('image', reader.result as string);
                                        };
                                        reader.readAsDataURL(file);
                                    }
                                }}
                                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-wood-100 file:text-wood-700 hover:file:bg-wood-200 cursor-pointer"
                            />
                            <p className="text-xs text-gray-500 mt-2">Recomendado: Imagens horizontais de alta qualidade.</p>
                        </div>
                    </div>
                </div>

                <div className="pt-4 flex justify-end">
                    <button
                        onClick={handleSave}
                        disabled={!hasChanges || isSaving}
                        className={`
                            px-6 py-2 rounded-lg font-bold transition flex items-center space-x-2
                            ${hasChanges
                                ? 'bg-gold-500 text-wood-900 shadow-md hover:bg-gold-600'
                                : 'bg-gray-200 text-gray-400 cursor-not-allowed'}
                        `}
                    >
                        {isSaving ? 'Salvando...' : 'Salvar Alterações'}
                    </button>
                </div>
            </div>
        </div>
    );
};
