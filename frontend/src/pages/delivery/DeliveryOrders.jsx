// src/pages/delivery/DeliveryOrders.jsx
import { useEffect, useState } from 'react';
import api from '../../api/axios';

function OrderCard({ order, onAction, processingId, actionLabel, actionColor, badge }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
      {/* Header */}
      <div
        className="flex items-center justify-between p-5 cursor-pointer hover:bg-gray-800/30 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
            </svg>
          </div>
          <div>
            <p className="text-white font-semibold text-sm">Commande #{order.id}</p>
            <p className="text-gray-500 text-xs mt-0.5">
              {new Date(order.created_at).toLocaleDateString('fr-FR', {
                day: 'numeric', month: 'long', year: 'numeric'
              })}
              {' · '}{order.items?.length || order.products?.length || 0} article(s)
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {badge}
          <span className="text-amber-400 font-bold text-sm">
            {parseFloat(order.total_amount).toFixed(2)} MAD
          </span>
          <svg className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}
            fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {/* Expanded */}
      {expanded && (
        <div className="border-t border-gray-800">
          {(order.items || order.products)?.length > 0 ? (
            <div className="divide-y divide-gray-800/60">
              {(order.items || order.products).map((item, i) => (
                <div key={i} className="flex items-center gap-4 px-5 py-3">
                  <div className="w-10 h-10 rounded-lg bg-gray-800 overflow-hidden flex-shrink-0">
                    {item.product?.image ? (
                      <img
                        src={item.product.image.startsWith('http') ? item.product.image : `${import.meta.env.VITE_API_URL}${item.product.image}`}
                        alt={item.product?.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                            d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-white text-sm font-medium">
                      {item.product?.name || `Produit #${item.product}`}
                    </p>
                    <p className="text-gray-500 text-xs">Qté : {item.quantity}</p>
                  </div>
                  <p className="text-amber-400 text-sm font-semibold">
                    {parseFloat(item.price || item.product?.price || 0).toFixed(2)} MAD
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="px-5 py-4 text-gray-500 text-sm">Aucun détail disponible.</p>
          )}

          {onAction && (
            <div className="px-5 py-4 bg-gray-800/20 border-t border-gray-800">
              <button
                onClick={() => onAction(order.id)}
                disabled={processingId === order.id}
                className={`w-full ${actionColor} text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed`}
              >
                {processingId === order.id ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : actionLabel}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function DeliveryOrders() {
  const [pending, setPending] = useState([]);
  const [delivered, setDelivered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [processingId, setProcessingId] = useState(null);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      api.get('/api/orders/delivery/'),
      api.get('/api/orders/delivery/history/'),
    ])
      .then(([pendingRes, historyRes]) => {
        setPending(pendingRes.data);
        setDelivered(historyRes.data);
      })
      .catch(() => setError('Impossible de charger les commandes.'))
      .finally(() => setLoading(false));
  }, []);

  const handleDeliver = async (orderId) => {
    setProcessingId(orderId);
    try {
      await api.patch(`/api/orders/delivery/${orderId}/delivered/`);
      const order = pending.find((o) => o.id === orderId);
      if (order) {
        setPending(pending.filter((o) => o.id !== orderId));
        setDelivered([{ ...order, status: 'DELIVERED' }, ...delivered]);
      }
    } catch {
      setError('Erreur lors de la mise à jour.');
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl h-20 animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {error && (
        <div className="px-4 py-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Section 1 — À livrer */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          <h2 className="text-lg font-bold text-white">À livrer</h2>
          <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 text-xs font-semibold border border-amber-500/20">
            {pending.length}
          </span>
        </div>

        {pending.length === 0 ? (
          <div className="text-center py-12 bg-gray-900 border border-gray-800 rounded-2xl">
            <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-gray-400 text-sm">Aucune commande en attente de livraison.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {pending.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                onAction={handleDeliver}
                processingId={processingId}
                actionLabel="✓ Marquer comme livrée"
                actionColor="bg-orange-500 hover:bg-orange-400"
                badge={
                  <span className="px-2.5 py-1 rounded-full text-xs font-medium border bg-amber-500/10 text-amber-400 border-amber-500/20">
                    Prête
                  </span>
                }
              />
            ))}
          </div>
        )}
      </div>

      {/* Section 2 — Livrées */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          <h2 className="text-lg font-bold text-white">Déjà livrées</h2>
          <span className="px-2.5 py-0.5 rounded-full bg-green-500/10 text-green-400 text-xs font-semibold border border-green-500/20">
            {delivered.length}
          </span>
        </div>

        {delivered.length === 0 ? (
          <div className="text-center py-12 bg-gray-900 border border-gray-800 rounded-2xl">
            <p className="text-gray-500 text-sm">Aucune commande livrée pour l'instant.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {delivered.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                onAction={null}
                badge={
                  <span className="px-2.5 py-1 rounded-full text-xs font-medium border bg-green-500/10 text-green-400 border-green-500/20">
                    Livrée
                  </span>
                }
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
