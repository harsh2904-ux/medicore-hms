package com.medicore.hms.admission;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.Instant;

@Entity
@Table(name = "beds")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Bed {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "room_id")
    private Room room;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "ward_id", nullable = false)
    private Ward ward;

    @Column(name = "bed_number", nullable = false, length = 50)
    private String bedNumber;

    @Column(name = "bed_type", length = 50)
    @Builder.Default
    private String bedType = "STANDARD";

    @Column(length = 50)
    @Builder.Default
    private String status = "AVAILABLE";

    @Column(name = "daily_charge", precision = 10, scale = 2)
    @Builder.Default
    private BigDecimal dailyCharge = BigDecimal.valueOf(150.00);

    @Column(name = "created_at")
    @Builder.Default
    private Instant createdAt = Instant.now();
}
