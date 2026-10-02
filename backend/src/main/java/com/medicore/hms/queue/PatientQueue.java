package com.medicore.hms.queue;

import com.medicore.hms.appointment.Appointment;
import com.medicore.hms.department.Department;
import com.medicore.hms.doctor.Doctor;
import com.medicore.hms.patient.Patient;
import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;
import java.time.LocalDate;

@Entity
@Table(name = "patient_queue")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PatientQueue {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "appointment_id")
    private Appointment appointment;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "patient_id", nullable = false)
    private Patient patient;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "doctor_id")
    private Doctor doctor;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "department_id")
    private Department department;

    @Column(name = "token_number", nullable = false)
    private Integer tokenNumber;

    @Column(length = 20)
    @Builder.Default
    private String priority = "NORMAL";

    @Column(length = 50)
    @Builder.Default
    private String status = "WAITING";

    @Column(name = "queue_date", nullable = false)
    private LocalDate queueDate;

    @Column(name = "check_in_time")
    @Builder.Default
    private Instant checkInTime = Instant.now();

    @Column(name = "called_time")
    private Instant calledTime;

    @Column(name = "completed_time")
    private Instant completedTime;
}
