package perumahan.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "users") // Menyesuaikan persis dengan nama tabelmu
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, unique = true)
    private String username;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private String role; // Berisi "ADMIN" atau "PEGAWAI"

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "nama_lengkap")
    private String namaLengkap;

    @Column(name = "foto_profil")
    private String fotoProfil;

    @Column(name = "no_wa")
    private String noWa;

    // --- GETTER & SETTER ---
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public String getNamaLengkap() { return namaLengkap; }
    public void setNamaLengkap(String namaLengkap) { this.namaLengkap = namaLengkap; }

    public String getFotoProfil() { return fotoProfil; }
    public void setFotoProfil(String fotoProfil) { this.fotoProfil = fotoProfil; }

    public String getNoWa() { return noWa; }
    public void setNoWa(String noWa) { this.noWa = noWa; }
}