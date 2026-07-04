import React, { useState, useEffect } from 'react';
import { ArrowLeft, Trash2, DollarSign, Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Link } from 'react-router-dom';

interface Product {
  id: string;
  name: string;
  price: number;
  image_url: string;
}

interface RawMaterial {
  id: string;
  name: string;
  unit: string;
  unit_size: number;
  last_cost: number;
}

interface ProductMaterial {
  id: string;
  material_id: string;
  quantity_used: number;
  raw_materials: RawMaterial;
}

export const FinancialReports: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [materials, setMaterials] = useState<RawMaterial[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [recipe, setRecipe] = useState<ProductMaterial[]>([]);
  
  // States for adding material to recipe
  const [selectedMaterialId, setSelectedMaterialId] = useState('');
  const [quantityUsed, setQuantityUsed] = useState('1');

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    setLoading(true);
    const [productsRes, materialsRes] = await Promise.all([
      supabase.from('products').select('*').order('name'),
      supabase.from('raw_materials').select('*').order('name')
    ]);
    
    if (productsRes.data) setProducts(productsRes.data);
    if (materialsRes.data) setMaterials(materialsRes.data);
    setLoading(false);
  };

  const selectProduct = async (product: Product) => {
    setSelectedProduct(product);
    setRecipe([]);
    
    const { data, error } = await supabase
      .from('product_materials')
      .select('*, raw_materials(*)')
      .eq('product_id', product.id);
      
    if (!error && data) {
      setRecipe(data);
    }
  };

  const addMaterialToRecipe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct || !selectedMaterialId || !quantityUsed) return;

    const materialToAdd = materials.find(m => m.id === selectedMaterialId);
    if (!materialToAdd) return;

    const qty = parseFloat(quantityUsed);

    const { data, error } = await supabase.from('product_materials').insert([{
      product_id: selectedProduct.id,
      material_id: selectedMaterialId,
      quantity_used: qty
    }]).select('*, raw_materials(*)').single();

    if (error) {
      alert('Erro ao adicionar material: ' + error.message);
    } else if (data) {
      setRecipe([...recipe, data]);
      setSelectedMaterialId('');
      setQuantityUsed('1');
    }
  };

  const removeMaterialFromRecipe = async (id: string) => {
    const { error } = await supabase.from('product_materials').delete().eq('id', id);
    if (!error) {
      setRecipe(recipe.filter(item => item.id !== id));
    }
  };

  const calculateTotalCost = (recipeItems: ProductMaterial[]) => {
    return recipeItems.reduce((total, item) => {
      const baseSize = item.raw_materials.unit_size || 1;
      const costPerUnit = item.raw_materials.last_cost / baseSize;
      return total + (costPerUnit * item.quantity_used);
    }, 0);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto flex flex-col md:flex-row gap-8">
      {/* Esquerda: Lista de Produtos */}
      <div className="w-full md:w-1/3">
        <div className="flex items-center gap-4 mb-6">
          <Link to="/admin" className="p-2 bg-wood-200 text-wood-800 rounded-full hover:bg-wood-300">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-3xl font-bold text-wood-900">Margem e Receitas</h1>
        </div>

        <div className="bg-white rounded-lg shadow-md border border-wood-100 h-[400px] md:h-[calc(100vh-200px)] flex flex-col">
          <div className="p-4 border-b border-wood-100 bg-wood-50">
            <h2 className="font-bold text-wood-900">Seus Produtos</h2>
            <p className="text-sm text-gray-500">Selecione para ver o custo real</p>
          </div>
          
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {loading ? (
              <div className="flex justify-center p-4"><Loader2 className="animate-spin text-gold-500" /></div>
            ) : (
              products.map(product => (
                <button
                  key={product.id}
                  onClick={() => selectProduct(product)}
                  className={`w-full text-left p-3 rounded-md flex items-center gap-3 transition-colors ${selectedProduct?.id === product.id ? 'bg-gold-100 border-gold-300 border' : 'hover:bg-wood-50 border border-transparent'}`}
                >
                  <img src={product.image_url} alt="" className="w-10 h-10 rounded object-cover bg-gray-200" />
                  <div>
                    <p className="font-medium text-wood-900 line-clamp-1">{product.name}</p>
                    <p className="text-xs text-gray-500">Venda: R$ {product.price.toFixed(2)}</p>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Direita: Receita e Cálculo de Lucro */}
      <div className="w-full md:w-2/3 mt-14 md:mt-0">
        {!selectedProduct ? (
          <div className="h-full flex flex-col items-center justify-center text-gray-400 bg-wood-50 rounded-lg border border-dashed border-wood-300 p-8 text-center">
            <DollarSign size={48} className="mb-4 text-wood-300" />
            <p className="text-xl font-medium text-wood-700">Nenhum Produto Selecionado</p>
            <p>Selecione um produto ao lado para criar a ficha técnica e descobrir sua margem de lucro real.</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md border border-wood-100 overflow-hidden">
            {/* Header de Resumo */}
            <div className="p-6 bg-wood-800 text-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
              <div>
                <h2 className="text-2xl font-bold">{selectedProduct.name}</h2>
                <p className="text-wood-300">Resumo Financeiro</p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 text-left sm:text-right w-full sm:w-auto">
                <div className="flex justify-between sm:block">
                  <p className="text-wood-400 text-sm sm:mb-1">Custo (Insumos)</p>
                  <p className="text-xl font-bold text-red-400">R$ {calculateTotalCost(recipe).toFixed(2)}</p>
                </div>
                <div className="flex justify-between sm:block">
                  <p className="text-wood-400 text-sm sm:mb-1">Preço de Venda</p>
                  <p className="text-xl font-bold text-green-400">R$ {selectedProduct.price.toFixed(2)}</p>
                </div>
                <div className="pt-2 sm:pt-0 sm:pl-6 border-t sm:border-t-0 sm:border-l border-wood-600 flex justify-between sm:block">
                  <p className="text-wood-400 text-sm sm:mb-1">Lucro Bruto</p>
                  <p className="text-2xl font-bold text-gold-400">
                    R$ {(selectedProduct.price - calculateTotalCost(recipe)).toFixed(2)}
                  </p>
                </div>
              </div>
            </div>

            {/* Construir Receita */}
            <div className="p-6">
              <h3 className="text-lg font-bold text-wood-900 mb-4">Ficha Técnica (Insumos Gastos)</h3>
              
              <form onSubmit={addMaterialToRecipe} className="flex flex-col sm:flex-row items-start sm:items-end gap-4 mb-6 bg-wood-50 p-4 rounded-md">
                <div className="flex-1 w-full">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Buscar Insumo Cadastrado</label>
                  <select 
                    value={selectedMaterialId} 
                    onChange={e => setSelectedMaterialId(e.target.value)}
                    className="w-full border-gray-300 rounded-md bg-white"
                    required
                  >
                    <option value="">Selecione...</option>
                    {materials.map(m => (
                      <option key={m.id} value={m.id}>{m.name} (Ref: {m.unit_size} {m.unit})</option>
                    ))}
                  </select>
                </div>
                <div className="w-full sm:w-auto">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Qtd Usada</label>
                  <div className="flex items-center gap-2">
                    <input 
                      type="number" 
                      step="0.01" 
                      min="0.01" 
                      required
                      value={quantityUsed} 
                      onChange={e => setQuantityUsed(e.target.value)}
                      className="w-full sm:w-24 border-gray-300 rounded-md"
                    />
                    <span className="text-sm text-gray-500 w-8">
                      {selectedMaterialId ? materials.find(m => m.id === selectedMaterialId)?.unit : ''}
                    </span>
                  </div>
                </div>
                <button type="submit" className="w-full sm:w-auto bg-gold-500 text-wood-900 px-4 py-2 rounded-md font-semibold hover:bg-gold-600">
                  Adicionar
                </button>
              </form>

              <div className="border border-wood-200 rounded-md overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Insumo</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Qtd Usada</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Custo Ref.</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Custo Total</th>
                      <th className="px-4 py-3"></th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {recipe.map((item) => {
                      const baseSize = item.raw_materials.unit_size || 1;
                      const costPerUnit = item.raw_materials.last_cost / baseSize;
                      const totalItemCost = costPerUnit * item.quantity_used;

                      return (
                        <tr key={item.id}>
                          <td className="px-4 py-3 text-sm text-gray-900 font-medium">{item.raw_materials.name}</td>
                          <td className="px-4 py-3 text-sm text-gray-500">{item.quantity_used} {item.raw_materials.unit}</td>
                          <td className="px-4 py-3 text-sm text-gray-500">R$ {item.raw_materials.last_cost?.toFixed(2)} / {item.raw_materials.unit_size}{item.raw_materials.unit}</td>
                          <td className="px-4 py-3 text-sm text-gray-900 font-semibold text-right">R$ {totalItemCost.toFixed(2)}</td>
                          <td className="px-4 py-3 text-right text-sm font-medium">
                            <button onClick={() => removeMaterialFromRecipe(item.id)} className="text-red-400 hover:text-red-600">
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                    {recipe.length === 0 && (
                      <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-500">Nenhum insumo cadastrado na receita deste produto.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>

            </div>
          </div>
        )}
      </div>
    </div>
  );
};
