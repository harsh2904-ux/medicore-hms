package com.medicore.hms.admission;

import com.medicore.hms.common.BaseEntity;
import com.medicore.hms.doctor.Doctor;
import com.medicore.hms.patient.Patient;
import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

@Entity
@Table(name = "admissions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Admission extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "admission_number", nullable = false, unique = true, length = 50)
    private String admissionNumber;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "patient_id", nullable = false)
    private Patient patient;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "attending_doctor_id")
    private Doctor attendingDoctor;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "bed_id")
    private Bed bed;

    @Column(name = "admission_date")
    @Builder.Default
    private Instant admissionDate = Instant.now();

    @Column(name = "discharge_date")
    private Instant dischargeDate;

    @Column(name = "admission_type", length = 50)
    @Builder.Default
    private String admissionType = "ELECTIVE";

    @Column(length = 50)
    @Builder.Default
    private String status = "ADMITTED";

    @Column(columnDefinition = "TEXT")
    private String reason;

    @Column(name = "discharge_summary", columnDefinition = "TEXT")
    private String dischargeSummary;
}
