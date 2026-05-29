package perumahan.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import perumahan.model.Transaksi;
import perumahan.repository.TransaksiRepository;

import java.util.List;

@RestController
@CrossOrigin(origins = "*")
public class TransaksiController {

    @Autowired
    private TransaksiRepository transaksiRepository;

    // Memindahkan fitur ini dari PropertiController
    // URL tetap dipertahankan agar kodingan JavaScript (fetch) mase tidak error
    @GetMapping("/api/properti/transaksi/semua")
    public List<Transaksi> getAllTransaksi(@RequestParam(required = false) String keyword) {
        if (keyword != null && !keyword.isEmpty()) {
            return transaksiRepository.cariRiwayatGlobal(keyword); // Panggil senjata tadi
        }
        return transaksiRepository.findAll();
    }
}