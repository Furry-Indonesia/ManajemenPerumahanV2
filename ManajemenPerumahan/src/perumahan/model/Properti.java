package perumahan.model;

import java.text.NumberFormat;
import java.util.Locale;

public class Properti {
    protected String kode;
    protected String nama;
    protected double harga;
    protected String lokasi;

    protected boolean terjual = false;
    protected String namaPembeli = "-";
    protected String alamatPembeli;
    protected String noHpPembeli;
    protected String tanggalPembelian;
    protected String metodePembayaran;

    public Properti(String kode, String nama, double harga, String lokasi) {
        this.kode = kode;
        this.nama = nama;
        this.harga = harga;
        this.lokasi = lokasi;
    }
    public String getKode() { return kode; }
    public String getLokasi() { return lokasi; }

    public String getNama() { return nama; }
    public double getHarga() { return harga; }
    public String getHargaFormat() { return formatRupiah(harga); }

    public boolean isTerjual() { return terjual; }
    public void setTerjual(boolean terjual) { this.terjual = terjual; }

    public String getNamaPembeli() { return namaPembeli; }
    public void setNamaPembeli(String namaPembeli) { this.namaPembeli = namaPembeli; }

    public void setAlamatPembeli(String a) { this.alamatPembeli = a; }
    public void setNoHpPembeli(String n) { this.noHpPembeli = n; }
    public void setTanggalPembelian(String t) { this.tanggalPembelian = t; }
    public void setMetodePembayaran(String m) { this.metodePembayaran = m; }

    public String getAlamatPembeli() { return alamatPembeli; }
    public String getNoHpPembeli() { return noHpPembeli; }
    public String getTanggalPembelian() { return tanggalPembelian; }
    public String getMetodePembayaran() { return metodePembayaran; }

    public String formatRupiah(double angka) {
        NumberFormat nf = NumberFormat.getCurrencyInstance(new Locale("id", "ID"));
        return nf.format(angka);
    }

    public void tampilkanInfo() {
        System.out.println(kode + " | " + nama + " | " + formatRupiah(harga) + " | " + lokasi);
    }
}