package com.medicore.hms.pharmacy;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MedicineRepository extends JpaRepository<Medicine, Long> {
    Optional<Medicine> findByCode(String code);
    List<Medicine> findByNameContainingIgnoreCase(String name);
    List<Medicine> findByCategory(String category);
}
