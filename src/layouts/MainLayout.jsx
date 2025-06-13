import React, { useState, useEffect, useCallback } from 'react'; // <-- 1. Impor useCallback
import { supabase } from '../lib/supabaseClient';
import Sidebar from './Sidebar';
import { Menu } from 'lucide-react';

import Dashboard from '../pages/Dashboard';
import Kasir from '../pages/Kasir';
import DataBarang from '../pages/DataBarang';
import DataSupplier from '../pages/DataSupplier';
import DataToko from '../pages/DataToko';
import Laporan from '../pages/Laporan';

const MainLayout = ({ user }) => {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userRole, setUserRole] = useState(null);

  const [items, setItems] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [stores, setStores] = useState([]);
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);

  // 2. Bungkus fetchAllData dengan useCallback
  // Ini memberitahu React untuk tidak membuat ulang fungsi ini di setiap render,
  // kecuali jika dependensinya (user.id) berubah.
  const fetchAllData = useCallback(async () => {
    if (!user) return; // Tambahkan penjagaan jika user belum ada

    setLoading(true);
    try {
        const { data: userData } = await supabase.from('users').select('role').eq('id', user.id).single();
        if (userData) setUserRole(userData.role);

        const [itemsRes, suppliersRes, storesRes, salesRes] = await Promise.all([
            supabase.from('items').select('*').order('name'),
            supabase.from('suppliers').select('*').order('name'),
            supabase.from('stores').select('*').order('name'),
            supabase.from('sales').select('*').order('sale_date', { ascending: false })
        ]);

        setItems(itemsRes.data || []);
        setSuppliers(suppliersRes.data || []);
        setStores(storesRes.data || []);
        setSales(salesRes.data || []);
    } catch (error) {
        console.error("Error fetching data:", error);
    } finally {
        setLoading(false);
    }
  }, [user]); // Dependensi useCallback adalah 'user'

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]); // <-- 3. Sekarang aman untuk menambahkan fetchAllData sebagai dependensi

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard user={user} items={items} suppliers={suppliers} stores={stores} loading={loading} />;
      case 'kasir':
        return <Kasir items={items} stores={stores} onDataChange={fetchAllData} />;
      case 'barang':
        return <DataBarang initialItems={items} suppliers={suppliers} onDataChange={fetchAllData} loading={loading} />;
      case 'supplier':
        if (userRole === 'admin') return <DataSupplier initialSuppliers={suppliers} onDataChange={fetchAllData} loading={loading} />;
        return <p>Anda tidak memiliki akses ke halaman ini.</p>;
      case 'toko':
        if (userRole === 'admin') return <DataToko initialStores={stores} onDataChange={fetchAllData} loading={loading} />;
        return <p>Anda tidak memiliki akses ke halaman ini.</p>;
      case 'laporan':
        if (userRole === 'admin') return <Laporan sales={sales} items={items} loading={loading} />;
        return <p>Anda tidak memiliki akses ke halaman ini.</p>;
      default:
        return <Dashboard user={user} items={items} suppliers={suppliers} stores={stores} loading={loading} />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar user={user} userRole={userRole} currentPage={currentPage} setCurrentPage={setCurrentPage} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm border-b h-16 flex items-center justify-between px-6">
           <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-gray-600 hover:text-gray-900">
             <Menu className="w-6 h-6" />
           </button>
           <div className="hidden lg:block w-0"></div>
           <div></div>
        </header>
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          {renderPage()}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;