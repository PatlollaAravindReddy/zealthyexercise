package exercise.backend.repository;

import exercise.backend.model.AdminConfig;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface AdminConfigRepository extends JpaRepository<AdminConfig, String> {
    @Query("SELECT ac FROM AdminConfig ac WHERE ac.pageNumber IN :pageNumbers")
    List<AdminConfig> findByPageNumbers(List<Integer> pageNumbers);
}