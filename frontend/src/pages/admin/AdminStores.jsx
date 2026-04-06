// src/pages/admin/AdminStores.jsx
import { useEffect, useState } from 'react';
import api from '../../api/axios';

export default function AdminStores() {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    api.get('/api/admin/stores/')
      .then((res) => setStores(res.data))
      .catch(() => setError('Impossible de charger les boutiques.'))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    try {
      await api.delete(`/api/admin/stores/${id}/`);
      setStores(stores.filter((s) => s.id !== id));
      setDeleteId(null);
    } catch {
      setError('Erreur lors de la suppression.');
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Boutiques</h1>
        <p className="text-gray-400 mt-1 text-sm">{stores.length} boutique(s) enregistrée(s)</p>
      </div>

      {error && (
        <div className="mb-6 px-4 py-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
          {error}
        </div>
      )}

      {loading ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl h-16 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="text-left px-5 py-4 text-gray-400 font-medium">Boutique</th>
                <th className="text-left px-5 py-4 text-gray-400 font-medium">Propriétaire</th>
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
                      <span className="text-white font-medium">{store.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-gray-400">{store.owner}</td>
                  <td className="px-5 py-4 text-right">
                    {deleteId === store.id ? (
                      <div className="flex items-center justify-end gap-2">
                        <span className="text-gray-400 text-xs">Confirmer ?</span>
                        <button onClick={() => handleDelete(store.id)} className="px-3 py-1 rounded-lg bg-red-500 text-white text-xs font-medium hover:bg-red-600 transition-colors">Oui</button>
                        <button onClick={() => setDeleteId(null)} className="px-3 py-1 rounded-lg bg-gray-700 text-white text-xs font-medium hover:bg-gray-600 transition-colors">Non</button>
                      </div>
                    ) : (
                      <button onClick={() => setDeleteId(store.id)} className="px-3 py-1.5 rounded-lg text-xs font-medium text-red-400 hover:bg-red-500/10 transition-colors border border-transparent hover:border-red-500/20">
                        Supprimer
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {stores.length === 0 && (
            <div className="text-center py-12 text-gray-500">Aucune boutique trouvée.</div>
          )}
        </div>
      )}
    </div>
  );
}
