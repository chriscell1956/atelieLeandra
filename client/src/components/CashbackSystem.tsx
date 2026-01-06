import React, { useState } from 'react';
import { Star, Send } from 'lucide-react';
import { supabase } from '../lib/supabase';

export const CashbackSystem: React.FC = () => {
    const [feedback, setFeedback] = useState('');
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        const { error } = await supabase
            .from('feedbacks')
            .insert({
                name: name || 'Anônimo',
                email,
                message: feedback
            });

        setIsSubmitting(false);

        if (!error) {
            setSubmitted(true);
        } else {
            alert('Erro ao enviar feedback. Tente novamente.');
        }
    };

    if (submitted) {
        return (
            <div className="bg-wood-100 border border-wood-300 p-8 rounded-lg text-center animate-fade-in">
                <div className="inline-block p-4 bg-green-100 rounded-full mb-4 text-green-600">
                    <Star size={48} fill="currentColor" />
                </div>
                <h3 className="text-2xl font-bold text-wood-800 mb-2">Obrigado pelo seu feedback!</h3>
                <p className="text-wood-700 mb-4">Como agradecimento, creditamos um <strong>Cashback</strong> em sua conta para a próxima compra!</p>
                <button onClick={() => setSubmitted(false)} className="text-wood-600 underline">Enviar outro comentário</button>
            </div>
        );
    }

    return (
        <div className="bg-white border-t-4 border-gold-500 rounded-lg shadow-lg p-8">
            <h3 className="text-2xl font-bold text-wood-800 mb-2 flex items-center gap-2">
                <Star className="text-gold-500" fill="#fbc02d" />
                Avalie e Ganhe Cashback
            </h3>
            <p className="text-wood-600 mb-6">Deixe seu comentário sobre nossos produtos e ganhe desconto na próxima compra!</p>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-wood-700 font-bold mb-1">Seu Nome</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full border border-wood-300 rounded p-2 focus:ring-2 focus:ring-gold-400 focus:border-transparent outline-none"
                        placeholder="Como gostaria de ser chamado?"
                    />
                </div>
                <div>
                    <label className="block text-wood-700 font-bold mb-1">Seu E-mail</label>
                    <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full border border-wood-300 rounded p-2 focus:ring-2 focus:ring-gold-400 focus:border-transparent outline-none"
                        placeholder="email@exemplo.com"
                    />
                </div>
                <div>
                    <label className="block text-wood-700 font-bold mb-1">Sua Mensagem</label>
                    <textarea
                        required
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                        className="w-full border border-wood-300 rounded p-2 focus:ring-2 focus:ring-gold-400 focus:border-transparent outline-none h-24"
                        placeholder="O que você achou dos nossos produtos?"
                    />
                </div>
                <button type="submit" disabled={isSubmitting} className="w-full bg-wood-800 text-gold-400 font-bold py-3 rounded hover:bg-wood-900 transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                    <Send size={20} />
                    {isSubmitting ? 'Enviando...' : 'Enviar Avaliação'}
                </button>
            </form>
        </div>
    );
};
