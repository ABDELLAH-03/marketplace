// src/pages/public/PublicShopLayout.jsx
import { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

export default function PublicShopLayout() {
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    window.dispatchEvent(new CustomEvent('public-search', { detail: search }));
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Top bar */}
      <div className="bg-[#3643BA] text-white text-xs text-center py-1.5">
        Livraison gratuite à partir de 500 MAD · Retour gratuit sous 30 jours
      </div>

      {/* Navbar */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="w-full px-6 py-3 flex items-center gap-6 max-w-screen-2xl mx-auto">
          <button onClick={() => navigate('/')} className="flex items-center gap-2 shrink-0">
            <div className="w-9 h-9 rounded-full bg-[#3643BA] flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="text-[#3643BA] font-black text-xl tracking-tight">MARKETPLACE</span>
          </button>

          <form onSubmit={handleSearch} className="flex-1 max-w-2xl">
            <div className="relative">
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Rechercher un produit, une marque..."
                className="w-full border border-gray-300 rounded-full pl-12 pr-4 py-2.5 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-[#3643BA]"
              />
            </div>
          </form>

          <div className="flex items-center gap-5 shrink-0">
            <button onClick={() => navigate('/login')} className="flex flex-col items-center gap-0.5 text-gray-600 hover:text-[#3643BA] transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span className="text-xs">Connexion</span>
            </button>
            <button onClick={() => navigate('/login')} className="flex flex-col items-center gap-0.5 text-gray-600 hover:text-[#3643BA] transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span className="text-xs">Panier</span>
            </button>
          </div>
        </div>

        <nav className="border-t border-gray-100">
          <div className="w-full max-w-screen-2xl mx-auto px-6 flex items-center gap-6 py-2 overflow-x-auto">
            {['Nos sports', 'Hommes', 'Femmes', 'Enfants', 'Accessoires', 'Équipements', 'Promotions', 'Tout < 99 DH'].map((item, i) => (
              <button
                key={item}
                className={`text-sm whitespace-nowrap pb-1 border-b-2 transition-colors ${
                  i === 6 ? 'text-[#3643BA] border-[#3643BA] font-semibold' : 'text-gray-700 border-transparent hover:border-gray-400'
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </nav>
      </header>

      {/* NO max-width wrapper here — let pages control their own layout */}
      <main className="flex-1 w-full bg-white">
        <Outlet context={{ searchQuery: search }} />
      </main>

      {/* Footer */}
      <footer className="bg-[#3643BA] text-white mt-16">
        <div className="border-b border-blue-500 py-8">
          <div className="max-w-screen-2xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: '🏆', title: 'Plus de 65 sports', desc: 'Une sélection pour chaque passion' },
              { icon: '🛡️', title: 'Garantie 2 ans', desc: 'Tous nos produits sont garantis min. 2 ans' },
              { icon: '🔄', title: 'Retour et échange', desc: 'Politique de retour simple et rapide' },
              { icon: '🚚', title: 'Livraison à domicile', desc: 'Commandez en ligne, recevez chez vous' },
            ].map((item) => (
              <div key={item.title} className="flex items-start gap-3">
                <span className="text-2xl">{item.icon}</span>
                <div>
                  <p className="font-semibold text-sm">{item.title}</p>
                  <p className="text-blue-200 text-xs mt-0.5">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="max-w-screen-2xl mx-auto px-6 py-10 grid grid-cols-2 md:grid-cols-5 gap-8">
          <div className="col-span-2 md:col-span-1">
            <span className="font-black text-lg block mb-3">MARKETPLACE</span>
            <p className="text-blue-200 text-xs leading-relaxed">Votre destination shopping pour tous vos besoins au meilleur prix.</p>
          </div>
          {[
            { title: 'NOS SERVICES', links: ['Carte cadeau', 'Click & Collect', 'Échange et remboursement'] },
            { title: 'UTILISATEUR', links: ['Mon compte', 'Mes commandes', 'Programme fidélité', 'CGU-CGV'] },
            { title: 'ACHETER EN LIGNE', links: ['Options de livraison', 'Moyens de paiement', 'Sécurité'] },
            { title: 'MARKETPLACE', links: ['Qui sommes-nous ?', 'Vendez avec nous', 'F.A.Q', 'Contact'] },
          ].map((col) => (
            <div key={col.title}>
              <p className="font-bold text-xs tracking-widest mb-3">{col.title}</p>
              <ul className="space-y-2">
                {col.links.map((l) => (
                  <li key={l}><a href="#" className="text-blue-200 text-xs hover:text-white transition-colors">{l}</a></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-blue-500 py-4">
          <p className="text-center text-blue-300 text-xs">* Tous les prix incluent la TVA. · Marketplace {new Date().getFullYear()} ©</p>
        </div>
      </footer>
    </div>
  );
}
