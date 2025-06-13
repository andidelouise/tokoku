import React from 'react';
import { supabase } from '../lib/supabaseClient';
import { BarChart3, Package, Truck, Store, TrendingUp, Users, LogOut, X, ShoppingCart } from 'lucide-react'; // Ikon baru ditambahkan

const Sidebar = ({ user, userRole, currentPage, setCurrentPage, sidebarOpen, setSidebarOpen }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3, adminOnly: false },
    { id: 'kasir', label: 'Kasir', icon: ShoppingCart, adminOnly: false }, // <-- MENU BARU
    { id: 'barang', label: 'Data Barang', icon: Package, adminOnly: false },
    { id: 'supplier', label: 'Data Supplier', icon: Truck, adminOnly: true },
    { id: 'toko', label: 'Data Toko', icon: Store, adminOnly: true },
    { id: 'laporan', label: 'Laporan', icon: TrendingUp, adminOnly: true },
  ];

  // Filter menu berdasarkan role pengguna
  const availableMenuItems = menuItems.filter(item => {
    if (!item.adminOnly) {
      return true;
    }
    return userRole === 'admin';
  });

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <>
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out lg:static lg:inset-0 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="flex items-center justify-between h-16 px-6 border-b">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 w-8 h-8 rounded-lg flex items-center justify-center">
              <Store className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-800">TokoKu</span>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>
        <nav className="mt-6 flex-1">
          {availableMenuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setCurrentPage(item.id);
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-6 py-3 text-left transition-colors ${
                currentPage === item.id
                ? 'bg-blue-50 border-r-4 border-blue-600 text-blue-600 font-semibold'
                : 'text-gray-700 hover:bg-blue-50'
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </button>
          ))}
        </nav>
        <div className="p-6 border-t">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                <Users className="w-5 h-5 text-gray-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800 truncate">{user.email}</p>
                <p className="text-xs text-gray-500 capitalize">{userRole}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-3 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;