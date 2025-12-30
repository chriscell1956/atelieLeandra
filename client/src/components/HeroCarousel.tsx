
import * as React from 'react';
import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useSiteContent } from '../context/SiteContentContext';

export const HeroCarousel: React.FC = () => {
    const { slides } = useSiteContent();
    const [currentSlide, setCurrentSlide] = useState(0);

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    };

    useEffect(() => {
        const timer = setInterval(nextSlide, 5000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="relative h-[500px] w-full overflow-hidden rounded-xl shadow-2xl mb-12">
            {slides.map((slide, index) => (
                <div
                    key={slide.id}
                    className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}
                >
                    <div className="absolute inset-0 bg-black/40 z-10" />
                    <img src={slide.image} alt={slide.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center text-white p-4">
                        <h2 className="text-5xl font-bold mb-4 drop-shadow-lg">{slide.title}</h2>
                        <p className="text-xl mb-8 drop-shadow-md">{slide.subtitle}</p>
                        <button className="bg-wood-600 hover:bg-wood-700 text-white px-8 py-3 rounded-full font-bold text-lg transition transform hover:scale-105 shadow-lg border-2 border-wood-400">
                            {slide.cta}
                        </button>
                    </div>
                </div>
            ))}

            <button onClick={prevSlide} className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-2 bg-white/20 hover:bg-white/40 rounded-full text-white backdrop-blur-sm transition">
                <ChevronLeft size={32} />
            </button>
            <button onClick={nextSlide} className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-2 bg-white/20 hover:bg-white/40 rounded-full text-white backdrop-blur-sm transition">
                <ChevronRight size={32} />
            </button>
        </div>
    );
};
