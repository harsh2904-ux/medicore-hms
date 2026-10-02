package com.medicore.hms.clinical;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.medicore.hms.patient.Patient;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "diagnoses")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Diagnosis {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "encounter_id")
    private Long encounterId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "patient_id", nullable = false)
    private Patient patient;

    @Column(name = "icd10_code", length = 50)
    private String icd10Code;

    @Column(nullable = false, length = 255)
    private String description;

    @Column(length = 50)
    @Builder.Default
    private String type = "PRIMARY";

    @Column(length = 50)
    @Builder.Default
    private String status = "CONFIRMED";

    @Column(name = "diagnosed_date")
    @Builder.Default
    private LocalDate diagnosedDate = LocalDate.now();
}
