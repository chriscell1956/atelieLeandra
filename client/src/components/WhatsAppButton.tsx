import React from 'react';
import { MessageCircle } from 'lucide-react';

export const WhatsAppButton: React.FC = () => {
    // Substitua pelo número real da Leandra
    // O formato deve ser apenas números: 55 + DDD + Número
    const phoneNumber = "5518997075761";
    const message = encodeURIComponent("Olá Leandra, vim pelo site e gostaria de saber mais sobre seus produtos!");
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;

    return (
        <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-6 right-6 z-50 bg-[#25D366] text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform active:scale-95 group"
            title="Falar no WhatsApp"
        >
            <MessageCircle size={32} fill="currentColor" />
            <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-white text-wood-800 px-3 py-1 rounded-lg text-sm font-bold shadow-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none border border-wood-100">
                Falar no WhatsApp
            </span>
        </a>
    );
};
