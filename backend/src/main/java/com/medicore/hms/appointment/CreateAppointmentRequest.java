package com.medicore.hms.appointment;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateAppointmentRequest {

    @NotNull(message = "Patient ID is required")
    private Long patientId;

    private Long doctorId;
    private Long departmentId;

    @NotNull(message = "Appointment date is required")
    private LocalDate appointmentDate;

    private LocalTime startTime;
    private LocalTime endTime;

    private String type;
    private String status;
    private String reason;
    private String notes;
}
