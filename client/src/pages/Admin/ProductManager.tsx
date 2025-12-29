import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Edit2, Trash2, Search, ArrowLeft, Save, X } from 'lucide-react';
import { Link } from 'react-router-dom';

// Types
interface Product {
    id: string;
    name: string;
    price: number;
    category: string;
    is_highlight: boolean;
    image_url: string;
}

export const ProductManager: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);

    // Mock initial data fetch
    useEffect(() => {
        // In real app, fetch from API
        // For now, let's pretend we have data or empty
        setTimeout(() => {
            setProducts([
                { id: 'MFM10531', name: 'Kit Medalhão NS Guadalupe', price: 52.20, category: 'Geral', is_highlight: true, image_url: 'stores/...' },
                { id: 'MFM10529', name: 'Combo Projeto 110 Clube', price: 58.90, category: 'Geral', is_highlight: true, image_url: 'stores/...' }
            ]);
            setIsLoading(false);
        }, 1000);
    }, []);

    const handleEdit = (product: Product) => {
        setEditingProduct(product);
        setShowModal(true);
    };

    const handleDelete = (id: string) => {
        if (window.confirm('Tem certeza que deseja excluir este produto?')) {
            setProducts(products.filter(p => p.id !== id));
        }
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();

        if (editingProduct) {
            // Updating existing product
            if (editingProduct.id.startsWith('new-')) {
                // It was a new product being edited? (Wait, flow is new -> modal -> save)
                // Just update the list
                setProducts(prev => prev.map(p => p.id === editingProduct.id ? editingProduct : p));
            } else {
                setProducts(prev => prev.map(p => p.id === editingProduct.id ? editingProduct : p));
            }
        } else {
            // Creating new product - logic handled via form state usually, 
            // but here we are using editingProduct as the form state container for simplicity in this mock
        }

        // Actually, let's fix the form binding. The inputs are using defaultValue, so we need to grab values from the form.
        const form = e.target as HTMLFormElement;
        const name = (form.elements.namedItem('name') as HTMLInputElement).value;
        const price = parseFloat((form.elements.namedItem('price') as HTMLInputElement).value);
        const imageUrl = (form.elements.namedItem('image') as HTMLInputElement).value;
        const isHighlight = (form.elements.namedItem('isHighlight') as HTMLInputElement).checked;

        if (editingProduct && !editingProduct.id.startsWith('temp')) {
            // Edit
            const updated = { ...editingProduct, name, price, image_url: imageUrl, is_highlight: isHighlight };
            setProducts(prev => prev.map(p => p.id === updated.id ? updated : p));
        } else {
            // New
            const newProduct: Product = {
                id: `MFM${Math.floor(Math.random() * 10000)}`,
                name,
                price,
                image_url: imageUrl || 'https://via.placeholder.com/150',
                category: 'Geral',
                is_highlight: isHighlight
            };
            setProducts(prev => [newProduct, ...prev]);
        }

        setShowModal(false);
        setEditingProduct(null);
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-wood-800">Gerenciar Produtos</h1>
                <button
                    onClick={() => { setEditingProduct(null); setShowModal(true); }}
                    className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
                >
                    <Plus size={20} />
                    <span>Novo Produto</span>
                </button>
            </div>

            <div className="bg-white rounded-lg shadow border border-wood-200 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-wood-100 border-b border-wood-200">
                        <tr>
                            <th className="p-4 font-bold text-wood-700">Imagem</th>
                            <th className="p-4 font-bold text-wood-700">Nome</th>
                            <th className="p-4 font-bold text-wood-700">Preço</th>
                            <th className="p-4 font-bold text-wood-700">Destaque</th>
                            <th className="p-4 font-bold text-wood-700">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-wood-100">
                        {products.map(product => (
                            <tr key={product.id} className="hover:bg-gray-50">
                                <td className="p-4">
                                    <div className="w-12 h-12 bg-wood-200 rounded flex items-center justify-center text-xs text-wood-600">Img</div>
                                </td>
                                <td className="p-4 font-medium">{product.name}</td>
                                <td className="p-4">R$ {product.price.toFixed(2)}</td>
                                <td className="p-4">
                                    {product.is_highlight ?
                                        <span className="bg-gold-400/20 text-wood-800 px-2 py-1 rounded text-xs font-bold border border-gold-400">SIM</span>
                                        : <span className="text-gray-400 text-xs">NÃO</span>
                                    }
                                </td>
                                <td className="p-4 flex space-x-2">
                                    <button onClick={() => handleEdit(product)} className="p-2 hover:bg-wood-100 rounded text-blue-600"><Edit2 size={18} /></button>
                                    <button onClick={() => handleDelete(product.id)} className="p-2 hover:bg-red-50 rounded text-red-600"><Trash2 size={18} /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {products.length === 0 && !isLoading && (
                    <div className="p-8 text-center text-gray-500">Nenhum produto encontrado.</div>
                )}
            </div>

            {/* Modal de Edição/Criação */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl overflow-hidden animate-fade-in relative">
                        <div className="bg-wood-700 text-white p-4 flex justify-between items-center">
                            <h2 className="text-xl font-bold">{editingProduct ? 'Editar Produto' : 'Novo Produto'}</h2>
                            <button onClick={() => setShowModal(false)} className="hover:bg-wood-600 p-1 rounded"><X size={24} /></button>
                        </div>
                        <form onSubmit={handleSave} className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-wood-800 mb-1">Nome do Produto</label>
                                    <input type="text" name="name" defaultValue={editingProduct?.name} className="w-full border border-wood-300 rounded p-2" required />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-wood-800 mb-1">Preço (R$)</label>
                                    <input type="number" name="price" step="0.01" defaultValue={editingProduct?.price} className="w-full border border-wood-300 rounded p-2" required />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-wood-800 mb-1">URL da Imagem</label>
                                <input type="text" name="image" defaultValue={editingProduct?.image_url} className="w-full border border-wood-300 rounded p-2" />
                            </div>

                            <div className="flex items-center space-x-2 bg-yellow-50 p-3 rounded border border-yellow-200">
                                <input type="checkbox" name="isHighlight" id="destaque" defaultChecked={editingProduct?.is_highlight} className="w-4 h-4 text-wood-600" />
                                <label htmlFor="destaque" className="font-bold text-wood-800 cursor-pointer">Marcar como Destaque / Oferta</label>
                            </div>

                            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100">
                                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded">Cancelar</button>
                                <button type="submit" className="px-4 py-2 bg-wood-600 text-white rounded hover:bg-wood-700 font-bold shadow">Salvar Produto</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};
