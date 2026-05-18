package perumahan.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import perumahan.model.*;
import perumahan.repository.PropertiRepository;
import perumahan.repository.TransaksiRepository;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/properti")
@CrossOrigin(origins = "*")
public class PropertiController {

    @Autowired
    private PropertiRepository propertiRepository;

    @Autowired
    private TransaksiRepository transaksiRepository;

    @GetMapping
    public List<Properti> getAllProperti() {
        return propertiRepository.findAll();
    }

    // ==========================================
    // FITUR TAMBAH PROPERTI (SUDAH DIUPGRADE)
    // ==========================================
    @PostMapping("/tambah")
    public ResponseEntity<String> tambahProperti(
            @RequestParam("foto") MultipartFile file,
            @RequestParam("kode") String kode,
            @RequestParam("nama") String nama,
            @RequestParam("harga") Double harga,
            @RequestParam("lokasi") String lokasi,
            @RequestParam("kategori") String kategori,
            @RequestParam("usernameAgen") String usernameAgen,
            // Tambahan Parameter Spesifikasi:
            @RequestParam(value = "tipeRumah", required = false) String tipeRumah,
            @RequestParam(value = "luasTanah", required = false) Integer luasTanah,
            @RequestParam(value = "lantai", required = false) Integer lantai,
            @RequestParam(value = "kt", required = false) String kt,
            @RequestParam(value = "km", required = false) String km) {
        
        try {
            // 1. Logika simpan file ke folder static/uploads/properti/
            String namaFile = System.currentTimeMillis() + "_" + file.getOriginalFilename();
            Path uploadPath = Paths.get("src/main/resources/static/uploads/properti/");

            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            Path filePath = uploadPath.resolve(namaFile);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            // 2. Simpan data ke Database
            Properti p = new Properti();
            p.setKode(kode);
            p.setNama(nama);
            p.setHarga(harga);
            p.setLokasi(lokasi);
            p.setKategori(kategori);
            p.setFotoProperti(namaFile);
            p.setUsernameAgen(usernameAgen);
            
            // Simpan Spesifikasi Tambahan
            p.setTipeRumah(tipeRumah);
            p.setLuasTanah(luasTanah);
            p.setLantai(lantai);
            p.setKt(kt);
            p.setKm(km);

            propertiRepository.save(p);
            return ResponseEntity.ok("Sukses: Properti berhasil ditambah!");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Gagal: " + e.getMessage());
        }
    }

    // ==========================================
    // FITUR BELI PROPERTI
    // ==========================================
    @PostMapping("/{kode}/beli")
    public String beliProperti(@PathVariable String kode, @RequestBody PembeliDTO pembeli) {

        Optional<Properti> propertiOpt = propertiRepository.findById(kode);

        if (propertiOpt.isEmpty()) {
            return "Gagal: Properti dengan kode " + kode + " tidak ditemukan!";
        }

        Properti p = propertiOpt.get();

        if (p.isTerjual()) {
            return "Gagal: Properti ini sudah terjual!";
        }

        p.setTerjual(true);

        Transaksi t = new Transaksi();
        t.setProperti(p);
        t.setNamaPembeli(pembeli.getNama());
        t.setAlamatPembeli(pembeli.getAlamat());
        t.setNoHp(pembeli.getNoHp());
        t.setTanggalTransaksi(LocalDate.parse(pembeli.getTanggal()));
        t.setMetodePembayaran(pembeli.getMetode());

        transaksiRepository.save(t);
        propertiRepository.save(p);

        return "Sukses: Transaksi berhasil diproses untuk " + pembeli.getNama() + "!";
    }
    // ==========================================
    // FITUR EDIT PROPERTI (SUDAH DIUPGRADE + FOTO)
    // ==========================================
    @PutMapping("/{kode}/edit")
    public String editProperti(
            @PathVariable String kode,
            @RequestParam("nama") String nama,
            @RequestParam("harga") Double harga,
            @RequestParam("lokasi") String lokasi,
            @RequestParam("tipe") String tipe,
            @RequestParam(value = "tipeRumah", required = false) String tipeRumah,
            @RequestParam(value = "luasTanah", required = false) Integer luasTanah,
            @RequestParam(value = "lantai", required = false) Integer lantai,
            @RequestParam(value = "kt", required = false) String kt,
            @RequestParam(value = "km", required = false) String km,
            @RequestParam(value = "foto", required = false) MultipartFile file) { // Menangkap file foto baru

        Optional<Properti> propertiOpt = propertiRepository.findById(kode);

        if (propertiOpt.isEmpty()) {
            return "Gagal: Properti tidak ditemukan!";
        }

        Properti p = propertiOpt.get();

        // 1. Update data dasar
        p.setNama(nama);
        p.setHarga(harga);
        p.setLokasi(lokasi);
        p.setKategori(tipe);
        p.setKt(kt);
        p.setKm(km);

        if (tipe.equals("Rumah")) {
            p.setTipeRumah(tipeRumah);
            p.setLuasTanah(luasTanah);
            p.setLantai(null); 
        } else {
            p.setLantai(lantai);
            p.setTipeRumah(null); 
            p.setLuasTanah(null);
        }

        // 2. Jika ada foto baru yang diunggah, proses fotonya!
        try {
            if (file != null && !file.isEmpty()) {
                String namaFile = System.currentTimeMillis() + "_" + file.getOriginalFilename();
                Path uploadPath = Paths.get("src/main/resources/static/uploads/properti/");
                
                if (!Files.exists(uploadPath)) {
                    Files.createDirectories(uploadPath);
                }
                
                Path filePath = uploadPath.resolve(namaFile);
                Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
                
                p.setFotoProperti(namaFile); // Update nama file di database
            }
            
            propertiRepository.save(p);
            return "Sukses: Data properti " + p.getKode() + " berhasil diperbarui!";
            
        } catch (Exception e) {
            return "Gagal mengupload foto: " + e.getMessage();
        }
    }

    // ==========================================
    // FITUR DELETE (HAPUS) PROPERTI
    // ==========================================
    @DeleteMapping("/{kode}/hapus")
    public String hapusProperti(@PathVariable String kode) {
        Optional<Properti> propertiOpt = propertiRepository.findById(kode);

        if (propertiOpt.isEmpty()) {
            return "Gagal: Properti tidak ditemukan!";
        }

        if (propertiOpt.get().isTerjual()) {
            return "Gagal: Properti sudah lunas/terjual! Data riwayat tidak boleh dihapus.";
        }

        propertiRepository.deleteById(kode);
        return "Sukses: Properti " + kode + " berhasil dihapus secara permanen!";
    }

    // ==========================================
    // FITUR MENAMPILKAN SEMUA RIWAYAT TRANSAKSI
    // ==========================================
    @GetMapping("/transaksi/semua")
    public List<Transaksi> ambilSemuaTransaksi() {
        return transaksiRepository.findAll();
    }
}