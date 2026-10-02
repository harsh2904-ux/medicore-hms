package com.medicore.hms.patient;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreatePatientRequest {

    @NotBlank(message = "First name is required")
    private String firstName;

    @NotBlank(message = "Last name is required")
    private String lastName;

    @NotBlank(message = "Gender is required")
    private String gender;

    @NotNull(message = "Date of birth is required")
    private LocalDate dateOfBirth;

    private String bloodGroup;

    @NotBlank(message = "Phone number is required")
    private String phone;

    private String email;
    private String address;
    private String city;
    private String emergencyContactName;
    private String emergencyContactPhone;
    private String insuranceProvider;
    private String insurancePolicyNumber;
    private List<String> allergies;
    private String status;
}
