package perumahan.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
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

    // 1. FITUR LOGIN (JSON Response)
    @PostMapping("/login")
    public ResponseEntity<java.util.Map<String, String>> login(@RequestBody User loginData) {
        java.util.Map<String, String> response = new java.util.HashMap<>();
        
        Optional<User> userOpt = userRepository.findByUsername(loginData.getUsername());
        
        // Cek apakah user ada dan password cocok
        if (userOpt.isPresent() && userOpt.get().getPassword().equals(loginData.getPassword())) {
            // Berhasil: Kirim paket JSON rapi
            response.put("status", "Sukses");
            response.put("pesan", "Autentikasi berhasil!");
            response.put("role", userOpt.get().getRole());
            
            return ResponseEntity.ok(response);
        } else {
            // Gagal: Kirim pesan error yang jelas
            response.put("status", "Gagal");
            response.put("pesan", "Username atau Kata Sandi salah!");
            
            return ResponseEntity.badRequest().body(response);
        }
    }

    // 2. FITUR REGISTER (JSON Response)
    @PostMapping("/register")
    public ResponseEntity<java.util.Map<String, String>> register(@RequestBody User regData) {
        java.util.Map<String, String> response = new java.util.HashMap<>();
        
        if (userRepository.existsByUsername(regData.getUsername())) {
            response.put("status", "Gagal");
            response.put("pesan", "Username/Email sudah terdaftar!");
            return ResponseEntity.badRequest().body(response);
        }

        // Set default role jika kosong
        if (regData.getRole() == null || regData.getRole().isEmpty()) {
            regData.setRole("USER"); 
        }

        userRepository.save(regData);
        
        response.put("status", "Sukses");
        response.put("pesan", "Pendaftaran berhasil, silakan login!");
        
        return ResponseEntity.ok(response);
    }
}