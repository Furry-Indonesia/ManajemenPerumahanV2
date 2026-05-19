package perumahan.controller; // Sesuaikan dengan nama package kamu

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import perumahan.model.User; // Sesuaikan dengan folder model/entity kamu
import perumahan.repository.UserRepository; // Sesuaikan dengan folder repository kamu
import org.springframework.web.multipart.MultipartFile;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import org.springframework.http.MediaType;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    // 1. Fungsi untuk Mengambil Semua Data Agen/Admin
    @GetMapping
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // 2. 🚀 INI YANG HILANG! Fungsi untuk Menambah Agen Baru
    @PostMapping(value = "/tambah", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<String> tambahAgen(
            @RequestParam("username") String username,
            @RequestParam("password") String password,
            @RequestParam("namaLengkap") String namaLengkap,
            @RequestParam("noWa") String noWa,
            @RequestParam("role") String role,
            @RequestParam(value = "foto", required = false) MultipartFile file
    ) {
        try {
            // Cek apakah username sudah terpakai
            Optional<User> existingUser = userRepository.findByUsername(username);
            if (existingUser.isPresent()) {
                return ResponseEntity.badRequest().body("Gagal: Username sudah digunakan! Silakan pilih username lain.");
            }

            // Buat objek User baru
            User newUser = new User();
            newUser.setUsername(username);
            newUser.setPassword(password);
            newUser.setNamaLengkap(namaLengkap);
            newUser.setNoWa(noWa);
            newUser.setRole(role);

            // Proses Upload Foto (Opsional)
            if (file != null && !file.isEmpty()) {
                String uploadDir = "src/main/resources/static/uploads/profil/";
                Path uploadPath = Paths.get(uploadDir);

                if (!Files.exists(uploadPath)) {
                    Files.createDirectories(uploadPath);
                }

                String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
                Path filePath = uploadPath.resolve(fileName);
                Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
                
                newUser.setFotoProfil(fileName);
            } else {
                // Jika tidak upload foto, beri nama file default
                newUser.setFotoProfil("default_profil.png"); 
            }

            // Simpan ke database
            userRepository.save(newUser);
            return ResponseEntity.ok("Sukses: Agen baru berhasil didaftarkan!");

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Gagal menambah agen: " + e.getMessage());
        }
    }

    // 3. Fungsi untuk Mengedit Data Agen
    @PutMapping(value = "/edit/{username}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<String> editAgen(
            @PathVariable("username") String username,
            @RequestParam(value = "password", required = false) String password,
            @RequestParam("namaLengkap") String namaLengkap,
            @RequestParam("noWa") String noWa,
            @RequestParam("role") String role,
            @RequestParam(value = "foto", required = false) MultipartFile file
    ) {
        try {
            // Cari agen berdasarkan username
            Optional<User> optionalUser = userRepository.findByUsername(username);
            if (!optionalUser.isPresent()) {
                return ResponseEntity.badRequest().body("Gagal: Agen tidak ditemukan!");
            }

            User userUpdate = optionalUser.get();
            
            // Update data teks (Password hanya diubah jika kolomnya diisi)
            if (password != null && !password.trim().isEmpty()) {
                userUpdate.setPassword(password); 
            }
            userUpdate.setNamaLengkap(namaLengkap);
            userUpdate.setNoWa(noWa);
            userUpdate.setRole(role);

            // Proses Upload Foto Baru (Hanya jika admin memilih file foto baru)
            if (file != null && !file.isEmpty()) {
                String uploadDir = "src/main/resources/static/uploads/profil/";
                Path uploadPath = Paths.get(uploadDir);

                if (!Files.exists(uploadPath)) {
                    Files.createDirectories(uploadPath);
                }

                String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
                Path filePath = uploadPath.resolve(fileName);
                Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
                
                userUpdate.setFotoProfil(fileName);
            }

            // Simpan perubahan ke database
            userRepository.save(userUpdate);
            return ResponseEntity.ok("Sukses: Data agen berhasil diperbarui!");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Gagal mengupdate agen: " + e.getMessage());
        }
    }

    // 4. Fungsi untuk Menghapus Data Agen
    @DeleteMapping("/hapus/{username}")
    public ResponseEntity<String> hapusAgen(@PathVariable("username") String username) {
        try {
            // Cari agen berdasarkan username
            Optional<User> optionalUser = userRepository.findByUsername(username);
            
            if (!optionalUser.isPresent()) {
                return ResponseEntity.badRequest().body("Gagal: Agen tidak ditemukan!");
            }

            // Jika ketemu, langsung hapus dari database
            userRepository.delete(optionalUser.get());
            
            return ResponseEntity.ok("Sukses: Data agen berhasil dihapus permanen!");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Gagal menghapus agen (Mungkin agen ini masih terikat dengan data properti/transaksi).");
        }
    }
}