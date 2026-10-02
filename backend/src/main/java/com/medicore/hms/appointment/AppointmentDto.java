package com.medicore.hms.appointment;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AppointmentDto {
    private String id;
    private String appointmentNumber;
    private String patientId;
    private String patientName;
    private String patientPhone;
    private String doctorId;
    private String doctorName;
    private String department;
    private String departmentId;
    private String date;
    private String time;
    private String type;
    private String status;
    private String reason;
    private String notes;

    public static AppointmentDto fromEntity(Appointment a) {
        String patName = a.getPatient() != null ? a.getPatient().getFirstName() + " " + a.getPatient().getLastName() : "Unknown";
        String patPhone = a.getPatient() != null ? a.getPatient().getPhone() : null;
        String docName = a.getDoctor() != null && a.getDoctor().getUser() != null
                ? "Dr. " + a.getDoctor().getUser().getFirstName() + " " + a.getDoctor().getUser().getLastName()
                : (a.getDoctor() != null ? "Dr. Specialist" : "Unassigned");
        String deptName = a.getDepartment() != null ? a.getDepartment().getName()
                : (a.getDoctor() != null && a.getDoctor().getDepartment() != null ? a.getDoctor().getDepartment().getName() : "General");

        return AppointmentDto.builder()
                .id(a.getId().toString())
                .appointmentNumber(a.getAppointmentNumber())
                .patientId(a.getPatient() != null ? a.getPatient().getId().toString() : null)
                .patientName(patName)
                .patientPhone(patPhone)
                .doctorId(a.getDoctor() != null ? a.getDoctor().getId().toString() : null)
                .doctorName(docName)
                .department(deptName)
                .departmentId(a.getDepartment() != null ? a.getDepartment().getId().toString() : null)
                .date(a.getAppointmentDate().toString())
                .time(a.getStartTime() != null ? a.getStartTime().toString() : "09:00")
                .type(a.getType())
                .status(a.getStatus())
                .reason(a.getReason())
                .notes(a.getNotes())
                .build();
    }
}
