package com.medicore.hms.doctor;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DoctorRepository extends JpaRepository<Doctor, Long> {
    Optional<Doctor> findByDoctorCode(String doctorCode);
    List<Doctor> findByDepartmentId(Long departmentId);
    List<Doctor> findByStatus(String status);

    @Query("SELECT d FROM Doctor d JOIN FETCH d.department LEFT JOIN FETCH d.user")
    List<Doctor> findAllWithDetails();
}
