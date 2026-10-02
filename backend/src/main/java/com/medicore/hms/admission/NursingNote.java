package com.medicore.hms.admission;

import com.medicore.hms.patient.Patient;
import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

@Entity
@Table(name = "nursing_notes")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NursingNote {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "admission_id", nullable = false)
    private Long admissionId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "patient_id", nullable = false)
    private Patient patient;

    @Column(name = "nurse_name", nullable = false, length = 100)
    private String nurseName;

    @Column(length = 20)
    @Builder.Default
    private String shift = "DAY";

    @Column(nullable = false, columnDefinition = "TEXT")
    private String note;

    @Column(name = "recorded_at")
    @Builder.Default
    private Instant recordedAt = Instant.now();
}
