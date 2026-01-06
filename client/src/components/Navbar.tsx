import * as React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Menu, X, User, Instagram } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export const Navbar: React.FC = () => {
    const [isOpen, setIsOpen] = React.useState(false);
    const { items } = useCart();
    const { user, logout } = useAuth();

    const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);

    return (
        <nav className="bg-wood-800 text-wood-50 shadow-lg sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    <div className="flex items-center">
                        <Link to="/" className="flex items-center space-x-3">
                            <img
                                src="/logo.png"
                                alt="Ateliê Leandra"
                                className="h-12 w-auto object-contain bg-white/10 rounded p-1"
                            />
                            <span className="font-bold text-2xl tracking-wider text-gold-500 font-serif italic">
                                Ateliê Leandra
                            </span>
                        </Link>
                    </div>
                    <div className="hidden md:block">
                        <div className="ml-10 flex items-center space-x-4">
                            <Link to="/" className="hover:bg-wood-700 px-3 py-2 rounded-md text-sm font-medium transition-colors">Início</Link>
                            <Link to="/produtos" className="hover:bg-wood-700 px-3 py-2 rounded-md text-sm font-medium transition-colors">Produtos</Link>
                            <Link to="/sobre" className="hover:bg-wood-700 px-3 py-2 rounded-md text-sm font-medium transition-colors">Sobre</Link>
                            <Link to="/contato" className="hover:bg-wood-700 px-3 py-2 rounded-md text-sm font-medium transition-colors">Contato</Link>

                            {/* Conditional Admin Link */}
                            {user && user.role === 'admin' ? (
                                <Link to="/admin" className="bg-gold-500/10 border border-gold-500/50 hover:bg-gold-500/20 px-3 py-2 rounded-md text-sm font-medium transition-colors text-gold-400">Admin</Link>
                            ) : null}
                        </div>
                    </div>
                    <div className="hidden md:block">
                        <div className="ml-4 flex items-center md:ml-6 space-x-4">
                            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="p-1 rounded-full hover:text-pink-400 transition-colors" title="Siga-nos no Instagram">
                                <Instagram className="h-6 w-6" />
                            </a>

                            {user ? (
                                <div className="flex items-center space-x-2">
                                    <span className="text-sm text-gold-200">Olá, {user.name}</span>
                                    <button onClick={logout} className="text-xs border border-wood-500 px-2 py-1 rounded hover:bg-wood-700">Sair</button>
                                </div>
                            ) : (
                                <Link to="/login" className="p-1 rounded-full hover:bg-wood-700 focus:outline-none transition-colors" title="Login Administrativo">
                                    <User className="h-6 w-6" />
                                </Link>
                            )}


                        </div>
                    </div>
                    <div className="-mr-2 flex md:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="bg-wood-700 inline-flex items-center justify-center p-2 rounded-md text-gray-200 hover:text-white hover:bg-wood-600 focus:outline-none"
                        >
                            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {isOpen && (
                <div className="md:hidden border-t border-wood-700">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        <Link to="/" onClick={() => setIsOpen(false)} className="hover:bg-wood-700 block px-3 py-2 rounded-md text-base font-medium">Início</Link>
                        <Link to="/produtos" onClick={() => setIsOpen(false)} className="hover:bg-wood-700 block px-3 py-2 rounded-md text-base font-medium">Produtos</Link>
                        <Link to="/sobre" onClick={() => setIsOpen(false)} className="hover:bg-wood-700 block px-3 py-2 rounded-md text-base font-medium">Sobre</Link>
                        <Link to="/contato" onClick={() => setIsOpen(false)} className="hover:bg-wood-700 block px-3 py-2 rounded-md text-base font-medium">Contato</Link>

                        <div className="border-t border-wood-700 my-2 pt-2">
                            {user ? (
                                <>
                                    <div className="px-3 py-2 text-gold-200 font-medium">Olá, {user.name}</div>
                                    {user.role === 'admin' && (
                                        <Link to="/admin" onClick={() => setIsOpen(false)} className="bg-gold-500/20 text-gold-400 block px-3 py-2 rounded-md text-base font-medium mb-2 border border-gold-500/30">Área Admin</Link>
                                    )}
                                    <button
                                        onClick={() => { logout(); setIsOpen(false); }}
                                        className="w-full text-left text-red-400 hover:bg-wood-700 block px-3 py-2 rounded-md text-base font-medium"
                                    >
                                        Sair da Conta
                                    </button>
                                </>
                            ) : (
                                <Link to="/login" onClick={() => setIsOpen(false)} className="hover:bg-wood-700 block px-3 py-2 rounded-md text-base font-medium flex items-center space-x-2">
                                    <User size={20} />
                                    <span>Entrar (Admin)</span>
                                </Link>
                            )}

                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
};
