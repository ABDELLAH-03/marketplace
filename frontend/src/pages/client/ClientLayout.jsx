// src/pages/client/ClientLayout.jsx
import { useState, useEffect } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';

export default function ClientLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [cartCount, setCartCount] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    api.get('/api/cart/').then((res) => setCartCount(res.data.length)).catch(() => {});
  }, []);

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Top bar */}
      <div className="bg-[#3643BA] text-white text-xs text-center py-1.5">
        Livraison gratuite à partir de 500 MAD · Retour gratuit sous 30 jours
      </div>

      {/* Navbar */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="w-full max-w-screen-2xl mx-auto px-6 py-3 flex items-center gap-6">
          {/* Logo */}
          <button onClick={() => navigate('/shop')} className="flex items-center gap-2 shrink-0">
            <div className="w-9 h-9 rounded-full bg-[#3643BA] flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="text-[#3643BA] font-black text-xl tracking-tight">MARKETPLACE</span>
          </button>

          {/* Search bar */}
          <div className="flex-1 max-w-2xl">
            <div className="relative">
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Rechercher un produit, une marque..."
                className="w-full border border-gray-300 rounded-full pl-12 pr-4 py-2.5 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-[#3643BA]"
                onChange={(e) => window.dispatchEvent(new CustomEvent('client-search', { detail: e.target.value }))}
              />
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-5 shrink-0">
            {/* Cart */}
            <NavLink to="/shop/cart" className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 relative transition-colors ${isActive ? 'text-[#3643BA]' : 'text-gray-600 hover:text-[#3643BA]'}`
            }>
              <div className="relative">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="text-xs">Panier</span>
            </NavLink>

            {/* Orders */}
            <NavLink to="/shop/orders" className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 transition-colors ${isActive ? 'text-[#3643BA]' : 'text-gray-600 hover:text-[#3643BA]'}`
            }>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <span className="text-xs">Commandes</span>
            </NavLink>

            {/* User avatar + logout */}
            <div className="relative">
              <button onClick={() => setMenuOpen((o) => !o)}
                className="flex flex-col items-center gap-0.5 text-gray-600 hover:text-[#3643BA] transition-colors">
                <div className="w-7 h-7 rounded-full bg-[#3643BA] flex items-center justify-center text-white font-bold text-sm">
                  {user?.name?.[0]?.toUpperCase() || 'U'}
                </div>
                <span className="text-xs">{user?.name?.split(' ')[0] || 'Moi'}</span>
              </button>
              {menuOpen && (
                <div className="absolute right-0 mt-2 w-44 bg-white border border-gray-200 rounded-xl shadow-lg py-2 z-50">
                  <p className="px-4 py-1.5 text-xs text-gray-400 font-medium">{user?.email}</p>
                  <hr className="my-1 border-gray-100" />
                  <button onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Déconnexion
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Nav links */}
        <nav className="border-t border-gray-100">
          <div className="w-full max-w-screen-2xl mx-auto px-6 flex items-center gap-6 py-2 overflow-x-auto">
            {['Nos sports', 'Hommes', 'Femmes', 'Enfants', 'Accessoires', 'Équipements', 'Promotions', 'Tout < 99 DH'].map((item, i) => (
              <button key={item}
                className={`text-sm whitespace-nowrap pb-1 border-b-2 transition-colors ${i === 6 ? 'text-[#3643BA] border-[#3643BA] font-semibold' : 'text-gray-700 border-transparent hover:border-gray-400'}`}>
                {item}
              </button>
            ))}
          </div>
        </nav>
      </header>

      {/* Content — NO max-width so hero can be full width */}
      <main className="flex-1 w-full bg-white" onClick={() => menuOpen && setMenuOpen(false)}>
        <Outlet context={{ cartCount, setCartCount }} />
      </main>

      {/* Footer */}
      <footer className="bg-[#3643BA] text-white mt-16">
        <div className="border-b border-blue-500 py-8">
          <div className="max-w-screen-2xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: '🏆', title: 'Plus de 65 sports', desc: 'Une sélection pour chaque passion' },
              { icon: '🛡️', title: 'Garantie 2 ans', desc: 'Min. 2 ans sur tous nos produits' },
              { icon: '🔄', title: 'Retour et échange', desc: 'Politique simple et rapide' },
              { icon: '🚚', title: 'Livraison à domicile', desc: 'Recevez chez vous en 2 jours' },
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
        <div className="border-t border-blue-500 py-4 mt-8">
          <p className="text-center text-blue-300 text-xs">* Tous les prix incluent la TVA. · Marketplace {new Date().getFullYear()} ©</p>
        </div>
      </footer>
    </div>
  );
}
