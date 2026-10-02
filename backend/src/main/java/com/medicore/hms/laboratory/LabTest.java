package com.medicore.hms.laboratory;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "lab_tests")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LabTest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "test_code", nullable = false, unique = true, length = 50)
    private String testCode;

    @Column(nullable = false, length = 150)
    private String name;

    @Column(nullable = false, length = 100)
    private String category;

    @Column(name = "sample_type", length = 100)
    private String sampleType;

    @Column(name = "turnaround_time_hours")
    @Builder.Default
    private Integer turnaroundTimeHours = 24;

    @Column(name = "standard_rate", precision = 10, scale = 2)
    @Builder.Default
    private BigDecimal standardRate = BigDecimal.valueOf(50.00);

    @Column(name = "normal_range", columnDefinition = "TEXT")
    private String normalRange;

    @Column(length = 50)
    private String unit;

    @Column(length = 50)
    @Builder.Default
    private String status = "ACTIVE";
}
