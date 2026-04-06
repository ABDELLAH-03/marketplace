// src/pages/admin/AdminUsers.jsx
import { useEffect, useState } from 'react';
import api from '../../api/axios';

const ROLE_LABELS = {
  SUPER_ADMIN: { label: 'Super Admin', color: 'bg-red-500/10 text-red-400 border-red-500/20' },
  STORE_OWNER: { label: 'Boutique', color: 'bg-purple-500/10 text-purple-400 border-purple-500/20' },
  NORMAL_USER: { label: 'Client', color: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
  PACKER:      { label: 'Emballeur', color: 'bg-green-500/10 text-green-400 border-green-500/20' },
  DELIVERY:    { label: 'Livreur', color: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
};

const EMPTY_FORM = { name: '', email: '', role: 'NORMAL_USER', password: '', password2: '', is_active: true };

function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-lg mx-4 shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
          <h2 className="text-white font-semibold text-base">{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
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

const inputCls = "w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2.5 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-amber-400 transition-colors";

export default function AdminUsers() {
  const [users, setUsers]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState('');
  const [success, setSuccess] = useState('');
  const [deleteId, setDeleteId] = useState(null);

  // modals
  const [showCreate, setShowCreate] = useState(false);
  const [editUser, setEditUser]     = useState(null);   // user object to edit
  const [viewUser, setViewUser]     = useState(null);   // user object to view

  const [form, setForm]         = useState(EMPTY_FORM);
  const [formError, setFormError] = useState('');
  const [saving, setSaving]     = useState(false);

  const fetchUsers = () => {
    setLoading(true);
    api.get('/api/admin/users/')
      .then((r) => setUsers(r.data))
      .catch(() => setError('Impossible de charger les utilisateurs.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchUsers(); }, []);

  const flash = (msg) => { setSuccess(msg); setTimeout(() => setSuccess(''), 3000); };

  /* ── Delete ── */
  const handleDelete = async (id) => {
    try {
      await api.delete(`/api/admin/users/${id}/`);
      setUsers(users.filter((u) => u.id !== id));
      setDeleteId(null);
      flash('Utilisateur supprimé.');
    } catch {
      setError('Erreur lors de la suppression.');
    }
  };

  /* ── Toggle active ── */
  const handleToggleActive = async (user) => {
    try {
      await api.patch(`/api/admin/users/${user.id}/`, { is_active: !user.is_active });
      setUsers(users.map((u) => u.id === user.id ? { ...u, is_active: !u.is_active } : u));
    } catch {
      setError('Erreur lors de la modification.');
    }
  };

  /* ── Create ── */
  const openCreate = () => { setForm(EMPTY_FORM); setFormError(''); setShowCreate(true); };
  const handleCreate = async (e) => {
    e.preventDefault();
    setSaving(true); setFormError('');
    try {
      const res = await api.post('/api/admin/users/create/', form);
      setUsers([res.data, ...users]);
      setShowCreate(false);
      flash('Utilisateur créé avec succès.');
    } catch (err) {
      const d = err.response?.data;
      setFormError(d ? Object.values(d).flat().join(' ') : 'Erreur lors de la création.');
    } finally { setSaving(false); }
  };

  /* ── Edit ── */
  const openEdit = (user) => {
    setForm({ name: user.name, email: user.email, role: user.role, is_active: user.is_active, balance: user.balance, password: '' });
    setFormError('');
    setEditUser(user);
  };
  const handleEdit = async (e) => {
    e.preventDefault();
    setSaving(true); setFormError('');
    try {
      const payload = { ...form };
      if (!payload.password) delete payload.password;
      const res = await api.patch(`/api/admin/users/${editUser.id}/`, payload);
      setUsers(users.map((u) => u.id === editUser.id ? res.data : u));
      setEditUser(null);
      flash('Utilisateur modifié avec succès.');
    } catch (err) {
      const d = err.response?.data;
      setFormError(d ? Object.values(d).flat().join(' ') : 'Erreur lors de la modification.');
    } finally { setSaving(false); }
  };

  const f = (k) => (e) => setForm({ ...form, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value });

  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Utilisateurs</h1>
          <p className="text-gray-400 mt-1 text-sm">{users.length} utilisateur(s)</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-400 text-gray-950 text-sm font-semibold hover:bg-amber-300 transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/></svg>
          Ajouter
        </button>
      </div>

      {error && <div className="mb-5 px-4 py-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">{error}</div>}
      {success && <div className="mb-5 px-4 py-3 bg-green-500/10 border border-green-500/30 rounded-xl text-green-400 text-sm">{success}</div>}

      {loading ? (
        <div className="space-y-3">{[...Array(5)].map((_, i) => <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl h-16 animate-pulse"/>)}</div>
      ) : (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="text-left px-5 py-4 text-gray-400 font-medium">Utilisateur</th>
                <th className="text-left px-5 py-4 text-gray-400 font-medium">Rôle</th>
                <th className="text-left px-5 py-4 text-gray-400 font-medium">Statut</th>
                <th className="text-left px-5 py-4 text-gray-400 font-medium">Inscrit le</th>
                <th className="text-right px-5 py-4 text-gray-400 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, i) => {
                const role = ROLE_LABELS[user.role] || { label: user.role, color: 'bg-gray-700 text-gray-300 border-gray-600' };
                return (
                  <tr key={user.id} className={`border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors ${i === users.length - 1 ? 'border-b-0' : ''}`}>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-amber-400 flex items-center justify-center text-gray-950 font-bold text-xs flex-shrink-0">
                          {user.name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || '?'}
                        </div>
                        <div>
                          <p className="text-white font-medium">{user.name || '—'}</p>
                          <p className="text-gray-500 text-xs">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${role.color}`}>{role.label}</span>
                    </td>
                    <td className="px-5 py-4">
                      <button onClick={() => handleToggleActive(user)} className={`px-2.5 py-1 rounded-full text-xs font-medium border transition-colors ${user.is_active ? 'bg-green-500/10 text-green-400 border-green-500/20 hover:bg-green-500/20' : 'bg-gray-700/30 text-gray-400 border-gray-700 hover:bg-gray-700/50'}`}>
                        {user.is_active ? 'Actif' : 'Inactif'}
                      </button>
                    </td>
                    <td className="px-5 py-4 text-gray-400">{new Date(user.date_joined).toLocaleDateString('fr-FR')}</td>
                    <td className="px-5 py-4 text-right">
                      {deleteId === user.id ? (
                        <div className="flex items-center justify-end gap-2">
                          <span className="text-gray-400 text-xs">Confirmer ?</span>
                          <button onClick={() => handleDelete(user.id)} className="px-3 py-1 rounded-lg bg-red-500 text-white text-xs font-medium hover:bg-red-600 transition-colors">Oui</button>
                          <button onClick={() => setDeleteId(null)} className="px-3 py-1 rounded-lg bg-gray-700 text-white text-xs font-medium hover:bg-gray-600 transition-colors">Non</button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => setViewUser(user)} className="px-3 py-1.5 rounded-lg text-xs font-medium text-blue-400 hover:bg-blue-500/10 border border-transparent hover:border-blue-500/20 transition-colors">Voir</button>
                          <button onClick={() => openEdit(user)} className="px-3 py-1.5 rounded-lg text-xs font-medium text-amber-400 hover:bg-amber-500/10 border border-transparent hover:border-amber-500/20 transition-colors">Modifier</button>
                          <button onClick={() => setDeleteId(user.id)} className="px-3 py-1.5 rounded-lg text-xs font-medium text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-colors">Supprimer</button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {users.length === 0 && <div className="text-center py-12 text-gray-500">Aucun utilisateur trouvé.</div>}
        </div>
      )}

      {/* View Modal */}
      {viewUser && (
        <Modal title="Détails utilisateur" onClose={() => setViewUser(null)}>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-amber-400 flex items-center justify-center text-gray-950 font-bold text-xl">
                {viewUser.name?.[0]?.toUpperCase() || '?'}
              </div>
              <div>
                <p className="text-white font-semibold text-base">{viewUser.name}</p>
                <p className="text-gray-400 text-sm">{viewUser.email}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 pt-2">
              {[
                { l: 'Rôle', v: ROLE_LABELS[viewUser.role]?.label || viewUser.role },
                { l: 'Statut', v: viewUser.is_active ? 'Actif' : 'Inactif' },
                { l: 'Solde', v: `${viewUser.balance} MAD` },
                { l: 'Inscrit le', v: new Date(viewUser.date_joined).toLocaleDateString('fr-FR') },
              ].map(({ l, v }) => (
                <div key={l} className="bg-gray-800 rounded-xl px-4 py-3">
                  <p className="text-gray-500 text-xs mb-1">{l}</p>
                  <p className="text-white text-sm font-medium">{v}</p>
                </div>
              ))}
            </div>
            <div className="flex justify-end pt-2">
              <button onClick={() => { setViewUser(null); openEdit(viewUser); }} className="px-4 py-2 rounded-xl bg-amber-400 text-gray-950 text-sm font-semibold hover:bg-amber-300 transition-colors">Modifier</button>
            </div>
          </div>
        </Modal>
      )}

      {/* Create Modal */}
      {showCreate && (
        <Modal title="Ajouter un utilisateur" onClose={() => setShowCreate(false)}>
          <form onSubmit={handleCreate} className="space-y-4">
            {formError && <p className="text-red-400 text-xs bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">{formError}</p>}
            <div className="grid grid-cols-2 gap-3">
              <Field label="Nom complet"><input className={inputCls} value={form.name} onChange={f('name')} placeholder="Nom" required /></Field>
              <Field label="Email"><input className={inputCls} type="email" value={form.email} onChange={f('email')} placeholder="email@ex.com" required /></Field>
            </div>
            <Field label="Rôle">
              <select className={inputCls} value={form.role} onChange={f('role')}>
                {Object.entries(ROLE_LABELS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
              </select>
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Mot de passe"><input className={inputCls} type="password" value={form.password} onChange={f('password')} placeholder="••••••••" required /></Field>
              <Field label="Confirmer"><input className={inputCls} type="password" value={form.password2} onChange={f('password2')} placeholder="••••••••" required /></Field>
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.is_active} onChange={f('is_active')} className="w-4 h-4 rounded accent-amber-400" />
              <span className="text-gray-300 text-sm">Compte actif</span>
            </label>
            <div className="flex justify-end gap-3 pt-2">
              <button type="button" onClick={() => setShowCreate(false)} className="px-4 py-2 rounded-xl bg-gray-800 text-gray-300 text-sm hover:bg-gray-700 transition-colors">Annuler</button>
              <button type="submit" disabled={saving} className="px-4 py-2 rounded-xl bg-amber-400 text-gray-950 text-sm font-semibold hover:bg-amber-300 disabled:opacity-50 transition-colors">{saving ? 'Création...' : 'Créer'}</button>
            </div>
          </form>
        </Modal>
      )}

      {/* Edit Modal */}
      {editUser && (
        <Modal title="Modifier l'utilisateur" onClose={() => setEditUser(null)}>
          <form onSubmit={handleEdit} className="space-y-4">
            {formError && <p className="text-red-400 text-xs bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">{formError}</p>}
            <div className="grid grid-cols-2 gap-3">
              <Field label="Nom complet"><input className={inputCls} value={form.name} onChange={f('name')} placeholder="Nom" required /></Field>
              <Field label="Email"><input className={inputCls} type="email" value={form.email} onChange={f('email')} placeholder="email@ex.com" required /></Field>
            </div>
            <Field label="Rôle">
              <select className={inputCls} value={form.role} onChange={f('role')}>
                {Object.entries(ROLE_LABELS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
              </select>
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Solde (MAD)"><input className={inputCls} type="number" step="0.01" value={form.balance} onChange={f('balance')} placeholder="0.00" /></Field>
              <Field label="Nouveau mot de passe"><input className={inputCls} type="password" value={form.password} onChange={f('password')} placeholder="Laisser vide = inchangé" /></Field>
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.is_active} onChange={f('is_active')} className="w-4 h-4 rounded accent-amber-400" />
              <span className="text-gray-300 text-sm">Compte actif</span>
            </label>
            <div className="flex justify-end gap-3 pt-2">
              <button type="button" onClick={() => setEditUser(null)} className="px-4 py-2 rounded-xl bg-gray-800 text-gray-300 text-sm hover:bg-gray-700 transition-colors">Annuler</button>
              <button type="submit" disabled={saving} className="px-4 py-2 rounded-xl bg-amber-400 text-gray-950 text-sm font-semibold hover:bg-amber-300 disabled:opacity-50 transition-colors">{saving ? 'Enregistrement...' : 'Enregistrer'}</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
