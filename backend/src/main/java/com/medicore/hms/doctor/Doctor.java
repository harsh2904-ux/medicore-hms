package com.medicore.hms.doctor;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.medicore.hms.common.BaseEntity;
import com.medicore.hms.department.Department;
import com.medicore.hms.user.User;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalTime;

@Entity
@Table(name = "doctors")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Doctor extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "department_id")
    private Department department;

    @Column(name = "doctor_code", nullable = false, unique = true, length = 50)
    private String doctorCode;

    @Column(nullable = false, length = 150)
    private String specialization;

    @Column(name = "license_number", nullable = false, length = 100)
    private String licenseNumber;

    @Column(name = "consultation_fee", precision = 10, scale = 2)
    @Builder.Default
    private BigDecimal consultationFee = BigDecimal.valueOf(100.00);

    @Column(name = "room_number", length = 50)
    private String roomNumber;

    @Column(name = "available_days", length = 100)
    @Builder.Default
    private String availableDays = "MON,TUE,WED,THU,FRI";

    @Column(name = "shift_start")
    @Builder.Default
    private LocalTime shiftStart = LocalTime.of(9, 0);

    @Column(name = "shift_end")
    @Builder.Default
    private LocalTime shiftEnd = LocalTime.of(17, 0);

    @Column(length = 50)
    @Builder.Default
    private String status = "AVAILABLE";
}
