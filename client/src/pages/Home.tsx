```typescript
import React, { useEffect, useState } from 'react';
import { HeroCarousel } from '../components/HeroCarousel';
import { ProductCard } from '../components/ProductCard';
import { CashbackSystem } from '../components/CashbackSystem';
import { ProductDetailsModal } from '../components/ProductDetailsModal';
import { useCart } from '../context/CartContext';

export const Home: React.FC = () => {
    const [products, setProducts] = useState<any[]>([]);
    const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
    const { addToCart } = useCart();
    
    useEffect(() => {
        // Mock data fetch for Home
        setProducts([
            { id: 'MFM10531', name: 'Kit Medalhão NS Guadalupe', price: 52.20, category: 'Geral', is_highlight: true, is_promotion: false, image_url: 'stores/001/977/761/products/2-766ec987f46ddeb0e317655416629878-480-0.webp', details: { dimensions: '25cm x 25cm', productionTime: '3 dias úteis' } },
            { id: 'MFM10529', name: 'Combo Projeto 110 Clube', price: 58.90, category: 'Geral', is_highlight: false, is_promotion: true, image_url: 'stores/001/977/761/products/2-7085b9e70857452a5317655381200361-480-0.webp', details: { dimensions: '30cm x 20cm', productionTime: '5 dias úteis' } },
             { id: 'MFM10528', name: 'Quadro Sagrado Coração', price: 36.90, category: 'Geral', is_highlight: true, is_promotion: false, image_url: 'stores/001/977/761/products/1-399c93aa1ff16c5a5d17655382547707-480-0.webp', details: { dimensions: '20cm x 20cm', productionTime: '2 dias úteis' } },
            { id: 'MFM10527', name: 'Pêndulo Mãezinha Luxo', price: 48.20, category: 'Geral', is_highlight: false, is_promotion: false, image_url: 'stores/001/977/761/products/2-f9b75c320d0909adb717655389700203-480-0.webp' }
        ]);
    }, []);

    const handleAddToCart = (product: any) => {
        addToCart(product);
        // Maybe show toast notification
        alert(`Adicionado: ${ product.name } `);
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
                    {products.map(product => (
                        <ProductCard 
                            key={product.id} 
                            product={product} 
                            onViewDetails={setSelectedProduct}
                            onAddToCart={handleAddToCart}
                        />
                    ))}
                </div>
            </div>

             <div className="bg-wood-200 rounded-xl p-8 mb-12 text-center">
                <h3 className="text-2xl font-bold text-wood-800 mb-4">Feito à Mão com Carinho</h3>
                <p className="text-wood-700 max-w-2xl mx-auto mb-6">Cada peça é produzida individualmente, garantindo exclusividade e qualidade para sua decoração ou devoção.</p>
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
```
