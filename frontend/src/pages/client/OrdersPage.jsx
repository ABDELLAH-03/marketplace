// src/pages/client/OrdersPage.jsx
import { useEffect, useState } from 'react';
import api from '../../api/axios';

const IMG = (src) => src ? (src.startsWith('http') ? src : `${import.meta.env.VITE_API_URL}${src}`) : null;

const STATUS_CONFIG = {
  PAID:             { label: 'Confirmée', color: 'bg-blue-50 text-blue-700 border-blue-200', dot: 'bg-blue-500', step: 1 },
  READY_TO_DELIVER: { label: 'En livraison', color: 'bg-amber-50 text-amber-700 border-amber-200', dot: 'bg-amber-500', step: 2 },
  DELIVERED:        { label: 'Livrée', color: 'bg-green-50 text-green-700 border-green-200', dot: 'bg-green-500', step: 3 },
  CANCELLED:        { label: 'Annulée', color: 'bg-red-50 text-red-700 border-red-200', dot: 'bg-red-500', step: 0 },
};

function OrderProgress({ status }) {
  if (status === 'CANCELLED') return null;
  const steps = [
    { label: 'Confirmée', icon: '✓' },
    { label: 'En préparation', icon: '📦' },
    { label: 'En livraison', icon: '🚚' },
    { label: 'Livrée', icon: '🏠' },
  ];
  const cfg = STATUS_CONFIG[status] || {};
  const current = cfg.step || 1;
  return (
    <div className="px-5 py-4 bg-gray-50 border-t border-gray-100">
      <div className="flex items-center gap-0">
        {steps.map((s, i) => (
          <div key={i} className="flex items-center flex-1 last:flex-none">
            <div className={`flex flex-col items-center gap-1`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-colors ${
                i + 1 <= current ? 'bg-[#3643BA] border-[#3643BA] text-white' : 'bg-white border-gray-200 text-gray-400'}`}>
                {i + 1 <= current ? '✓' : i + 1}
              </div>
              <span className={`text-[10px] whitespace-nowrap ${i + 1 <= current ? 'text-[#3643BA] font-semibold' : 'text-gray-400'}`}>{s.label}</span>
            </div>
            {i < steps.length - 1 && (
              <div className={`flex-1 h-0.5 mx-1 mb-4 ${i + 1 < current ? 'bg-[#3643BA]' : 'bg-gray-200'}`} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/api/orders/my/').then((res) => setOrders(res.data))
      .catch(() => setError('Impossible de charger les commandes.')).finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-screen-2xl mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Mes Commandes</h1>
        <p className="text-gray-500 mt-1 text-sm">{orders.length} commande(s)</p>
      </div>

      {error && <div className="mb-6 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">{error}</div>}

      {loading ? (
        <div className="space-y-3">{[...Array(3)].map((_, i) => <div key={i} className="bg-gray-100 rounded-xl h-20 animate-pulse" />)}</div>
      ) : orders.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-gray-200 rounded-2xl">
          <svg className="w-16 h-16 text-gray-200 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <p className="text-gray-400">Aucune commande pour l'instant.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const cfg = STATUS_CONFIG[order.status] || { label: order.status, color: 'bg-gray-50 text-gray-600 border-gray-200', dot: 'bg-gray-400' };
            const isExpanded = expanded === order.id;
            return (
              <div key={order.id} className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-sm transition-shadow">
                {/* Header */}
                <div className="flex items-center justify-between p-5 cursor-pointer" onClick={() => setExpanded(isExpanded ? null : order.id)}>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                      <svg className="w-6 h-6 text-[#3643BA]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-gray-900 font-bold text-sm">Commande #{order.id}</p>
                      <p className="text-gray-400 text-xs mt-0.5">
                        {new Date(order.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                        {' · '}{order.items?.length || 0} article(s)
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${cfg.color}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                      {cfg.label}
                    </span>
                    <span className="text-gray-900 font-black text-sm">{parseFloat(order.total_amount).toFixed(2)} MAD</span>
                    <svg className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                      fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>

                {/* Expanded */}
                {isExpanded && (
                  <>
                    <OrderProgress status={order.status} />
                    <div className="border-t border-gray-100">
                      {order.items && order.items.length > 0 ? (
                        <>
                          <div className="divide-y divide-gray-50">
                            {order.items.map((item, i) => {
                              const price = parseFloat(item.product?.price || 0);
                              return (
                                <div key={i} className="flex items-center gap-4 px-5 py-3">
                                  <div className="w-14 h-14 rounded-xl bg-gray-50 border border-gray-100 overflow-hidden flex-shrink-0 flex items-center justify-center">
                                    {IMG(item.product?.image) ? (
                                      <img src={IMG(item.product.image)} alt={item.product?.name} className="w-full h-full object-contain p-1" />
                                    ) : (
                                      <svg className="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16" />
                                      </svg>
                                    )}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-gray-800 text-sm font-medium truncate">{item.product?.name || `Produit #${item.product}`}</p>
                                    <p className="text-gray-400 text-xs mt-0.5">{price.toFixed(2)} MAD × {item.quantity}</p>
                                  </div>
                                  <p className="text-gray-900 font-bold text-sm shrink-0">{(price * item.quantity).toFixed(2)} MAD</p>
                                </div>
                              );
                            })}
                          </div>
                          <div className="flex items-center justify-between px-5 py-3 bg-gray-50 border-t border-gray-100">
                            <span className="text-gray-500 text-sm">Total payé</span>
                            <span className="text-[#3643BA] font-black">{parseFloat(order.total_amount).toFixed(2)} MAD</span>
                          </div>
                        </>
                      ) : (
                        <div className="px-5 py-4 text-gray-400 text-sm">Aucun détail disponible.</div>
                      )}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
