package perumahan.model;
import java.text.NumberFormat;
import java.util.Locale;

public abstract class Properti {

    private String id;
    private String nama;
    private double harga;
    private String lokasi;
    private boolean terjual;
    
    private String namaPembeli;
    private String alamatPembeli;
    private String noHpPembeli;
    private String tanggalPembelian;
    private String metodePembayaran; 

    public Properti(String id, String nama, double harga, String lokasi) {
        this.id = id;
        this.nama = nama;
        this.harga = harga;
        this.lokasi = lokasi;
        this.terjual = false;
        
        // Nilai default
        this.namaPembeli = "-";
        this.alamatPembeli = "-";
        this.noHpPembeli = "-";
        this.tanggalPembelian = "-";
        this.metodePembayaran = "-"; 
    }

    public abstract void tampilkanInfo();

    public String getId() { return id; }
    public String getNama() { return nama; }
    public double getHarga() { return harga; }
    public String getLokasi() { return lokasi; }
    public boolean isTerjual() { return terjual; }
    public void setTerjual(boolean status) { this.terjual = status; }
    
    public String getNamaPembeli() { return namaPembeli; }
    public void setNamaPembeli(String namaPembeli) { this.namaPembeli = namaPembeli; }
    
    public String getAlamatPembeli() { return alamatPembeli; }
    public void setAlamatPembeli(String alamat) { this.alamatPembeli = alamat; }
    
    public String getNoHpPembeli() { return noHpPembeli; }
    public void setNoHpPembeli(String noHp) { this.noHpPembeli = noHp; }
    
    public String getTanggalPembelian() { return tanggalPembelian; }
    public void setTanggalPembelian(String tanggal) { this.tanggalPembelian = tanggal; }

    public String getMetodePembayaran() { return metodePembayaran; }
    public void setMetodePembayaran(String metode) { this.metodePembayaran = metode; }

    public String formatRupiah(double nominal) {
        NumberFormat nf = NumberFormat.getInstance(Locale.forLanguageTag("id-ID"));
        return "Rp " + nf.format(nominal);
    }
}