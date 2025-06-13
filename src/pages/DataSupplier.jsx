import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import Modal from '../components/Modal';
import { Plus, Edit, Trash2 } from 'lucide-react';

// Terima props dari MainLayout, sama seperti DataBarang
const DataSupplier = ({ initialSuppliers: suppliers, onDataChange, loading }) => {
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentSupplier, setCurrentSupplier] = useState(null);

  const [formData, setFormData] = useState({
    name: '', contact: '', address: '', email: '',
  });

  // Fungsi-fungsi lain tetap sama, tapi kita akan ubah cara mereka bekerja
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const openAddModal = () => {
    setIsEditing(false);
    setCurrentSupplier(null);
    setFormData({ name: '', contact: '', address: '', email: '' });
    setShowModal(true);
  };

  const openEditModal = (supplier) => {
    setIsEditing(true);
    setCurrentSupplier(supplier);
    setFormData({
      name: supplier.name,
      contact: supplier.contact,
      address: supplier.address,
      email: supplier.email,
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (isEditing) {
        const { error } = await supabase.from('suppliers').update(formData).eq('id', currentSupplier.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('suppliers').insert(formData);
        if (error) throw error;
      }
      setShowModal(false);
      onDataChange(); // Panggil fungsi refresh dari parent
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus supplier ini?')) {
      try {
        const { error } = await supabase.from('suppliers').delete().eq('id', id);
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
        <h1 className="text-2xl font-bold text-gray-800">Data Supplier</h1>
        <button onClick={openAddModal} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2">
          <Plus className="w-4 h-4" /> Tambah Supplier
        </button>
      </div>

      {error && <p className="text-red-500 bg-red-100 p-3 rounded-lg">{error}</p>}

      {loading ? (<p>Memuat data...</p>) : suppliers && suppliers.length > 0 ? (
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nama</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kontak</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Alamat</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Aksi</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {suppliers.map((supplier) => (
                  <tr key={supplier.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium">{supplier.name}</td>
                    <td className="px-6 py-4">{supplier.email}</td>
                    <td className="px-6 py-4">{supplier.contact}</td>
                    <td className="px-6 py-4">{supplier.address}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <button onClick={() => openEditModal(supplier)} className="text-blue-600"><Edit className="w-4 h-4" /></button>
                        <button onClick={() => handleDelete(supplier.id)} className="text-red-600"><Trash2 className="w-4 h-4" /></button>
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
          <p className="text-gray-500">Belum ada data supplier.</p>
        </div>
      )}

      <Modal showModal={showModal} setShowModal={setShowModal} title={isEditing ? 'Edit Supplier' : 'Tambah Supplier Baru'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Nama Supplier</label>
            <input name="name" value={formData.name} onChange={handleInputChange} type="text" required className="mt-1 w-full px-3 py-2 border rounded-lg" />
          </div>
          <div>
            <label className="block text-sm font-medium">Email</label>
            <input name="email" value={formData.email} onChange={handleInputChange} type="email" required className="mt-1 w-full px-3 py-2 border rounded-lg" />
          </div>
          <div>
            <label className="block text-sm font-medium">Kontak</label>
            <input name="contact" value={formData.contact} onChange={handleInputChange} type="text" required className="mt-1 w-full px-3 py-2 border rounded-lg" />
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

export default DataSupplier;