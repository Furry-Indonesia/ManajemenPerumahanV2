package perumahan.model;

import jakarta.persistence.*;
import java.text.NumberFormat;
import java.util.Locale;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "properti") 
public class Properti {

    @Id 
    @Column(name = "kode", length = 20)
    private String kode;

    @Column(nullable = false, length = 100)
    private String nama;

    @Column(nullable = false)
    private double harga;

    @Column(nullable = false, length = 100)
    private String lokasi;

    @Column(nullable = false, length = 20)
    private String kategori; 

    @Column(name = "tipe_rumah", length = 50)
    private String tipeRumah;

    @Column(name = "luas_tanah")
    private Integer luasTanah;

    private Integer lantai;

    @Column(length = 20)
    private String kt;

    @Column(length = 20)
    private String km;

    @Column(name = "is_terjual")
    private boolean terjual = false;

    // --- TAMBAHAN BARU SESUAI STRUKTUR SQL ---
    
    @Column(name = "foto_properti")
    private String fotoProperti;

    @Column(name = "username_agen")
    private String usernameAgen;

    @ManyToOne
    @JoinColumn(name = "username_agen", referencedColumnName = "username", insertable = false, updatable = false)
    @JsonIgnore
    private User agen; 

    // ----------------------------------------

    public Properti() {}

    public Properti(String kode, String nama, double harga, String lokasi, String kategori) {
        this.kode = kode;
        this.nama = nama;
        this.harga = harga;
        this.lokasi = lokasi;
        this.kategori = kategori;
    }

    // --- GETTER & SETTER LAMA ---
    public String getKode() { return kode; }
    public void setKode(String kode) { this.kode = kode; }

    public String getNama() { return nama; }
    public void setNama(String nama) { this.nama = nama; }

    public double getHarga() { return harga; }
    public void setHarga(double harga) { this.harga = harga; }

    public String getLokasi() { return lokasi; }
    public void setLokasi(String lokasi) { this.lokasi = lokasi; }

    public String getKategori() { return kategori; }
    public void setKategori(String kategori) { this.kategori = kategori; }

    public boolean isTerjual() { return terjual; }
    public void setTerjual(boolean terjual) { this.terjual = terjual; }

    // --- GETTER & SETTER BARU (WAJIB ADA) ---
    
    public String getFotoProperti() {
        return fotoProperti;
    }

    public void setFotoProperti(String fotoProperti) {
        this.fotoProperti = fotoProperti;
    }

    public String getUsernameAgen() {
        return usernameAgen;
    }

    public void setUsernameAgen(String usernameAgen) {
        this.usernameAgen = usernameAgen;
    }

    public User getAgen() {
        return agen;
    }

    public void setAgen(User agen) {
        this.agen = agen;
    }

    // --- HELPER METHODS ---
    public String getHargaFormat() {
        NumberFormat nf = NumberFormat.getCurrencyInstance(new Locale("id", "ID"));
        return nf.format(harga);
    }
    
    public String getJenisProperti() {
        return kategori;
    }

    @OneToOne(mappedBy = "properti", cascade = CascadeType.ALL)
    @com.fasterxml.jackson.annotation.JsonIgnoreProperties("properti")
    private Transaksi transaksi;

    public Transaksi getTransaksi() { return transaksi; }
    public void setTransaksi(Transaksi transaksi) { this.transaksi = transaksi; }

    public String getNamaPembeli() {
        if (this.transaksi != null) {
            return this.transaksi.getNamaPembeli();
        }
        return null;
    }

    public String getTipeRumah() { return tipeRumah; }
    public void setTipeRumah(String tipeRumah) { this.tipeRumah = tipeRumah; }

    public Integer getLuasTanah() { return luasTanah; }
    public void setLuasTanah(Integer luasTanah) { this.luasTanah = luasTanah; }

    public Integer getLantai() { return lantai; }
    public void setLantai(Integer lantai) { this.lantai = lantai; }

    public String getKt() { return kt; }
    public void setKt(String kt) { this.kt = kt; }

    public String getKm() { return km; }
    public void setKm(String km) { this.km = km; }

    // --- HELPER UNTUK FRONTEND (Agar tidak kena Infinite Recursion) ---
    public String getNamaAgen() {
        return (this.agen != null && this.agen.getNamaLengkap() != null) ? this.agen.getNamaLengkap() : this.usernameAgen;
    }

    public String getWaAgen() {
        return (this.agen != null && this.agen.getNoWa() != null) ? this.agen.getNoWa() : "628000000000"; // Default jika kosong
    }

    public String getFotoAgen() {
        return (this.agen != null && this.agen.getFotoProfil() != null) ? this.agen.getFotoProfil() : "default_profil.png";
    }
}