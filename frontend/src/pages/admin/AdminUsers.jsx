// src/pages/admin/AdminUsers.jsx
import { useEffect, useState } from 'react';
import api from '../../api/axios';

const ROLE_LABELS = {
  SUPER_ADMIN: { label: 'Super Admin', color: 'bg-red-500/10 text-red-400 border-red-500/20' },
  STORE_OWNER: { label: 'Boutique', color: 'bg-purple-500/10 text-purple-400 border-purple-500/20' },
  NORMAL_USER: { label: 'Client', color: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
  PACKER: { label: 'Emballeur', color: 'bg-green-500/10 text-green-400 border-green-500/20' },
  DELIVERY: { label: 'Livreur', color: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
};

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteId, setDeleteId] = useState(null);

  const fetchUsers = () => {
    setLoading(true);
    api.get('/api/admin/users/')
      .then((res) => setUsers(res.data))
      .catch(() => setError('Impossible de charger les utilisateurs.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleDelete = async (id) => {
    try {
      await api.delete(`/api/admin/users/${id}/`);
      setUsers(users.filter((u) => u.id !== id));
      setDeleteId(null);
    } catch {
      setError('Erreur lors de la suppression.');
    }
  };

  const handleToggleActive = async (user) => {
    try {
      await api.patch(`/api/admin/users/${user.id}/`, { is_active: !user.is_active });
      setUsers(users.map((u) => u.id === user.id ? { ...u, is_active: !u.is_active } : u));
    } catch {
      setError('Erreur lors de la modification.');
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Utilisateurs</h1>
        <p className="text-gray-400 mt-1 text-sm">{users.length} utilisateur(s) enregistré(s)</p>
      </div>

      {error && (
        <div className="mb-6 px-4 py-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
          {error}
        </div>
      )}

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
                <th className="text-left px-5 py-4 text-gray-400 font-medium">Utilisateur</th>
                <th className="text-left px-5 py-4 text-gray-400 font-medium">Rôle</th>
                <th className="text-left px-5 py-4 text-gray-400 font-medium">Statut</th>
                <th className="text-left px-5 py-4 text-gray-400 font-medium">Inscrit le</th>
                <th className="text-right px-5 py-4 text-gray-400 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, i) => {
                const role = ROLE_LABELS[user.role] || { label: user.role, color: 'bg-gray-700 text-gray-300' };
                return (
                  <tr key={user.id} className={`border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors ${i === users.length - 1 ? 'border-b-0' : ''}`}>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-amber-400 flex items-center justify-center text-gray-950 font-bold text-xs flex-shrink-0">
                          {user.username?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || '?'}
                        </div>
                        <div>
                          <p className="text-white font-medium">{user.username || '—'}</p>
                          <p className="text-gray-500 text-xs">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${role.color}`}>
                        {role.label}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <button
                        onClick={() => handleToggleActive(user)}
                        className={`px-2.5 py-1 rounded-full text-xs font-medium border transition-colors ${
                          user.is_active
                            ? 'bg-green-500/10 text-green-400 border-green-500/20 hover:bg-green-500/20'
                            : 'bg-gray-700/30 text-gray-400 border-gray-700 hover:bg-gray-700/50'
                        }`}
                      >
                        {user.is_active ? 'Actif' : 'Inactif'}
                      </button>
                    </td>
                    <td className="px-5 py-4 text-gray-400">
                      {new Date(user.date_joined).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="px-5 py-4 text-right">
                      {deleteId === user.id ? (
                        <div className="flex items-center justify-end gap-2">
                          <span className="text-gray-400 text-xs">Confirmer ?</span>
                          <button
                            onClick={() => handleDelete(user.id)}
                            className="px-3 py-1 rounded-lg bg-red-500 text-white text-xs font-medium hover:bg-red-600 transition-colors"
                          >
                            Oui
                          </button>
                          <button
                            onClick={() => setDeleteId(null)}
                            className="px-3 py-1 rounded-lg bg-gray-700 text-white text-xs font-medium hover:bg-gray-600 transition-colors"
                          >
                            Non
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setDeleteId(user.id)}
                          className="px-3 py-1.5 rounded-lg text-xs font-medium text-red-400 hover:bg-red-500/10 transition-colors border border-transparent hover:border-red-500/20"
                        >
                          Supprimer
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {users.length === 0 && (
            <div className="text-center py-12 text-gray-500">Aucun utilisateur trouvé.</div>
          )}
        </div>
      )}
    </div>
  );
}
