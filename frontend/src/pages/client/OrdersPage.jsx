// src/pages/client/OrdersPage.jsx
import { useEffect, useState } from 'react';
import api from '../../api/axios';

const STATUS_STYLES = {
  PAID:             { label: 'Payée',     color: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
  READY_TO_DELIVER: { label: 'En route',  color: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
  DELIVERED:        { label: 'Livrée',    color: 'bg-green-500/10 text-green-400 border-green-500/20' },
  CANCELLED:        { label: 'Annulée',   color: 'bg-red-500/10 text-red-400 border-red-500/20' },
};

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/api/orders/my/')
      .then((res) => setOrders(res.data))
      .catch(() => setError('Impossible de charger les commandes.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Mes Commandes</h1>
        <p className="text-gray-400 mt-1 text-sm">{orders.length} commande(s)</p>
      </div>

      {error && (
        <div className="mb-6 px-4 py-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
          {error}
        </div>
      )}

      {loading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl h-20 animate-pulse" />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-20 bg-gray-900 border border-gray-800 rounded-2xl">
          <div className="w-16 h-16 rounded-2xl bg-amber-400/10 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <p className="text-gray-400 text-sm">Aucune commande pour l'instant.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => {
            const status = STATUS_STYLES[order.status] || { label: order.status, color: 'bg-gray-700 text-gray-300 border-gray-600' };
            const isExpanded = expanded === order.id;

            return (
              <div key={order.id} className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden transition-all">
                {/* Header - clickable */}
                <div
                  className="flex items-center justify-between p-5 cursor-pointer hover:bg-gray-800/30 transition-colors"
                  onClick={() => setExpanded(isExpanded ? null : order.id)}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-amber-400/10 flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-white font-semibold text-sm">Commande #{order.id}</p>
                      <p className="text-gray-500 text-xs mt-0.5">
                        {new Date(order.created_at).toLocaleDateString('fr-FR', {
                          day: 'numeric', month: 'long', year: 'numeric'
                        })}
                        {' · '}
                        {order.items?.length || 0} article(s)
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${status.color}`}>
                      {status.label}
                    </span>
                    <span className="text-amber-400 font-bold text-sm">{parseFloat(order.total_amount).toFixed(2)} MAD</span>
                    <svg
                      className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                      fill="none" stroke="currentColor" viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>

                {/* Expanded — product details */}
                {isExpanded && (
                  <div className="border-t border-gray-800">
                    {order.items && order.items.length > 0 ? (
                      <>
                        <div className="divide-y divide-gray-800/60">
                          {order.items.map((item, i) => {
                            const price = parseFloat(item.product?.price || 0);
                            const subtotal = (price * item.quantity).toFixed(2);
                            return (
                              <div key={i} className="flex items-center gap-4 px-5 py-3">
                                {/* Image */}
                                <div className="w-12 h-12 rounded-xl bg-gray-800 overflow-hidden flex-shrink-0">
                                  {item.product?.image ? (
                                    <img
                                      src={item.product.image.startsWith('http') ? item.product.image : `http://localhost:8000${item.product.image}`}
                                      alt={item.product?.name}
                                      className="w-full h-full object-cover"
                                    />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                      <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                                          d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                      </svg>
                                    </div>
                                  )}
                                </div>

                                {/* Name + qty */}
                                <div className="flex-1 min-w-0">
                                  <p className="text-white text-sm font-medium truncate">
                                    {item.product?.name || `Produit #${item.product}`}
                                  </p>
                                  <p className="text-gray-500 text-xs mt-0.5">
                                    {price.toFixed(2)} MAD × {item.quantity}
                                  </p>
                                </div>

                                {/* Subtotal */}
                                <p className="text-amber-400 font-semibold text-sm flex-shrink-0">
                                  {subtotal} MAD
                                </p>
                              </div>
                            );
                          })}
                        </div>

                        {/* Total row */}
                        <div className="flex items-center justify-between px-5 py-3 bg-gray-800/30 border-t border-gray-800">
                          <span className="text-gray-400 text-sm">Total payé</span>
                          <span className="text-amber-400 font-bold">{parseFloat(order.total_amount).toFixed(2)} MAD</span>
                        </div>
                      </>
                    ) : (
                      <div className="px-5 py-4 text-gray-500 text-sm">
                        Aucun détail disponible pour cette commande.
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
