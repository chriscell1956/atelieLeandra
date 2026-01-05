import React, { useEffect, useState } from 'react';
import { HeroCarousel } from '../components/HeroCarousel';
import { ProductCard } from '../components/ProductCard';
import { CashbackSystem } from '../components/CashbackSystem';
import { ProductDetailsModal } from '../components/ProductDetailsModal';
import { useCart } from '../context/CartContext';
import { supabase } from '../lib/supabase';

export const Home: React.FC = () => {
    const [products, setProducts] = useState<any[]>([]);
    const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const { addToCart } = useCart();

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        setIsLoading(true);
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .eq('is_highlight', true)
            .order('created_at', { ascending: false });

        if (!error && data) {
            setProducts(data);
        }
        setIsLoading(false);
    };

    const handleAddToCart = (product: any) => {
        addToCart(product);
        // Maybe show toast notification
        alert(`Adicionado: ${product.name}`);
    };

    return (
        <div className="px-4 py-8 sm:px-0">
            <HeroCarousel />

            <div className="mb-12">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-3xl font-bold text-wood-800 border-l-4 border-gold-500 pl-4">Destaques da Semana</h2>
                    <a href="/produtos" className="text-wood-600 font-semibold hover:text-wood-800 hover:underline">Ver todos</a>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {isLoading ? (
                        Array(4).fill(0).map((_, i) => (
                            <div key={i} className="bg-wood-100 animate-pulse h-64 rounded-lg"></div>
                        ))
                    ) : products.length > 0 ? (
                        products.map(product => (
                            <ProductCard
                                key={product.id}
                                product={product}
                                onViewDetails={setSelectedProduct}
                                onAddToCart={handleAddToCart}
                            />
                        ))
                    ) : (
                        <div className="col-span-full text-center py-12 text-wood-600">
                            Nenhum produto em destaque no momento.
                        </div>
                    )}
                </div>
            </div>

            <div className="bg-wood-200 rounded-xl p-8 mb-12 text-center">
                <h3 className="text-2xl font-bold text-wood-800 mb-4">Feito à Mão com Carinho</h3>
                <p className="text-wood-700 max-w-2xl mx-auto mb-6">Cada peça é feita com dedicação e carinho.</p>
                <button className="bg-wood-800 text-gold-400 px-6 py-2 rounded font-bold hover:bg-wood-900 transition">Conheça o Ateliê</button>
            </div>

            <div className="max-w-2xl mx-auto">
                <CashbackSystem />
            </div>

            {selectedProduct && (
                <ProductDetailsModal
                    product={selectedProduct}
                    onClose={() => setSelectedProduct(null)}
                    onAddToCart={(p) => { handleAddToCart(p); setSelectedProduct(null); }}
                />
            )}
        </div>
    );
};
