package com.medicore.hms.laboratory;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.medicore.hms.doctor.Doctor;
import com.medicore.hms.patient.Patient;
import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "lab_orders")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class LabOrder {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "order_number", nullable = false, unique = true, length = 50)
    private String orderNumber;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "patient_id", nullable = false)
    private Patient patient;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "doctor_id")
    private Doctor doctor;

    @Column(name = "encounter_id")
    private Long encounterId;

    @Column(length = 20)
    @Builder.Default
    private String priority = "ROUTINE";

    @Column(length = 50)
    @Builder.Default
    private String status = "ORDERED";

    @Column(name = "clinical_notes", columnDefinition = "TEXT")
    private String clinicalNotes;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    @Builder.Default
    private List<LabResult> results = new ArrayList<>();

    @Column(name = "ordered_at")
    @Builder.Default
    private Instant orderedAt = Instant.now();
}
