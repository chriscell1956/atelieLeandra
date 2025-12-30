import * as React from 'react';
import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export interface CarouselSlide {
    id: number;
    title: string;
    subtitle: string;
    image: string;
    button_text: string;
    link?: string;
}

interface SiteContentContextType {
    slides: CarouselSlide[];
    updateSlide: (id: number, data: Partial<CarouselSlide>) => Promise<void>;
    addSlide: (data: Omit<CarouselSlide, 'id'>) => Promise<void>;
    removeSlide: (id: number) => Promise<void>;
}

const SiteContentContext = createContext<SiteContentContextType | undefined>(undefined);

export const SiteContentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [slides, setSlides] = useState<CarouselSlide[]>([]);

    useEffect(() => {
        fetchSlides();
    }, []);

    const fetchSlides = async () => {
        try {
            const { data, error } = await supabase
                .from('carousel_slides')
                .select('*')
                .order('id', { ascending: true });

            if (error) {
                console.error('Error fetching slides:', error);
            } else if (data) {
                setSlides(data);
            }
        } catch (err) {
            console.error('Unexpected error fetching slides:', err);
        }
    };

    const updateSlide = async (id: number, data: Partial<CarouselSlide>) => {
        try {
            const { error } = await supabase
                .from('carousel_slides')
                .update(data)
                .eq('id', id);

            if (error) {
                alert('Erro ao atualizar slide: ' + error.message);
                console.error('Supabase error updating slide:', error);
            } else {
                await fetchSlides();
            }
        } catch (err) {
            alert('Erro inesperado ao atualizar slide');
            console.error(err);
        }
    };

    const addSlide = async (data: Omit<CarouselSlide, 'id'>) => {
        try {
            console.log('Tentando adicionar slide:', data);
            const { error } = await supabase
                .from('carousel_slides')
                .insert([data]);

            if (error) {
                alert('Erro ao adicionar slide: ' + error.message);
                console.error('Supabase error adding slide:', error);
            } else {
                await fetchSlides();
            }
        } catch (err) {
            alert('Erro inesperado ao adicionar slide');
            console.error(err);
        }
    };

    const removeSlide = async (id: number) => {
        try {
            const { error } = await supabase
                .from('carousel_slides')
                .delete()
                .eq('id', id);

            if (error) {
                alert('Erro ao remover slide: ' + error.message);
                console.error('Supabase error removing slide:', error);
            } else {
                await fetchSlides();
            }
        } catch (err) {
            alert('Erro inesperado ao remover slide');
            console.error(err);
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
