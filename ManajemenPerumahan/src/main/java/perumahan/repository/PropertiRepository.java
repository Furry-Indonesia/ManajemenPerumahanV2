package perumahan.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import perumahan.model.Properti;

@Repository
public interface PropertiRepository extends JpaRepository<Properti, String> {
    // Kosong saja! Spring Boot akan otomatis membuatkan fungsi save(), findAll(), findById() dll.
}