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
  PAID: 'Payée', READY_TO_DELIVER: 'Prête', DELIVERED: 'Livrée', CANCELLED: 'Annulée',
};
const STATUS_OPTIONS = ['PAID', 'READY_TO_DELIVER', 'DELIVERED', 'CANCELLED'];

function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-xl mx-4 shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800 sticky top-0 bg-gray-900">
          <h2 className="text-white font-semibold text-base">{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  );
}

export default function AdminOrders() {
  const [orders, setOrders]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');
  const [success, setSuccess] = useState('');
  const [filter, setFilter]   = useState('ALL');
  const [search, setSearch]   = useState('');

  const [viewOrder, setViewOrder]     = useState(null);
  const [editOrder, setEditOrder]     = useState(null);
  const [newStatus, setNewStatus]     = useState('');
  const [saving, setSaving]           = useState(false);

  useEffect(() => {
    api.get('/api/admin/orders/')
      .then((r) => setOrders(r.data))
      .catch(() => setError('Impossible de charger les commandes.'))
      .finally(() => setLoading(false));
  }, []);

  const flash = (msg) => { setSuccess(msg); setTimeout(() => setSuccess(''), 3000); };

  const openEdit = (order) => { setEditOrder(order); setNewStatus(order.status); };

  const handleStatusUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await api.patch(`/api/admin/orders/${editOrder.id}/`, { status: newStatus });
      setOrders(orders.map((o) => o.id === editOrder.id ? res.data : o));
      setEditOrder(null);
      flash('Statut mis à jour.');
    } catch {
      setError('Erreur lors de la mise à jour du statut.');
    } finally { setSaving(false); }
  };

  const filtered = orders.filter((o) => {
    const matchStatus = filter === 'ALL' || o.status === filter;
    const matchSearch = !search || 
      o.user_detail?.name?.toLowerCase().includes(search.toLowerCase()) ||
      o.user_detail?.email?.toLowerCase().includes(search.toLowerCase()) ||
      String(o.id).includes(search);
    return matchStatus && matchSearch;
  });

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Commandes</h1>
        <p className="text-gray-400 mt-1 text-sm">{orders.length} commande(s) au total</p>
      </div>

      {error && <div className="mb-5 px-4 py-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">{error}</div>}
      {success && <div className="mb-5 px-4 py-3 bg-green-500/10 border border-green-500/30 rounded-xl text-green-400 text-sm">{success}</div>}

      {/* Filters */}
      <div className="flex gap-2 mb-5 flex-wrap">
        {['ALL', ...STATUS_OPTIONS].map((s) => (
          <button key={s} onClick={() => setFilter(s)} className={`px-4 py-2 rounded-xl text-sm font-medium transition-all border ${filter === s ? 'bg-amber-400 text-gray-950 border-amber-400' : 'bg-gray-900 text-gray-400 border-gray-800 hover:border-gray-600 hover:text-white'}`}>
            {s === 'ALL' ? 'Toutes' : STATUS_LABELS[s]}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="mb-5 relative">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
        <input className="w-full bg-gray-900 border border-gray-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-amber-400 transition-colors" placeholder="Rechercher par client ou numéro de commande..." value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      {loading ? (
        <div className="space-y-3">{[...Array(5)].map((_, i) => <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl h-16 animate-pulse"/>)}</div>
      ) : (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="text-left px-5 py-4 text-gray-400 font-medium">#</th>
                <th className="text-left px-5 py-4 text-gray-400 font-medium">Client</th>
                <th className="text-left px-5 py-4 text-gray-400 font-medium">Articles</th>
                <th className="text-left px-5 py-4 text-gray-400 font-medium">Montant</th>
                <th className="text-left px-5 py-4 text-gray-400 font-medium">Statut</th>
                <th className="text-left px-5 py-4 text-gray-400 font-medium">Date</th>
                <th className="text-right px-5 py-4 text-gray-400 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((order, i) => (
                <tr key={order.id} className={`border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors ${i === filtered.length - 1 ? 'border-b-0' : ''}`}>
                  <td className="px-5 py-4 text-gray-400 font-mono text-xs">#{order.id}</td>
                  <td className="px-5 py-4">
                    <div>
                      <p className="text-white font-medium">{order.user_detail?.name || '—'}</p>
                      <p className="text-gray-500 text-xs">{order.user_detail?.email}</p>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-gray-800 text-gray-300 border border-gray-700">
                      {order.items_count} article(s)
                    </span>
                  </td>
                  <td className="px-5 py-4 text-white font-semibold">{order.total_amount} MAD</td>
                  <td className="px-5 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${STATUS_STYLES[order.status] || 'bg-gray-700 text-gray-300 border-gray-600'}`}>
                      {STATUS_LABELS[order.status] || order.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-gray-400">{new Date(order.created_at).toLocaleDateString('fr-FR')}</td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => setViewOrder(order)} className="px-3 py-1.5 rounded-lg text-xs font-medium text-blue-400 hover:bg-blue-500/10 border border-transparent hover:border-blue-500/20 transition-colors">Voir</button>
                      <button onClick={() => openEdit(order)} className="px-3 py-1.5 rounded-lg text-xs font-medium text-amber-400 hover:bg-amber-500/10 border border-transparent hover:border-amber-500/20 transition-colors">Statut</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && <div className="text-center py-12 text-gray-500">Aucune commande trouvée.</div>}
        </div>
      )}

      {/* View Order Modal */}
      {viewOrder && (
        <Modal title={`Commande #${viewOrder.id}`} onClose={() => setViewOrder(null)}>
          <div className="space-y-5">
            {/* Client */}
            <div>
              <p className="text-gray-500 text-xs font-medium mb-2 uppercase tracking-wide">Client</p>
              <div className="flex items-center gap-3 bg-gray-800 rounded-xl px-4 py-3">
                <div className="w-9 h-9 rounded-full bg-amber-400 flex items-center justify-center text-gray-950 font-bold text-sm flex-shrink-0">
                  {viewOrder.user_detail?.name?.[0]?.toUpperCase() || '?'}
                </div>
                <div>
                  <p className="text-white font-medium">{viewOrder.user_detail?.name || '—'}</p>
                  <p className="text-gray-400 text-xs">{viewOrder.user_detail?.email}</p>
                </div>
              </div>
            </div>

            {/* Order info */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-gray-800 rounded-xl px-4 py-3">
                <p className="text-gray-500 text-xs mb-1">Statut</p>
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${STATUS_STYLES[viewOrder.status] || ''}`}>
                  {STATUS_LABELS[viewOrder.status] || viewOrder.status}
                </span>
              </div>
              <div className="bg-gray-800 rounded-xl px-4 py-3">
                <p className="text-gray-500 text-xs mb-1">Total</p>
                <p className="text-white text-sm font-bold">{viewOrder.total_amount} MAD</p>
              </div>
              <div className="bg-gray-800 rounded-xl px-4 py-3">
                <p className="text-gray-500 text-xs mb-1">Date</p>
                <p className="text-white text-sm">{new Date(viewOrder.created_at).toLocaleDateString('fr-FR')}</p>
              </div>
            </div>

            {/* Items */}
            <div>
              <p className="text-gray-500 text-xs font-medium mb-2 uppercase tracking-wide">Articles ({viewOrder.items_count})</p>
              <div className="space-y-2">
                {viewOrder.items?.length > 0 ? viewOrder.items.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between bg-gray-800 rounded-xl px-4 py-3">
                    <div>
                      <p className="text-white text-sm font-medium">{item.product_name}</p>
                      <p className="text-gray-400 text-xs">Quantité : {item.quantity}</p>
                    </div>
                    <p className="text-white font-semibold text-sm">{(item.price * item.quantity).toFixed(2)} MAD</p>
                  </div>
                )) : (
                  <p className="text-gray-500 text-sm text-center py-4">Aucun article.</p>
                )}
              </div>
            </div>

            <div className="flex justify-end pt-1">
              <button onClick={() => { setViewOrder(null); openEdit(viewOrder); }} className="px-4 py-2 rounded-xl bg-amber-400 text-gray-950 text-sm font-semibold hover:bg-amber-300 transition-colors">Modifier le statut</button>
            </div>
          </div>
        </Modal>
      )}

      {/* Edit Status Modal */}
      {editOrder && (
        <Modal title={`Modifier le statut — Commande #${editOrder.id}`} onClose={() => setEditOrder(null)}>
          <form onSubmit={handleStatusUpdate} className="space-y-5">
            <div>
              <p className="text-gray-500 text-xs font-medium mb-3 uppercase tracking-wide">Statut actuel</p>
              <span className={`px-3 py-1.5 rounded-full text-xs font-medium border ${STATUS_STYLES[editOrder.status] || ''}`}>
                {STATUS_LABELS[editOrder.status] || editOrder.status}
              </span>
            </div>
            <div>
              <p className="text-gray-400 text-xs font-medium mb-3">Nouveau statut</p>
              <div className="grid grid-cols-2 gap-2">
                {STATUS_OPTIONS.map((s) => (
                  <button key={s} type="button" onClick={() => setNewStatus(s)} className={`px-4 py-3 rounded-xl text-sm font-medium border transition-all text-left ${newStatus === s ? 'border-amber-400 bg-amber-400/10 text-amber-300' : 'border-gray-700 bg-gray-800 text-gray-400 hover:border-gray-600 hover:text-white'}`}>
                    <span className={`inline-block w-2 h-2 rounded-full mr-2 ${newStatus === s ? 'bg-amber-400' : 'bg-gray-600'}`}/>
                    {STATUS_LABELS[s]}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-1">
              <button type="button" onClick={() => setEditOrder(null)} className="px-4 py-2 rounded-xl bg-gray-800 text-gray-300 text-sm hover:bg-gray-700 transition-colors">Annuler</button>
              <button type="submit" disabled={saving || newStatus === editOrder.status} className="px-4 py-2 rounded-xl bg-amber-400 text-gray-950 text-sm font-semibold hover:bg-amber-300 disabled:opacity-50 transition-colors">{saving ? 'Mise à jour...' : 'Confirmer'}</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
