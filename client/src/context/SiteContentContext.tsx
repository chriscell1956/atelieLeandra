import * as React from 'react';
import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

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
    // Initial Data
    const [slides, setSlides] = useState<CarouselSlide[]>([]);

    useEffect(() => {
        fetchSlides();
    }, []);

    const fetchSlides = async () => {
        const { data, error } = await supabase
            .from('carousel_slides')
            .select('*')
            .order('id', { ascending: true });

        if (!error && data) {
            setSlides(data);
        }
    };

    const updateSlide = async (id: number, data: Partial<CarouselSlide>) => {
        const { error } = await supabase
            .from('carousel_slides')
            .update(data)
            .eq('id', id);

        if (!error) {
            fetchSlides();
        }
    };

    const addSlide = async (data: Omit<CarouselSlide, 'id'>) => {
        const { error } = await supabase
            .from('carousel_slides')
            .insert(data);

        if (!error) {
            fetchSlides();
        }
    };

    const removeSlide = async (id: number) => {
        const { error } = await supabase
            .from('carousel_slides')
            .delete()
            .eq('id', id);

        if (!error) {
            fetchSlides();
        }
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
