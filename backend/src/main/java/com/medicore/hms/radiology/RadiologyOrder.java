package com.medicore.hms.radiology;

import com.medicore.hms.doctor.Doctor;
import com.medicore.hms.patient.Patient;
import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

@Entity
@Table(name = "radiology_orders")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RadiologyOrder {

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

    @Column(nullable = false, length = 50)
    private String modality;

    @Column(name = "body_part", nullable = false, length = 100)
    private String bodyPart;

    @Column(length = 20)
    @Builder.Default
    private String priority = "ROUTINE";

    @Column(length = 50)
    @Builder.Default
    private String status = "ORDERED";

    @Column(columnDefinition = "TEXT")
    private String findings;

    @Column(columnDefinition = "TEXT")
    private String impression;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "radiologist_id")
    private Doctor radiologist;

    @Column(name = "ordered_at")
    @Builder.Default
    private Instant orderedAt = Instant.now();
}
