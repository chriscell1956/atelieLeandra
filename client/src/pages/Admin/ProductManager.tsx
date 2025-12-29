import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X } from 'lucide-react';

// Types
interface Product {
    id: string;
    name: string;
    price: number;
    category: string;
    is_highlight: boolean;
    image_url: string;
    description?: string;
    details?: {
        dimensions?: string;
        productionTime?: string;
    };
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
                {
                    id: 'MFM10531',
                    name: 'Kit Medalhão NS Guadalupe',
                    price: 52.20,
                    category: 'Geral',
                    is_highlight: true,
                    image_url: 'stores/001/977/761/products/2-766ec987f46ddeb0e317655416629878-480-0.webp',
                    description: 'Kit exclusivo com medalhão detalhado e acabamento premium.',
                    details: { dimensions: '25cm x 25cm', productionTime: '3 dias úteis' }
                },
                {
                    id: 'MFM10529',
                    name: 'Combo Projeto 110 Clube',
                    price: 58.90,
                    category: 'Geral',
                    is_highlight: true,
                    image_url: 'stores/001/977/761/products/2-7085b9e70857452a5317655381200361-480-0.webp',
                    description: 'Projeto especial para clubes e grupos, feito sob medida.',
                    details: { dimensions: '30cm x 20cm', productionTime: '5 dias úteis' }
                }
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

        const form = e.target as HTMLFormElement;
        const name = (form.elements.namedItem('name') as HTMLInputElement).value;
        const price = parseFloat((form.elements.namedItem('price') as HTMLInputElement).value);
        const imageUrl = (form.elements.namedItem('image') as HTMLInputElement).value;
        const description = (form.elements.namedItem('description') as HTMLTextAreaElement).value;
        const dimensions = (form.elements.namedItem('dimensions') as HTMLInputElement).value;
        const productionTime = (form.elements.namedItem('productionTime') as HTMLInputElement).value;
        const isHighlight = (form.elements.namedItem('isHighlight') as HTMLInputElement).checked;

        const productData: Partial<Product> = {
            name,
            price,
            image_url: imageUrl,
            is_highlight: isHighlight,
            description,
            details: {
                dimensions,
                productionTime
            }
        };

        if (editingProduct) {
            // Edit
            const updated = { ...editingProduct, ...productData } as Product;
            setProducts(prev => prev.map(p => p.id === updated.id ? updated : p));
        } else {
            // New
            const newProduct: Product = {
                id: `MFM${Math.floor(Math.random() * 10000)}`,
                category: 'Geral',
                name: productData.name!,
                price: productData.price!,
                is_highlight: productData.is_highlight!,
                image_url: productData.image_url || 'https://via.placeholder.com/150',
                description: productData.description,
                details: productData.details
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
                            <th className="p-4 font-bold text-wood-700">Detalhes</th>
                            <th className="p-4 font-bold text-wood-700">Destaque</th>
                            <th className="p-4 font-bold text-wood-700">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-wood-100">
                        {products.map(product => (
                            <tr key={product.id} className="hover:bg-gray-50">
                                <td className="p-4">
                                    <img
                                        src={product.image_url.startsWith('http') || product.image_url.startsWith('stores') ? (product.image_url.startsWith('stores') ? `http://localhost:3000/${product.image_url}` : product.image_url) : `http://localhost:3000/${product.image_url}`}
                                        alt={product.name}
                                        className="w-12 h-12 rounded object-cover border border-wood-200"
                                        onError={(e) => (e.target as HTMLImageElement).src = 'https://via.placeholder.com/48'}
                                    />
                                </td>
                                <td className="p-4 font-medium">{product.name}</td>
                                <td className="p-4">R$ {product.price.toFixed(2)}</td>
                                <td className="p-4 text-sm text-gray-500 max-w-xs truncate">
                                    {product.details?.dimensions || '-'}
                                </td>
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
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-y-auto p-4">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl animate-fade-in relative my-8">
                        <div className="bg-wood-700 text-white p-4 flex justify-between items-center rounded-t-lg">
                            <h2 className="text-xl font-bold">{editingProduct ? 'Editar Produto' : 'Novo Produto'}</h2>
                            <button onClick={() => setShowModal(false)} className="hover:bg-wood-600 p-1 rounded"><X size={24} /></button>
                        </div>
                        <form onSubmit={handleSave} className="p-6 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-bold text-wood-800 mb-1">Nome do Produto</label>
                                    <input type="text" name="name" defaultValue={editingProduct?.name} className="w-full border border-wood-300 rounded p-2 focus:ring-2 focus:ring-wood-500" required />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-wood-800 mb-1">Preço (R$)</label>
                                    <input type="number" name="price" step="0.01" defaultValue={editingProduct?.price} className="w-full border border-wood-300 rounded p-2 focus:ring-2 focus:ring-wood-500" required />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-wood-800 mb-1">URL da Imagem</label>
                                    <input type="text" name="image" defaultValue={editingProduct?.image_url} className="w-full border border-wood-300 rounded p-2 focus:ring-2 focus:ring-wood-500" placeholder="http://..." />
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-sm font-bold text-wood-800 mb-1">Descrição Detalhada</label>
                                    <textarea name="description" rows={4} defaultValue={editingProduct?.description} className="w-full border border-wood-300 rounded p-2 focus:ring-2 focus:ring-wood-500" placeholder="Descreva os detalhes da peça, materiais usados, etc."></textarea>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-wood-800 mb-1">Dimensões (Ex: 30x20cm)</label>
                                    <input type="text" name="dimensions" defaultValue={editingProduct?.details?.dimensions} className="w-full border border-wood-300 rounded p-2 focus:ring-2 focus:ring-wood-500" />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-wood-800 mb-1">Tempo de Produção</label>
                                    <input type="text" name="productionTime" defaultValue={editingProduct?.details?.productionTime} className="w-full border border-wood-300 rounded p-2 focus:ring-2 focus:ring-wood-500" placeholder="Ex: 5 dias úteis" />
                                </div>
                            </div>

                            <div className="flex items-center space-x-2 bg-yellow-50 p-3 rounded border border-yellow-200 mt-4">
                                <input type="checkbox" name="isHighlight" id="destaque" defaultChecked={editingProduct?.is_highlight} className="w-4 h-4 text-wood-600 rounded focus:ring-wood-500" />
                                <label htmlFor="destaque" className="font-bold text-wood-800 cursor-pointer text-sm">Exibir na Home como Destaque</label>
                            </div>

                            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-100 mt-6">
                                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded md:w-auto w-full">Cancelar</button>
                                <button type="submit" className="px-6 py-2 bg-wood-600 text-white rounded hover:bg-wood-700 font-bold shadow md:w-auto w-full">Salvar Produto</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};
