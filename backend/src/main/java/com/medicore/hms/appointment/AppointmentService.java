package com.medicore.hms.appointment;

import com.medicore.hms.common.PageResponse;
import com.medicore.hms.common.ResourceNotFoundException;
import com.medicore.hms.department.Department;
import com.medicore.hms.department.DepartmentRepository;
import com.medicore.hms.doctor.Doctor;
import com.medicore.hms.doctor.DoctorRepository;
import com.medicore.hms.patient.Patient;
import com.medicore.hms.patient.PatientRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.Year;
import java.util.UUID;

import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;
import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final PatientRepository patientRepository;
    private final DoctorRepository doctorRepository;
    private final DepartmentRepository departmentRepository;

    @Transactional(readOnly = true)
    public PageResponse<AppointmentDto> getAppointments(LocalDate date, Long doctorId, String status, Pageable pageable) {
        Specification<Appointment> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            if (date != null) {
                predicates.add(cb.equal(root.get("appointmentDate"), date));
            }
            if (doctorId != null) {
                predicates.add(cb.equal(root.get("doctor").get("id"), doctorId));
            }
            if (status != null && !status.isBlank()) {
                predicates.add(cb.equal(root.get("status"), status));
            }
            return cb.and(predicates.toArray(new Predicate[0]));
        };
        Page<Appointment> page = appointmentRepository.findAll(spec, pageable);
        return PageResponse.from(page.map(AppointmentDto::fromEntity));
    }

    @Transactional(readOnly = true)
    public AppointmentDto getAppointmentById(Long id) {
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment", "id", id));
        return AppointmentDto.fromEntity(appointment);
    }

    @Transactional
    public AppointmentDto createAppointment(CreateAppointmentRequest request) {
        Patient patient = patientRepository.findById(request.getPatientId())
                .orElseThrow(() -> new ResourceNotFoundException("Patient", "id", request.getPatientId()));

        Doctor doctor = null;
        if (request.getDoctorId() != null) {
            doctor = doctorRepository.findById(request.getDoctorId()).orElse(null);
        }

        Department department = null;
        if (request.getDepartmentId() != null) {
            department = departmentRepository.findById(request.getDepartmentId()).orElse(null);
        } else if (doctor != null && doctor.getDepartment() != null) {
            department = doctor.getDepartment();
        }

        String aptNumber = "APT-" + Year.now().getValue() + "-" + UUID.randomUUID().toString().substring(0, 5).toUpperCase();
        LocalTime start = request.getStartTime() != null ? request.getStartTime() : LocalTime.of(9, 0);
        LocalTime end = request.getEndTime() != null ? request.getEndTime() : start.plusMinutes(30);

        Appointment appointment = Appointment.builder()
                .appointmentNumber(aptNumber)
                .patient(patient)
                .doctor(doctor)
                .department(department)
                .appointmentDate(request.getAppointmentDate())
                .startTime(start)
                .endTime(end)
                .type(request.getType() != null ? request.getType() : "CONSULTATION")
                .status(request.getStatus() != null ? request.getStatus() : "SCHEDULED")
                .reason(request.getReason())
                .notes(request.getNotes())
                .build();

        Appointment saved = appointmentRepository.save(appointment);
        return AppointmentDto.fromEntity(saved);
    }

    @Transactional
    public AppointmentDto updateAppointmentStatus(Long id, String status) {
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment", "id", id));

        appointment.setStatus(status.toUpperCase());
        Appointment updated = appointmentRepository.save(appointment);
        return AppointmentDto.fromEntity(updated);
    }

    @Transactional
    public void deleteAppointment(Long id) {
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment", "id", id));
        appointmentRepository.delete(appointment);
    }
}
