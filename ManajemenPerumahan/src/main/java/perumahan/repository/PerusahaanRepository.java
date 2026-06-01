package perumahan.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import perumahan.model.Perusahaan;

@Repository
public interface PerusahaanRepository extends JpaRepository<Perusahaan, Integer> {
}