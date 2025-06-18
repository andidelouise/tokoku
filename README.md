# TokoKu - Aplikasi Manajemen Toko Modern

![Macbook-Air-tokoku-rho vercel app](https://github.com/user-attachments/assets/f471c85b-1e04-4da2-af72-dc1a60b333e4)

**TokoKu** adalah aplikasi web manajemen toko yang lengkap dan modern, dibangun untuk membantu pemilik usaha mengelola operasional toko mereka dengan efisien. Aplikasi ini menyediakan fitur-fitur penting mulai dari manajemen data, otentikasi pengguna dengan hak akses, hingga laporan analitik penjualan.


**[https://tokoku-rho.vercel.app/] (https://tokoku-rho.vercel.app/)** 

---

## 🗄️ Skema Database

Berikut adalah diagram relasi untuk struktur database yang digunakan dalam aplikasi ini di Supabase.
![supabase-schema](https://github.com/user-attachments/assets/7e01470d-07aa-4452-8f93-f10771f3953c)

---

## 🗄️ Struktur Database

Aplikasi ini menggunakan beberapa tabel utama di Supabase untuk mengelola data:

-   **`users`**: Menyimpan informasi tambahan pengguna seperti `role` ('admin' atau 'pengguna'). Terhubung dengan tabel `auth.users` bawaan Supabase.
-   **`items`**: Menyimpan semua data barang, termasuk nama, kategori, harga, stok, dan relasi ke `suppliers`.
-   **`suppliers`**: Menyimpan data master untuk semua supplier.
-   **`stores`**: Menyimpan data master untuk semua cabang toko.
-   **`sales`**: Mencatat setiap transaksi penjualan yang terjadi, termasuk relasi ke `items` dan `stores`.

---

## 🚀 Fitur Utama

-   **Manajemen Pengguna & Hak Akses**:
    -   Dua jenis peran: **Admin** (akses penuh) dan **Pengguna** (akses terbatas).
    -   Sistem pendaftaran dan login yang aman menggunakan Supabase Auth.
-   **Dashboard Analitik**:
    -   Statistik ringkasan (Total Barang, Penjualan, Supplier, Toko).
    -   Visualisasi data penjualan dan produk terlaris menggunakan chart interaktif.
-   **Manajemen Data (CRUD)**:
    -   Kelola **Data Barang**: Nama, kategori, harga, dan stok.
    -   Kelola **Data Supplier**: Informasi kontak dan alamat.
    -   Kelola **Data Toko**: Informasi cabang dan manajer.
-   **Fitur Kasir (Point of Sale)**:
    -   Formulir untuk mencatat transaksi penjualan baru.
    -   Stok barang otomatis berkurang setiap ada transaksi.
-   **Halaman Laporan**:
    -   Menampilkan data penjualan asli dalam bentuk grafik tren dan produk terlaris.
-   **Desain Modern & Responsif**:
    -   Dibangun dengan pendekatan *mobile-first*.
    -   Antarmuka yang bersih dan profesional menggunakan Tailwind CSS.

---

## 🔑 Akun Demo

Anda bisa mencoba aplikasi menggunakan akun di bawah ini untuk melihat perbedaan hak akses.

-   **Peran Admin**
    -   **Email**: `admin@gmail.com`
    -   **Password**: `admin123`

-   **Peran Pengguna Biasa**
    -   **Email**: `user@gmail.com`
    -   **Password**: `user123`

---

## 🛠️ Teknologi yang Digunakan

-   **Frontend**: [React](https://reactjs.org/)
-   **Backend & Database**: [Supabase](https://supabase.io/)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
-   **Charting**: [Recharts](https://recharts.org/)
-   **Icons**: [Lucide React](https://lucide.dev/)
-   **Deployment**: [Vercel](https://vercel.com/)

---

## 🤝 Kontribusi

Kontribusi, isu, dan permintaan fitur sangat diterima! Jangan ragu untuk membuat isu baru atau pull request.

