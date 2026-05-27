# 🏡 Manajemen Perumahan V2 (TUGAS.IN)

Aplikasi berbasis web untuk sistem manajemen perumahan. Proyek ini memfasilitasi pengelolaan data properti, agen (users), dan riwayat transaksi secara terintegrasi. 

Aplikasi ini dibangun menggunakan **Java Spring Boot** dan telah terhubung dengan *database cloud* **MySQL via Aiven**.

## 🛠️ Teknologi yang Digunakan
* **Bahasa Pemrograman:** Java
* **Framework:** Spring Boot
* **Database:** MySQL (Aiven Cloud)
* **Frontend:** HTML, CSS, JavaScript

---

## 🚀 Cara Menjalankan Aplikasi (Quick Start)

**⚠️ PENTING:** Demi keamanan, file konfigurasi database (`application.properties`) sengaja tidak di-upload. Silakan minta kodingan koneksinya di grup WhatsApp kelompok terlebih dahulu!

Ikuti langkah singkat ini secara berurutan untuk menyalakan aplikasi di laptop Anda:

1. **Clone Repositori:** Buka terminal dan unduh proyek dengan mengetik `git clone https://github.com/Furry-Indonesia/ManajemenPerumahanV2.git`, lalu masuk ke foldernya dengan perintah `cd ManajemenPerumahanV2`.
2. **Pasang Kunci Database:** Buat file baru persis dengan nama `application.properties` di dalam folder `src/main/resources/`, lalu *paste* kodingan konfigurasi Aiven yang didapat dari grup WA ke dalam file tersebut.
3. **Nyalakan Mesin:** Pastikan laptop terhubung ke internet (karena menggunakan *cloud*, XAMPP tidak perlu dinyalakan). Buka terminal di VS Code lalu jalankan perintah `cmd /c mvnw spring-boot:run` (untuk Windows) atau `./mvnw spring-boot:run` (untuk Mac/Linux).
4. **Buka Web:** Setelah *loading* di terminal selesai dan tidak ada *error*, buka *browser* Anda dan kunjungi alamat 👉 **http://localhost:8080/**

---

## 📂 Fitur Utama
* **Katalog Properti:** Menampilkan daftar rumah/apartemen yang tersedia, lengkap dengan harga, lokasi, dan detail ruangan.
* **Manajemen Agen:** Pendaftaran dan pengelolaan data agen/admin perumahan.
* **Transaksi:** Pencatatan riwayat pembelian properti.
* **Upload Foto:** Sistem sudah mendukung penyimpanan *file upload* lokal untuk foto profil dan foto rumah (batas ukuran maksimal 10MB).