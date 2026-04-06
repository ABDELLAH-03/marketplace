// src/pages/client/ShopPage.jsx
import { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import api from '../../api/axios';

export default function ShopPage() {
  const { setCartCount } = useOutletContext();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [search, setSearch] = useState('');
  const [addingId, setAddingId] = useState(null);
  const [successId, setSuccessId] = useState(null);

  useEffect(() => {
    api.get('/api/categories/').then((res) => setCategories(res.data)).catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    let url = '/api/products/';
    const params = [];
    if (selectedCategory) params.push(`category=${selectedCategory}`);
    if (params.length) url += '?' + params.join('&');

    api.get(url)
      .then((res) => setProducts(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [selectedCategory]);

  const handleAddToCart = async (productId) => {
    setAddingId(productId);
    try {
      await api.post('/api/cart/add/', { product_id: productId, quantity: 1 });
      setSuccessId(productId);
      setCartCount((prev) => prev + 1);
      setTimeout(() => setSuccessId(null), 2000);
    } catch {
    } finally {
      setAddingId(null);
    }
  };

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Boutique</h1>
        <p className="text-gray-400 mt-1 text-sm">{filtered.length} produit(s) disponible(s)</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        {/* Search */}
        <div className="relative flex-1">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher un produit..."
            className="w-full bg-gray-900 border border-gray-800 rounded-xl pl-10 pr-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-amber-400 transition-colors text-sm"
          />
        </div>

        {/* Category filter */}
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setSelectedCategory('')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors border ${
              selectedCategory === ''
                ? 'bg-amber-400 text-gray-950 border-amber-400'
                : 'bg-gray-900 text-gray-400 border-gray-800 hover:text-white hover:border-gray-600'
            }`}
          >
            Tout
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors border ${
                selectedCategory === cat.id
                  ? 'bg-amber-400 text-gray-950 border-amber-400'
                  : 'bg-gray-900 text-gray-400 border-gray-800 hover:text-white hover:border-gray-600'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Products grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-gray-900 border border-gray-800 rounded-2xl h-72 animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 bg-gray-900 border border-gray-800 rounded-2xl">
          <p className="text-gray-400">Aucun produit trouvé.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((product) => (
            <div key={product.id} className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden hover:border-gray-700 transition-all group">
              {/* Image */}
              <div className="h-44 bg-gray-800 overflow-hidden relative">
                {product.image ? (
                  <img
                    src={product.image.startsWith('http') ? product.image : `http://localhost:8000${product.image}`}
                    alt={product.name}
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
                {product.stock === 0 && (
                  <div className="absolute inset-0 bg-gray-950/70 flex items-center justify-center">
                    <span className="text-gray-400 text-sm font-medium">Rupture de stock</span>
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="p-4">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h3 className="text-white font-semibold text-sm truncate">{product.name}</h3>
                </div>
                {product.category && (
                  <p className="text-gray-500 text-xs mb-3">{product.category.name}</p>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-amber-400 font-bold">{product.price} MAD</span>
                  <button
                    onClick={() => handleAddToCart(product.id)}
                    disabled={product.stock === 0 || addingId === product.id}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                      successId === product.id
                        ? 'bg-green-500 text-white'
                        : product.stock === 0
                        ? 'bg-gray-800 text-gray-600 cursor-not-allowed'
                        : 'bg-amber-400 hover:bg-amber-300 text-gray-950'
                    }`}
                  >
                    {addingId === product.id ? (
                      <div className="w-3 h-3 border-2 border-gray-950 border-t-transparent rounded-full animate-spin" />
                    ) : successId === product.id ? (
                      <>
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                        Ajouté !
                      </>
                    ) : (
                      <>
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Ajouter
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
