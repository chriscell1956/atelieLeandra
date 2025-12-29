import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Menu, X, User } from 'lucide-react';
import { useCart } from '../context/CartContext';

export const Navbar: React.FC = () => {
    const [isOpen, setIsOpen] = React.useState(false);
    const { items } = useCart();

    const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);

    return (
        <nav className="bg-wood-800 text-wood-50 shadow-lg sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/" className="font-bold text-2xl tracking-wider text-gold-500">
                            Ateliê Leandra
                        </Link>
                    </div>
                    <div className="hidden md:block">
                        <div className="ml-10 flex items-baseline space-x-4">
                            <Link to="/" className="hover:bg-wood-700 px-3 py-2 rounded-md text-sm font-medium transition-colors">Início</Link>
                            <Link to="/produtos" className="hover:bg-wood-700 px-3 py-2 rounded-md text-sm font-medium transition-colors">Produtos</Link>
                            <Link to="/sobre" className="hover:bg-wood-700 px-3 py-2 rounded-md text-sm font-medium transition-colors">Sobre</Link>
                            <Link to="/contato" className="hover:bg-wood-700 px-3 py-2 rounded-md text-sm font-medium transition-colors">Contato</Link>
                            <Link to="/admin" className="hover:bg-wood-700 px-3 py-2 rounded-md text-sm font-medium transition-colors text-gold-400">Admin</Link>
                        </div>
                    </div>
                    <div className="hidden md:block">
                        <div className="ml-4 flex items-center md:ml-6 space-x-4">
                            <button className="p-1 rounded-full hover:bg-wood-700 focus:outline-none transition-colors">
                                <User className="h-6 w-6" />
                            </button>
                            <Link to="/carrinho" className="p-1 rounded-full hover:bg-wood-700 focus:outline-none transition-colors relative">
                                <ShoppingCart className="h-6 w-6" />
                                {itemCount > 0 && (
                                    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/4 -translate-y-1/4 bg-red-600 rounded-full">{itemCount}</span>
                                )}
                            </Link>
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
                <div className="md:hidden">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        <Link to="/" className="hover:bg-wood-700 block px-3 py-2 rounded-md text-base font-medium">Início</Link>
                        <Link to="/produtos" className="hover:bg-wood-700 block px-3 py-2 rounded-md text-base font-medium">Produtos</Link>
                        <Link to="/sobre" className="hover:bg-wood-700 block px-3 py-2 rounded-md text-base font-medium">Sobre</Link>
                        <Link to="/contato" className="hover:bg-wood-700 block px-3 py-2 rounded-md text-base font-medium">Contato</Link>
                    </div>
                </div>
            )}
        </nav>
    );
};
