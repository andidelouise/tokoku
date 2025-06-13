import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';

// Terima props dari MainLayout: sales (data transaksi), items (data barang), dan loading
const Laporan = ({ sales, items, loading }) => {
  const [summary, setSummary] = useState({ totalPenjualan: 0, totalKeuntungan: 0, totalTransaksi: 0, produkTerjual: 0 });
  const [monthlySales, setMonthlySales] = useState([]);
  const [topProducts, setTopProducts] = useState([]);

  useEffect(() => {
    // Proses data hanya jika data penjualan dan barang sudah tersedia
    if (sales && items && sales.length > 0) {
      // 1. Menghitung Ringkasan (Summary Cards)
      const totalPenjualan = sales.reduce((sum, sale) => sum + Number(sale.total_price), 0);
      const produkTerjual = sales.reduce((sum, sale) => sum + sale.quantity, 0);
      // Asumsi keuntungan adalah 25% dari harga jual. Ini bisa disempurnakan jika ada harga modal.
      const totalKeuntungan = totalPenjualan * 0.25;

      setSummary({
        totalPenjualan,
        totalKeuntungan,
        totalTransaksi: sales.length,
        produkTerjual,
      });

      // 2. Mengolah Data untuk Grafik Tren Bulanan
      const monthlyData = {};
      sales.forEach(sale => {
        const month = new Date(sale.sale_date).toLocaleString('default', { month: 'short' });
        if (!monthlyData[month]) {
          monthlyData[month] = { name: month, Penjualan: 0, Keuntungan: 0 };
        }
        monthlyData[month].Penjualan += Number(sale.total_price);
        monthlyData[month].Keuntungan += Number(sale.total_price) * 0.25; // Asumsi keuntungan 25%
      });
      setMonthlySales(Object.values(monthlyData));

      // 3. Mengolah Data untuk Produk Terlaris
      const productSales = {};
      sales.forEach(sale => {
        if (!productSales[sale.item_id]) {
          const item = items.find(i => i.id === sale.item_id);
          productSales[sale.item_id] = { name: item ? item.name : 'Produk Dihapus', terjual: 0 };
        }
        productSales[sale.item_id].terjual += sale.quantity;
      });
      // Urutkan dan ambil 5 produk teratas
      const sortedProducts = Object.values(productSales).sort((a, b) => b.terjual - a.terjual).slice(0, 5);
      setTopProducts(sortedProducts);
    }
  }, [sales, items]); // Proses ulang setiap kali data sales atau items berubah

  if (loading) {
    return <p>Memuat data laporan...</p>;
  }

  if (!sales || sales.length === 0) {
      return (
          <div className="text-center py-10 bg-white rounded-xl border">
              <h1 className="text-2xl font-bold text-gray-800">Laporan & Analisis</h1>
              <p className="mt-4 text-gray-500">Belum ada data penjualan untuk ditampilkan.</p>
              <p className="text-sm text-gray-400 mt-1">Silakan lakukan transaksi di halaman Kasir untuk memulai.</p>
          </div>
      )
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Laporan & Analisis</h1>
        <p className="mt-1 text-gray-600">Ringkasan performa penjualan toko Anda.</p>
      </div>

      {/* Ringkasan Utama dengan data asli */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl border shadow-sm">
          <h4 className="text-gray-500 font-medium">Total Penjualan</h4>
          <p className="text-3xl font-bold text-blue-600 mt-2">Rp {summary.totalPenjualan.toLocaleString('id-ID')}</p>
        </div>
        <div className="bg-white p-6 rounded-xl border shadow-sm">
          <h4 className="text-gray-500 font-medium">Total Keuntungan (Estimasi)</h4>
          <p className="text-3xl font-bold text-green-600 mt-2">Rp {summary.totalKeuntungan.toLocaleString('id-ID')}</p>
        </div>
        <div className="bg-white p-6 rounded-xl border shadow-sm">
          <h4 className="text-gray-500 font-medium">Total Transaksi</h4>
          <p className="text-3xl font-bold text-indigo-600 mt-2">{summary.totalTransaksi}</p>
        </div>
        <div className="bg-white p-6 rounded-xl border shadow-sm">
          <h4 className="text-gray-500 font-medium">Total Produk Terjual</h4>
          <p className="text-3xl font-bold text-orange-600 mt-2">{summary.produkTerjual}</p>
        </div>
      </div>

      {/* Visualisasi Data dengan data asli */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-xl border shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Grafik Tren Penjualan & Keuntungan</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlySales}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis tickFormatter={(value) => `Rp ${value/1000}k`} />
              <Tooltip formatter={(value) => `Rp ${value.toLocaleString('id-ID')}`}/>
              <Legend />
              <Line type="monotone" dataKey="Penjualan" stroke="#3b82f6" strokeWidth={2} />
              <Line type="monotone" dataKey="Keuntungan" stroke="#10b981" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white p-6 rounded-xl border shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Produk Terlaris</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topProducts} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis type="category" dataKey="name" width={120} tick={{ fontSize: 12 }} />
                <Tooltip formatter={(value) => `${value} unit`}/>
                <Legend />
                <Bar dataKey="terjual" fill="#8884d8" name="Unit Terjual" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Laporan;