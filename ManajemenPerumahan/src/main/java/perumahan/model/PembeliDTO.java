package perumahan.model;

public class PembeliDTO {
    private String nama;
    private String alamat;
    private String noHp;
    private String tanggal;
    private String metode;

    // Getter dan Setter yang benar (tanpa error throw)
    public String getNama() { return nama; }
    public void setNama(String nama) { this.nama = nama; }

    public String getAlamat() { return alamat; }
    public void setAlamat(String alamat) { this.alamat = alamat; }

    public String getNoHp() { return noHp; }
    public void setNoHp(String noHp) { this.noHp = noHp; }

    public String getTanggal() { return tanggal; }
    public void setTanggal(String tanggal) { this.tanggal = tanggal; }

    public String getMetode() { return metode; }
    public void setMetode(String metode) { this.metode = metode; }
}