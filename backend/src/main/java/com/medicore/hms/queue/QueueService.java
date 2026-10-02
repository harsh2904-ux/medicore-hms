package com.medicore.hms.queue;

import com.medicore.hms.appointment.Appointment;
import com.medicore.hms.appointment.AppointmentRepository;
import com.medicore.hms.common.ResourceNotFoundException;
import com.medicore.hms.patient.Patient;
import com.medicore.hms.patient.PatientRepository;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class QueueService {

    private final PatientQueueRepository queueRepository;
    private final PatientRepository patientRepository;
    private final AppointmentRepository appointmentRepository;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class QueueDto {
        private String id;
        private Integer tokenNumber;
        private String patientId;
        private String patientName;
        private String doctorId;
        private String doctorName;
        private String department;
        private String status;
        private String priority;
        private String checkInTime;
        private String calledTime;
        private String completedTime;

        public static QueueDto fromEntity(PatientQueue q) {
            String pName = q.getPatient() != null ? q.getPatient().getFirstName() + " " + q.getPatient().getLastName() : "Unknown";
            String dName = q.getDoctor() != null && q.getDoctor().getUser() != null
                    ? "Dr. " + q.getDoctor().getUser().getFirstName() + " " + q.getDoctor().getUser().getLastName()
                    : "Attending Physician";
            String deptName = q.getDepartment() != null ? q.getDepartment().getName() : "OPD";

            return QueueDto.builder()
                    .id(q.getId().toString())
                    .tokenNumber(q.getTokenNumber())
                    .patientId(q.getPatient() != null ? q.getPatient().getId().toString() : null)
                    .patientName(pName)
                    .doctorId(q.getDoctor() != null ? q.getDoctor().getId().toString() : null)
                    .doctorName(dName)
                    .department(deptName)
                    .status(q.getStatus())
                    .priority(q.getPriority())
                    .checkInTime(q.getCheckInTime() != null ? q.getCheckInTime().toString() : null)
                    .calledTime(q.getCalledTime() != null ? q.getCalledTime().toString() : null)
                    .completedTime(q.getCompletedTime() != null ? q.getCompletedTime().toString() : null)
                    .build();
        }
    }

    @Transactional(readOnly = true)
    public List<QueueDto> getTodayQueue(Long doctorId) {
        LocalDate today = LocalDate.now();
        List<PatientQueue> entries;
        if (doctorId != null) {
            entries = queueRepository.findByQueueDateAndDoctorIdOrderByTokenNumberAsc(today, doctorId);
        } else {
            entries = queueRepository.findByQueueDateOrderByTokenNumberAsc(today);
        }
        return entries.stream().map(QueueDto::fromEntity).toList();
    }

    @Transactional
    public QueueDto checkIn(Long appointmentId, String priority) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment", "id", appointmentId));

        LocalDate today = LocalDate.now();
        List<PatientQueue> todayList = queueRepository.findByQueueDateOrderByTokenNumberAsc(today);
        int nextToken = todayList.size() + 1;

        PatientQueue queue = PatientQueue.builder()
                .appointment(appointment)
                .patient(appointment.getPatient())
                .doctor(appointment.getDoctor())
                .department(appointment.getDepartment())
                .tokenNumber(nextToken)
                .priority(priority != null ? priority.toUpperCase() : "NORMAL")
                .status("WAITING")
                .queueDate(today)
                .checkInTime(Instant.now())
                .build();

        PatientQueue saved = queueRepository.save(queue);
        appointment.setStatus("CONFIRMED");
        appointmentRepository.save(appointment);

        return QueueDto.fromEntity(saved);
    }

    @Transactional
    public QueueDto updateStatus(Long queueId, String status) {
        PatientQueue queue = queueRepository.findById(queueId)
                .orElseThrow(() -> new ResourceNotFoundException("PatientQueue", "id", queueId));

        queue.setStatus(status.toUpperCase());
        if ("IN_CONSULTATION".equalsIgnoreCase(status)) {
            queue.setCalledTime(Instant.now());
        } else if ("COMPLETED".equalsIgnoreCase(status)) {
            queue.setCompletedTime(Instant.now());
        }

        PatientQueue updated = queueRepository.save(queue);
        return QueueDto.fromEntity(updated);
    }
}
