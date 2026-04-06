// src/pages/admin/AdminOrders.jsx
import { useEffect, useState } from 'react';
import api from '../../api/axios';

const STATUS_STYLES = {
  PAID:             'bg-blue-500/10 text-blue-400 border-blue-500/20',
  READY_TO_DELIVER: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  DELIVERED:        'bg-green-500/10 text-green-400 border-green-500/20',
  CANCELLED:        'bg-red-500/10 text-red-400 border-red-500/20',
};

const STATUS_LABELS = {
  PAID: 'Payée',
  READY_TO_DELIVER: 'Prête',
  DELIVERED: 'Livrée',
  CANCELLED: 'Annulée',
};

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('ALL');

  useEffect(() => {
    api.get('/api/admin/orders/')
      .then((res) => setOrders(res.data))
      .catch(() => setError('Impossible de charger les commandes.'))
      .finally(() => setLoading(false));
  }, []);

  const filtered = filter === 'ALL' ? orders : orders.filter((o) => o.status === filter);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Commandes</h1>
        <p className="text-gray-400 mt-1 text-sm">{orders.length} commande(s) au total</p>
      </div>

      {error && (
        <div className="mb-6 px-4 py-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Filters */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {['ALL', 'PAID', 'READY_TO_DELIVER', 'DELIVERED', 'CANCELLED'].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all border ${
              filter === s
                ? 'bg-amber-400 text-gray-950 border-amber-400'
                : 'bg-gray-900 text-gray-400 border-gray-800 hover:border-gray-600 hover:text-white'
            }`}
          >
            {s === 'ALL' ? 'Toutes' : STATUS_LABELS[s]}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl h-16 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="text-left px-5 py-4 text-gray-400 font-medium">#</th>
                <th className="text-left px-5 py-4 text-gray-400 font-medium">Client</th>
                <th className="text-left px-5 py-4 text-gray-400 font-medium">Montant</th>
                <th className="text-left px-5 py-4 text-gray-400 font-medium">Statut</th>
                <th className="text-left px-5 py-4 text-gray-400 font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((order, i) => (
                <tr key={order.id} className={`border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors ${i === filtered.length - 1 ? 'border-b-0' : ''}`}>
                  <td className="px-5 py-4 text-gray-400 font-mono">#{order.id}</td>
                  <td className="px-5 py-4 text-white">{order.user}</td>
                  <td className="px-5 py-4 text-white font-semibold">{order.total_amount} MAD</td>
                  <td className="px-5 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${STATUS_STYLES[order.status] || 'bg-gray-700 text-gray-300'}`}>
                      {STATUS_LABELS[order.status] || order.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-gray-400">
                    {new Date(order.created_at).toLocaleDateString('fr-FR')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="text-center py-12 text-gray-500">Aucune commande trouvée.</div>
          )}
        </div>
      )}
    </div>
  );
}
