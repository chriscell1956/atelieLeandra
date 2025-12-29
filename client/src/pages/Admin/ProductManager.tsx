import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X, Image as ImageIcon } from 'lucide-react';
import { supabase } from '../../lib/supabase';

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
    const [productData, setProductData] = useState<Partial<Product>>({});

    // Mock initial data fetch
    // Fetch from Supabase on mount
    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        setIsLoading(true);
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching products:', error);
            // Fallback or alert?
        } else {
            setProducts(data || []);
        }
        setIsLoading(false);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();

        const form = e.target as HTMLFormElement;
        const name = (form.elements.namedItem('name') as HTMLInputElement).value;
        const price = parseFloat((form.elements.namedItem('price') as HTMLInputElement).value);
        const category = (form.elements.namedItem('category') as HTMLSelectElement).value;
        const imageUrl = (form.elements.namedItem('image') as HTMLInputElement).value || productData.image_url;
        const description = (form.elements.namedItem('description') as HTMLTextAreaElement).value;
        const dimensions = (form.elements.namedItem('dimensions') as HTMLInputElement).value;
        const productionTime = (form.elements.namedItem('productionTime') as HTMLInputElement).value;
        const isHighlight = (form.elements.namedItem('is_highlight') as HTMLInputElement).checked;

        const productToSave = {
            id: editingProduct?.id || crypto.randomUUID(), // Ensure ID generation
            name,
            price,
            image_url: imageUrl || 'https://via.placeholder.com/150',
            category,
            is_highlight: isHighlight,
            description,
            details: {
                dimensions: dimensions || '',
                productionTime: productionTime || ''
            }
        };

        const { error } = await supabase
            .from('products')
            .upsert(productToSave);

        if (error) {
            alert('Erro ao salvar produto: ' + error.message);
        } else {
            fetchProducts(); // Refresh list
            setShowModal(false);
            setEditingProduct(null);
            setProductData({});
        }
    };

    const handleEdit = (product: Product) => {
        setEditingProduct(product);
        setProductData(product);
        setShowModal(true);
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Tem certeza que deseja excluir este produto?')) {
            const { error } = await supabase
                .from('products')
                .delete()
                .eq('id', id);

            if (error) {
                alert('Erro ao excluir: ' + error.message);
            } else {
                fetchProducts();
            }
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setProductData(prev => ({ ...prev, image_url: reader.result as string }));
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-wood-800">Gerenciar Produtos</h1>
                <button
                    onClick={() => { setEditingProduct(null); setProductData({}); setShowModal(true); }}
                    className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
                >
                    <Plus size={20} />
                    <span>Novo Produto</span>
                </button>
            </div>

            <div className="bg-white rounded-lg shadow border border-wood-200 overflow-hidden overflow-x-auto">
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
                                        src={
                                            product.image_url.startsWith('data:')
                                                ? product.image_url
                                                : product.image_url.startsWith('http')
                                                    ? product.image_url
                                                    : `http://localhost:3000/${product.image_url}`
                                        }
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

                                <div className="md:col-span-2">
                                    <label className="block text-sm font-bold text-wood-800 mb-1">Descrição Detalhada</label>
                                    <textarea name="description" rows={4} defaultValue={editingProduct?.description} className="w-full border border-wood-300 rounded p-2 focus:ring-2 focus:ring-wood-500" placeholder="Descreva os detalhes da peça, materiais usados, etc."></textarea>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-wood-800 mb-1">Preço (R$)</label>
                                    <input type="number" name="price" step="0.01" defaultValue={editingProduct?.price} className="w-full border border-wood-300 rounded p-2 focus:ring-2 focus:ring-wood-500" required />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-wood-800 mb-1">Categoria</label>
                                    <select
                                        name="category"
                                        defaultValue={editingProduct?.category || "Geral"}
                                        className="w-full border border-wood-300 rounded p-2 focus:ring-2 focus:ring-wood-500"
                                    >
                                        <option value="Geral">Geral</option>
                                        <option value="Decoração">Decoração</option>
                                        <option value="Religioso">Religioso</option>
                                        <option value="Casamento">Casamento</option>
                                        <option value="Presentes">Presentes</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-wood-800 mb-1">Dimensões (Ex: 30x20cm)</label>
                                    <input type="text" name="dimensions" defaultValue={editingProduct?.details?.dimensions} className="w-full border border-wood-300 rounded p-2 focus:ring-2 focus:ring-wood-500" />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-wood-800 mb-1">Tempo de Produção</label>
                                    <input type="text" name="productionTime" defaultValue={editingProduct?.details?.productionTime} className="w-full border border-wood-300 rounded p-2 focus:ring-2 focus:ring-wood-500" placeholder="Ex: 5 dias úteis" />
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-sm font-bold text-wood-800 mb-1">Imagem do Produto</label>
                                    <div className="space-y-2">
                                        <div className="flex items-center space-x-4">
                                            <div className="w-24 h-24 bg-gray-100 rounded border border-gray-300 flex items-center justify-center overflow-hidden">
                                                {productData?.image_url ? (
                                                    <img
                                                        src={
                                                            productData.image_url.startsWith('data:')
                                                                ? productData.image_url
                                                                : productData.image_url.startsWith('http')
                                                                    ? productData.image_url
                                                                    : `http://localhost:3000/${productData.image_url}`
                                                        }
                                                        alt="Preview"
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <ImageIcon className="text-gray-400" size={32} />
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleImageChange}
                                                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-wood-100 file:text-wood-700 hover:file:bg-wood-200 cursor-pointer"
                                                />
                                                <p className="text-xs text-gray-500 mt-1">Carregue uma foto da galeria ou tire na hora.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="md:col-span-2">
                                    <label className="flex items-center space-x-2 cursor-pointer bg-yellow-50 p-3 rounded border border-yellow-200">
                                        <input
                                            type="checkbox"
                                            name="is_highlight"
                                            defaultChecked={editingProduct?.is_highlight}
                                            className="w-4 h-4 text-wood-600 rounded focus:ring-wood-500"
                                        />
                                        <span className="font-bold text-wood-800 text-sm">Exibir na Home como Destaque</span>
                                    </label>
                                </div>
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
