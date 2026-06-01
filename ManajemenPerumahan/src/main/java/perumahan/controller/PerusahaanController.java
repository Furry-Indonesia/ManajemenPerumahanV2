package perumahan.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import perumahan.model.Perusahaan;
import perumahan.repository.PerusahaanRepository;

@RestController
@RequestMapping("/api/perusahaan")
@CrossOrigin(origins = "*")
public class PerusahaanController {

    @Autowired
    private PerusahaanRepository repo;

    @GetMapping
    public ResponseEntity<Perusahaan> ambilData() {
        // Cari data ID 1, kalau belum ada, kembalikan objek kosong
        return ResponseEntity.ok(repo.findById(1).orElse(new Perusahaan()));
    }

    @PostMapping
    public ResponseEntity<String> simpanData(@RequestBody Perusahaan data) {
        data.setId(1); // Kunci paksa ke ID 1 agar tidak membuat baris baru
        repo.save(data);
        return ResponseEntity.ok("Data perusahaan berhasil disimpan ke Database!");
    }
}