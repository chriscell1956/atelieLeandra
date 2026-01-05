import React, { useEffect, useState } from 'react';
import { ProductCard } from '../components/ProductCard';
import { ProductDetailsModal } from '../components/ProductDetailsModal';
import { useCart } from '../context/CartContext';
import { supabase } from '../lib/supabase';

export const ProductsPage: React.FC = () => {
    const [products, setProducts] = useState<any[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
    const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [categoryFilter, setCategoryFilter] = useState('Todos');
    const { addToCart } = useCart();

    useEffect(() => {
        fetchProducts();
    }, []);

    useEffect(() => {
        if (categoryFilter === 'Todos') {
            setFilteredProducts(products);
        } else {
            setFilteredProducts(products.filter(p => p.category === categoryFilter));
        }
    }, [categoryFilter, products]);

    const fetchProducts = async () => {
        setIsLoading(true);
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .order('created_at', { ascending: false });

        if (!error && data) {
            setProducts(data);
            setFilteredProducts(data);
        }
        setIsLoading(false);
    };

    const handleAddToCart = (product: any) => {
        // Basic stock check simulation (since we are adding the field now)
        if (product.stock !== undefined && product.stock <= 0) {
            alert('Produto esgotado!');
            return;
        }
        addToCart(product);
        alert(`Adicionado: ${product.name}`);
    };

    const categories = ['Todos', 'Geral', 'Decoração', 'Religioso', 'Casamento', 'Presentes'];

    return (
        <div className="px-4 py-8 max-w-7xl mx-auto">
            <h1 className="text-4xl font-bold text-wood-800 mb-8 border-l-8 border-gold-500 pl-6 font-serif">Nossos Produtos</h1>

            {/* Filter Bar */}
            <div className="flex flex-wrap gap-4 mb-8">
                {categories.map(cat => (
                    <button
                        key={cat}
                        onClick={() => setCategoryFilter(cat)}
                        className={`px-4 py-2 rounded-full font-bold transition ${categoryFilter === cat
                                ? 'bg-wood-800 text-gold-400 shadow-md'
                                : 'bg-wood-100 text-wood-600 hover:bg-wood-200'
                            }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {isLoading ? (
                    Array(8).fill(0).map((_, i) => (
                        <div key={i} className="bg-wood-100 animate-pulse h-64 rounded-lg"></div>
                    ))
                ) : filteredProducts.length > 0 ? (
                    filteredProducts.map(product => (
                        <ProductCard
                            key={product.id}
                            product={product}
                            onViewDetails={setSelectedProduct}
                            onAddToCart={handleAddToCart}
                        />
                    ))
                ) : (
                    <div className="col-span-full text-center py-12 text-wood-600 bg-wood-50 rounded-lg">
                        <p className="text-xl">Nenhum produto encontrado nesta categoria.</p>
                    </div>
                )}
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
