import React, { useEffect } from 'react';
import { X, Clock, Ruler, MessageCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { logVisit } from '../lib/supabase';
import { getImageUrl } from '../lib/imageHelper';

interface Product {
    id: string;
    name: string;
    price: number;
    image_url: string;
    images?: string[];
    description?: string;
    stock?: number;
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

export const ProductDetailsModal: React.FC<ProductDetailsModalProps> = ({ product, onClose }) => {
    const [isZoomed, setIsZoomed] = React.useState(false);
    const [activeImage, setActiveImage] = React.useState(product.image_url);

    const [touchStart, setTouchStart] = React.useState(0);
    const [touchEnd, setTouchEnd] = React.useState(0);

    const images = product.images && product.images.length > 0 ? product.images : [product.image_url];
    const currentIndex = images.indexOf(activeImage);

    useEffect(() => {
        setActiveImage(product.image_url);
    }, [product]);

    const handleNext = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        const nextIndex = (currentIndex + 1) % images.length;
        setActiveImage(images[nextIndex]);
    };

    const handlePrev = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        const prevIndex = (currentIndex - 1 + images.length) % images.length;
        setActiveImage(images[prevIndex]);
    };

    const handleTouchStart = (e: React.TouchEvent) => {
        setTouchStart(e.targetTouches[0].clientX);
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        setTouchEnd(e.targetTouches[0].clientX);
    };

    const handleTouchEnd = () => {
        if (!touchStart || !touchEnd) return;
        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > 50;
        const isRightSwipe = distance < -50;

        if (isLeftSwipe) {
            handleNext();
        }
        if (isRightSwipe) {
            handlePrev();
        }
        setTouchEnd(0); // Reset
        setTouchStart(0);
    };

    useEffect(() => {
        logVisit(product);
    }, [product]);

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-fade-in backdrop-blur-sm">
            {isZoomed && (
                <div
                    className="fixed inset-0 z-[60] bg-black flex items-center justify-center p-4 cursor-zoom-out"
                    onClick={() => setIsZoomed(false)}
                >
                    <img
                        src={getImageUrl(activeImage)}
                        alt={product.name}
                        className="max-w-full max-h-full object-contain"
                        onTouchStart={handleTouchStart}
                        onTouchMove={handleTouchMove}
                        onTouchEnd={handleTouchEnd}
                    />

                    {images.length > 1 && (
                        <>
                            <button
                                onClick={handlePrev}
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-white p-3 bg-black/50 rounded-full hover:bg-black/70 transition"
                            >
                                <ChevronLeft size={32} />
                            </button>
                            <button
                                onClick={handleNext}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-white p-3 bg-black/50 rounded-full hover:bg-black/70 transition"
                            >
                                <ChevronRight size={32} />
                            </button>

                            {/* Dots indicator for mobile/desktop */}
                            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2">
                                {images.map((_, idx) => (
                                    <div
                                        key={idx}
                                        className={`w-2 h-2 rounded-full transition-all ${idx === currentIndex ? 'bg-white w-4' : 'bg-white/50'}`}
                                    />
                                ))}
                            </div>
                        </>
                    )}
                    <button className="absolute top-4 right-4 text-white p-2 bg-black/50 rounded-full hover:bg-black/70">
                        <X size={32} />
                    </button>
                </div>
            )}

            <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto md:overflow-hidden flex flex-col md:flex-row relative scrollbar-hide">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 bg-white/80 rounded-full p-2 hover:bg-white text-wood-800 z-10 transition shadow"
                >
                    <X size={24} />
                </button>

                <div
                    className="md:w-1/2 h-64 md:h-auto bg-wood-100 relative shrink-0 cursor-zoom-in group"
                    onClick={() => setIsZoomed(true)}
                >
                    <img
                        src={getImageUrl(activeImage)}
                        alt={product.name}
                        className="w-full h-full object-contain bg-wood-50 transition duration-300 group-hover:brightness-90"
                        onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x400?text=Sem+Imagem' }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-300 pointer-events-none">
                        <span className="bg-black/50 text-white px-3 py-1 rounded-full text-sm font-bold backdrop-blur-sm">Clique para ampliar</span>
                    </div>

                    {/* Image Gallery Thumbnails */}
                    {product.images && product.images.length > 1 && (
                        <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2 px-4 z-20" onClick={(e) => e.stopPropagation()}>
                            {product.images.map((img, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setActiveImage(img)}
                                    className={`w-12 h-12 rounded-lg overflow-hidden border-2 transition shadow-lg ${activeImage === img ? 'border-gold-500 scale-110' : 'border-white/50 hover:border-white'}`}
                                >
                                    <img
                                        src={getImageUrl(img)}
                                        alt={`View ${idx}`}
                                        className="w-full h-full object-cover"
                                    />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <div className="md:w-1/2 p-6 md:p-8 flex flex-col overflow-y-auto">
                    <div className="mb-auto">
                        <span className="text-wood-500 font-bold tracking-wider text-xs uppercase mb-2 block">Detalhes Exclusivos</span>
                        <h2 className="text-3xl font-bold text-wood-900 mb-4 font-serif">{product.name}</h2>
                        <div className="flex items-center space-x-4 mb-6">
                            <p className="text-xl font-bold text-wood-700">R$ {product.price.toFixed(2).replace('.', ',')}</p>
                            {product.stock !== undefined && (
                                <span className={`text-sm font-bold px-3 py-1 rounded-full ${product.stock > 0
                                    ? product.stock <= 5 ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'
                                    : 'bg-blue-100 text-blue-700'
                                    }`}>
                                    {product.stock > 0
                                        ? `${product.stock} unidades disponíveis`
                                        : 'Sob Encomenda'
                                    }
                                </span>
                            )}
                        </div>

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
                        onClick={() => {
                            const isOutOfStock = product.stock !== undefined && product.stock <= 0;
                            const message = isOutOfStock
                                ? `Olá, vi o produto *${product.name}* (R$ ${product.price.toFixed(2)}) que está sob encomenda. Gostaria de saber o prazo de produção.`
                                : `Olá, gostaria de saber mais sobre o produto: *${product.name}* (R$ ${product.price.toFixed(2)})`;

                            const url = `https://wa.me/5518997075761?text=${encodeURIComponent(message)}`;
                            window.open(url, '_blank');
                        }}
                        className="w-full py-4 rounded-lg font-bold text-lg transition flex items-center justify-center space-x-2 shadow-lg bg-green-600 text-white hover:bg-green-700 hover:shadow-xl transform active:scale-95"
                    >
                        <MessageCircle />
                        <span>{product.stock !== undefined && product.stock <= 0 ? 'Encomendar pelo WhatsApp' : 'Comprar no WhatsApp'}</span>
                    </button>
                </div>
            </div>
        </div>
    );
};
