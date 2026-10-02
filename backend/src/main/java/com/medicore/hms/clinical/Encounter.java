package com.medicore.hms.clinical;

import com.medicore.hms.appointment.Appointment;
import com.medicore.hms.common.BaseEntity;
import com.medicore.hms.doctor.Doctor;
import com.medicore.hms.patient.Patient;
import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

@Entity
@Table(name = "encounters")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Encounter extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "encounter_number", nullable = false, unique = true, length = 50)
    private String encounterNumber;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "patient_id", nullable = false)
    private Patient patient;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "doctor_id")
    private Doctor doctor;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "appointment_id")
    private Appointment appointment;

    @Column(name = "encounter_type", length = 50)
    @Builder.Default
    private String encounterType = "OPD";

    @Column(length = 50)
    @Builder.Default
    private String status = "IN_PROGRESS";

    @Column(name = "chief_complaint", columnDefinition = "TEXT")
    private String chiefComplaint;

    @Column(name = "start_time")
    @Builder.Default
    private Instant startTime = Instant.now();

    @Column(name = "end_time")
    private Instant endTime;
}
