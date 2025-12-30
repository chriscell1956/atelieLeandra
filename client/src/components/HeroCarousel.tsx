
import * as React from 'react';
import { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useSiteContent } from '../context/SiteContentContext';

export const HeroCarousel: React.FC = () => {
    const { slides } = useSiteContent();
    const [currentSlide, setCurrentSlide] = useState(0);

    const nextSlide = useCallback(() => {
        if (slides.length === 0) return;
        setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, [slides.length]);

    const prevSlide = useCallback(() => {
        if (slides.length === 0) return;
        setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    }, [slides.length]);

    useEffect(() => {
        if (slides.length === 0) return;

        // Reset current slide if it's out of bounds (e.g. after a slide was removed)
        if (currentSlide >= slides.length) {
            setCurrentSlide(0);
        }

        const timer = setInterval(nextSlide, 5000);
        return () => clearInterval(timer);
    }, [slides.length, nextSlide, currentSlide]);

    if (!slides || slides.length === 0) {
        return (
            <div className="h-[500px] w-full flex items-center justify-center bg-wood-100 rounded-xl mb-12 animate-pulse">
                <p className="text-wood-500 font-medium">Carregando destaques...</p>
            </div>
        );
    }

    return (
        <div className="relative h-[400px] md:h-[500px] w-full overflow-hidden rounded-xl shadow-2xl mb-12 bg-wood-200">
            {slides.map((slide, index) => (
                <div
                    key={slide.id}
                    className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
                >
                    <div className="absolute inset-0 bg-black/40 z-20" />
                    <img
                        src={slide.image || 'https://via.placeholder.com/1200x500?text=Feito+a+Mão'}
                        alt={slide.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/1200x500?text=Imagem+não+encontrada';
                        }}
                    />
                    <div className="absolute inset-0 z-30 flex flex-col items-center justify-center text-center text-white p-6 md:p-12">
                        <h2 className="text-3xl md:text-5xl font-bold mb-4 drop-shadow-lg leading-tight">{slide.title}</h2>
                        <p className="text-lg md:text-xl mb-8 drop-shadow-md max-w-2xl">{slide.subtitle}</p>
                        {slide.link ? (
                            <a href={slide.link} className="bg-gold-500 hover:bg-gold-600 text-wood-900 px-8 py-3 rounded-full font-bold text-lg transition transform hover:scale-105 shadow-lg">
                                {slide.button_text}
                            </a>
                        ) : (
                            <button className="bg-gold-500 hover:bg-gold-600 text-wood-900 px-8 py-3 rounded-full font-bold text-lg transition transform hover:scale-105 shadow-lg">
                                {slide.button_text}
                            </button>
                        )}
                    </div>
                </div>
            ))}

            {slides.length > 1 && (
                <>
                    <button onClick={prevSlide} className="absolute left-4 top-1/2 -translate-y-1/2 z-40 p-2 bg-black/20 hover:bg-black/40 rounded-full text-white backdrop-blur-sm transition">
                        <ChevronLeft size={24} className="md:w-8 md:h-8" />
                    </button>
                    <button onClick={nextSlide} className="absolute right-4 top-1/2 -translate-y-1/2 z-40 p-2 bg-black/20 hover:bg-black/40 rounded-full text-white backdrop-blur-sm transition">
                        <ChevronRight size={24} className="md:w-8 md:h-8" />
                    </button>

                    {/* Dots indicator */}
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-40 flex space-x-2">
                        {slides.map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => setCurrentSlide(idx)}
                                className={`w-2 h-2 rounded-full transition-all ${idx === currentSlide ? 'bg-gold-500 w-6' : 'bg-white/50'}`}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

