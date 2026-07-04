import React, { useState, useEffect } from 'react';
import { ArrowLeft, PackagePlus, Receipt, Search, Upload, Loader2, Camera } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Link } from 'react-router-dom';

interface RawMaterial {
  id: string;
  name: string;
  photo_url: string | null;
  unit: string | null;
  unit_size: number | null;
  last_cost: number;
  average_cost: number;
  last_supplier: string | null;
}

export const MaterialsManager: React.FC = () => {
  const [materials, setMaterials] = useState<RawMaterial[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  
  const [selectedMaterial, setSelectedMaterial] = useState<RawMaterial | null>(null);

  const [name, setName] = useState('');
  const [unit, setUnit] = useState('unidade');
  const [unitSize, setUnitSize] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [photoUrl, setPhotoUrl] = useState('');
  
  // Optional initial purchase data
  const [initialPrice, setInitialPrice] = useState('');
  const [initialQuantity, setInitialQuantity] = useState('1');
  const [initialSupplier, setInitialSupplier] = useState('');

  // Form states for New Purchase
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [supplier, setSupplier] = useState('');

  useEffect(() => {
    fetchMaterials();
  }, []);

  const fetchMaterials = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('raw_materials').select('*').order('name');
    if (error) {
      console.error('Error fetching materials:', error);
    } else {
      setMaterials(data || []);
    }
    setLoading(false);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (!e.target.files || e.target.files.length === 0) return;
      const file = e.target.files[0];
      setIsUploading(true);

      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `materials/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('products')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('products').getPublicUrl(filePath);
      setPhotoUrl(data.publicUrl);
    } catch (error) {
      console.error('Upload error:', error);
      alert('Erro ao fazer upload da imagem.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleAddMaterial = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    let cost = 0;
    if (initialPrice && initialQuantity) {
      cost = parseFloat(initialPrice) / parseFloat(initialQuantity);
    }

    const { data: newMaterial, error } = await supabase.from('raw_materials').insert([{
      name,
      unit,
      unit_size: unitSize ? parseFloat(unitSize) : null,
      photo_url: photoUrl || null,
      last_cost: cost,
      last_supplier: initialSupplier || null
    }]).select().single();

    if (error) {
      alert('Erro ao salvar insumo: ' + error.message);
      return;
    }

    // Se informou preço, já cria a primeira nota fiscal (compra)
    if (newMaterial && initialPrice && initialQuantity) {
      await supabase.from('purchases').insert([{
        material_id: newMaterial.id,
        price: parseFloat(initialPrice),
        quantity: parseFloat(initialQuantity),
        supplier: initialSupplier || null
      }]);
    }

    setShowAddModal(false);
    resetForms();
    fetchMaterials();
  };

  const handleAddPurchase = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMaterial || !price || !quantity) return;

    const numPrice = parseFloat(price);
    const numQty = parseFloat(quantity);

    const { error: purchaseError } = await supabase.from('purchases').insert([{
      material_id: selectedMaterial.id,
      price: numPrice,
      quantity: numQty,
      supplier: supplier || null
    }]);

    if (purchaseError) {
      alert('Erro ao lançar compra: ' + purchaseError.message);
      return;
    }

    const { error: updateError } = await supabase.from('raw_materials')
      .update({
        last_cost: numPrice / numQty,
        last_supplier: supplier || null,
      })
      .eq('id', selectedMaterial.id);

    if (updateError) {
      console.error('Error updating material stats:', updateError);
    }

    setShowPurchaseModal(false);
    resetForms();
    fetchMaterials();
  };

  const resetForms = () => {
    setName('');
    setUnit('unidade');
    setUnitSize('');
    setPhotoUrl('');
    setInitialPrice('');
    setInitialQuantity('1');
    setInitialSupplier('');
    setPrice('');
    setQuantity('1');
    setSupplier('');
    setSelectedMaterial(null);
  };

  const filteredMaterials = materials.filter(m => 
    m.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 mb-8">
        <div className="flex items-center gap-4">
          <Link to="/admin" className="p-2 bg-wood-200 text-wood-800 rounded-full hover:bg-wood-300">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-3xl font-bold text-wood-900">Gestão de Insumos</h1>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-gold-500 text-wood-900 px-4 py-2 rounded-md hover:bg-gold-600 font-semibold transition-colors"
        >
          <PackagePlus size={20} />
          Novo Insumo
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8 border border-wood-100">
        <div className="flex gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Buscar insumo (ex: Cola, MDF, Fita)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-gold-500 focus:border-gold-500"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center p-8"><Loader2 className="animate-spin text-gold-500" size={32} /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-wood-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-wood-600 uppercase tracking-wider">Insumo</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-wood-600 uppercase tracking-wider">Medida</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-wood-600 uppercase tracking-wider">Último Custo (Unid)</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-wood-600 uppercase tracking-wider">Último Fornecedor</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-wood-600 uppercase tracking-wider">Ações</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredMaterials.map((material) => (
                  <tr key={material.id} className="hover:bg-wood-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0 bg-wood-200 rounded-md overflow-hidden flex items-center justify-center">
                          {material.photo_url ? (
                            <img className="h-10 w-10 object-cover" src={material.photo_url} alt="" />
                          ) : (
                            <span className="text-wood-400 text-xs">Sem foto</span>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{material.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {material.unit_size} {material.unit}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600">
                      R$ {Number(material.last_cost || 0).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {material.last_supplier || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => {
                          setSelectedMaterial(material);
                          setShowPurchaseModal(true);
                        }}
                        className="text-gold-600 hover:text-gold-800 bg-gold-50 px-3 py-1 rounded-md flex items-center gap-1 ml-auto"
                      >
                        <Receipt size={16} />
                        Lançar Nota
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredMaterials.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                      Nenhum insumo encontrado. Adicione um novo insumo primeiro.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Add Material */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold text-wood-900 mb-4">Novo Insumo</h2>
            <form onSubmit={handleAddMaterial} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Insumo *</label>
                <input required type="text" value={name} onChange={e => setName(e.target.value)} className="w-full border-gray-300 rounded-md focus:ring-gold-500" placeholder="Ex: Cola Branca Extra, MDF 3mm..." />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Unidade</label>
                  <select value={unit} onChange={e => setUnit(e.target.value)} className="w-full border-gray-300 rounded-md">
                    <option value="unidade">Unidade (un)</option>
                    <option value="g">Gramas (g)</option>
                    <option value="kg">Quilos (kg)</option>
                    <option value="ml">Mililitros (ml)</option>
                    <option value="L">Litros (L)</option>
                    <option value="cm">Centímetros (cm)</option>
                    <option value="m">Metros (m)</option>
                    <option value="chapa">Chapa</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tamanho/Peso</label>
                  <input type="number" step="0.01" value={unitSize} onChange={e => setUnitSize(e.target.value)} className="w-full border-gray-300 rounded-md" placeholder="Ex: 250" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Foto do Produto (Opcional)</label>
                <div className="flex flex-wrap items-center gap-2 sm:gap-4">
                  {photoUrl && <img src={photoUrl} alt="Preview" className="w-16 h-16 object-cover rounded-md border" />}
                  <label className="cursor-pointer bg-wood-100 px-3 py-2 rounded-md hover:bg-wood-200 flex items-center gap-2 text-sm text-wood-800 transition-colors">
                    {isUploading ? <Loader2 className="animate-spin" size={16} /> : <Camera size={16} />}
                    <span className="hidden sm:inline">{isUploading ? 'Enviando...' : 'Câmera'}</span>
                    <input type="file" accept="image/*" capture="environment" onChange={handleImageUpload} className="hidden" disabled={isUploading} />
                  </label>
                  <label className="cursor-pointer bg-wood-100 px-3 py-2 rounded-md hover:bg-wood-200 flex items-center gap-2 text-sm text-wood-800 transition-colors">
                    {isUploading ? <Loader2 className="animate-spin" size={16} /> : <Upload size={16} />}
                    <span className="hidden sm:inline">{isUploading ? 'Enviando...' : 'Galeria'}</span>
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" disabled={isUploading} />
                  </label>
                </div>
              </div>

              <hr className="my-4 border-gray-200" />
              <h3 className="text-sm font-bold text-wood-800 mb-2">Primeira Compra (Opcional)</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Preço Total Pago (R$)</label>
                  <input type="number" step="0.01" min="0" value={initialPrice} onChange={e => setInitialPrice(e.target.value)} className="w-full border-gray-300 rounded-md focus:ring-gold-500" placeholder="0.00" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Qtd. Comprada</label>
                  <input type="number" step="0.01" min="0.01" value={initialQuantity} onChange={e => setInitialQuantity(e.target.value)} className="w-full border-gray-300 rounded-md focus:ring-gold-500" placeholder="1" />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Local da Compra / Fornecedor</label>
                <input type="text" value={initialSupplier} onChange={e => setInitialSupplier(e.target.value)} className="w-full border-gray-300 rounded-md focus:ring-gold-500" placeholder="Ex: Shopee, Papelaria Central..." />
              </div>

              <div className="flex gap-2 justify-end pt-4">
                <button type="button" onClick={() => { setShowAddModal(false); resetForms(); }} className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50">Cancelar</button>
                <button type="submit" disabled={isUploading} className="px-4 py-2 bg-gold-500 text-wood-900 rounded-md hover:bg-gold-600 font-medium">Salvar Insumo</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Purchase */}
      {showPurchaseModal && selectedMaterial && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold text-wood-900 mb-2">Lançar Nota (Compra)</h2>
            <p className="text-wood-600 mb-6">Lançando entrada para: <span className="font-semibold">{selectedMaterial.name}</span></p>
            <form onSubmit={handleAddPurchase} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Preço Total Pago (R$) *</label>
                  <input required type="number" step="0.01" min="0" value={price} onChange={e => setPrice(e.target.value)} className="w-full border-gray-300 rounded-md" placeholder="0.00" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Quantidade *</label>
                  <input required type="number" step="0.01" min="0.01" value={quantity} onChange={e => setQuantity(e.target.value)} className="w-full border-gray-300 rounded-md" placeholder="1" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Local da Compra / Fornecedor</label>
                <input type="text" value={supplier} onChange={e => setSupplier(e.target.value)} className="w-full border-gray-300 rounded-md" placeholder="Ex: Shopee, Papelaria Central..." />
              </div>
              <div className="bg-blue-50 p-3 rounded-md text-sm text-blue-800">
                <p>Custo Unitário Calculado: <strong>R$ {price && quantity ? (parseFloat(price) / parseFloat(quantity)).toFixed(2) : '0.00'}</strong></p>
              </div>
              <div className="flex gap-2 justify-end pt-4">
                <button type="button" onClick={() => { setShowPurchaseModal(false); resetForms(); }} className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50">Cancelar</button>
                <button type="submit" className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 font-medium">Salvar Lançamento</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
