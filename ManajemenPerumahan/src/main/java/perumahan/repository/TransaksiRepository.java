package perumahan.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import perumahan.model.Transaksi;

@Repository
public interface TransaksiRepository extends JpaRepository<Transaksi, Integer> {
}