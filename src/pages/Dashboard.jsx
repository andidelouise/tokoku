import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Activity, Box, DollarSign, Truck, Store as StoreIcon } from 'lucide-react';

// Data mock untuk chart, nanti bisa diganti data dari Supabase
const mockSalesData = [
  { month: 'Jan', sales: 4000, profit: 2400 }, { month: 'Feb', sales: 3000, profit: 1398 },
  { month: 'Mar', sales: 2000, profit: 9800 }, { month: 'Apr', sales: 2780, profit: 3908 },
  { month: 'May', sales: 1890, profit: 4800 }, { month: 'Jun', sales: 2390, profit: 3800 },
];
const mockCategoryData = [
  { name: 'Elektronik', value: 400, color: '#0088FE' }, { name: 'Fashion', value: 300, color: '#00C49F' },
  { name: 'Makanan', value: 300, color: '#FFBB28' }, { name: 'Lainnya', value: 200, color: '#FF8042' },
];


const Dashboard = ({ user, items, suppliers, stores }) => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-600 mt-1">Selamat datang, {user?.email}</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card Total Barang */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
          <p>Total Barang</p><p className="text-3xl font-bold">{items.length}</p>
        </div>
        {/* Card Total Penjualan (mock) */}
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
          <p>Total Penjualan</p><p className="text-3xl font-bold">Rp 45.2M</p>
        </div>
        {/* Card Supplier */}
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white">
          <p>Supplier</p><p className="text-3xl font-bold">{suppliers.length}</p>
        </div>
        {/* Card Toko */}
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-6 text-white">
          <p>Toko</p><p className="text-3xl font-bold">{stores.length}</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Penjualan Bulanan</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={mockSalesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="sales" stroke="#3B82F6" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Kategori Produk</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={mockCategoryData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} fill="#8884d8" label>
                {mockCategoryData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;