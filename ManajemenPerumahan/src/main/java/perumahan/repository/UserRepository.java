package perumahan.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import perumahan.model.User;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {
    // Fungsi ajaib Spring Boot untuk mencari user di database
    Optional<User> findByUsername(String username);
}