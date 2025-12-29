import React from 'react';
import { X, Clock, Ruler, ShoppingCart } from 'lucide-react';

interface Product {
    id: string;
    name: string;
    price: number;
    image_url: string;
    description?: string;
    details?: {
        dimensions?: string;
        material?: string;
        productionTime?: string;
    };
}

interface ProductDetailsModalProps {
    product: Product;
    onClose: () => void;
    onAddToCart: (product: Product) => void;
}

export const ProductDetailsModal: React.FC<ProductDetailsModalProps> = ({ product, onClose, onAddToCart }) => {
    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-fade-in backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col md:flex-row relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 bg-white/80 rounded-full p-2 hover:bg-white text-wood-800 z-10 transition shadow"
                >
                    <X size={24} />
                </button>

                <div className="md:w-1/2 h-96 md:h-auto bg-wood-100 relative">
                    <img
                        src={product.image_url.startsWith('stores') ? `http://localhost:3000/${product.image_url}` : product.image_url}
                        alt={product.name}
                        className="w-full h-full object-cover"
                        onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x400?text=Sem+Imagem' }}
                    />
                </div>

                <div className="md:w-1/2 p-8 flex flex-col">
                    <div className="mb-auto">
                        <span className="text-wood-500 font-bold tracking-wider text-xs uppercase mb-2 block">Detalhes Exclusivos</span>
                        <h2 className="text-3xl font-bold text-wood-900 mb-4 font-serif">{product.name}</h2>
                        <p className="text-xl font-bold text-wood-700 mb-6">R$ {product.price.toFixed(2).replace('.', ',')}</p>

                        <p className="text-gray-600 mb-6 leading-relaxed">
                            {product.description || "Esta peça artesanal é única e feita com todo cuidado e carinho. Perfeita para decorar seu lar ou presentear alguém especial com um toque de devoção e arte."}
                        </p>

                        <div className="grid grid-cols-2 gap-4 mb-8">
                            <div className="bg-wood-50 p-3 rounded flex items-center space-x-3">
                                <Ruler className="text-wood-600" />
                                <div>
                                    <p className="text-xs text-wood-500 font-bold uppercase">Dimensões</p>
                                    <p className="text-sm font-semibold text-wood-800">{product.details?.dimensions || "Não informada"}</p>
                                </div>
                            </div>
                            <div className="bg-wood-50 p-3 rounded flex items-center space-x-3">
                                <Clock className="text-wood-600" />
                                <div>
                                    <p className="text-xs text-wood-500 font-bold uppercase">Produção</p>
                                    <p className="text-sm font-semibold text-wood-800">{product.details?.productionTime || "Pronta entrega"}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={() => onAddToCart(product)}
                        className="w-full bg-wood-800 text-gold-400 py-4 rounded-lg font-bold text-lg hover:bg-wood-900 transition flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transform active:scale-95"
                    >
                        <ShoppingCart />
                        <span>Adicionar ao Carrinho</span>
                    </button>
                </div>
            </div>
        </div>
    );
};
