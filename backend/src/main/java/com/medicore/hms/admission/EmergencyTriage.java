package com.medicore.hms.admission;

import com.medicore.hms.patient.Patient;
import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

@Entity
@Table(name = "emergency_triages")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EmergencyTriage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "triage_number", nullable = false, unique = true, length = 50)
    private String triageNumber;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "patient_id", nullable = false)
    private Patient patient;

    @Column(name = "triage_level", nullable = false, length = 20)
    private String triageLevel;

    @Column(name = "chief_complaint", nullable = false, columnDefinition = "TEXT")
    private String chiefComplaint;

    @Column(name = "vitals_summary", columnDefinition = "TEXT")
    private String vitalsSummary;

    @Column(length = 50)
    @Builder.Default
    private String status = "TRIAGED";

    @Column(name = "arrived_at")
    @Builder.Default
    private Instant arrivedAt = Instant.now();
}
