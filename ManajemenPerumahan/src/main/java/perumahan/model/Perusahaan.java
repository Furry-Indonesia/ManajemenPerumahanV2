package perumahan.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;

@Entity
public class Perusahaan {
    
    @Id
    private Integer id = 1;
    
    private String nama;
    private String brand;
    private String npwp;
    private String email;
    private String alamat;

    // Getter dan Setter
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }
    public String getNama() { return nama; }
    public void setNama(String nama) { this.nama = nama; }
    public String getBrand() { return brand; }
    public void setBrand(String brand) { this.brand = brand; }
    public String getNpwp() { return npwp; }
    public void setNpwp(String npwp) { this.npwp = npwp; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getAlamat() { return alamat; }
    public void setAlamat(String alamat) { this.alamat = alamat; }
}