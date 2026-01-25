import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X, Image as ImageIcon } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { getImageUrl } from '../../lib/imageHelper';

// Types
interface Product {
    id: string;
    name: string;
    price: number;
    category: string;
    is_highlight: boolean;
    image_url: string;
    images?: string[];
    description?: string;
    stock?: number;
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
        try {
            e.preventDefault();
            const form = e.target as HTMLFormElement;

            // Get form values safely
            const name = (form.elements.namedItem('name') as HTMLInputElement)?.value || '';
            const priceValue = (form.elements.namedItem('price') as HTMLInputElement)?.value;
            const price = priceValue ? parseFloat(priceValue.replace(',', '.')) : 0;
            const category = (form.elements.namedItem('category') as HTMLSelectElement)?.value || 'Geral';
            const description = (form.elements.namedItem('description') as HTMLTextAreaElement)?.value || '';
            const dimensions = (form.elements.namedItem('dimensions') as HTMLInputElement)?.value || '';
            const productionTime = (form.elements.namedItem('productionTime') as HTMLInputElement)?.value || '';
            const stockValue = (form.elements.namedItem('stock') as HTMLInputElement)?.value;
            const stock = stockValue ? parseInt(stockValue) : 0;
            const isHighlight = (form.elements.namedItem('is_highlight') as HTMLInputElement)?.checked || false;

            // Use image from state (updated in handleImageChange) or existing product image
            // Prioritize the images array for the multi-image logic
            const currentImages = productData.images || editingProduct?.images || [];

            // Ensure image_url (main image) is consistent with images[0]
            let imageUrl = productData.image_url || editingProduct?.image_url || '';

            // If we have images in the array, the first one MUST be the main image_url
            if (currentImages.length > 0 && currentImages[0]) {
                imageUrl = currentImages[0];
            } else if (imageUrl) {
                // If we have an old image_url but empty array, populate array
                if (currentImages.length === 0) {
                    currentImages.push(imageUrl);
                }
            }

            // Fallback for visual
            if (!imageUrl) imageUrl = 'https://via.placeholder.com/150';

            const productToSave: any = {
                id: editingProduct?.id || crypto.randomUUID(),
                name,
                price,
                image_url: imageUrl,
                images: currentImages.filter(img => img && img.length > 0), // Clean empty strings
                category,
                is_highlight: isHighlight,
                description,
                stock, // Add stock to payload
                details: {
                    dimensions,
                    productionTime
                }
            };

            // Only add created_at if it's a new product
            if (!editingProduct?.id) {
                productToSave.created_at = new Date().toISOString();
            }

            console.log('Tentando salvar produto:', productToSave);

            const { data, error } = await supabase
                .from('products')
                .upsert(productToSave)
                .select();

            if (error) {
                console.error('Supabase error saving product:', error);
                alert('Erro ao salvar no banco: ' + error.message);
            } else {
                console.log('Produto salvo com sucesso:', data);
                await fetchProducts(); // Refresh list
                setShowModal(false);
                setEditingProduct(null);
                setProductData({});
                alert('Produto salvo com sucesso!');
            }
        } catch (err) {
            console.error('Unexpected error in handleSave:', err);
            alert('Erro inesperado: ' + (err instanceof Error ? err.message : String(err)));
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

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                alert('A imagem deve ter no máximo 5MB');
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                const newImage = reader.result as string;

                // Update images array at specific index
                setProductData(prev => {
                    const currentImages = [...(prev.images || editingProduct?.images || [])];
                    if (index === 0) {
                        // Main image update - ensures legacy compatibility
                        return {
                            ...prev,
                            image_url: newImage,
                            images: [newImage, ...(currentImages.slice(1))]
                        };
                    } else {
                        // Auxiliary images
                        // Ensure array is big enough
                        while (currentImages.length <= index) {
                            currentImages.push('');
                        }
                        currentImages[index] = newImage;
                        // Filter out empty slots if any hole was created? No, keep index integrity for inputs
                        return { ...prev, images: currentImages };
                    }
                });
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
                <h1 className="text-2xl font-bold text-wood-800">Gerenciar Produtos</h1>
                <button
                    onClick={() => { setEditingProduct(null); setProductData({}); setShowModal(true); }}
                    className="flex items-center justify-center space-x-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition w-full sm:w-auto shadow-lg font-bold"
                >
                    <Plus size={24} />
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
                            <th className="p-4 font-bold text-wood-700">Estoque</th>
                            <th className="p-4 font-bold text-wood-700">Destaque</th>
                            <th className="p-4 font-bold text-wood-700">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-wood-100">
                        {products.map(product => (
                            <tr key={product.id} className="hover:bg-gray-50">
                                <td className="p-4">
                                    <img
                                        src={getImageUrl(product.image_url)}
                                        alt={product.name}
                                        className="w-12 h-12 rounded object-cover border border-wood-200"
                                        onError={(e) => {
                                            const img = e.target as HTMLImageElement;
                                            if (!img.src.includes('placeholder')) {
                                                img.src = 'https://via.placeholder.com/48';
                                            }
                                        }}
                                    />
                                </td>
                                <td className="p-4 font-medium">{product.name}</td>
                                <td className="p-4">R$ {product.price.toFixed(2)}</td>
                                <td className="p-4 font-semibold text-wood-800">{product.stock || 0} unid.</td>
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
                <div className="fixed inset-0 bg-black/60 z-[60] flex flex-col items-center justify-center sm:p-4 backdrop-blur-sm">
                    <div className="bg-white w-full h-[100dvh] sm:h-auto sm:max-h-[90vh] sm:max-w-2xl sm:rounded-lg shadow-2xl flex flex-col animate-fade-in">
                        {/* Header */}
                        <div className="bg-wood-800 text-white p-4 flex justify-between items-center shrink-0 sm:rounded-t-lg">
                            <h2 className="text-xl font-bold">{editingProduct ? 'Editar Produto' : 'Novo Produto'}</h2>
                            <button
                                onClick={() => setShowModal(false)}
                                className="hover:bg-wood-700 p-2 rounded-full transition-colors"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        {/* Scrollable Content */}
                        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-gray-50">
                            <form id="product-form" onSubmit={handleSave} className="space-y-5">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-bold text-wood-800 mb-1">Nome do Produto</label>
                                        <input type="text" name="name" defaultValue={editingProduct?.name} className="w-full border border-wood-300 rounded-lg p-3 focus:ring-2 focus:ring-wood-500 focus:border-wood-500" required placeholder="Ex: Imagem de Nossa Senhora" />
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-bold text-wood-800 mb-1">Descrição</label>
                                        <textarea name="description" rows={3} defaultValue={editingProduct?.description} className="w-full border border-wood-300 rounded-lg p-3 focus:ring-2 focus:ring-wood-500 focus:border-wood-500" placeholder="Detalhes da peça..."></textarea>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-wood-800 mb-1">Preço (R$)</label>
                                        <input type="number" name="price" step="0.01" defaultValue={editingProduct?.price} className="w-full border border-wood-300 rounded-lg p-3 focus:ring-2 focus:ring-wood-500" required />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-wood-800 mb-1">Categoria</label>
                                        <select
                                            name="category"
                                            defaultValue={editingProduct?.category || "Geral"}
                                            className="w-full border border-wood-300 rounded-lg p-3 focus:ring-2 focus:ring-wood-500 bg-white"
                                        >
                                            <option value="Geral">Geral</option>
                                            <option value="Decoração">Decoração</option>
                                            <option value="Religioso">Religioso</option>
                                            <option value="Casamento">Casamento</option>
                                            <option value="Presentes">Presentes</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-wood-800 mb-1">Estoque (Unidades)</label>
                                        <input type="number" name="stock" defaultValue={editingProduct?.stock || 0} className="w-full border border-wood-300 rounded-lg p-3 focus:ring-2 focus:ring-wood-500" min="0" />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-wood-800 mb-1">Dimensões</label>
                                        <input type="text" name="dimensions" defaultValue={editingProduct?.details?.dimensions} className="w-full border border-wood-300 rounded-lg p-3 focus:ring-2 focus:ring-wood-500" placeholder="Ex: 30x20cm" />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-wood-800 mb-1">Tempo de Produção</label>
                                        <input type="text" name="productionTime" defaultValue={editingProduct?.details?.productionTime} className="w-full border border-wood-300 rounded-lg p-3 focus:ring-2 focus:ring-wood-500" placeholder="Ex: 5 dias" />
                                    </div>

                                    <div className="md:col-span-2 bg-white p-4 rounded-lg border border-wood-200">
                                        <div>
                                            <label className="block text-sm font-medium text-wood-700 mb-1">Imagens do Produto (Até 3)</label>
                                            <div className="grid grid-cols-3 gap-4">
                                                {[0, 1, 2].map((index) => {
                                                    // Determine which image to show
                                                    const currentImages = productData.images || editingProduct?.images || [];

                                                    // Legacy fallback for index 0
                                                    let imgSrc = '';
                                                    if (index === 0) {
                                                        imgSrc = productData.image_url || editingProduct?.image_url || currentImages[0];
                                                    } else {
                                                        imgSrc = currentImages[index];
                                                    }

                                                    return (
                                                        <div key={index} className="flex flex-col items-center gap-2">
                                                            <div className="w-full h-24 bg-gray-100 rounded border border-dashed border-gray-300 flex items-center justify-center overflow-hidden relative">
                                                                {imgSrc ? (
                                                                    <img
                                                                        src={getImageUrl(imgSrc)}
                                                                        alt={`Foto ${index + 1}`}
                                                                        className="w-full h-full object-cover"
                                                                    />
                                                                ) : (
                                                                    <ImageIcon className="text-gray-400" />
                                                                )}
                                                                <input
                                                                    type="file"
                                                                    accept="image/*"
                                                                    onChange={(e) => handleImageChange(e, index)}
                                                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                                                    title={`Alterar imagem ${index + 1}`}
                                                                />
                                                            </div>
                                                            <span className="text-xs text-wood-600 font-medium">
                                                                {index === 0 ? "Principal" : `Foto ${index + 1}`}
                                                            </span>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                            <p className="text-xs text-gray-500 mt-1">Clique nas caixas para adicionar/alterar. A primeira é a capa.</p>
                                        </div>
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="flex items-center space-x-3 cursor-pointer p-4 rounded-lg border border-gold-200 bg-gold-50/50 hover:bg-gold-50 transition">
                                            <input
                                                type="checkbox"
                                                name="is_highlight"
                                                defaultChecked={editingProduct?.is_highlight}
                                                className="w-5 h-5 text-wood-600 rounded focus:ring-wood-500 border-gray-300"
                                            />
                                            <div className="flex flex-col">
                                                <span className="font-bold text-wood-800 text-sm">Destaque na Home</span>
                                                <span className="text-xs text-wood-600">Este produto aparecerá no carrossel de destaques</span>
                                            </div>
                                        </label>
                                    </div>
                                </div>
                            </form>
                        </div>

                        {/* Footer Buttons */}
                        <div className="p-4 border-t border-gray-200 bg-white sm:rounded-b-lg shrink-0 flex flex-col-reverse sm:flex-row justify-end gap-3 sm:space-x-3">
                            <button
                                type="button"
                                onClick={() => setShowModal(false)}
                                className="px-5 py-3 text-wood-600 font-bold hover:bg-gray-100 rounded-lg transition-colors w-full sm:w-auto"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                form="product-form"
                                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-bold shadow-md hover:shadow-lg transition-transform active:scale-95 w-full sm:w-auto flex items-center justify-center gap-2"
                            >
                                <Plus size={20} className="hidden sm:inline" />
                                <span>{editingProduct ? 'Salvar Alterações' : 'Criar Produto'}</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
