package perumahan.model;

public class PropertiBaruDTO {
    private String kode;
    private String nama;
    private double harga;
    private String lokasi;
    private String tipe; 
    
    // Tambahkan 3 field baru ini:
    private String tipeRumah;
    private Integer luasTanah;
    private Integer lantai;
    
    // --- TAMBAHAN BARU: KT & KM ---
    private String kt;
    private String km;

    // --- GETTER & SETTER ---
    public String getKode() { return kode; }
    public void setKode(String kode) { this.kode = kode; }
    public String getNama() { return nama; }
    public void setNama(String nama) { this.nama = nama; }
    public double getHarga() { return harga; }
    public void setHarga(double harga) { this.harga = harga; }
    public String getLokasi() { return lokasi; }
    public void setLokasi(String lokasi) { this.lokasi = lokasi; }
    public String getTipe() { return tipe; }
    public void setTipe(String tipe) { this.tipe = tipe; }

    public String getTipeRumah() { return tipeRumah; }
    public void setTipeRumah(String tipeRumah) { this.tipeRumah = tipeRumah; }
    public Integer getLuasTanah() { return luasTanah; }
    public void setLuasTanah(Integer luasTanah) { this.luasTanah = luasTanah; }
    public Integer getLantai() { return lantai; }
    public void setLantai(Integer lantai) { this.lantai = lantai; }

    // --- GETTER & SETTER KT & KM ---
    public String getKt() { return kt; }
    public void setKt(String kt) { this.kt = kt; }
    
    public String getKm() { return km; }
    public void setKm(String km) { this.km = km; }
}