package com.medicore.hms.queue;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface PatientQueueRepository extends JpaRepository<PatientQueue, Long> {
    List<PatientQueue> findByQueueDateOrderByTokenNumberAsc(LocalDate queueDate);
    List<PatientQueue> findByQueueDateAndDoctorIdOrderByTokenNumberAsc(LocalDate queueDate, Long doctorId);
    List<PatientQueue> findByQueueDateAndDepartmentIdOrderByTokenNumberAsc(LocalDate queueDate, Long departmentId);
}
