<p align="center">
  <img src="https://media.giphy.com/media/26tn33aiTi1jkl6H6/giphy.gif" width="100%" alt="Banner" />
</p>

<h1 align="center">🏡 Manajemen Perumahan V2</h1>

<p align="center">
  <b>by Furry-Indonesia · Kelompok 3</b>
</p>

<p align="center">
  <!-- Badge Backend & DB -->
  <img src="https://img.shields.io/badge/Java-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white" />
  <img src="https://img.shields.io/badge/Spring_Boot-6DB33F?style=for-the-badge&logo=spring-boot&logoColor=white" />
  <img src="https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white" />
  <img src="https://img.shields.io/badge/Aiven_Cloud-00AFD7?style=for-the-badge&logo=aiven&logoColor=white" />
  <br>
  <!-- Badge Frontend -->
  <img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white" />
  <img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white" />
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" />
</p>

<p align="center">
  Aplikasi terintegrasi untuk manajemen data properti, agen, dan riwayat transaksi secara efisien.<br/>
  Menghubungkan keunggulan <b>Java Spring Boot</b> dengan keandalan database <b>MySQL di Aiven Cloud</b>.
</p>

---

## 📋 Daftar Isi

- [⚡ Quick Start](#-quick-start)
- [📂 Fitur Utama](#-fitur-utama)
- [🗂️ Struktur Folder](#️-struktur-folder)
- [🛠️ Teknologi](#️-teknologi-yang-digunakan)
- [🎓 Tim Pengembang](#-tim-pengembang--kelompok-3)

---

## ⚡ Quick Start

> **⚠️ Perhatian Keamanan**
> File `src/main/resources/application.properties` **sengaja tidak di-upload** demi melindungi kredensial database cloud.
> Minta file konfigurasi di grup WhatsApp kelompok sebelum melanjutkan.

**Langkah 1 — Clone Repositori**

```bash
git clone https://github.com/Furry-Indonesia/ManajemenPerumahanV2.git
cd ManajemenPerumahanV2
```

**Langkah 2 — Pasang Kunci Database**

Buat file baru di `src/main/resources/application.properties`, lalu *paste* konfigurasi berikut ke dalam file tersebut:

```properties
# ===============================
# KONFIGURASI DATABASE MYSQL
# ===============================
# Ganti dengan port MySQL-mu jika bukan 3306
spring.datasource.url=jdbc:mysql://localhost:3306/db_perumahan_v2?useSSL=false&serverTimezone=UTC
spring.datasource.username=root
# Kosongkan password di bawah ini jika kamu pakai XAMPP default tanpa password
spring.datasource.password=

# ===============================
# KONFIGURASI JPA & HIBERNATE
# ===============================
# 'update' berarti Spring Boot tidak akan menghapus tabel yang sudah kita buat
spring.jpa.hibernate.ddl-auto=update
# Untuk melihat proses SQL di terminal (membantu saat debugging)
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true
# Memperbesar batas maksimal file upload menjadi 10 MB
spring.servlet.multipart.max-file-size=10MB
spring.servlet.multipart.max-request-size=10MB
```

**Langkah 3 — Import Database**

Buka **phpMyAdmin** (atau MySQL client lainnya), lalu:

1. Buat database baru bernama `db_perumahan_v2`
2. Pilih database tersebut, lalu klik tab **Import**
3. Upload file `db_perumahan_v2.sql` yang tersedia di repositori ini
4. Klik **Go / Eksekusi**

Atau gunakan perintah berikut via terminal:

```bash
mysql -u root -p db_perumahan_v2 < db_perumahan_v2.sql
```

> Database berisi 4 tabel: `users`, `properti`, `transaksi`, dan `perusahaan` — lengkap dengan data percobaan.

**Langkah 4 — Jalankan Aplikasi**

Pastikan laptop terhubung ke internet, lalu buka terminal dan jalankan:

```bash
# Windows
cmd /c mvnw spring-boot:run

# Mac / Linux
./mvnw spring-boot:run
```

**Langkah 5 — Buka Browser**

Setelah terminal menampilkan status **"Started"**, buka browser dan kunjungi:

<h3 align="center">
  👉 <a href="http://localhost:8080/">http://localhost:8080/</a>
</h3>

---

## 📂 Fitur Utama

| Fitur | Deskripsi |
| :--- | :--- |
| 🔍 **Katalog Properti** | Menampilkan daftar lengkap rumah/apartemen dengan foto, lokasi, harga, dan spesifikasi ruangan. |
| 👥 **Manajemen Agen** | Pendaftaran dan pengelolaan data profil agen/admin perumahan. |
| 📄 **Riwayat Transaksi** | Pencatatan detail riwayat pembelian properti oleh pembeli. |
| 📊 **Server-Side Aggregation** | Perhitungan statistik metrik KPI langsung dari Backend untuk performa super ringan.
| 📸 **Upload Foto** | Penyimpanan lokal untuk foto profil dan foto rumah (maks. 10 MB per file). |

---

## 🗂️ Struktur Folder

```
ManajemenPerumahanV2/
│
├── 📄 README.md
├── 📄 .gitignore
│
└── ManajemenPerumahan/
    ├── 📄 pom.xml                          # Konfigurasi Maven & dependensi
    │
    └── src/
        └── main/
            ├── java/
            │   └── perumahan/
            │       ├── 🚀 ManajemenPerumahanApplication.java   # Entry point aplikasi
            │       │
            │       ├── config/
            │       │   └── WebConfig.java                     # Konfigurasi web & CORS
            │       │
            │       ├── controller/
            │       │   ├── AuthController.java                # Autentikasi (login/logout)
            │       │   ├── PropertiController.java            # CRUD data properti
            │       │   └── UserController.java                # Manajemen pengguna/agen
            │       │
            │       ├── model/
            │       │   ├── Properti.java                      # Entity properti
            │       │   ├── Transaksi.java                     # Entity transaksi
            │       │   ├── User.java                          # Entity pengguna
            │       │   ├── LoginDTO.java                      # DTO form login
            │       │   ├── PembeliDTO.java                    # DTO data pembeli
            │       │   └── PropertiBaruDTO.java               # DTO tambah properti
            │       │
            │       └── repository/
            │           ├── PropertiRepository.java            # Query database properti
            │           ├── TransaksiRepository.java           # Query database transaksi
            │           └── UserRepository.java                # Query database pengguna
            │
            └── resources/
                ├── ⚙️ application.properties                  # ⚠️ TIDAK di-upload (rahasia)
                │
                └── static/                                    # File frontend (HTML)
                    ├── index.html                             # Halaman utama / landing
                    ├── login.html                             # Halaman login
                    ├── dashboard.html                         # Dashboard admin
                    ├── katalog.html                           # Katalog properti
                    ├── manajemen-agen.html                    # Kelola data agen
                    ├── riwayat-transaksi.html                 # Riwayat transaksi
                    ├── laporan.html                           # Halaman laporan
                    ├── setting.html                           # Pengaturan sistem
                    ├── setting-user.html                      # Pengaturan profil
                    │
                    └── uploads/                               # Penyimpanan file upload
                        ├── profil/                            # Foto profil agen
                        └── properti/                          # Foto properti
```

---

## 🛠️ Teknologi yang Digunakan

### 🖥️ Frontend (Client-Side)

| Teknologi | Peran |
| :--- | :--- |
| **HTML5 & CSS3** | Struktur antarmuka dan styling (Custom Properties/Variables, Flexbox/Grid, Animasi CSS). |
| **Vanilla JavaScript (ES6+)** | Logika sisi klien (Thin Client), manipulasi DOM dinamis, Event Handling. |
| **Fetch API & Promise** | Komunikasi asinkronus (AJAX) dengan Backend REST API. |
| **SessionStorage** | Manajemen sesi pengguna (Auth Guard, Self-Protection UI). |
| **SweetAlert2** | Modul pop-up notifikasi (toast & modal) yang interaktif dan elegan. |
| **Tabler Icons / FontAwesome** | Tipografi ikon vektor untuk visualisasi UI/UX. |

### ⚙️ Backend (Server-Side) & Database

| Teknologi | Peran |
| :--- | :--- |
| **Java 17+** | Bahasa pemrograman utama logika server. |
| **Spring Boot 3** | Framework utama Backend dan RESTful API. |
| **Spring Data JPA (Hibernate)** | ORM (Object-Relational Mapping) untuk query database dinamis. |
| **MySQL** | Basis data relasional (Relational Database Management System). |
| **Aiven Cloud** | Hosting database cloud (DBaaS). |
| **Maven Wrapper** | Build tool & manajemen dependensi proyek. |

---

## 🎓 Tim Pengembang — Kelompok 3

| Nama | NIM |
| :--- | :---: |
| Mohammad Alvin Firmansyah | 25051204401 |
| Naila Nurul Faizah | 25051204343 |
| Maulana Halim | 25051204386 |
| Dea Apriani Agustin | 25051204387 |
| Indasyifa Debian Wirajati | 25051204395 |
| Akhdan Farrel Bernadine | 25051204398 |
| Widya Pramudyaning Tyas | 25051204405 |

---

<p align="center">
  Dibuat Oleh <b>Furry-Indonesia(KEL-3)</b> &nbsp;·&nbsp; Solid! Solid! Solid! 🐾
</p>