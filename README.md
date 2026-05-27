<p align="center">
  <img src="https://media.giphy.com/media/26tn33aiTi1jkl6H6/giphy.gif" width="100%" alt="AdmajaMajesti Banner" />
</p>

<h1 align="center">🏡 Manajemen Perumahan V2 <br>by TUGAS.IN Kelompok 3</h1>

<p align="center">
  <img src="https://img.shields.io/badge/Java-ED8B00?style=for-the-badge&logo=java&logoColor=white" alt="Java Badges" />
  <img src="https://img.shields.io/badge/Spring_Boot-6DB33F?style=for-the-badge&logo=spring-boot&logoColor=white" alt="Spring Badges" />
  <img src="https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white" alt="MySQL Badges" />
  <img src="https://img.shields.io/badge/Aiven_Cloud-00AFD7?style=for-the-badge&logo=aiven&logoColor=white" alt="Aiven Badges" />
</p>

<p align="center">
  Aplikasi terintegrasi untuk manajemen data properti, agen (users), dan riwayat transaksi secara efisien. Proyek ini menghubungkan keunggulan <b>Java Spring Boot</b> dengan keandalan database <b>MySQL di Aiven Cloud</b>.
</p>

---

## 📸 Demo Aplikasi
<p align="center">
  <img src="demo.gif" alt="Rekaman Layar Demo Aplikasi" width="80%" style="border-radius: 10px; border: 2px solid #ddd;" />
</p>

---

## ⚡ Quick Start: Jalankan Aplikasi dalam 4 Langkah

**⚠️ PERINGATAN KEAMANAN:** Demi melindungi database cloud, file `src/main/resources/application.properties` **sengaja tidak di-upload**. Segera minta kredensial koneksi di grup WhatsApp kelompok untuk melanjutkan!

Berikut adalah panduan ringkas untuk menyalakan proyek di laptop Anda:

<details open>
  <summary><b>Klik untuk melihat langkah detail (Toggle)</b></summary>
  <br>
  <ol>
    <li>
      <b>Clone Repositori</b><br>
      Unduh proyek ini ke komputer lokal Anda dengan menjalankan perintah terminal:
      <pre lang="bash">
git clone https://github.com/Furry-Indonesia/ManajemenPerumahanV2.git
cd ManajemenPerumahanV2
      </pre>
    </li>
    <li>
      <b>Pasang Kunci Database</b><br>
      Buat file baru bernama <code>application.properties</code> di dalam folder <code>src/main/resources/</code>, lalu <i>paste</i> kodingan konfigurasi Aiven yang didapat dari grup WA ke dalam file tersebut.
    </li>
    <li>
      <b>Nyalakan Mesin</b><br>
      Pastikan laptop terhubung ke internet. Buka terminal di VS Code lalu jalankan:
      <pre lang="bash">
# Untuk Windows:
cmd /c mvnw spring-boot:run

# Untuk Mac/Linux:
./mvnw spring-boot:run
      </pre>
    </li>
    <li>
      <b>Buka Web</b><br>
      Setelah log terminal menampilkan status "Started", buka browser Anda dan kunjungi:
      <h3 align="center">👉 <a href="http://localhost:8080/">http://localhost:8080/</a></h3>
    </li>
  </ol>
</details>

---

## 📂 Fitur Utama
Aplikasi TUGAS.IN Manajemen Perumahan V2 dilengkapi dengan fitur-fitur canggih:

| Fitur | Deskripsi |
| :--- | :--- |
| **🔍 Katalog Properti** | Menampilkan daftar lengkap rumah/apartemen, lengkap dengan foto, lokasi, harga, dan detail spesifikasi ruangan. |
| **👥 Manajemen Agen** | Pendaftaran dan pengelolaan data profil agen/admin perumahan. |
| **📄 Riwayat Transaksi** | Pencatatan detail riwayat pembelian properti oleh pembeli. |
| **📸 Upload Foto** | Sistem penyimpanan lokal untuk foto profil dan foto rumah (Maks. 10MB per file). |

---

## 🎓 Tim Pengembang (Kelompok 3)
* **AdmajaMajesti** - *Full Stack Developer*
* **Rensa** - *Database Engineer*
* ... (Tambahkan nama teman-teman sekelompok mase di sini, ya!)

---
<p align="center">
  Dibuat dengan ❤️ untuk Tugas Besar Praktikum PBO.
</p>