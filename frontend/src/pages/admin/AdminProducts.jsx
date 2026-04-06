// src/pages/admin/AdminProducts.jsx
import { useEffect, useState } from 'react';
import api from '../../api/axios';

const inputCls = "w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2.5 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-amber-400 transition-colors";

function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-lg mx-4 shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800 sticky top-0 bg-gray-900 z-10">
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

const EMPTY_FORM = { name: '', price: '', stock: '', store: '', category: '', image: null };

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [stores, setStores]     = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState('');
  const [success, setSuccess]   = useState('');
  const [deleteId, setDeleteId] = useState(null);
  const [search, setSearch]     = useState('');

  const [showCreate, setShowCreate] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [viewProduct, setViewProduct] = useState(null);

  const [form, setForm]           = useState(EMPTY_FORM);
  const [formError, setFormError] = useState('');
  const [saving, setSaving]       = useState(false);

  const fetchProducts = () => {
    setLoading(true);
    api.get('/api/admin/products/')
      .then((r) => setProducts(r.data))
      .catch(() => setError('Impossible de charger les produits.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchProducts();
    api.get('/api/admin/stores/').then((r) => setStores(r.data)).catch(() => {});
    api.get('/api/admin/categories/').then((r) => setCategories(r.data)).catch(() => {});
  }, []);

  const flash = (msg) => { setSuccess(msg); setTimeout(() => setSuccess(''), 3000); };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/api/admin/products/${id}/`);
      setProducts(products.filter((p) => p.id !== id));
      setDeleteId(null);
      flash('Produit supprimé.');
    } catch {
      setError('Erreur lors de la suppression.');
    }
  };

  const openCreate = () => { setForm(EMPTY_FORM); setFormError(''); setShowCreate(true); };
  const openEdit = (product) => {
    setForm({
      name: product.name, price: product.price, stock: product.stock,
      store: product.store?.id || product.store,
      category: product.category?.id || product.category || '',
      image: null,
    });
    setFormError('');
    setEditProduct(product);
  };

  const buildFormData = () => {
    const fd = new FormData();
    fd.append('name', form.name);
    fd.append('price', form.price);
    fd.append('stock', form.stock);
    fd.append('store', form.store);
    if (form.category) fd.append('category', form.category);
    if (form.image) fd.append('image', form.image);
    return fd;
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setSaving(true); setFormError('');
    try {
      const res = await api.post('/api/admin/products/create/', buildFormData(), { headers: { 'Content-Type': 'multipart/form-data' } });
      setProducts([res.data, ...products]);
      setShowCreate(false);
      flash('Produit créé avec succès.');
    } catch (err) {
      const d = err.response?.data;
      setFormError(d ? Object.values(d).flat().join(' ') : 'Erreur lors de la création.');
    } finally { setSaving(false); }
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    setSaving(true); setFormError('');
    try {
      const fd = buildFormData();
      const res = await api.patch(`/api/admin/products/${editProduct.id}/`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      setProducts(products.map((p) => p.id === editProduct.id ? res.data : p));
      setEditProduct(null);
      flash('Produit modifié avec succès.');
    } catch (err) {
      const d = err.response?.data;
      setFormError(d ? Object.values(d).flat().join(' ') : 'Erreur lors de la modification.');
    } finally { setSaving(false); }
  };

  const f = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  const fFile = (e) => setForm({ ...form, image: e.target.files[0] });

  const filtered = products.filter((p) =>
    p.name?.toLowerCase().includes(search.toLowerCase()) ||
    p.store_detail?.name?.toLowerCase().includes(search.toLowerCase())
  );

  const ProductForm = ({ onSubmit, submitLabel }) => (
    <form onSubmit={onSubmit} className="space-y-4">
      {formError && <p className="text-red-400 text-xs bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">{formError}</p>}
      <Field label="Nom du produit">
        <input className={inputCls} value={form.name} onChange={f('name')} placeholder="Nom du produit" required />
      </Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Prix (MAD)">
          <input className={inputCls} type="number" step="0.01" min="0" value={form.price} onChange={f('price')} placeholder="0.00" required />
        </Field>
        <Field label="Stock">
          <input className={inputCls} type="number" min="0" value={form.stock} onChange={f('stock')} placeholder="0" required />
        </Field>
      </div>
      <Field label="Boutique">
        <select className={inputCls} value={form.store} onChange={f('store')} required>
          <option value="">-- Sélectionner une boutique --</option>
          {stores.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
      </Field>
      <Field label="Catégorie (optionnelle)">
        <select className={inputCls} value={form.category} onChange={f('category')}>
          <option value="">-- Aucune catégorie --</option>
          {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </Field>
      <Field label="Image du produit">
        <input type="file" accept="image/*" onChange={fFile} className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-gray-400 text-sm file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:bg-amber-400 file:text-gray-950 file:font-medium hover:file:bg-amber-300 cursor-pointer" />
      </Field>
      <div className="flex justify-end gap-3 pt-2">
        <button type="button" onClick={() => { setShowCreate(false); setEditProduct(null); }} className="px-4 py-2 rounded-xl bg-gray-800 text-gray-300 text-sm hover:bg-gray-700 transition-colors">Annuler</button>
        <button type="submit" disabled={saving} className="px-4 py-2 rounded-xl bg-amber-400 text-gray-950 text-sm font-semibold hover:bg-amber-300 disabled:opacity-50 transition-colors">{saving ? 'Enregistrement...' : submitLabel}</button>
      </div>
    </form>
  );

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Produits</h1>
          <p className="text-gray-400 mt-1 text-sm">{products.length} produit(s)</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-400 text-gray-950 text-sm font-semibold hover:bg-amber-300 transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/></svg>
          Ajouter
        </button>
      </div>

      {error && <div className="mb-5 px-4 py-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">{error}</div>}
      {success && <div className="mb-5 px-4 py-3 bg-green-500/10 border border-green-500/30 rounded-xl text-green-400 text-sm">{success}</div>}

      {/* Search */}
      <div className="mb-5 relative">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
        <input className="w-full bg-gray-900 border border-gray-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-amber-400 transition-colors" placeholder="Rechercher un produit ou une boutique..." value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      {loading ? (
        <div className="space-y-3">{[...Array(5)].map((_, i) => <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl h-16 animate-pulse"/>)}</div>
      ) : (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="text-left px-5 py-4 text-gray-400 font-medium">Produit</th>
                <th className="text-left px-5 py-4 text-gray-400 font-medium">Boutique</th>
                <th className="text-left px-5 py-4 text-gray-400 font-medium">Catégorie</th>
                <th className="text-left px-5 py-4 text-gray-400 font-medium">Prix</th>
                <th className="text-left px-5 py-4 text-gray-400 font-medium">Stock</th>
                <th className="text-right px-5 py-4 text-gray-400 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((product, i) => (
                <tr key={product.id} className={`border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors ${i === filtered.length - 1 ? 'border-b-0' : ''}`}>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      {product.image ? (
                        <img src={product.image} alt={product.name} className="w-9 h-9 rounded-lg object-cover border border-gray-700" />
                      ) : (
                        <div className="w-9 h-9 rounded-lg bg-green-500/20 flex items-center justify-center text-green-400 text-xs font-bold">{product.name?.[0]?.toUpperCase() || 'P'}</div>
                      )}
                      <span className="text-white font-medium">{product.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-gray-300">{product.store_detail?.name || '—'}</td>
                  <td className="px-5 py-4 text-gray-400 text-xs">{product.category_detail?.name || <span className="text-gray-600">—</span>}</td>
                  <td className="px-5 py-4 text-white font-semibold">{product.price} MAD</td>
                  <td className="px-5 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${product.stock > 10 ? 'bg-green-500/10 text-green-400 border-green-500/20' : product.stock > 0 ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
                      {product.stock} unités
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    {deleteId === product.id ? (
                      <div className="flex items-center justify-end gap-2">
                        <span className="text-gray-400 text-xs">Confirmer ?</span>
                        <button onClick={() => handleDelete(product.id)} className="px-3 py-1 rounded-lg bg-red-500 text-white text-xs font-medium hover:bg-red-600 transition-colors">Oui</button>
                        <button onClick={() => setDeleteId(null)} className="px-3 py-1 rounded-lg bg-gray-700 text-white text-xs font-medium hover:bg-gray-600 transition-colors">Non</button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => setViewProduct(product)} className="px-3 py-1.5 rounded-lg text-xs font-medium text-blue-400 hover:bg-blue-500/10 border border-transparent hover:border-blue-500/20 transition-colors">Voir</button>
                        <button onClick={() => openEdit(product)} className="px-3 py-1.5 rounded-lg text-xs font-medium text-amber-400 hover:bg-amber-500/10 border border-transparent hover:border-amber-500/20 transition-colors">Modifier</button>
                        <button onClick={() => setDeleteId(product.id)} className="px-3 py-1.5 rounded-lg text-xs font-medium text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-colors">Supprimer</button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && <div className="text-center py-12 text-gray-500">Aucun produit trouvé.</div>}
        </div>
      )}

      {/* View Modal */}
      {viewProduct && (
        <Modal title="Détails du produit" onClose={() => setViewProduct(null)}>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              {viewProduct.image ? (
                <img src={viewProduct.image} alt={viewProduct.name} className="w-16 h-16 rounded-xl object-cover border border-gray-700" />
              ) : (
                <div className="w-16 h-16 rounded-xl bg-green-500/20 flex items-center justify-center text-green-400 font-bold text-2xl">{viewProduct.name?.[0]?.toUpperCase() || 'P'}</div>
              )}
              <div>
                <p className="text-white font-semibold text-base">{viewProduct.name}</p>
                <p className="text-gray-400 text-sm">{viewProduct.store_detail?.name}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { l: 'Prix', v: `${viewProduct.price} MAD` },
                { l: 'Stock', v: `${viewProduct.stock} unités` },
                { l: 'Catégorie', v: viewProduct.category_detail?.name || '—' },
                { l: 'Boutique', v: viewProduct.store_detail?.name || '—' },
              ].map(({ l, v }) => (
                <div key={l} className="bg-gray-800 rounded-xl px-4 py-3">
                  <p className="text-gray-500 text-xs mb-1">{l}</p>
                  <p className="text-white text-sm font-medium">{v}</p>
                </div>
              ))}
            </div>
            <div className="flex justify-end pt-2">
              <button onClick={() => { setViewProduct(null); openEdit(viewProduct); }} className="px-4 py-2 rounded-xl bg-amber-400 text-gray-950 text-sm font-semibold hover:bg-amber-300 transition-colors">Modifier</button>
            </div>
          </div>
        </Modal>
      )}

      {showCreate && (
        <Modal title="Ajouter un produit" onClose={() => setShowCreate(false)}>
          <ProductForm onSubmit={handleCreate} submitLabel="Créer" />
        </Modal>
      )}
      {editProduct && (
        <Modal title="Modifier le produit" onClose={() => setEditProduct(null)}>
          <ProductForm onSubmit={handleEdit} submitLabel="Enregistrer" />
        </Modal>
      )}
    </div>
  );
}
