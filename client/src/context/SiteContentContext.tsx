import * as React from 'react';
import { createContext, useContext, useState } from 'react';

export interface CarouselSlide {
    id: number;
    title: string;
    subtitle: string;
    image: string;
    cta: string;
}

interface SiteContentContextType {
    slides: CarouselSlide[];
    updateSlide: (id: number, data: Partial<CarouselSlide>) => void;
    addSlide: (data: Omit<CarouselSlide, 'id'>) => void;
    removeSlide: (id: number) => void;
}

const SiteContentContext = createContext<SiteContentContextType | undefined>(undefined);

export const SiteContentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    // Initial Mock Data
    const [slides, setSlides] = useState<CarouselSlide[]>([
        {
            id: 1,
            title: "Artesanato com Amor",
            subtitle: "Peças exclusivas feitas à mão para você",
            image: "https://images.unsplash.com/photo-1499893903130-48d7ad45e69e?q=80&w=1950&auto=format&fit=crop",
            cta: "Ver coleção"
        },
        {
            id: 2,
            title: "Fé e Devoção",
            subtitle: "Kits e peças religiosas montadas com carinho",
            image: "https://images.unsplash.com/photo-1549416802-39bd93282eb1?q=80&w=1950&auto=format&fit=crop",
            cta: "Confira as ofertas"
        }
    ]);

    const updateSlide = (id: number, data: Partial<CarouselSlide>) => {
        setSlides(prev => prev.map(slide => slide.id === id ? { ...slide, ...data } : slide));
    };

    const addSlide = (data: Omit<CarouselSlide, 'id'>) => {
        const newId = Math.max(...slides.map(s => s.id), 0) + 1;
        setSlides(prev => [...prev, { id: newId, ...data }]);
    };

    const removeSlide = (id: number) => {
        setSlides(prev => prev.filter(slide => slide.id !== id));
    };

    return (
        <SiteContentContext.Provider value={{ slides, updateSlide, addSlide, removeSlide }}>
            {children}
        </SiteContentContext.Provider>
    );
};

export const useSiteContent = () => {
    const context = useContext(SiteContentContext);
    if (!context) {
        throw new Error('useSiteContent must be used within a SiteContentProvider');
    }
    return context;
};
