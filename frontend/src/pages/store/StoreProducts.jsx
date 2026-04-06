// src/pages/store/StoreProducts.jsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';

export default function StoreProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteId, setDeleteId] = useState(null);

  const fetchProducts = () => {
    setLoading(true);
    api.get('/api/store-products/')
      .then((res) => setProducts(res.data))
      .catch(() => setError('Impossible de charger les produits.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleDelete = async (id) => {
    try {
      await api.delete(`/api/store-products/${id}/`);
      setProducts(products.filter((p) => p.id !== id));
      setDeleteId(null);
    } catch {
      setError('Erreur lors de la suppression.');
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Mes Produits</h1>
          <p className="text-gray-400 mt-1 text-sm">{products.length} produit(s) dans votre boutique</p>
        </div>
        <Link
          to="/store/products/create"
          className="flex items-center gap-2 px-4 py-2.5 bg-purple-500 hover:bg-purple-400 text-white rounded-xl text-sm font-medium transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Ajouter un produit
        </Link>
      </div>

      {error && (
        <div className="mb-6 px-4 py-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
          {error}
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-gray-900 border border-gray-800 rounded-2xl h-48 animate-pulse" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-20 bg-gray-900 border border-gray-800 rounded-2xl">
          <div className="w-16 h-16 rounded-2xl bg-purple-500/10 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <p className="text-gray-400 text-sm">Aucun produit pour l'instant.</p>
          <Link to="/store/products/create" className="mt-4 inline-block text-purple-400 hover:text-purple-300 text-sm font-medium transition-colors">
            Ajouter votre premier produit →
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((product) => (
            <div key={product.id} className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden hover:border-gray-700 transition-colors group">
              {/* Image */}
              <div className="h-40 bg-gray-800 relative overflow-hidden">
                {product.image ? (
                  <img
                    src={product.image.startsWith('http') ? product.image : `http://localhost:8000${product.image}`}                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <svg className="w-12 h-12 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                        d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  </div>
                )}
                {/* Stock badge */}
                <span className={`absolute top-3 right-3 px-2 py-1 rounded-lg text-xs font-medium ${
                  product.stock > 10
                    ? 'bg-green-500/20 text-green-400'
                    : product.stock > 0
                    ? 'bg-amber-500/20 text-amber-400'
                    : 'bg-red-500/20 text-red-400'
                }`}>
                  {product.stock} en stock
                </span>
              </div>

              {/* Info */}
              <div className="p-4">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h3 className="text-white font-semibold text-sm truncate">{product.name}</h3>
                  <span className="text-purple-400 font-bold text-sm flex-shrink-0">{product.price} MAD</span>
                </div>
                {product.category && (
                  <span className="text-xs text-gray-500">{product.category.name}</span>
                )}

                {/* Actions */}
                <div className="flex gap-2 mt-4">
                  <Link
                    to={`/store/products/edit/${product.id}`}
                    className="flex-1 text-center px-3 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-white text-xs font-medium transition-colors"
                  >
                    Modifier
                  </Link>
                  {deleteId === product.id ? (
                    <div className="flex gap-1">
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="px-3 py-2 rounded-xl bg-red-500 text-white text-xs font-medium hover:bg-red-600 transition-colors"
                      >
                        Oui
                      </button>
                      <button
                        onClick={() => setDeleteId(null)}
                        className="px-3 py-2 rounded-xl bg-gray-700 text-white text-xs font-medium hover:bg-gray-600 transition-colors"
                      >
                        Non
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setDeleteId(product.id)}
                      className="px-3 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-medium transition-colors border border-red-500/20"
                    >
                      Supprimer
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
