import React from 'react';
import { ShoppingCart, Eye } from 'lucide-react';

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
    onAddToCart: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onViewDetails, onAddToCart }) => {
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
                    <div className="absolute inset-0 bg-black/60 z-20 flex items-center justify-center">
                        <span className="text-white font-bold text-xl border-2 border-white px-4 py-2 uppercase tracking-widest">Esgotado</span>
                    </div>
                )}
                <img
                    src={
                        product.image_url.startsWith('data:')
                            ? product.image_url
                            : product.image_url.startsWith('http')
                                ? product.image_url
                                : product.image_url.startsWith('/')
                                    ? product.image_url
                                    : `/${product.image_url}`
                    }
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

                {/* Overlay Buttons - Hide if out of stock */}
                {(product.stock === undefined || product.stock > 0) && (
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-4 pointer-events-none group-hover:pointer-events-auto">
                        <button onClick={() => onViewDetails(product)} className="bg-white text-wood-800 p-3 rounded-full hover:bg-wood-100 transform hover:scale-110 transition shadow-lg" title="Ver Detalhes">
                            <Eye size={20} />
                        </button>
                        <button onClick={() => onAddToCart(product)} className="bg-wood-600 text-white p-3 rounded-full hover:bg-wood-700 transform hover:scale-110 transition shadow-lg" title="Adicionar ao Carrinho">
                            <ShoppingCart size={20} />
                        </button>
                    </div>
                )}
            </div>

            <div className="p-4">
                <p className="text-sm text-wood-500 uppercase font-semibold text-xs mb-1">Artesanato</p>
                <h3 className="text-lg font-bold text-wood-900 mb-2 truncate" title={product.name}>{product.name}</h3>
                <div className="flex justify-between items-center">
                    <span className="text-xl font-bold text-wood-700">R$ {product.price.toFixed(2).replace('.', ',')}</span>
                    {product.stock !== undefined && product.stock > 0 && product.stock <= 5 && (
                        <span className="text-xs text-red-600 font-bold bg-red-50 px-2 py-1 rounded-full">
                            Restam {product.stock}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};
