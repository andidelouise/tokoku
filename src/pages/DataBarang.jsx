import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import Modal from '../components/Modal';
import { Plus, Edit, Trash2 } from 'lucide-react';

// Terima 'suppliers' sebagai prop baru
const DataBarang = ({ initialItems: items, suppliers, onDataChange, loading }) => {
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    stock: '',
    supplier_id: '', // Diubah untuk menyimpan ID, bukan nama
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const openAddModal = () => {
    setIsEditing(false);
    setCurrentItem(null);
    setFormData({ name: '', category: '', price: '', stock: '', supplier_id: '' });
    setShowModal(true);
  };

  const openEditModal = (item) => {
    setIsEditing(true);
    setCurrentItem(item);
    setFormData({
      name: item.name,
      category: item.category,
      price: item.price,
      stock: item.stock,
      supplier_id: item.supplier_id || '', // Pastikan supplier_id ter-set
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Perbarui data untuk dikirim, pastikan supplier_id tidak kosong
    const submissionData = {
      ...formData,
      supplier_id: formData.supplier_id === '' ? null : formData.supplier_id
    };

    try {
      if (isEditing) {
        const { error } = await supabase.from('items').update(submissionData).eq('id', currentItem.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('items').insert(submissionData);
        if (error) throw error;
      }
      setShowModal(false);
      onDataChange();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus barang ini?')) {
      try {
        const { error } = await supabase.from('items').delete().eq('id', id);
        if (error) throw error;
        onDataChange();
      } catch (err) {
        setError(err.message);
      }
    }
  };

  // Fungsi kecil untuk mendapatkan nama supplier berdasarkan ID
  const getSupplierName = (supplierId) => {
    if (!suppliers || !supplierId) return 'Tidak ada';
    const supplier = suppliers.find(s => s.id === supplierId);
    return supplier ? supplier.name : 'Supplier Dihapus';
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Data Barang</h1>
        <button onClick={openAddModal} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2">
          <Plus className="w-4 h-4" /> Tambah Barang
        </button>
      </div>

      {error && <p className="text-red-500 bg-red-100 p-3 rounded-lg">{error}</p>}

      {loading ? (<p>Memuat data...</p>) : items && items.length > 0 ? (
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nama Barang</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Supplier</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Harga</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stok</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Aksi</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {items.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">{item.name}</td>
                    {/* Tampilkan nama supplier, bukan ID */}
                    <td className="px-6 py-4 text-gray-500">{getSupplierName(item.supplier_id)}</td>
                    <td className="px-6 py-4 text-gray-500">Rp {Number(item.price).toLocaleString('id-ID')}</td>
                    <td className="px-6 py-4 text-gray-500">{item.stock}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <button onClick={() => openEditModal(item)} className="text-blue-600 hover:text-blue-900"><Edit className="w-4 h-4" /></button>
                        <button onClick={() => handleDelete(item.id)} className="text-red-600 hover:text-red-900"><Trash2 className="w-4 h-4" /></button>
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
          <p className="text-gray-500">Belum ada data barang.</p>
        </div>
      )}

      {/* Modal untuk Tambah/Edit Barang */}
      <Modal showModal={showModal} setShowModal={setShowModal} title={isEditing ? 'Edit Barang' : 'Tambah Barang Baru'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nama Barang</label>
            <input name="name" value={formData.name} onChange={handleInputChange} type="text" required className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
            <input name="category" value={formData.category} onChange={handleInputChange} type="text" required className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
          </div>
          {/* === INI BAGIAN YANG DIUBAH MENJADI DROPDOWN === */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Supplier</label>
            <select
              name="supplier_id"
              value={formData.supplier_id}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white"
            >
              <option value="">-- Pilih Supplier --</option>
              {suppliers && suppliers.map(supplier => (
                <option key={supplier.id} value={supplier.id}>
                  {supplier.name}
                </option>
              ))}
            </select>
          </div>
          {/* ============================================== */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Harga</label>
            <input name="price" value={formData.price} onChange={handleInputChange} type="number" required className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Stok</label>
            <input name="stock" value={formData.stock} onChange={handleInputChange} type="number" required className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
          </div>
          <div className="flex gap-3 pt-4">
            <button type="submit" className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700">Simpan</button>
            <button type="button" onClick={() => setShowModal(false)} className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300">Batal</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default DataBarang;