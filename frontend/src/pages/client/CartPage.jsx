// src/pages/client/CartPage.jsx
import { useEffect, useState } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import api from '../../api/axios';

export default function CartPage() {
  const { setCartCount } = useOutletContext();
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchCart = () => {
    setLoading(true);
    api.get('/api/cart/')
      .then((res) => {
        setCartItems(res.data);
        setCartCount(res.data.length);
      })
      .catch(() => setError('Impossible de charger le panier.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchCart(); }, []);

  const total = cartItems.reduce((sum, item) => {
    const price = parseFloat(item.product?.price || 0);
    return sum + price * item.quantity;
  }, 0);

  const handleQuantityChange = async (item, newQty) => {
    if (newQty < 1) return;
    setCartItems((prev) =>
      prev.map((i) => i.id === item.id ? { ...i, quantity: newQty } : i)
    );
    try {
      await api.patch(`/api/cart/${item.id}/`, { quantity: newQty });
    } catch {
      fetchCart();
    }
  };

  const handleRemove = async (itemId) => {
    try {
      await api.delete(`/api/cart/${itemId}/`);
      const updated = cartItems.filter((i) => i.id !== itemId);
      setCartItems(updated);
      setCartCount(updated.length);
    } catch {
      setError('Erreur lors de la suppression.');
    }
  };

  const handleConfirmOrder = async () => {
    setConfirming(true);
    setError('');
    try {
      await api.post('/api/order/confirm/');
      setSuccess('Commande confirmée avec succès ! 🎉');
      setCartItems([]);
      setCartCount(0);
      setTimeout(() => navigate('/shop/orders'), 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Erreur lors de la confirmation.');
    } finally {
      setConfirming(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Mon Panier</h1>
        <p className="text-gray-400 mt-1 text-sm">{cartItems.length} article(s)</p>
      </div>

      {error && (
        <div className="mb-6 px-4 py-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-6 px-4 py-3 bg-green-500/10 border border-green-500/30 rounded-xl text-green-400 text-sm">
          {success}
        </div>
      )}

      {loading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl h-24 animate-pulse" />
          ))}
        </div>
      ) : cartItems.length === 0 && !success ? (
        <div className="text-center py-20 bg-gray-900 border border-gray-800 rounded-2xl">
          <div className="w-16 h-16 rounded-2xl bg-amber-400/10 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <p className="text-gray-400 text-sm">Votre panier est vide.</p>
          <button onClick={() => navigate('/shop')} className="mt-4 text-amber-400 hover:text-amber-300 text-sm font-medium transition-colors">
            Continuer les achats →
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Items */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden divide-y divide-gray-800">
            {cartItems.map((item) => {
              const price = parseFloat(item.product?.price || 0);
              const subtotal = (price * item.quantity).toFixed(2);
              return (
                <div key={item.id} className="flex items-center gap-4 p-4">
                  {/* Image */}
                  <div className="w-16 h-16 rounded-xl bg-gray-800 overflow-hidden flex-shrink-0">
                    {item.product?.image ? (
                      <img
                        src={item.product.image.startsWith('http') ? item.product.image : `http://localhost:8000${item.product.image}`}
                        alt={item.product?.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                            d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium text-sm truncate">
                      {item.product?.name || `Produit #${item.product}`}
                    </p>
                    <p className="text-gray-500 text-xs mt-0.5">{price.toFixed(2)} MAD / unité</p>

                    {/* Quantity controls */}
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => handleQuantityChange(item, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        className="w-7 h-7 rounded-lg bg-gray-800 hover:bg-gray-700 text-white flex items-center justify-center transition-colors disabled:opacity-40 disabled:cursor-not-allowed text-lg leading-none"
                      >
                        −
                      </button>
                      <span className="text-white font-semibold text-sm w-6 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => handleQuantityChange(item, item.quantity + 1)}
                        className="w-7 h-7 rounded-lg bg-gray-800 hover:bg-gray-700 text-white flex items-center justify-center transition-colors text-lg leading-none"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Price + Remove */}
                  <div className="flex flex-col items-end gap-2">
                    <p className="text-amber-400 font-bold text-sm">{subtotal} MAD</p>
                    <button
                      onClick={() => handleRemove(item.id)}
                      className="text-gray-600 hover:text-red-400 transition-colors"
                      title="Supprimer"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Summary */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-gray-400 text-sm">Sous-total</span>
              <span className="text-white font-semibold">{total.toFixed(2)} MAD</span>
            </div>
            <div className="flex items-center justify-between mb-5 pb-4 border-b border-gray-800">
              <span className="text-gray-400 text-sm">Livraison</span>
              <span className="text-green-400 text-sm font-medium">Gratuit</span>
            </div>
            <div className="flex items-center justify-between mb-6">
              <span className="text-white font-bold">Total</span>
              <span className="text-amber-400 font-bold text-xl">{total.toFixed(2)} MAD</span>
            </div>

            <button
              onClick={handleConfirmOrder}
              disabled={confirming || cartItems.length === 0}
              className="w-full bg-amber-400 hover:bg-amber-300 text-gray-950 font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {confirming ? (
                <div className="w-5 h-5 border-2 border-gray-950 border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Confirmer la commande
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
