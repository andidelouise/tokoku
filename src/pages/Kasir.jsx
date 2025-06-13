import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { ShoppingCart, Save } from 'lucide-react';

// Terima props dari MainLayout
const Kasir = ({ items, stores, onDataChange }) => {
  // State untuk form transaksi
  const [selectedItem, setSelectedItem] = useState('');
  const [selectedStore, setSelectedStore] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);

  // State untuk UI feedback
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Hitung total harga setiap kali item atau kuantitas berubah
  useEffect(() => {
    if (selectedItem && quantity > 0) {
      const item = items.find(i => i.id === selectedItem);
      if (item) {
        setTotalPrice(item.price * quantity);
      }
    } else {
      setTotalPrice(0);
    }
  }, [selectedItem, quantity, items]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    // Validasi
    if (!selectedItem || !selectedStore || quantity <= 0) {
      setError('Harap lengkapi semua data transaksi.');
      setLoading(false);
      return;
    }

    try {
      const itemData = items.find(i => i.id === selectedItem);
      if (itemData.stock < quantity) {
          throw new Error(`Stok tidak mencukupi. Sisa stok: ${itemData.stock}`);
      }

      // 1. Simpan data ke tabel 'sales'
      const { error: salesError } = await supabase.from('sales').insert({
        item_id: selectedItem,
        store_id: selectedStore,
        quantity: quantity,
        total_price: totalPrice,
      });

      if (salesError) throw salesError;

      // 2. Kurangi stok di tabel 'items'
      const newStock = itemData.stock - quantity;
      const { error: stockError } = await supabase
        .from('items')
        .update({ stock: newStock })
        .eq('id', selectedItem);

      if (stockError) throw stockError;

      setMessage('Transaksi berhasil disimpan!');
      // Reset form
      setSelectedItem('');
      setSelectedStore('');
      setQuantity(1);
      // Panggil fungsi refresh dari parent untuk update data di seluruh aplikasi
      onDataChange();

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-4">
        <ShoppingCart className="w-8 h-8 text-blue-600" />
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Halaman Kasir</h1>
          <p className="mt-1 text-gray-600">Catat transaksi penjualan baru.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl border shadow-sm space-y-6">
        {/* Pesan Sukses atau Error */}
        {message && <p className="text-green-600 bg-green-100 p-3 rounded-lg">{message}</p>}
        {error && <p className="text-red-600 bg-red-100 p-3 rounded-lg">{error}</p>}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Pilih Barang</label>
          <select
            value={selectedItem}
            onChange={(e) => setSelectedItem(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white"
            required
          >
            <option value="">-- Nama Barang --</option>
            {items && items.map(item => (
              <option key={item.id} value={item.id}>
                {item.name} (Stok: {item.stock})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Pilih Toko</label>
          <select
            value={selectedStore}
            onChange={(e) => setSelectedStore(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white"
            required
          >
            <option value="">-- Lokasi Penjualan --</option>
            {stores && stores.map(store => (
              <option key={store.id} value={store.id}>
                {store.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Jumlah</label>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value, 10))}
            min="1"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            required
          />
        </div>

        <div className="pt-4 border-t">
          <div className="flex justify-between items-center">
            <span className="text-lg font-medium text-gray-600">Total Harga:</span>
            <span className="text-2xl font-bold text-gray-800">
              Rp {totalPrice.toLocaleString('id-ID')}
            </span>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
        >
          <Save className="w-5 h-5" />
          {loading ? 'Menyimpan...' : 'Simpan Transaksi'}
        </button>
      </form>
    </div>
  );
};

export default Kasir;