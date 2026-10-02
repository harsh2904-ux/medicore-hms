package com.medicore.hms.admission;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

@Entity
@Table(name = "wards")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Ward {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "department_id")
    private Long departmentId;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(name = "ward_type", length = 50)
    @Builder.Default
    private String wardType = "GENERAL";

    @Column(length = 20)
    private String floor;

    @Column(name = "total_beds")
    @Builder.Default
    private Integer totalBeds = 0;

    @Column(length = 50)
    @Builder.Default
    private String status = "ACTIVE";

    @Column(name = "created_at")
    @Builder.Default
    private Instant createdAt = Instant.now();
}
