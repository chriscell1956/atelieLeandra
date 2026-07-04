import React, { useState, useEffect } from 'react';
import { ArrowLeft, Search, Plus, Trash2, Send, Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Link } from 'react-router-dom';

interface RawMaterial {
  id: string;
  name: string;
  unit: string | null;
  unit_size: number | null;
  last_cost: number;
  last_supplier: string | null;
}

interface ShoppingListItem extends RawMaterial {
  buy_quantity: number;
}

export const ShoppingList: React.FC = () => {
  const [materials, setMaterials] = useState<RawMaterial[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [shoppingList, setShoppingList] = useState<ShoppingListItem[]>([]);

  useEffect(() => {
    fetchMaterials();
  }, []);

  const fetchMaterials = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('raw_materials').select('*').order('name');
    if (!error && data) {
      setMaterials(data);
    }
    setLoading(false);
  };

  const addToList = (material: RawMaterial) => {
    if (shoppingList.find(item => item.id === material.id)) return;
    setShoppingList([...shoppingList, { ...material, buy_quantity: 1 }]);
  };

  const removeFromList = (id: string) => {
    setShoppingList(shoppingList.filter(item => item.id !== id));
  };

  const updateQuantity = (id: string, qty: number) => {
    setShoppingList(shoppingList.map(item => 
      item.id === id ? { ...item, buy_quantity: Math.max(1, qty) } : item
    ));
  };

  const sendToWhatsApp = () => {
    if (shoppingList.length === 0) return;

    let message = `*🛍️ LISTA DE COMPRAS - ATELIÊ*\n\n`;
    
    let estimatedTotal = 0;

    shoppingList.forEach((item, index) => {
      const estimatedItemCost = item.last_cost * item.buy_quantity;
      estimatedTotal += estimatedItemCost;
      
      message += `${index + 1}. *${item.name}* (${item.unit_size || ''} ${item.unit || ''})\n`;
      message += `   Quantidade: ${item.buy_quantity}\n`;
      if (item.last_cost > 0) {
        message += `   Último Preço (unid): R$ ${item.last_cost.toFixed(2)}\n`;
      }
      if (item.last_supplier) {
        message += `   Último Local: ${item.last_supplier}\n`;
      }
      message += `\n`;
    });

    message += `*Estimativa Total:* R$ ${estimatedTotal.toFixed(2)}\n`;

    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/?text=${encodedMessage}`, '_blank');
  };

  const filteredMaterials = materials.filter(m => 
    m.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 max-w-7xl mx-auto flex flex-col md:flex-row gap-8">
      {/* Esquerda: Busca e Seleção */}
      <div className="w-full md:w-1/2">
        <div className="flex items-center gap-4 mb-6">
          <Link to="/admin" className="p-2 bg-wood-200 text-wood-800 rounded-full hover:bg-wood-300">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-3xl font-bold text-wood-900">Montar Lista</h1>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border border-wood-100 h-[500px] md:h-[calc(100vh-200px)] flex flex-col">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Buscar insumos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-gold-500"
            />
          </div>

          <div className="flex-1 overflow-y-auto pr-2">
            {loading ? (
              <div className="flex justify-center p-8"><Loader2 className="animate-spin text-gold-500" /></div>
            ) : (
              <div className="space-y-2">
                {filteredMaterials.map(material => (
                  <div key={material.id} className="flex items-center justify-between p-3 bg-wood-50 rounded-md hover:bg-wood-100 transition-colors">
                    <div>
                      <p className="font-semibold text-wood-900">{material.name}</p>
                      <p className="text-xs text-gray-500">{material.unit_size} {material.unit} • Último: R$ {material.last_cost?.toFixed(2)}</p>
                    </div>
                    <button
                      onClick={() => addToList(material)}
                      disabled={shoppingList.some(item => item.id === material.id)}
                      className="p-2 bg-gold-100 text-gold-700 rounded-md hover:bg-gold-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Plus size={18} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Direita: A Lista de Compras */}
      <div className="w-full md:w-1/2">
        <div className="bg-white rounded-lg shadow-md border border-wood-100 h-[500px] md:h-[calc(100vh-140px)] flex flex-col mt-4 md:mt-0">
          <div className="p-4 border-b border-wood-100 bg-wood-50 rounded-t-lg">
            <h2 className="text-xl font-bold text-wood-900">Sua Lista de Compras</h2>
            <p className="text-sm text-wood-600">{shoppingList.length} itens selecionados</p>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {shoppingList.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-gray-400">
                <p>Nenhum item na lista ainda.</p>
                <p className="text-sm">Busque e adicione os insumos ao lado.</p>
              </div>
            ) : (
              shoppingList.map(item => (
                <div key={item.id} className="border border-wood-200 rounded-md p-3 relative bg-white">
                  <button 
                    onClick={() => removeFromList(item.id)}
                    className="absolute top-2 right-2 text-red-400 hover:text-red-600"
                  >
                    <Trash2 size={16} />
                  </button>
                  <p className="font-semibold text-wood-900 pr-6">{item.name}</p>
                  <div className="text-sm text-gray-600 mt-1 grid grid-cols-2 gap-2">
                    <div>
                      <p className="text-xs text-gray-400">Último Fornecedor</p>
                      <p>{item.last_supplier || 'Não registrado'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Último Preço (un)</p>
                      <p>R$ {item.last_cost?.toFixed(2)}</p>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center gap-3">
                    <label className="text-sm font-medium text-gray-700">Comprar:</label>
                    <input 
                      type="number" 
                      min="1" 
                      value={item.buy_quantity}
                      onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)}
                      className="w-20 border-gray-300 rounded-md py-1 px-2 text-sm"
                    />
                    <span className="text-sm text-gray-500">
                      {item.unit_size && item.unit ? `(${item.unit_size} ${item.unit} cada)` : ''}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="p-4 border-t border-wood-100 bg-wood-50 rounded-b-lg">
            <button
              onClick={sendToWhatsApp}
              disabled={shoppingList.length === 0}
              className="w-full flex items-center justify-center gap-2 bg-green-500 text-white py-3 rounded-md hover:bg-green-600 font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send size={20} />
              Enviar Lista para WhatsApp
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
