// src/pages/public/PublicProductDetail.jsx
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/axios';

const IMG = (src) =>
  src ? (src.startsWith('http') ? src : `${import.meta.env.VITE_API_URL}${src}`) : null;

function StarRating({ count = 4 }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <svg
          key={s}
          className={`w-4 h-4 ${s <= count ? 'text-yellow-400' : 'text-gray-200'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

function ProductCard({ product, onClick }) {
  return (
    <div
      onClick={() => onClick(product.id)}
      className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-all cursor-pointer group"
    >
      <div className="h-40 bg-gray-50 flex items-center justify-center overflow-hidden">
        {IMG(product.image) ? (
          <img
            src={IMG(product.image)}
            alt={product.name}
            className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <svg className="w-12 h-12 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        )}
      </div>
      <div className="p-3">
        {product.store && (
          <p className="text-[11px] text-gray-400 uppercase tracking-wide font-semibold">{product.store.name}</p>
        )}
        <h3 className="text-sm text-gray-800 mt-0.5 line-clamp-2 leading-snug">{product.name}</h3>
        <p className="text-sm font-bold text-gray-900 mt-2">{parseFloat(product.price).toFixed(2)} MAD</p>
      </div>
    </div>
  );
}

export default function PublicProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    setLoading(true);
    window.scrollTo(0, 0);
    api.get(`/api/products/`)
      .then((res) => {
        const found = res.data.find((p) => p.id === parseInt(id));
        setProduct(found || null);

        // Suggestions: same category, different product
        if (found?.category) {
          const sug = res.data.filter(
            (p) => p.category?.id === found.category.id && p.id !== found.id
          ).slice(0, 5);
          setSuggestions(sug);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-[1400px] mx-auto px-6 py-12">
        <div className="grid md:grid-cols-2 gap-10">
          <div className="bg-gray-100 rounded-2xl h-96 animate-pulse" />
          <div className="space-y-4">
            <div className="h-6 bg-gray-100 rounded w-1/3 animate-pulse" />
            <div className="h-10 bg-gray-100 rounded w-2/3 animate-pulse" />
            <div className="h-8 bg-gray-100 rounded w-1/4 animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-[1400px] mx-auto px-6 py-20 text-center">
        <p className="text-xl text-gray-400">Produit introuvable.</p>
        <button onClick={() => navigate('/')} className="mt-4 text-[#3643BA] underline text-sm">
          Retour à l'accueil
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto px-6 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8">
        <button onClick={() => navigate('/')} className="hover:text-[#3643BA] transition-colors">
          Accueil
        </button>
        <span>›</span>
        {product.category && (
          <>
            <button
              onClick={() => navigate('/')}
              className="hover:text-[#3643BA] transition-colors"
            >
              {product.category.name}
            </button>
            <span>›</span>
          </>
        )}
        <span className="text-gray-800 font-medium truncate max-w-xs">{product.name}</span>
      </nav>

      {/* Main product layout */}
      <div className="grid md:grid-cols-2 gap-10 mb-16">
        {/* Image */}
        <div className="bg-gray-50 rounded-2xl flex items-center justify-center p-8 min-h-80 border border-gray-100">
          {IMG(product.image) ? (
            <img
              src={IMG(product.image)}
              alt={product.name}
              className="max-h-80 object-contain w-full"
            />
          ) : (
            <div className="flex flex-col items-center gap-3 text-gray-300">
              <svg className="w-24 h-24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={0.8}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-sm">Aucune photo disponible</span>
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          {product.store && (
            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">
              {product.store.name}
            </p>
          )}
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3 leading-snug">
            {product.name}
          </h1>

          {/* Rating (decorative) */}
          <div className="flex items-center gap-2 mb-4">
            <StarRating count={4} />
            <span className="text-sm text-gray-500">4.3 · 128 avis</span>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3 mb-6">
            <span className="text-3xl font-black text-gray-900">
              {parseFloat(product.price).toFixed(2)} MAD
            </span>
            {product.stock > 0 && (
              <span className="text-xs bg-green-50 text-green-700 font-semibold px-2 py-0.5 rounded">
                En stock ({product.stock} disponible{product.stock > 1 ? 's' : ''})
              </span>
            )}
            {product.stock === 0 && (
              <span className="text-xs bg-red-50 text-red-600 font-semibold px-2 py-0.5 rounded">
                Rupture de stock
              </span>
            )}
          </div>

          {/* Category tag */}
          {product.category && (
            <div className="flex items-center gap-2 mb-6">
              <span className="text-xs text-gray-500">Catégorie :</span>
              <span className="text-xs bg-blue-50 text-[#3643BA] font-semibold px-3 py-1 rounded-full">
                {product.category.name}
              </span>
            </div>
          )}

          <hr className="border-gray-100 mb-6" />

          {/* Quantity selector */}
          <div className="flex items-center gap-4 mb-4">
            <span className="text-sm text-gray-600 font-medium">Quantité :</span>
            <div className="flex items-center border border-gray-300 rounded-full overflow-hidden">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-9 h-9 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors text-lg font-light"
              >
                −
              </button>
              <span className="w-10 text-center text-sm font-semibold text-gray-800">{quantity}</span>
              <button
                onClick={() => setQuantity((q) => Math.min(product.stock || 1, q + 1))}
                disabled={product.stock === 0}
                className="w-9 h-9 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors text-lg font-light disabled:opacity-30"
              >
                +
              </button>
            </div>
          </div>

          {/* Add to cart button */}
          <button
            onClick={() => navigate('/login')}
            disabled={product.stock === 0}
            className={`w-full py-3.5 rounded-lg font-bold text-base transition-colors mb-3 ${
              product.stock === 0
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-[#3643BA] hover:bg-[#2a35a0] text-white'
            }`}
          >
            {product.stock === 0 ? 'Indisponible' : 'Ajouter au panier'}
          </button>

          <p className="text-xs text-center text-gray-400 mb-6">
            Connectez-vous pour finaliser votre achat
          </p>

          {/* Delivery info */}
          <div className="space-y-3 border-t border-gray-100 pt-6">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-gray-400 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <div>
                <p className="text-sm font-semibold text-gray-800">Ramassage près de chez vous</p>
                <p className="text-xs text-green-600 flex items-center gap-1 mt-0.5">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full inline-block" />
                  Disponible en 2 jours ouvrables
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-gray-400 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <div>
                <p className="text-sm font-semibold text-gray-800">Livraison à domicile</p>
                <p className="text-xs text-green-600 flex items-center gap-1 mt-0.5">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full inline-block" />
                  Prêt en 2 jours ouvrables
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Suggestions */}
      {suggestions.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              Autres produits dans "{product.category?.name}"
            </h2>
            <button
              onClick={() => navigate('/')}
              className="text-[#3643BA] text-sm font-semibold hover:underline flex items-center gap-1"
            >
              Voir tout
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {suggestions.map((p) => (
              <ProductCard key={p.id} product={p} onClick={(pid) => navigate(`/product/${pid}`)} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
