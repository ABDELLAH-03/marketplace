// src/pages/store/StoreProductCreate.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';

export default function StoreProductCreate() {
  const navigate = useNavigate();
  const [stores, setStores] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    name: '',
    price: '',
    stock: '',
    store_id: '',
    category: '',
  });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Charger les stores du owner connecté
    api.get('/api/stores/my-stores/')
      .then((res) => setStores(res.data))
      .catch(() => { });

    // Charger les catégories
    api.get('/api/categories/')
      .then((res) => setCategories(res.data))
      
      .catch(() => {});
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleImage = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('price', form.price);
      formData.append('stock', form.stock);
      formData.append('store_id', form.store_id);
      if (form.category) formData.append('category', form.category);
      if (image) formData.append('image', image);

      await api.post('/api/store-products/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      navigate('/store/products');
    } catch (err) {
      const data = err.response?.data;
      if (data) {
        setError(Object.values(data).flat().join(' '));
      } else {
        setError('Erreur lors de la création du produit.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Ajouter un produit</h1>
        <p className="text-gray-400 mt-1 text-sm">Remplissez les informations de votre nouveau produit</p>
      </div>

      {error && (
        <div className="mb-6 px-4 py-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-5">
        {/* Image upload */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Image du produit</label>
          <div
            className="border-2 border-dashed border-gray-700 rounded-xl p-6 text-center cursor-pointer hover:border-purple-500/50 transition-colors relative"
            onClick={() => document.getElementById('image-input').click()}
          >
            {preview ? (
              <img src={preview} alt="preview" className="h-40 object-contain mx-auto rounded-lg" />
            ) : (
              <div>
                <svg className="w-10 h-10 text-gray-600 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-gray-500 text-sm">Cliquer pour ajouter une image</p>
              </div>
            )}
            <input id="image-input" type="file" accept="image/*" onChange={handleImage} className="hidden" />
          </div>
        </div>

        {/* Nom */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Nom du produit</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            placeholder="Ex: T-shirt blanc"
            className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
          />
        </div>

        {/* Prix + Stock */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Prix (MAD)</label>
            <input
              type="number"
              name="price"
              value={form.price}
              onChange={handleChange}
              required
              min="0"
              step="0.01"
              placeholder="0.00"
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Stock</label>
            <input
              type="number"
              name="stock"
              value={form.stock}
              onChange={handleChange}
              required
              min="0"
              placeholder="0"
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
            />
          </div>
        </div>

        {/* Store */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Boutique</label>
          <select
            name="store_id"
            value={form.store_id}
            onChange={handleChange}
            required
            className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
          >
            <option value="">Sélectionner une boutique</option>
            {stores.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </div>

        {/* Catégorie */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Catégorie (optionnel)</label>
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
          >
            <option value="">Sans catégorie</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        {/* Buttons */}
        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={() => navigate('/store/products')}
            className="flex-1 px-4 py-3 rounded-xl bg-gray-800 hover:bg-gray-700 text-white text-sm font-medium transition-colors"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 px-4 py-3 rounded-xl bg-purple-500 hover:bg-purple-400 text-white text-sm font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : 'Créer le produit'}
          </button>
        </div>
      </form>
    </div>
  );
}
