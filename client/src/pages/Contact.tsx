import React from 'react';
import { Mail, Phone, Instagram, MapPin } from 'lucide-react';

export const Contact: React.FC = () => {
    return (
        <div className="max-w-4xl mx-auto py-12 px-4">
            <h1 className="text-4xl font-bold text-wood-800 mb-8 border-l-8 border-gold-500 pl-6 font-serif">Contato</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="space-y-8">
                    <p className="text-lg text-wood-700 leading-relaxed">
                        Tem alguma dúvida sobre nossas peças ou gostaria de fazer um pedido personalizado?
                        Entre em contato conosco por qualquer um dos canais abaixo.
                    </p>

                    <div className="space-y-6">
                        <div className="flex items-center space-x-4 group">
                            <div className="bg-gold-100 p-3 rounded-full text-gold-600 group-hover:bg-gold-500 group-hover:text-white transition-colors">
                                <Mail size={24} />
                            </div>
                            <div>
                                <h3 className="font-bold text-wood-800 text-sm uppercase tracking-wider">E-mail</h3>
                                <p className="text-wood-600">leandraribeiro.lr.lr@gmail.com</p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-4 group">
                            <div className="bg-green-100 p-3 rounded-full text-green-600 group-hover:bg-green-500 group-hover:text-white transition-colors">
                                <Phone size={24} />
                            </div>
                            <div>
                                <h3 className="font-bold text-wood-800 text-sm uppercase tracking-wider">WhatsApp</h3>
                                <p className="text-wood-600">Clique no botão lateral ou peça o número!</p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-4 group">
                            <div className="bg-pink-100 p-3 rounded-full text-pink-600 group-hover:bg-pink-500 group-hover:text-white transition-colors">
                                <Instagram size={24} />
                            </div>
                            <div>
                                <h3 className="font-bold text-wood-800 text-sm uppercase tracking-wider">Instagram</h3>
                                <p className="text-wood-600">@atelie_leandra</p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-4 group">
                            <div className="bg-blue-100 p-3 rounded-full text-blue-600 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                                <MapPin size={24} />
                            </div>
                            <div>
                                <h3 className="font-bold text-wood-800 text-sm uppercase tracking-wider">Localização</h3>
                                <p className="text-wood-600">Atendimento online e envios para todo o Brasil.</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-wood-100 p-8 rounded-2xl shadow-inner border border-wood-200">
                    <h2 className="text-2xl font-bold text-wood-800 mb-6 font-serif">Horário de Atendimento</h2>
                    <ul className="space-y-4 text-wood-700">
                        <li className="flex justify-between border-b border-wood-200 pb-2">
                            <span>Segunda a Sexta</span>
                            <span className="font-bold">09:00 - 18:00</span>
                        </li>
                        <li className="flex justify-between border-b border-wood-200 pb-2">
                            <span>Sábado</span>
                            <span className="font-bold">09:00 - 13:00</span>
                        </li>
                        <li className="flex justify-between">
                            <span>Domingo</span>
                            <span className="text-gray-400 italic">Fechado</span>
                        </li>
                    </ul>

                    <div className="mt-10 p-4 bg-white rounded-lg border border-wood-300 shadow-sm text-center">
                        <p className="text-sm text-wood-600 italic">"Cada peça é feita com dedicação e carinho."</p>
                    </div>
                </div>
            </div>
        </div>
    );
};
