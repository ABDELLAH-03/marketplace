// src/pages/public/PublicShopLayout.jsx
import { Outlet } from 'react-router-dom';

export default function PublicShopLayout() {
  return (
    <div className="min-h-screen bg-gray-950 flex flex-col">
      {/* Navbar */}
      <header className="bg-gray-900 border-b border-gray-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-400 flex items-center justify-center">
              <svg className="w-4 h-4 text-gray-950" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="text-white font-bold text-lg">Marketplace</span>
          </div>

          {/* Auth buttons */}
          <div className="flex items-center gap-3">
            <a
              href="/login"
              className="px-4 py-2 rounded-xl text-sm font-medium text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
            >
              Se connecter
            </a>
            <a
              href="/register"
              className="px-4 py-2 rounded-xl text-sm font-medium bg-amber-400 hover:bg-amber-300 text-gray-950 transition-colors"
            >
              S'inscrire
            </a>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-8">
        <Outlet />
      </main>
    </div>
  );
}
