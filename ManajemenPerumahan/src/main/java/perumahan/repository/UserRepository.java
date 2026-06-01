package perumahan.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import perumahan.model.User;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {
    
    // Jalur Khusus Login
    Optional<User> findByUsername(String username);
    boolean existsByUsername(String username);

    // MESIN PENCARI (Namanya sudah disamakan dengan UserController)
    @Query("SELECT u FROM User u WHERE " +
           "LOWER(u.username) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(u.namaLengkap) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(u.noWa) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<User> cariGlobalSemuaKolom(@Param("keyword") String keyword);

}