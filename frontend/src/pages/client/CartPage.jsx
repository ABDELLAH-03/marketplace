// src/pages/client/CartPage.jsx
import { useEffect, useState } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import api from '../../api/axios';

const IMG = (src) => src ? (src.startsWith('http') ? src : `${import.meta.env.VITE_API_URL}${src}`) : null;

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
    api.get('/api/cart/').then((res) => { setCartItems(res.data); setCartCount(res.data.length); })
      .catch(() => setError('Impossible de charger le panier.')).finally(() => setLoading(false));
  };
  useEffect(() => { fetchCart(); }, []);

  const total = cartItems.reduce((sum, item) => sum + parseFloat(item.product?.price || 0) * item.quantity, 0);

  const handleQuantityChange = async (item, newQty) => {
    if (newQty < 1) return;
    setCartItems((prev) => prev.map((i) => i.id === item.id ? { ...i, quantity: newQty } : i));
    try { await api.patch(`/api/cart/${item.id}/`, { quantity: newQty }); } catch { fetchCart(); }
  };

  const handleRemove = async (itemId) => {
    try {
      await api.delete(`/api/cart/${itemId}/`);
      const updated = cartItems.filter((i) => i.id !== itemId);
      setCartItems(updated); setCartCount(updated.length);
    } catch { setError('Erreur lors de la suppression.'); }
  };

  const handleConfirmOrder = async () => {
    setConfirming(true); setError('');
    try {
      await api.post('/api/order/confirm/');
      setSuccess('Commande confirmée avec succès ! 🎉');
      setCartItems([]); setCartCount(0);
      setTimeout(() => navigate('/shop/orders'), 2000);
    } catch (err) { setError(err.response?.data?.error || 'Erreur lors de la confirmation.');
    } finally { setConfirming(false); }
  };

  return (
    <div className="max-w-screen-2xl mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Mon Panier</h1>
        <p className="text-gray-500 mt-1 text-sm">{cartItems.length} article(s)</p>
      </div>

      {error && <div className="mb-6 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">{error}</div>}
      {success && <div className="mb-6 px-4 py-3 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm">{success}</div>}

      {loading ? (
        <div className="space-y-3">{[...Array(3)].map((_, i) => <div key={i} className="bg-gray-100 rounded-xl h-24 animate-pulse" />)}</div>
      ) : cartItems.length === 0 && !success ? (
        <div className="text-center py-20 border border-dashed border-gray-200 rounded-2xl">
          <svg className="w-16 h-16 text-gray-200 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <p className="text-gray-400">Votre panier est vide.</p>
          <button onClick={() => navigate('/shop')} className="mt-4 text-[#3643BA] font-semibold text-sm hover:underline">Continuer les achats →</button>
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Items */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden divide-y divide-gray-100">
              {cartItems.map((item) => {
                const price = parseFloat(item.product?.price || 0);
                return (
                  <div key={item.id} className="flex items-center gap-4 p-4">
                    <div className="w-20 h-20 rounded-xl bg-gray-50 border border-gray-100 overflow-hidden flex-shrink-0 flex items-center justify-center">
                      {IMG(item.product?.image) ? (
                        <img src={IMG(item.product.image)} alt={item.product?.name} className="w-full h-full object-contain p-1" />
                      ) : (
                        <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14" />
                        </svg>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-gray-800 font-semibold text-sm truncate">{item.product?.name || `Produit #${item.product}`}</p>
                      <p className="text-gray-400 text-xs mt-0.5">{price.toFixed(2)} MAD / unité</p>
                      <div className="flex items-center gap-2 mt-2">
                        <button onClick={() => handleQuantityChange(item, item.quantity - 1)} disabled={item.quantity <= 1}
                          className="w-7 h-7 rounded-full border border-gray-300 text-gray-600 flex items-center justify-center hover:border-[#3643BA] hover:text-[#3643BA] transition-colors disabled:opacity-30 text-lg leading-none">−</button>
                        <span className="text-gray-800 font-semibold text-sm w-6 text-center">{item.quantity}</span>
                        <button onClick={() => handleQuantityChange(item, item.quantity + 1)}
                          className="w-7 h-7 rounded-full border border-gray-300 text-gray-600 flex items-center justify-center hover:border-[#3643BA] hover:text-[#3643BA] transition-colors text-lg leading-none">+</button>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <p className="text-gray-900 font-bold text-sm">{(price * item.quantity).toFixed(2)} MAD</p>
                      <button onClick={() => handleRemove(item.id)} className="text-gray-300 hover:text-red-500 transition-colors" title="Supprimer">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
            <button onClick={() => navigate('/shop')} className="text-[#3643BA] text-sm font-semibold hover:underline flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/></svg>
              Continuer les achats
            </button>
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-gray-200 rounded-2xl p-6 sticky top-36">
              <h3 className="font-bold text-gray-900 text-lg mb-4">Récapitulatif</h3>
              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Sous-total ({cartItems.length} article{cartItems.length > 1 ? 's' : ''})</span>
                  <span className="text-gray-800 font-medium">{total.toFixed(2)} MAD</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Livraison</span>
                  <span className="text-green-600 font-medium">{total >= 500 ? 'Gratuit' : '29.00 MAD'}</span>
                </div>
              </div>
              <hr className="border-gray-100 mb-4" />
              <div className="flex justify-between mb-6">
                <span className="font-bold text-gray-900">Total TTC</span>
                <span className="font-black text-xl text-[#3643BA]">{(total >= 500 ? total : total + 29).toFixed(2)} MAD</span>
              </div>
              {total < 500 && (
                <p className="text-xs text-gray-400 mb-4 text-center">Ajoutez {(500 - total).toFixed(2)} MAD pour la livraison gratuite</p>
              )}
              <button onClick={handleConfirmOrder} disabled={confirming || cartItems.length === 0}
                className="w-full bg-[#3643BA] hover:bg-[#2a35a0] text-white font-bold py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed">
                {confirming ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> :
                  <><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/></svg>Commander</>}
              </button>
              <p className="text-xs text-gray-400 mt-3 text-center">Paiement sécurisé · Retour gratuit</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
