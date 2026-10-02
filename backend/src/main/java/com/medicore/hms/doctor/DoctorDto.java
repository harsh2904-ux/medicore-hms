package com.medicore.hms.doctor;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DoctorDto {
    private String id;
    private String doctorCode;
    private String name;
    private String email;
    private String phone;
    private String specialization;
    private String departmentId;
    private String departmentName;
    private String licenseNumber;
    private BigDecimal consultationFee;
    private String roomNumber;
    private String availableDays;
    private String shiftStart;
    private String shiftEnd;
    private String status;

    public static DoctorDto fromEntity(Doctor d) {
        String name = d.getUser() != null ? "Dr. " + d.getUser().getFirstName() + " " + d.getUser().getLastName() : "Dr. " + d.getSpecialization() + " Specialist";
        String email = d.getUser() != null ? d.getUser().getEmail() : null;
        String phone = d.getUser() != null ? d.getUser().getPhone() : null;
        String deptId = d.getDepartment() != null ? d.getDepartment().getId().toString() : null;
        String deptName = d.getDepartment() != null ? d.getDepartment().getName() : null;

        return DoctorDto.builder()
                .id(d.getId().toString())
                .doctorCode(d.getDoctorCode())
                .name(name)
                .email(email)
                .phone(phone)
                .specialization(d.getSpecialization())
                .departmentId(deptId)
                .departmentName(deptName)
                .licenseNumber(d.getLicenseNumber())
                .consultationFee(d.getConsultationFee())
                .roomNumber(d.getRoomNumber())
                .availableDays(d.getAvailableDays())
                .shiftStart(d.getShiftStart() != null ? d.getShiftStart().toString() : null)
                .shiftEnd(d.getShiftEnd() != null ? d.getShiftEnd().toString() : null)
                .status(d.getStatus())
                .build();
    }
}
