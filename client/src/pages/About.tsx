import React from 'react';

export const About: React.FC = () => {
    return (
        <div className="max-w-4xl mx-auto py-12 px-4">
            <h1 className="text-4xl font-bold text-wood-800 mb-8 border-l-8 border-gold-500 pl-6 font-serif">Sobre o Ateliê</h1>

            <div className="prose prose-lg text-wood-700 max-w-none space-y-6">
                <p>
                    O <strong>Ateliê Leandra</strong> nasceu da paixão pelo artesanato e da devoção que transforma materiais simples em peças de arte sacra e decoração exclusivas.
                    Localizado no coração de cada peça está o cuidado, a oração e a atenção aos detalhes.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-12">
                    <div className="bg-wood-100 p-6 rounded-lg border border-wood-200">
                        <h3 className="text-xl font-bold text-wood-900 mb-3">Nossa Missão</h3>
                        <p>Levar beleza e espiritualidade para os lares através de peças artesanais feitas com materiais de alta qualidade e muito carinho.</p>
                    </div>
                    <div className="bg-gold-50 p-6 rounded-lg border border-gold-200">
                        <h3 className="text-xl font-bold text-wood-900 mb-3">Produção Artesanal</h3>
                        <p>Cada item é produzido individualmente. Não trabalhamos com escala industrial, garantindo que sua peça seja única.</p>
                    </div>
                </div>

                <h2 className="text-3xl font-bold text-wood-800 font-serif mt-12 mb-6">Nossa História</h2>
                <p>
                    Tudo começou com pequenos presentes para amigos e familiares. A aceitação e o carinho recebidos motivaram a criação do Ateliê,
                    que hoje atende clientes em todo o Brasil. Especializamo-nos em quadros, medalhões, escapulários e itens personalizados para batizados,
                    casamentos e momentos especiais.
                </p>

                <div className="mt-12 p-8 bg-wood-800 text-gold-400 rounded-2xl shadow-xl text-center">
                    <h3 className="text-2xl font-bold mb-4">"Onde há amor, há arte."</h3>
                    <p className="text-wood-200">- Ateliê Leandra</p>
                </div>
            </div>
        </div>
    );
};
