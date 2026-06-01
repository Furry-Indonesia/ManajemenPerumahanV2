package perumahan.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.data.domain.Sort;
import perumahan.model.Properti;
import perumahan.model.AgenOmsetDTO;
import java.util.List;

@Repository
public interface PropertiRepository extends JpaRepository<Properti, String> {
    
    // Pencarian Lintas Tabel (JOIN)
    @Query("SELECT p FROM Properti p LEFT JOIN p.transaksi t " +
           "WHERE LOWER(p.nama) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
           "OR LOWER(p.kode) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
           "OR LOWER(t.namaPembeli) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<Properti> cariGlobalSemuaKolom(@Param("keyword") String keyword, Sort sort);

    // MENGHITUNG TOTAL OMSET AGEN LANGSUNG DI DATABASE
    @Query("SELECT p.usernameAgen AS usernameAgen, SUM(p.harga) AS totalOmset " +
           "FROM Properti p " +
           "WHERE p.terjual = true " +
           "GROUP BY p.usernameAgen " +
           "ORDER BY totalOmset DESC")
    List<AgenOmsetDTO> hitungOmsetSemuaAgen();
    
}