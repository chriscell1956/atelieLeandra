import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { Trash2, Smartphone } from 'lucide-react';

export const CartPage: React.FC = () => {
    const { items, removeFromCart, total, clearCart } = useCart();
    const [isCheckout, setIsCheckout] = useState(false);
    const [cep, setCep] = useState('');
    const [shippingQuote, setShippingQuote] = useState<{ price: number; days: number } | null>(null);

    const handleCalculateShipping = (e: React.FormEvent) => {
        e.preventDefault();
        if (cep.length >= 8) {
            // Simulação de frete
            setShippingQuote({
                price: 25.00,
                days: 5
            });
        }
    };

    const finalTotal = total + (shippingQuote?.price || 0);

    if (items.length === 0 && !isCheckout) {
        return (
            <div className="min-h-[50vh] flex flex-col items-center justify-center">
                <h2 className="text-2xl font-bold text-wood-800 mb-4">Seu carrinho está vazio</h2>
                <a href="/" className="bg-wood-600 text-white px-6 py-2 rounded hover:bg-wood-700 transition">Voltar as compras</a>
            </div>
        );
    }

    if (isCheckout) {
        return (
            <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-lg border border-wood-200 animate-fade-in">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Smartphone className="text-green-600" size={32} />
                    </div>
                    <h2 className="text-2xl font-bold text-wood-900">Pedido Recebido!</h2>
                    <p className="text-wood-600">Notificamos a Leandra sobre seu interesse.</p>
                </div>

                <div className="bg-wood-50 p-4 rounded mb-6">
                    <h3 className="font-bold text-wood-800 mb-2">Resumo do Pedido</h3>
                    {items.map(item => (
                        <div key={item.product.id} className="flex justify-between text-sm mb-1">
                            <span>{item.quantity}x {item.product.name}</span>
                            <span>R$ {(item.product.price * item.quantity).toFixed(2)}</span>
                        </div>
                    ))}
                    <div className="border-t border-wood-200 mt-2 pt-2 flex justify-between font-bold">
                        <span>Total</span>
                        <span>R$ {total.toFixed(2)}</span>
                    </div>
                </div>

                <div className="text-center">
                    <p className="mb-4 text-sm text-gray-600">Enviamos um e-mail com os detalhes e o link de pagamento.</p>
                    <button onClick={() => { clearCart(); setIsCheckout(false); window.location.href = '/'; }} className="bg-wood-800 text-white px-8 py-3 rounded font-bold hover:bg-wood-900 transition">
                        Voltar para o Início
                    </button>
                </div>
            </div>
        );
    }



    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-wood-900 mb-8 border-b border-wood-200 pb-4">Seu Carrinho</h1>

            <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
                <div className="p-6 space-y-4">
                    {items.map(item => (
                        <div key={item.product.id} className="flex items-center justify-between border-b border-wood-100 last:border-0 pb-4 last:pb-0">
                            <div className="flex items-center space-x-4">
                                <img src={item.product.image_url} alt={item.product.name} className="w-16 h-16 object-cover rounded bg-wood-100" />
                                <div>
                                    <h3 className="font-bold text-wood-800">{item.product.name}</h3>
                                    <p className="text-sm text-wood-500">Quantidade: {item.quantity}</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-6">
                                <span className="font-bold text-lg text-wood-700">R$ {(item.product.price * item.quantity).toFixed(2)}</span>
                                <button onClick={() => removeFromCart(item.product.id)} className="text-red-500 hover:bg-red-50 p-2 rounded transition">
                                    <Trash2 size={20} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Shipping Calculator */}
                <div className="bg-wood-50 p-6 border-t border-wood-200">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <form onSubmit={handleCalculateShipping} className="flex items-end gap-2 text-sm">
                            <div>
                                <label className="block text-wood-600 mb-1 font-semibold">Calcule o Frete</label>
                                <input
                                    type="text"
                                    value={cep}
                                    onChange={(e) => setCep(e.target.value.replace(/\D/g, ''))}
                                    placeholder="00000-000"
                                    maxLength={8}
                                    className="border border-wood-300 rounded p-2 w-32 focus:outline-none focus:border-gold-500"
                                />
                            </div>
                            <button type="submit" className="bg-wood-600 text-white px-4 py-2 rounded font-bold hover:bg-wood-700 transition">
                                OK
                            </button>
                        </form>

                        {shippingQuote && (
                            <div className="text-right">
                                <p className="text-wood-800 font-bold">Frete Fixo: R$ {shippingQuote.price.toFixed(2)}</p>
                                <p className="text-xs text-wood-500">Entrega em até {shippingQuote.days} dias úteis</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="bg-wood-100 p-6 flex justify-between items-center border-t border-wood-200">
                    <span className="text-xl font-bold text-wood-800">Total</span>
                    <span className="text-2xl font-bold text-wood-900">R$ {finalTotal.toFixed(2)}</span>
                </div>
            </div>

            <div className="flex flex-col items-end space-y-4">
                <p className="text-sm text-wood-500">
                    Prazo de devolução: <strong>7 dias</strong> após o recebimento.
                </p>
                <button onClick={() => setIsCheckout(true)} className="bg-green-600 text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-green-700 transition shadow-lg flex items-center space-x-2">
                    <span>Finalizar Compra</span>
                </button>
            </div>
        </div>
    );
};
