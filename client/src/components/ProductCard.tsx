import React from 'react';
import { Eye, MessageCircle } from 'lucide-react';
import { getImageUrl } from '../lib/imageHelper';

interface Product {
    id: string;
    name: string;
    price: number;
    image_url: string;
    is_highlight?: boolean;
    is_promotion?: boolean;
    stock?: number;
}

interface ProductCardProps {
    product: Product;
    onViewDetails: (product: Product) => void;
    onAddToCart: (product: Product) => void; // Keeping interface for now to specific minimal changes but removing from destructing below if unused, or just remove from interface too if I update usage in Home.tsx
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onViewDetails }) => {
    return (
        <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-wood-100 group">
            <div className="relative h-64 overflow-hidden bg-wood-50">
                {product.is_promotion && (
                    <div className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded z-10">
                        OFERTA
                    </div>
                )}
                {product.is_highlight && (
                    <div className="absolute top-2 right-2 bg-gold-500 text-wood-900 text-xs font-bold px-2 py-1 rounded z-10">
                        DESTAQUE
                    </div>
                )}
                {product.stock !== undefined && product.stock <= 0 && (
                    <div className="absolute top-2 right-2 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded z-10 shadow-md">
                        SOB ENCOMENDA
                    </div>
                )}
                <img
                    src={getImageUrl(product.image_url)}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 cursor-pointer"
                    onClick={() => onViewDetails(product)}
                    onError={(e) => {
                        const img = e.target as HTMLImageElement;
                        if (!img.src.includes('placeholder')) {
                            img.src = 'https://via.placeholder.com/300x300?text=Sem+Imagem';
                        }
                    }}
                />

                {/* Overlay Buttons - Always show now */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-4 pointer-events-none group-hover:pointer-events-auto">
                    <button onClick={() => onViewDetails(product)} className="bg-white text-wood-800 p-3 rounded-full hover:bg-wood-100 transform hover:scale-110 transition shadow-lg" title="Ver Detalhes">
                        <Eye size={20} />
                    </button>
                    <button onClick={() => {
                        const isOutOfStock = product.stock !== undefined && product.stock <= 0;
                        const message = isOutOfStock
                            ? `Olá, vi o produto *${product.name}* (R$ ${product.price.toFixed(2)}) que está sob encomenda. Gostaria de saber o prazo de produção.`
                            : `Olá, gostaria de saber mais sobre o produto: *${product.name}* (R$ ${product.price.toFixed(2)})`;

                        const url = `https://wa.me/5518997075761?text=${encodeURIComponent(message)}`;
                        window.open(url, '_blank');
                    }} className="bg-green-600 hover:bg-green-700 text-white p-3 rounded-full transform hover:scale-110 transition shadow-lg" title={product.stock !== undefined && product.stock <= 0 ? "Encomendar no WhatsApp" : "Comprar pelo WhatsApp"}>
                        <MessageCircle size={20} />
                    </button>
                </div>
            </div>

            <div className="p-4">
                <p className="text-sm text-wood-500 uppercase font-semibold text-xs mb-1">Artesanato</p>
                <h3 className="text-lg font-bold text-wood-900 mb-2 truncate" title={product.name}>{product.name}</h3>
                <div className="flex justify-between items-center">
                    <span className="text-xl font-bold text-wood-700">R$ {product.price.toFixed(2).replace('.', ',')}</span>
                    {product.stock !== undefined && product.stock <= 0 ? (
                        <span className="text-xs text-blue-600 font-bold bg-blue-50 px-2 py-1 rounded-full">
                            Sob Encomenda
                        </span>
                    ) : product.stock !== undefined && product.stock > 0 && product.stock <= 5 ? (
                        <span className="text-xs text-red-600 font-bold bg-red-50 px-2 py-1 rounded-full">
                            Restam {product.stock}
                        </span>
                    ) : null}
                </div>
            </div>
        </div>
    );
};
