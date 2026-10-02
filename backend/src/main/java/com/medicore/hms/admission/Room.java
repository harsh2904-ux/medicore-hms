package com.medicore.hms.admission;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "rooms")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Room {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ward_id", nullable = false)
    private Ward ward;

    @Column(name = "room_number", nullable = false, length = 50)
    private String roomNumber;

    @Column(name = "room_type", length = 50)
    @Builder.Default
    private String roomType = "STANDARD";

    @Column(name = "daily_rate", precision = 10, scale = 2)
    @Builder.Default
    private BigDecimal dailyRate = BigDecimal.ZERO;

    @Column(length = 50)
    @Builder.Default
    private String status = "AVAILABLE";
}
