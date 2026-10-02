package com.medicore.hms.notification;

import com.medicore.hms.common.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;

    @Transactional(readOnly = true)
    public List<Notification> getNotifications(Long userId) {
        if (userId != null) {
            return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId);
        }
        return notificationRepository.findByOrderByCreatedAtDesc();
    }

    @Transactional
    public Notification markAsRead(Long id) {
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Notification", "id", id));
        notification.setIsRead(true);
        return notificationRepository.save(notification);
    }

    @Transactional
    public void markAllAsRead(Long userId) {
        List<Notification> list = getNotifications(userId);
        for (Notification n : list) {
            n.setIsRead(true);
        }
        notificationRepository.saveAll(list);
    }

    @Transactional
    public Notification sendNotification(Long userId, String title, String message, String type) {
        Notification n = Notification.builder()
                .userId(userId)
                .title(title)
                .message(message)
                .type(type != null ? type : "INFO")
                .isRead(false)
                .createdAt(Instant.now())
                .build();
        return notificationRepository.save(n);
    }
}
