package com.medicore.hms.patient;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.Period;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PatientDto {
    private String id;
    private String mrn;
    private String firstName;
    private String lastName;
    private String name;
    private String gender;
    private String dateOfBirth;
    private Integer age;
    private String bloodGroup;
    private String phone;
    private String email;
    private String address;
    private String city;
    private EmergencyContact emergencyContact;
    private String insuranceProvider;
    private String insurancePolicyNumber;
    private List<String> allergies;
    private String status;
    private String createdAt;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class EmergencyContact {
        private String name;
        private String phone;
    }

    public static PatientDto fromEntity(Patient p) {
        int age = p.getDateOfBirth() != null ? Period.between(p.getDateOfBirth(), LocalDate.now()).getYears() : 0;
        List<String> allergyList = p.getAllergies() != null && !p.getAllergies().isBlank()
                ? Arrays.stream(p.getAllergies().split(",")).map(String::trim).toList()
                : Collections.emptyList();

        return PatientDto.builder()
                .id(p.getId().toString())
                .mrn(p.getMrn())
                .firstName(p.getFirstName())
                .lastName(p.getLastName())
                .name(p.getFirstName() + " " + p.getLastName())
                .gender(p.getGender())
                .dateOfBirth(p.getDateOfBirth().toString())
                .age(age)
                .bloodGroup(p.getBloodGroup())
                .phone(p.getPhone())
                .email(p.getEmail())
                .address(p.getAddress())
                .city(p.getCity())
                .emergencyContact(EmergencyContact.builder()
                        .name(p.getEmergencyContactName())
                        .phone(p.getEmergencyContactPhone())
                        .build())
                .insuranceProvider(p.getInsuranceProvider())
                .insurancePolicyNumber(p.getInsurancePolicyNumber())
                .allergies(allergyList)
                .status(p.getStatus())
                .createdAt(p.getCreatedAt() != null ? p.getCreatedAt().toString() : null)
                .build();
    }
}
