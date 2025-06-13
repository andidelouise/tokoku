# TokoKu - Aplikasi Manajemen Toko Modern

![Tangkapan Layar Dashboard TokoKu](https://i.imgur.com/G5fB4yV.png)

**TokoKu** adalah aplikasi web manajemen toko yang lengkap dan modern, dibangun untuk membantu pemilik usaha mengelola operasional toko mereka dengan efisien. Aplikasi ini menyediakan fitur-fitur penting mulai dari manajemen data, otentikasi pengguna dengan hak akses, hingga laporan analitik penjualan.

**[Lihat Live Demo](https://tokoku-rho.vercel.app/)** 

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

## ⚙️ Panduan Setup & Instalasi Lokal

Untuk menjalankan proyek ini di komputer lokal Anda, ikuti langkah-langkah berikut:

1.  **Clone Repositori**
    ```bash
    git clone [https://github.com/andi-nugroho/tokoku-app.git](https://github.com/andi-nugroho/tokoku-app.git)
    cd tokoku-app
    ```

2.  **Install Dependensi**
    ```bash
    npm install
    ```

3.  **Setup Database Supabase**
    -   Buat proyek baru di [Supabase](https://supabase.io/).
    -   Masuk ke **SQL Editor** dan jalankan seluruh skrip dari file `schema.sql` untuk membuat semua tabel dan kebijakan keamanan.

4.  **Setup Environment Variables**
    -   Buat file bernama `.env.local` di direktori utama proyek.
    -   Dapatkan **URL** dan **Anon Key** dari dashboard Supabase Anda (Settings > API) dan masukkan ke dalam file.
    ```env
    REACT_APP_SUPABASE_URL=URL_SUPABASE_ANDA
    REACT_APP_SUPABASE_ANON_KEY=ANON_KEY_SUPABASE_ANDA
    ```

5.  **Jalankan Aplikasi**
    ```bash
    npm start
    ```
    Aplikasi akan berjalan di `http://localhost:3000`.

---

## 📂 Struktur Proyek

/src
|-- /components        # Komponen UI kecil yang dapat digunakan kembali (mis: Modal)
|-- /layouts           # Komponen tata letak utama (Sidebar, MainLayout)
|-- /lib               # Koneksi dan helper pihak ketiga (mis: supabaseClient)
|-- /pages             # Komponen yang merepresentasikan satu halaman penuh
|-- App.jsx            # Komponen utama yang mengatur routing & sesi
|-- index.js           # Titik masuk utama aplikasi React

---

## 🤝 Kontribusi

Kontribusi, isu, dan permintaan fitur sangat diterima! Jangan ragu untuk membuat isu baru atau pull request.

## 📄 Lisensi

Proyek ini dilisensikan di bawah Lisensi MIT.

Kontribusi, isu, dan permintaan fitur sangat diterima! Jangan ragu untuk membuat isu baru atau pull request.

## 📄 Lisensi

Proyek ini dilisensikan di bawah Lisensi MIT.
