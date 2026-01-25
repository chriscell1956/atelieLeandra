
import * as React from 'react';
import { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useSiteContent } from '../context/SiteContentContext';
import { getImageUrl } from '../lib/imageHelper';

// HeroCarousel.tsx
import * as React from 'react';
import { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useSiteContent } from '../context/SiteContentContext';
import { getImageUrl } from '../lib/imageHelper';

export const HeroCarousel: React.FC = () => {
    const { slides } = useSiteContent();
    const [currentSlide, setCurrentSlide] = useState(0);

    // Auto-advance
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
        const timer = setInterval(nextSlide, 5000);
        return () => clearInterval(timer);
    }, [slides.length, nextSlide]);

    if (!slides || slides.length === 0) {
        return (
            <div className="h-[400px] w-full flex items-center justify-center bg-wood-100 rounded-xl mb-12 animate-pulse">
                <p className="text-wood-500 font-medium">Carregando destaques...</p>
            </div>
        );
    }

    // Helper to get indices safely
    const getSlideIndex = (offset: number) => {
        return (currentSlide + offset + slides.length) % slides.length;
    };

    const prevIndex = getSlideIndex(-1);
    const nextIndex = getSlideIndex(1);

    // If we have only 1 slide, just render center. If 2, duplicate logic might be needed or just show prev/next as same.
    // For simplicity, if length < 3, we might repeat items visually but logic holds.

    return (
        <div className="relative h-[400px] md:h-[500px] w-full mb-12 flex items-center justify-center overflow-hidden bg-wood-900 rounded-xl shadow-2xl group">

            {/* Ambient Background (Blurred Current Slide) */}
            <div className="absolute inset-0 z-0">
                <img
                    src={getImageUrl(slides[currentSlide].image)}
                    alt=""
                    className="w-full h-full object-cover blur-3xl opacity-60 scale-110 transition-all duration-1000"
                />
                <div className="absolute inset-0 bg-black/40" /> {/* Dim overlay */}
            </div>

            {/* Slides Container - Center Mode */}
            <div className="relative w-full h-full max-w-7xl mx-auto flex items-center justify-center z-10 perspective-1000">

                {/* PREVIOUS SLIDE (Left) */}
                {slides.length > 1 && (
                    <div
                        className="absolute left-[5%] md:left-[10%] w-[60%] md:w-[45%] h-[70%] md:h-[80%] opacity-50 blur-[2px] transform -translate-x-12 scale-90 cursor-pointer transition-all duration-700 ease-in-out hover:opacity-70 z-0"
                        onClick={prevSlide}
                    >
                        <img
                            src={getImageUrl(slides[prevIndex].image)}
                            alt={slides[prevIndex].title}
                            className="w-full h-full object-cover rounded-xl shadow-lg brightness-50"
                        />
                    </div>
                )}

                {/* NEXT SLIDE (Right) */}
                {slides.length > 1 && (
                    <div
                        className="absolute right-[5%] md:right-[10%] w-[60%] md:w-[45%] h-[70%] md:h-[80%] opacity-50 blur-[2px] transform translate-x-12 scale-90 cursor-pointer transition-all duration-700 ease-in-out hover:opacity-70 z-0"
                        onClick={nextSlide}
                    >
                        <img
                            src={getImageUrl(slides[nextIndex].image)}
                            alt={slides[nextIndex].title}
                            className="w-full h-full object-cover rounded-xl shadow-lg brightness-50"
                        />
                    </div>
                )}

                {/* CURRENT SLIDE (Center) */}
                <div className="relative w-[85%] md:w-[60%] h-[85%] md:h-[90%] z-20 transition-all duration-700 ease-in-out transform scale-100 hover:scale-[1.02]">
                    <img
                        src={getImageUrl(slides[currentSlide].image)}
                        alt={slides[currentSlide].title}
                        className="w-full h-full object-cover rounded-xl shadow-2xl ring-1 ring-white/10"
                    />

                    {/* Content Overlay */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white p-6 md:p-12 bg-gradient-to-t from-black/80 via-transparent to-transparent rounded-xl">
                        <div className="mt-auto mb-8 animate-fade-in-up">
                            <h2 className="text-2xl md:text-5xl font-bold mb-3 drop-shadow-lg leading-tight tracking-tight text-white">{slides[currentSlide].title}</h2>
                            <p className="text-sm md:text-lg mb-6 drop-shadow-md text-gray-200 max-w-lg mx-auto line-clamp-2 md:line-clamp-none">{slides[currentSlide].subtitle}</p>

                            {slides[currentSlide].link ? (
                                <a href={slides[currentSlide].link} className="inline-block bg-gold-500 hover:bg-gold-600 text-wood-900 px-8 py-3 rounded-full font-bold text-sm md:text-base transition transform hover:scale-105 shadow-xl border border-gold-400">
                                    {slides[currentSlide].button_text}
                                </a>
                            ) : (
                                <button className="inline-block bg-gold-500 hover:bg-gold-600 text-wood-900 px-8 py-3 rounded-full font-bold text-sm md:text-base transition transform hover:scale-105 shadow-xl border border-gold-400">
                                    {slides[currentSlide].button_text}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Navigation Buttons */}
            {slides.length > 1 && (
                <>
                    <button onClick={prevSlide} className="absolute left-2 md:left-8 top-1/2 -translate-y-1/2 z-30 p-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full text-white backdrop-blur-md transition shadow-lg group-hover:scale-110">
                        <ChevronLeft size={28} />
                    </button>
                    <button onClick={nextSlide} className="absolute right-2 md:right-8 top-1/2 -translate-y-1/2 z-30 p-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full text-white backdrop-blur-md transition shadow-lg group-hover:scale-110">
                        <ChevronRight size={28} />
                    </button>

                    {/* Dots */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex space-x-2">
                        {slides.map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => setCurrentSlide(idx)}
                                className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentSlide ? 'bg-gold-500 w-8' : 'bg-white/40 w-2 hover:bg-white/60'}`}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

