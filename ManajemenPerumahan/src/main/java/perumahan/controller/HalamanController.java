package perumahan.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class HalamanController {

    // 1. Mengatur Halaman Utama (Index)
    @GetMapping("/")
    public String halamanIndex() {
        return "forward:/index.html";
    }

    // 2. Mengatur Halaman Dashboard
    @GetMapping("/dashboard")
    public String halamanDashboard() {
        return "forward:/dashboard.html";
    }

    // 3. Mengatur Halaman Laporan
    @GetMapping("/laporan")
    public String halamanLaporan() {
        return "forward:/laporan.html";
    }

    // 4. Mengatur Halaman Manajemen Agen
    @GetMapping("/manajemen-agen")
    public String halamanManajemenAgen() {
        return "forward:/manajemen-agen.html";
    }

    // 5. Mengatur Halaman Setting
    @GetMapping("/setting")
    public String halamanSetting() {
        return "forward:/setting.html";
    }

    // 6. Mengatur Halaman Login
    @GetMapping("/login")
    public String halamanLogin() {
        return "forward:/login.html";
    }

    // 7. Mengatur Halaman katalog
    @GetMapping("/katalog")
    public String halamanKatalog() {
        return "forward:/katalog.html";
    }

    // 8. Mengatur Halaman setting user
    @GetMapping("/setting-user")
    public String halamanSettingUser() {
        return "forward:/setting-user.html";
    }

    // 9. Mengatur Halaman Riwayat Transaksi
    @GetMapping("/riwayat-transaksi")
    public String halamanRiwayatTransaksi() {
        return "forward:/riwayat-transaksi.html";
    }
}