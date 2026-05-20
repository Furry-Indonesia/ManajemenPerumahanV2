package perumahan.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import perumahan.model.User;
import perumahan.model.LoginDTO;
import perumahan.repository.UserRepository;

import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    // 1. FITUR LOGIN (Sudah ada)
    @PostMapping("/login")
    public String prosesLogin(@RequestBody LoginDTO loginRequest) {
        Optional<User> userOpt = userRepository.findByUsername(loginRequest.getUsername());
        
        if (userOpt.isEmpty()) {
            return "Gagal: Username tidak terdaftar!";
        }
        
        User user = userOpt.get();
        
        if (!user.getPassword().equals(loginRequest.getPassword())) {
            return "Gagal: Password salah!";
        }
        
        return "Sukses: " + user.getRole(); 
    }

    // 2. FITUR DAFTAR SEKARANG (Tambahan Baru)
    @PostMapping("/register")
    public String prosesDaftar(@RequestBody User userBaru) {
        try {
            // Cek apakah username/email sudah digunakan
            if (userRepository.findByUsername(userBaru.getUsername()).isPresent()) {
                return "Gagal: Username atau Email sudah terdaftar!";
            }

            // Atur default untuk pendaftar baru dari halaman depan
            userBaru.setRole("USER"); // Otomatis jadi Pembeli
            userBaru.setFotoProfil("default_profil.png");

            // Simpan ke database
            userRepository.save(userBaru);
            return "Sukses: Akun berhasil dibuat! Silakan masuk.";

        } catch (Exception e) {
            return "Gagal: Terjadi kesalahan pada server.";
        }
    }
}