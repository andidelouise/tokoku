import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import Modal from '../components/Modal';
import { Plus, Edit, Trash2 } from 'lucide-react';

// Terima props dari MainLayout
const DataToko = ({ initialStores: stores, onDataChange, loading }) => {
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentStore, setCurrentStore] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone: '',
    manager: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const openAddModal = () => {
    setIsEditing(false);
    setCurrentStore(null);
    setFormData({ name: '', address: '', phone: '', manager: '' });
    setShowModal(true);
  };

  const openEditModal = (store) => {
    setIsEditing(true);
    setCurrentStore(store);
    setFormData({
      name: store.name,
      address: store.address,
      phone: store.phone,
      manager: store.manager,
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (isEditing) {
        const { error } = await supabase.from('stores').update(formData).eq('id', currentStore.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('stores').insert(formData);
        if (error) throw error;
      }
      setShowModal(false);
      onDataChange(); // Panggil fungsi refresh dari parent
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus toko ini?')) {
      try {
        const { error } = await supabase.from('stores').delete().eq('id', id);
        if (error) throw error;
        onDataChange(); // Panggil fungsi refresh dari parent
      } catch (err) {
        setError(err.message);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Data Toko</h1>
        <button onClick={openAddModal} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2">
          <Plus className="w-4 h-4" /> Tambah Toko
        </button>
      </div>

      {error && <p className="text-red-500 bg-red-100 p-3 rounded-lg">{error}</p>}

      {loading ? (<p>Memuat data...</p>) : stores && stores.length > 0 ? (
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nama Toko</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Manager</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Telepon</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Alamat</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Aksi</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {stores.map((store) => (
                  <tr key={store.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium">{store.name}</td>
                    <td className="px-6 py-4">{store.manager}</td>
                    <td className="px-6 py-4">{store.phone}</td>
                    <td className="px-6 py-4">{store.address}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <button onClick={() => openEditModal(store)} className="text-blue-600"><Edit className="w-4 h-4" /></button>
                        <button onClick={() => handleDelete(store.id)} className="text-red-600"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="text-center py-10 bg-white rounded-xl border">
          <p className="text-gray-500">Belum ada data toko.</p>
        </div>
      )}

      <Modal showModal={showModal} setShowModal={setShowModal} title={isEditing ? 'Edit Toko' : 'Tambah Toko Baru'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Nama Toko</label>
            <input name="name" value={formData.name} onChange={handleInputChange} type="text" required className="mt-1 w-full px-3 py-2 border rounded-lg" />
          </div>
          <div>
            <label className="block text-sm font-medium">Manager</label>
            <input name="manager" value={formData.manager} onChange={handleInputChange} type="text" required className="mt-1 w-full px-3 py-2 border rounded-lg" />
          </div>
           <div>
            <label className="block text-sm font-medium">Telepon</label>
            <input name="phone" value={formData.phone} onChange={handleInputChange} type="text" required className="mt-1 w-full px-3 py-2 border rounded-lg" />
          </div>
          <div>
            <label className="block text-sm font-medium">Alamat</label>
            <textarea name="address" value={formData.address} onChange={handleInputChange} required rows="3" className="mt-1 w-full px-3 py-2 border rounded-lg" />
          </div>
          <div className="flex gap-3 pt-4">
            <button type="submit" className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg">Simpan</button>
            <button type="button" onClick={() => setShowModal(false)} className="flex-1 bg-gray-200 py-2 px-4 rounded-lg">Batal</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default DataToko;