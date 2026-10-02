package com.medicore.hms.inventory;

import com.medicore.hms.common.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "inventory_items")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InventoryItem extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "item_code", nullable = false, unique = true, length = 50)
    private String itemCode;

    @Column(nullable = false, length = 150)
    private String name;

    @Column(nullable = false, length = 100)
    private String category;

    @Column(nullable = false)
    @Builder.Default
    private Integer quantity = 100;

    @Column(name = "reorder_level", nullable = false)
    @Builder.Default
    private Integer reorderLevel = 20;

    @Column(length = 50)
    @Builder.Default
    private String unit = "Units";

    @Column(name = "unit_price", precision = 10, scale = 2)
    @Builder.Default
    private BigDecimal unitPrice = BigDecimal.valueOf(15.00);

    @Column(length = 100)
    private String location;

    @Column(length = 50)
    @Builder.Default
    private String status = "IN_STOCK";
}
