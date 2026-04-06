// src/pages/admin/AdminStores.jsx
import { useEffect, useState } from 'react';
import api from '../../api/axios';

const inputCls = "w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2.5 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-amber-400 transition-colors";

function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-lg mx-4 shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
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

function Field({ label, children }) {
  return (
    <div>
      <label className="block text-gray-400 text-xs font-medium mb-1.5">{label}</label>
      {children}
    </div>
  );
}

const EMPTY_FORM = { name: '', description: '', owner: '' };

export default function AdminStores() {
  const [stores, setStores]   = useState([]);
  const [owners, setOwners]   = useState([]);  // STORE_OWNER users
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');
  const [success, setSuccess] = useState('');
  const [deleteId, setDeleteId] = useState(null);

  const [showCreate, setShowCreate] = useState(false);
  const [editStore, setEditStore]   = useState(null);
  const [viewStore, setViewStore]   = useState(null);

  const [form, setForm]         = useState(EMPTY_FORM);
  const [formError, setFormError] = useState('');
  const [saving, setSaving]     = useState(false);

  const fetchStores = () => {
    setLoading(true);
    api.get('/api/admin/stores/')
      .then((r) => setStores(r.data))
      .catch(() => setError('Impossible de charger les boutiques.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchStores();
    // Load STORE_OWNER users for the owner dropdown
    api.get('/api/admin/users/')
      .then((r) => setOwners(r.data.filter((u) => u.role === 'STORE_OWNER')))
      .catch(() => {});
  }, []);

  const flash = (msg) => { setSuccess(msg); setTimeout(() => setSuccess(''), 3000); };

  /* ── Delete ── */
  const handleDelete = async (id) => {
    try {
      await api.delete(`/api/admin/stores/${id}/`);
      setStores(stores.filter((s) => s.id !== id));
      setDeleteId(null);
      flash('Boutique supprimée.');
    } catch {
      setError('Erreur lors de la suppression.');
    }
  };

  /* ── Create ── */
  const openCreate = () => { setForm(EMPTY_FORM); setFormError(''); setShowCreate(true); };
  const handleCreate = async (e) => {
    e.preventDefault();
    setSaving(true); setFormError('');
    try {
      const res = await api.post('/api/admin/stores/create/', { ...form, owner: parseInt(form.owner) });
      setStores([res.data, ...stores]);
      setShowCreate(false);
      flash('Boutique créée avec succès.');
    } catch (err) {
      const d = err.response?.data;
      setFormError(d ? Object.values(d).flat().join(' ') : 'Erreur lors de la création.');
    } finally { setSaving(false); }
  };

  /* ── Edit ── */
  const openEdit = (store) => {
    setForm({ name: store.name, description: store.description || '', owner: store.owner });
    setFormError('');
    setEditStore(store);
  };
  const handleEdit = async (e) => {
    e.preventDefault();
    setSaving(true); setFormError('');
    try {
      const res = await api.patch(`/api/admin/stores/${editStore.id}/`, { ...form, owner: parseInt(form.owner) });
      setStores(stores.map((s) => s.id === editStore.id ? res.data : s));
      setEditStore(null);
      flash('Boutique modifiée avec succès.');
    } catch (err) {
      const d = err.response?.data;
      setFormError(d ? Object.values(d).flat().join(' ') : 'Erreur lors de la modification.');
    } finally { setSaving(false); }
  };

  const f = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const StoreForm = ({ onSubmit, submitLabel }) => (
    <form onSubmit={onSubmit} className="space-y-4">
      {formError && <p className="text-red-400 text-xs bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">{formError}</p>}
      <Field label="Nom de la boutique">
        <input className={inputCls} value={form.name} onChange={f('name')} placeholder="Ma boutique" required />
      </Field>
      <Field label="Description">
        <textarea className={inputCls + ' resize-none'} rows={3} value={form.description} onChange={f('description')} placeholder="Description optionnelle..." />
      </Field>
      <Field label="Propriétaire (Store Owner)">
        <select className={inputCls} value={form.owner} onChange={f('owner')} required>
          <option value="">-- Sélectionner un propriétaire --</option>
          {owners.map((u) => <option key={u.id} value={u.id}>{u.name} ({u.email})</option>)}
        </select>
        {owners.length === 0 && <p className="text-amber-400 text-xs mt-1">Aucun utilisateur avec le rôle "Store Owner" trouvé.</p>}
      </Field>
      <div className="flex justify-end gap-3 pt-2">
        <button type="button" onClick={() => { setShowCreate(false); setEditStore(null); }} className="px-4 py-2 rounded-xl bg-gray-800 text-gray-300 text-sm hover:bg-gray-700 transition-colors">Annuler</button>
        <button type="submit" disabled={saving} className="px-4 py-2 rounded-xl bg-amber-400 text-gray-950 text-sm font-semibold hover:bg-amber-300 disabled:opacity-50 transition-colors">{saving ? 'Enregistrement...' : submitLabel}</button>
      </div>
    </form>
  );

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Boutiques</h1>
          <p className="text-gray-400 mt-1 text-sm">{stores.length} boutique(s)</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-400 text-gray-950 text-sm font-semibold hover:bg-amber-300 transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/></svg>
          Ajouter
        </button>
      </div>

      {error && <div className="mb-5 px-4 py-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">{error}</div>}
      {success && <div className="mb-5 px-4 py-3 bg-green-500/10 border border-green-500/30 rounded-xl text-green-400 text-sm">{success}</div>}

      {loading ? (
        <div className="space-y-3">{[...Array(4)].map((_, i) => <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl h-16 animate-pulse"/>)}</div>
      ) : (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="text-left px-5 py-4 text-gray-400 font-medium">Boutique</th>
                <th className="text-left px-5 py-4 text-gray-400 font-medium">Propriétaire</th>
                <th className="text-left px-5 py-4 text-gray-400 font-medium">Créée le</th>
                <th className="text-right px-5 py-4 text-gray-400 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {stores.map((store, i) => (
                <tr key={store.id} className={`border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors ${i === stores.length - 1 ? 'border-b-0' : ''}`}>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center text-purple-400 font-bold text-xs">
                        {store.name?.[0]?.toUpperCase() || 'S'}
                      </div>
                      <div>
                        <p className="text-white font-medium">{store.name}</p>
                        {store.description && <p className="text-gray-500 text-xs truncate max-w-48">{store.description}</p>}
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    {store.owner_detail ? (
                      <div>
                        <p className="text-white text-sm">{store.owner_detail.name}</p>
                        <p className="text-gray-500 text-xs">{store.owner_detail.email}</p>
                      </div>
                    ) : <span className="text-gray-400">—</span>}
                  </td>
                  <td className="px-5 py-4 text-gray-400">{store.created_at ? new Date(store.created_at).toLocaleDateString('fr-FR') : '—'}</td>
                  <td className="px-5 py-4 text-right">
                    {deleteId === store.id ? (
                      <div className="flex items-center justify-end gap-2">
                        <span className="text-gray-400 text-xs">Confirmer ?</span>
                        <button onClick={() => handleDelete(store.id)} className="px-3 py-1 rounded-lg bg-red-500 text-white text-xs font-medium hover:bg-red-600 transition-colors">Oui</button>
                        <button onClick={() => setDeleteId(null)} className="px-3 py-1 rounded-lg bg-gray-700 text-white text-xs font-medium hover:bg-gray-600 transition-colors">Non</button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => setViewStore(store)} className="px-3 py-1.5 rounded-lg text-xs font-medium text-blue-400 hover:bg-blue-500/10 border border-transparent hover:border-blue-500/20 transition-colors">Voir</button>
                        <button onClick={() => openEdit(store)} className="px-3 py-1.5 rounded-lg text-xs font-medium text-amber-400 hover:bg-amber-500/10 border border-transparent hover:border-amber-500/20 transition-colors">Modifier</button>
                        <button onClick={() => setDeleteId(store.id)} className="px-3 py-1.5 rounded-lg text-xs font-medium text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-colors">Supprimer</button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {stores.length === 0 && <div className="text-center py-12 text-gray-500">Aucune boutique trouvée.</div>}
        </div>
      )}

      {/* View Modal */}
      {viewStore && (
        <Modal title="Détails de la boutique" onClose={() => setViewStore(null)}>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-400 font-bold text-2xl">
                {viewStore.name?.[0]?.toUpperCase() || 'S'}
              </div>
              <div>
                <p className="text-white font-semibold text-base">{viewStore.name}</p>
                {viewStore.description && <p className="text-gray-400 text-sm mt-0.5">{viewStore.description}</p>}
              </div>
            </div>
            <div className="bg-gray-800 rounded-xl px-4 py-3">
              <p className="text-gray-500 text-xs mb-1">Propriétaire</p>
              {viewStore.owner_detail ? (
                <>
                  <p className="text-white text-sm font-medium">{viewStore.owner_detail.name}</p>
                  <p className="text-gray-400 text-xs">{viewStore.owner_detail.email}</p>
                </>
              ) : <p className="text-gray-400 text-sm">—</p>}
            </div>
            {viewStore.created_at && (
              <div className="bg-gray-800 rounded-xl px-4 py-3">
                <p className="text-gray-500 text-xs mb-1">Créée le</p>
                <p className="text-white text-sm">{new Date(viewStore.created_at).toLocaleDateString('fr-FR')}</p>
              </div>
            )}
            <div className="flex justify-end pt-2">
              <button onClick={() => { setViewStore(null); openEdit(viewStore); }} className="px-4 py-2 rounded-xl bg-amber-400 text-gray-950 text-sm font-semibold hover:bg-amber-300 transition-colors">Modifier</button>
            </div>
          </div>
        </Modal>
      )}

      {showCreate && (
        <Modal title="Ajouter une boutique" onClose={() => setShowCreate(false)}>
          <StoreForm onSubmit={handleCreate} submitLabel="Créer" />
        </Modal>
      )}

      {editStore && (
        <Modal title="Modifier la boutique" onClose={() => setEditStore(null)}>
          <StoreForm onSubmit={handleEdit} submitLabel="Enregistrer" />
        </Modal>
      )}
    </div>
  );
}
