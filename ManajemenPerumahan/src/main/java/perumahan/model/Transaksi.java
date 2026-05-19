package perumahan.model;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonBackReference;
import java.time.LocalDate;

@Entity
@Table(name = "transaksi")
public class Transaksi {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    // Ini adalah Relasi yang menghubungkan Transaksi dengan Properti (Foreign Key)
    @OneToOne
    @JoinColumn(name = "kode_properti", referencedColumnName = "kode")
    @com.fasterxml.jackson.annotation.JsonIgnoreProperties("transaksi")
    private Properti properti;

    @Column(name = "nama_pembeli")
    private String namaPembeli;

    @Column(name = "alamat_pembeli")
    private String alamatPembeli;

    @Column(name = "no_hp")
    private String noHp;

    @Column(name = "tanggal_transaksi")
    private LocalDate tanggalTransaksi;

    @Column(name = "metode_pembayaran")
    private String metodePembayaran;

    // --- GETTER & SETTER ---
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public Properti getProperti() { return properti; }
    public void setProperti(Properti properti) { this.properti = properti; }

    public String getNamaPembeli() { return namaPembeli; }
    public void setNamaPembeli(String namaPembeli) { this.namaPembeli = namaPembeli; }

    public String getAlamatPembeli() { return alamatPembeli; }
    public void setAlamatPembeli(String alamatPembeli) { this.alamatPembeli = alamatPembeli; }

    public String getNoHp() { return noHp; }
    public void setNoHp(String noHp) { this.noHp = noHp; }

    public LocalDate getTanggalTransaksi() { return tanggalTransaksi; }
    public void setTanggalTransaksi(LocalDate tanggalTransaksi) { this.tanggalTransaksi = tanggalTransaksi; }

    public String getMetodePembayaran() { return metodePembayaran; }
    public void setMetodePembayaran(String metodePembayaran) { this.metodePembayaran = metodePembayaran; }
}