package perumahan.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import perumahan.model.Transaksi;
import java.util.List;

@Repository
public interface TransaksiRepository extends JpaRepository<Transaksi, Long> { 
    // (Catatan: tipe ID Long/Integer sesuaikan dengan kodingan mase sebelumnya)

    // 👉 SENJATA PAMUNGKAS TRANSAKSI
    @Query("SELECT t FROM Transaksi t LEFT JOIN t.properti p " +
           "WHERE LOWER(t.namaPembeli) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
           "OR LOWER(p.nama) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
           "OR LOWER(p.kode) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<Transaksi> cariRiwayatGlobal(@Param("keyword") String keyword);
    
}