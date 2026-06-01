-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Waktu pembuatan: 01 Jun 2026 pada 13.52
-- Versi server: 10.4.32-MariaDB
-- Versi PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `db_perumahan_v2`
--

-- --------------------------------------------------------

--
-- Struktur dari tabel `perusahaan`
--

CREATE TABLE `perusahaan` (
  `id` int(11) NOT NULL,
  `alamat` varchar(255) DEFAULT NULL,
  `brand` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `nama` varchar(255) DEFAULT NULL,
  `npwp` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `perusahaan`
--

INSERT INTO `perusahaan` (`id`, `alamat`, `brand`, `email`, `nama`, `npwp`) VALUES
(1, 'Gedung Admaja Tower Lt. 4, Jl. Jend. Sudirman No. 88, Ponorogo, Jawa Timur 63411', 'Admaja Majesti', 'admajamajestiofc@yahoo.co.id', 'PT. Admaja Properti  Graha Majesti', '02.456.789.1-645.000');

-- --------------------------------------------------------

--
-- Struktur dari tabel `properti`
--

CREATE TABLE `properti` (
  `kode` varchar(20) NOT NULL,
  `nama` varchar(100) NOT NULL,
  `harga` double NOT NULL,
  `lokasi` varchar(100) NOT NULL,
  `foto_properti` varchar(255) DEFAULT 'default_house.jpg',
  `username_agen` varchar(50) DEFAULT NULL,
  `kategori` varchar(20) NOT NULL,
  `tipe_rumah` varchar(50) DEFAULT NULL,
  `luas_tanah` int(11) DEFAULT NULL,
  `lantai` int(11) DEFAULT NULL,
  `is_terjual` tinyint(1) DEFAULT 0,
  `km` varchar(20) DEFAULT NULL,
  `kt` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `properti`
--

INSERT INTO `properti` (`kode`, `nama`, `harga`, `lokasi`, `foto_properti`, `username_agen`, `kategori`, `tipe_rumah`, `luas_tanah`, `lantai`, `is_terjual`, `km`, `kt`) VALUES
('BYW01', 'Banyuwangi Indah', 500000000, 'Kab. Banyuwangi', '1779951331316_Group-164-min.jpg', 'Alvinskie', 'Rumah', '', NULL, NULL, 1, '2', '5'),
('KDR02', 'Mojoroto', 289000000, 'Kota. Kediri', '1779957547900_ide-desain-rumah-mewah-untuk-anda-130125013838148646.jpg', 'Syifa', 'Rumah', '36', 89, NULL, 1, '1', '3'),
('MGT03', 'Plaosan', 430000000, 'Kab. Magetan', '1779951274088_desain-rumah-modern-2-setengah-lantai-24131022-85791957131022093203-0.webp', 'Akhdan', 'Rumah', '36', 123, NULL, 1, '2', '3+1'),
('MLG02', 'Tambak Mas', 654000000, 'Kota. Malang', '1779784398333_Inspirasi-desain-rumah-minimalis.jpg', 'Maulana', 'Rumah', '72', 167, NULL, 1, '3', '6'),
('PCT01', 'Mlarak', 653000000, 'Kab. Pacitan', '1779105907991_Rumah Sederhana di Kampung dengan Kayu.jpg', 'Alvinskie', 'Rumah', '72', 145, NULL, 1, '2', '3'),
('PNG01', 'Tajug Indah', 320000000, 'Kab. Ponorogo', '1779037662394_Desain-rumah-4-kamar.jpg', 'Maulana', 'Rumah', '45', 67, NULL, 1, '2', '3'),
('PNG02', 'Suling Asri', 650000000, 'Kab. Ponorogo', '1779112083431_Desain-rumah-4-kamar.jpg', 'Alvinskie', 'Rumah', '72', 123, NULL, 1, '3', '4'),
('SBD01', 'Jati Nangor', 454000000, 'Kab. Situbondo', '1780309841067_ide-desain-rumah-mewah-untuk-anda-130125013838148646.jpg', 'Alvinskie', 'Apartemen', NULL, NULL, 23, 1, '1', '3'),
('TLG01', 'Manokwari', 234000000, 'Kab. Tulungagung', '1780293367067_ide-desain-rumah-mewah-untuk-anda-130125013838148646.jpg', 'Naila', 'Rumah', '36', 123, NULL, 1, '2', '3');

-- --------------------------------------------------------

--
-- Struktur dari tabel `transaksi`
--

CREATE TABLE `transaksi` (
  `id` int(11) NOT NULL,
  `kode_properti` varchar(20) NOT NULL,
  `nama_pembeli` varchar(100) NOT NULL,
  `alamat_pembeli` text NOT NULL,
  `no_hp` varchar(20) NOT NULL,
  `tanggal_transaksi` date NOT NULL,
  `metode_pembayaran` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `transaksi`
--

INSERT INTO `transaksi` (`id`, `kode_properti`, `nama_pembeli`, `alamat_pembeli`, `no_hp`, `tanggal_transaksi`, `metode_pembayaran`) VALUES
(4, 'PNG01', 'Baharudin Kowor', 'Jl. Sukowati Selatan', '0892748327438', '2026-05-18', 'Transfer'),
(5, 'PCT01', 'Sofyan Suryo', 'Jl. Raden Rahmat', '08971643512562', '2026-05-18', 'Cash'),
(6, 'PNG02', 'Irfan Suka KawaKawa', 'Jl. Parang Menang', '087627364646', '2026-05-18', 'Cash'),
(7, 'MLG02', 'Sunarto Dafinci', 'Jl. Urip Sumoharjo', '088987282828', '2026-05-26', 'Transfer'),
(8, 'MGT03', 'Maulana Halim', 'Jl. Sawah Kidul', '088728372827', '2026-05-28', 'Transfer'),
(9, 'BYW01', 'Ilham Basuki', 'Jl. Ahmad Yani', '088102837473', '2026-05-28', 'Transfer'),
(10, 'KDR02', 'Wahyu Aji', 'Jl. Hj Slamet', '09384748383', '2026-05-28', 'Transfer'),
(11, 'TLG01', 'Kariman Jatirono', 'Jl. Ahmad Yani', '0896253646346', '2026-06-01', 'Cash'),
(12, 'SBD01', 'Lanaya Kinta', 'Jl. Tengah Alas', '099283838383', '2026-06-01', 'Transfer');

-- --------------------------------------------------------

--
-- Struktur dari tabel `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `nama_lengkap` varchar(100) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `role` varchar(255) NOT NULL,
  `foto_profil` varchar(255) DEFAULT 'default_profil.png',
  `no_wa` varchar(20) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `users`
--

INSERT INTO `users` (`id`, `username`, `nama_lengkap`, `password`, `role`, `foto_profil`, `no_wa`, `created_at`) VALUES
(2, 'Pembeli01', '23r2rqwrqw', 'rahasia', 'USER', '1779964363958_desain-rumah-modern-2-setengah-lantai-24131022-85791957131022093203-0.webp', '213423324324', '2026-05-11 07:57:48'),
(3, 'Maulana', 'Maulana Halim', 'rahasia', 'ADMIN', '1779950872162_✧･ﾟ_ 𝓚𝓪𝓷𝓪 𝓐𝓻𝓲𝓶𝓪 𝔀𝓲𝓽𝓱 𝓶𝓪𝓷𝓱𝔀𝓪 𝓼𝓽𝔂𝓵𝓮 _･ﾟ✧.jpg', '089587464758', '2026-05-14 07:46:19'),
(4, 'Syifa', 'Indasyifa Debian Wirajati', 'rahasia', 'ADMIN', '1779950881313_cre_ 可爱多.jpg', '089765465672', '2026-05-14 07:58:47'),
(8, 'Naila', 'Naila Nurul Faizah', 'rahasia01', 'ADMIN', '1779950890276_blue archive.jpg', '088982737475', '2026-05-26 09:05:54'),
(9, 'Yaya', 'Dea Apriani Agustin', 'rahasia', 'ADMIN', '1779950899333_cre_ Nakano Miku.jpg', '087625362637', '2026-05-26 09:06:52'),
(10, 'Akhdan', 'Akhdan Farrel Bernadine', 'rahasia', 'ADMIN', '1779950909298_download (5).jpg', '089526374635', '2026-05-26 09:07:52'),
(11, 'Tyas', 'Widya Pramudyaning Tyas', 'rahasia', 'ADMIN', '1779950932222_download (2).jpg', '087892847384', '2026-05-26 09:08:48'),
(19, 'Alvinskie', 'Mohammad Alvin Firmansyah', '11111111', 'ADMIN', '1780294281368_Yaemiko.png', '088928473828', '2026-05-31 23:11:21');

--
-- Indexes for dumped tables
--

--
-- Indeks untuk tabel `perusahaan`
--
ALTER TABLE `perusahaan`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `properti`
--
ALTER TABLE `properti`
  ADD PRIMARY KEY (`kode`),
  ADD KEY `fk_properti_agen` (`username_agen`);

--
-- Indeks untuk tabel `transaksi`
--
ALTER TABLE `transaksi`
  ADD PRIMARY KEY (`id`),
  ADD KEY `transaksi_ibfk_1` (`kode_properti`);

--
-- Indeks untuk tabel `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- AUTO_INCREMENT untuk tabel yang dibuang
--

--
-- AUTO_INCREMENT untuk tabel `transaksi`
--
ALTER TABLE `transaksi`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT untuk tabel `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- Ketidakleluasaan untuk tabel pelimpahan (Dumped Tables)
--

--
-- Ketidakleluasaan untuk tabel `properti`
--
ALTER TABLE `properti`
  ADD CONSTRAINT `fk_properti_agen` FOREIGN KEY (`username_agen`) REFERENCES `users` (`username`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Ketidakleluasaan untuk tabel `transaksi`
--
ALTER TABLE `transaksi`
  ADD CONSTRAINT `transaksi_ibfk_1` FOREIGN KEY (`kode_properti`) REFERENCES `properti` (`kode`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
