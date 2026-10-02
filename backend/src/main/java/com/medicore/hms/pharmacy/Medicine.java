package com.medicore.hms.pharmacy;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "medicines")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Medicine {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 50)
    private String code;

    @Column(nullable = false, length = 150)
    private String name;

    @Column(name = "generic_name", length = 150)
    private String genericName;

    @Column(length = 100)
    private String category;

    @Column(name = "dosage_form", length = 50)
    private String dosageForm;

    @Column(length = 50)
    private String strength;

    @Column(length = 150)
    private String manufacturer;

    @Column(name = "unit_price", precision = 10, scale = 2)
    @Builder.Default
    private BigDecimal unitPrice = BigDecimal.valueOf(10.00);

    @Column(length = 50)
    @Builder.Default
    private String status = "ACTIVE";
}
