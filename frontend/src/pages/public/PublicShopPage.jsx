// src/pages/public/PublicShopPage.jsx
import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';

const IMG = (src) => src ? (src.startsWith('http') ? src : `${import.meta.env.VITE_API_URL}${src}`) : null;

const CAT_COLORS = [
  'from-blue-500 to-indigo-600',
  'from-emerald-500 to-teal-600',
  'from-orange-400 to-rose-500',
  'from-purple-500 to-pink-600',
  'from-amber-400 to-orange-500',
  'from-cyan-500 to-blue-600',
];
const CAT_ICONS = ['⚽', '🎾', '🏊', '🚴', '🏋️', '🤸', '🎿', '🏇'];

const SLIDES = [
  { bg: 'from-[#1a1a2e] to-[#6B21A8]', tag: 'OFFRE LIMITÉE', title: 'Profitez plus,\ndépensez moins !', sub: "Jusqu'à -50% sur une sélection de produits", cta: 'Découvrir les offres', accent: '#FACC15' },
  { bg: 'from-[#0f172a] to-[#1e3a5f]', tag: 'NOUVEAUTÉS', title: 'Nouvelle collection\nPrintemps 2025', sub: 'Les dernières tendances sont arrivées', cta: 'Voir la collection', accent: '#22D3EE' },
  { bg: 'from-[#1a1a1a] to-[#3643BA]', tag: 'LIVRAISON OFFERTE', title: 'Commandez dès\n500 MAD', sub: 'Et recevez chez vous en 2 jours ouvrables', cta: 'En profiter', accent: '#A3E635' },
];

function HeroCarousel() {
  const [current, setCurrent] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setCurrent((c) => (c + 1) % SLIDES.length), 5000);
    return () => clearInterval(t);
  }, []);
  const s = SLIDES[current];
  return (
    <div className={`relative w-full bg-gradient-to-r ${s.bg} text-white overflow-hidden`} style={{ minHeight: 380 }}>
      <div className="absolute -right-24 -top-24 w-96 h-96 rounded-full opacity-10 border-[50px] border-white" />
      <div className="absolute right-48 bottom-0 w-48 h-48 rounded-full opacity-10 border-[24px] border-white" />
      <div className="max-w-screen-2xl mx-auto px-10 py-16 flex flex-col md:flex-row items-center gap-10">
        <div className="flex-1">
          <span className="inline-block text-[11px] font-bold tracking-widest px-3 py-1 rounded-full mb-4" style={{ background: s.accent, color: '#000' }}>
            {s.tag}
          </span>
          <h1 className="text-4xl md:text-5xl font-black leading-tight whitespace-pre-line mb-4">{s.title}</h1>
          <p className="text-blue-200 text-base mb-8">{s.sub}</p>
          <button className="px-8 py-3 rounded-full font-bold text-sm hover:opacity-90 transition-opacity" style={{ background: s.accent, color: '#000' }}>
            {s.cta}
          </button>
        </div>
        <div className="hidden md:flex gap-4 shrink-0">
          {[{ pct: '-30%', label: 'sur les accessoires' }, { pct: '-50%', label: 'sur les équipements' }].map((b) => (
            <div key={b.label} className="bg-white/10 rounded-2xl p-6 w-44 text-center border border-white/20">
              <p className="text-4xl font-black" style={{ color: s.accent }}>{b.pct}</p>
              <p className="text-sm mt-1 text-blue-100">{b.label}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {SLIDES.map((_, i) => (
          <button key={i} onClick={() => setCurrent(i)}
            className={`h-2 rounded-full transition-all ${i === current ? 'bg-white w-6' : 'bg-white/40 w-2'}`} />
        ))}
      </div>
    </div>
  );
}

function ProductCard({ product, onNavigate }) {
  return (
    <div onClick={() => onNavigate(product.id)}
      className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-all cursor-pointer group">
      <div className="relative h-48 bg-gray-50 flex items-center justify-center overflow-hidden">
        {product.stock === 0 && (
          <span className="absolute top-2 left-2 z-10 bg-gray-700 text-white text-[10px] font-semibold px-2 py-0.5 rounded">Rupture</span>
        )}
        {IMG(product.image) ? (
          <img src={IMG(product.image)} alt={product.name}
            className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-300" />
        ) : (
          <div className="flex flex-col items-center gap-1 text-gray-300">
            <svg className="w-14 h-14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-xs">Photo à venir</span>
          </div>
        )}
      </div>
      <div className="p-3">
        {product.store && <p className="text-[11px] text-gray-400 uppercase tracking-wide font-semibold">{product.store.name}</p>}
        <h3 className="text-sm text-gray-800 mt-0.5 line-clamp-2 leading-snug">{product.name}</h3>
        {product.category && <p className="text-xs text-gray-400 mt-0.5">{product.category.name}</p>}
        <div className="mt-2">
          <span className="text-base font-bold text-gray-900">{parseFloat(product.price).toFixed(2)} MAD</span>
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); window.location.href = '/login'; }}
          disabled={product.stock === 0}
          className={`mt-3 w-full py-2 rounded text-sm font-semibold transition-colors ${product.stock === 0 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-[#3643BA] hover:bg-[#2a35a0] text-white'}`}
        >
          {product.stock === 0 ? 'Indisponible' : 'Ajouter au panier'}
        </button>
      </div>
    </div>
  );
}

export default function PublicShopPage() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [search, setSearch] = useState('');
  const productsRef = useRef(null);

  useEffect(() => {
    api.get('/api/categories/').then((res) => setCategories(res.data)).catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    let url = '/api/products/';
    if (selectedCategory) url += `?category=${selectedCategory}`;
    api.get(url).then((res) => setProducts(res.data)).catch(() => {}).finally(() => setLoading(false));
  }, [selectedCategory]);

  useEffect(() => {
    const handler = (e) => {
      setSearch(e.detail);
      productsRef.current?.scrollIntoView({ behavior: 'smooth' });
    };
    window.addEventListener('public-search', handler);
    return () => window.removeEventListener('public-search', handler);
  }, []);

  const filtered = products.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="text-gray-900">
      <HeroCarousel />

      {/* Categories strip */}
      {categories.length > 0 && (
        <div className="max-w-screen-2xl mx-auto px-6 py-10">
          <div className="flex gap-6 overflow-x-auto pb-2">
            {categories.map((cat, i) => (
              <button key={cat.id}
                onClick={() => { setSelectedCategory(cat.id); productsRef.current?.scrollIntoView({ behavior: 'smooth' }); }}
                className="flex flex-col items-center gap-2 shrink-0 group">
                <div className={`w-24 h-24 rounded-xl bg-gradient-to-br ${CAT_COLORS[i % CAT_COLORS.length]} flex items-center justify-center shadow-md group-hover:scale-105 transition-transform`}>
                  <span className="text-3xl text-white select-none">{CAT_ICONS[i % CAT_ICONS.length]}</span>
                </div>
                <span className="text-sm text-gray-700 font-medium">{cat.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Promo band — full width */}
      <div className="w-full bg-[#FEF08A] py-5">
        <div className="max-w-screen-2xl mx-auto px-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="font-black text-2xl text-gray-900">Marketplace baisse ses prix</p>
            <p className="text-gray-700 text-sm">Sur plus de 500 articles</p>
          </div>
          <button onClick={() => productsRef.current?.scrollIntoView({ behavior: 'smooth' })}
            className="bg-[#3643BA] text-white font-bold px-6 py-2.5 rounded-full hover:bg-[#2a35a0] transition-colors text-sm">
            Je fonce
          </button>
        </div>
      </div>

      {/* Products section */}
      <div ref={productsRef} className="max-w-screen-2xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {selectedCategory ? categories.find((c) => c.id === selectedCategory)?.name || 'Produits' : 'Tous les produits'}
          </h2>
          <span className="text-sm text-gray-500">{filtered.length} article(s)</span>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1 max-w-sm">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Filtrer les produits..."
              className="w-full border border-gray-300 rounded-full pl-9 pr-4 py-2 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-[#3643BA]" />
          </div>
          <div className="flex gap-2 flex-wrap">
            <button onClick={() => setSelectedCategory('')}
              className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${selectedCategory === '' ? 'bg-[#3643BA] text-white border-[#3643BA]' : 'border-gray-300 text-gray-600 hover:border-[#3643BA] hover:text-[#3643BA]'}`}>
              Tout
            </button>
            {categories.map((cat) => (
              <button key={cat.id} onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${selectedCategory === cat.id ? 'bg-[#3643BA] text-white border-[#3643BA]' : 'border-gray-300 text-gray-600 hover:border-[#3643BA] hover:text-[#3643BA]'}`}>
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {[...Array(10)].map((_, i) => <div key={i} className="bg-gray-100 rounded-lg h-72 animate-pulse" />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-gray-200 rounded-2xl">
            <p className="text-gray-400 text-lg">Aucun produit trouvé.</p>
            <button onClick={() => { setSearch(''); setSelectedCategory(''); }} className="mt-4 text-[#3643BA] text-sm underline">
              Réinitialiser les filtres
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} onNavigate={(id) => navigate(`/product/${id}`)} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
