package perumahan.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
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

    // MENGAMBIL SEMUA TRANSAKSI (SEARCH & FULL JAVA SORTING)
    @GetMapping("/api/properti/transaksi/semua")
    public List<Transaksi> getAllTransaksi(@RequestParam(required = false) String keyword) {
        List<Transaksi> listTransaksi;
        
        // 1. Proses Search
        if (keyword != null && !keyword.isEmpty()) {
            listTransaksi = transaksiRepository.cariRiwayatGlobal(keyword);
        } else {
            listTransaksi = transaksiRepository.findAll();
        }

        // 2. PROSES SORTING TANGGAL (Bukti ke-3 untuk dosen)
        // Mengurutkan Transaksi dari yang PALING BARU ke PALING LAMA (Descending)
        java.util.Collections.sort(listTransaksi, new java.util.Comparator<Transaksi>() {
            @Override
            public int compare(Transaksi t1, Transaksi t2) {
                if (t1.getTanggalTransaksi() == null || t2.getTanggalTransaksi() == null) {
                    return 0;
                }
                // Dibalik (t2 compare ke t1) agar urutannya Descending (Terbaru di atas)
                return t2.getTanggalTransaksi().compareTo(t1.getTanggalTransaksi());
            }
        });

        return listTransaksi;
    }

    // FITUR RESET SEMUA TRANSAKSI (FACTORY RESET)
    @DeleteMapping("/api/transaksi/reset-semua")
    public org.springframework.http.ResponseEntity<String> resetSemuaTransaksi() {
        // Perintah sakti untuk menghapus seluruh riwayat di tabel transaksi
        transaksiRepository.deleteAll();
        return org.springframework.http.ResponseEntity.ok("Semua riwayat transaksi berhasil dikosongkan!");
    }
}