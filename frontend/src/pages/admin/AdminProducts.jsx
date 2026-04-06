// src/pages/admin/AdminProducts.jsx
import { useEffect, useState } from 'react';
import api from '../../api/axios';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    api.get('/api/admin/products/')
      .then((res) => setProducts(res.data))
      .catch(() => setError('Impossible de charger les produits.'))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    try {
      await api.delete(`/api/admin/products/${id}/`);
      setProducts(products.filter((p) => p.id !== id));
      setDeleteId(null);
    } catch {
      setError('Erreur lors de la suppression.');
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Produits</h1>
        <p className="text-gray-400 mt-1 text-sm">{products.length} produit(s) enregistré(s)</p>
      </div>

      {error && (
        <div className="mb-6 px-4 py-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
          {error}
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl h-32 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="text-left px-5 py-4 text-gray-400 font-medium">Produit</th>
                <th className="text-left px-5 py-4 text-gray-400 font-medium">Boutique</th>
                <th className="text-left px-5 py-4 text-gray-400 font-medium">Prix</th>
                <th className="text-left px-5 py-4 text-gray-400 font-medium">Stock</th>
                <th className="text-right px-5 py-4 text-gray-400 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product, i) => (
                <tr key={product.id} className={`border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors ${i === products.length - 1 ? 'border-b-0' : ''}`}>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      {product.image ? (
                        <img src={product.image} alt={product.name} className="w-8 h-8 rounded-lg object-cover" />
                      ) : (
                        <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center text-green-400 text-xs font-bold">
                          {product.name?.[0]?.toUpperCase() || 'P'}
                        </div>
                      )}
                      <span className="text-white font-medium">{product.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-gray-400">{product.store?.name || product.store}</td>
                  <td className="px-5 py-4 text-white font-semibold">{product.price} MAD</td>
                  <td className="px-5 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${
                      product.stock > 10
                        ? 'bg-green-500/10 text-green-400 border-green-500/20'
                        : product.stock > 0
                        ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                        : 'bg-red-500/10 text-red-400 border-red-500/20'
                    }`}>
                      {product.stock} unités
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    {deleteId === product.id ? (
                      <div className="flex items-center justify-end gap-2">
                        <span className="text-gray-400 text-xs">Confirmer ?</span>
                        <button onClick={() => handleDelete(product.id)} className="px-3 py-1 rounded-lg bg-red-500 text-white text-xs font-medium hover:bg-red-600 transition-colors">Oui</button>
                        <button onClick={() => setDeleteId(null)} className="px-3 py-1 rounded-lg bg-gray-700 text-white text-xs font-medium hover:bg-gray-600 transition-colors">Non</button>
                      </div>
                    ) : (
                      <button onClick={() => setDeleteId(product.id)} className="px-3 py-1.5 rounded-lg text-xs font-medium text-red-400 hover:bg-red-500/10 transition-colors border border-transparent hover:border-red-500/20">
                        Supprimer
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {products.length === 0 && (
            <div className="text-center py-12 text-gray-500">Aucun produit trouvé.</div>
          )}
        </div>
      )}
    </div>
  );
}
