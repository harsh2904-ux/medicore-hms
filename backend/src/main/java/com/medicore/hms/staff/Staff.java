package com.medicore.hms.staff;

import com.medicore.hms.common.BaseEntity;
import com.medicore.hms.department.Department;
import com.medicore.hms.user.User;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "staff")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Staff extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "department_id")
    private Department department;

    @Column(name = "staff_code", nullable = false, unique = true, length = 50)
    private String staffCode;

    @Column(name = "job_title", length = 100)
    private String jobTitle;

    @Column(name = "employment_type", length = 50)
    @Builder.Default
    private String employmentType = "FULL_TIME";

    @Column(length = 255)
    private String qualification;

    @Column(name = "joining_date")
    private LocalDate joiningDate;

    @Column(length = 50)
    @Builder.Default
    private String status = "ACTIVE";
}
