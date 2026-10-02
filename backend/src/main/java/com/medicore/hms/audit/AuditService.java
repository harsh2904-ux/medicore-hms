package com.medicore.hms.audit;

import com.medicore.hms.common.PageResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;

@Service
@RequiredArgsConstructor
public class AuditService {

    private final AuditLogRepository auditLogRepository;

    @Transactional(readOnly = true)
    public PageResponse<AuditLog> getAuditLogs(String resourceType, Pageable pageable) {
        Page<AuditLog> page;
        if (resourceType != null && !resourceType.isBlank()) {
            page = auditLogRepository.findByResourceTypeOrderByTimestampDesc(resourceType, pageable);
        } else {
            page = auditLogRepository.findAllByOrderByTimestampDesc(pageable);
        }
        return PageResponse.from(page);
    }

    @Transactional
    public void logAction(Long userId, String username, String action, String resourceType, String resourceId, String ipAddress, String details) {
        AuditLog log = AuditLog.builder()
                .userId(userId)
                .username(username)
                .action(action)
                .resourceType(resourceType)
                .resourceId(resourceId)
                .ipAddress(ipAddress)
                .details(details)
                .timestamp(Instant.now())
                .build();
        auditLogRepository.save(log);
    }
}
