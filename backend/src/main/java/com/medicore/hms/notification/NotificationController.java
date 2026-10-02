package com.medicore.hms.notification;

import com.medicore.hms.common.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@Tag(name = "Notifications", description = "Endpoints for real-time clinical alerts, inventory notifications, and user messages")
@RestController
@RequestMapping("/api/v1/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    @Operation(summary = "List system and user notifications")
    @GetMapping
    public ResponseEntity<ApiResponse<List<Notification>>> getNotifications(
            @RequestParam(required = false) Long userId) {
        return ResponseEntity.ok(ApiResponse.ok(notificationService.getNotifications(userId)));
    }

    @Operation(summary = "Create and dispatch new notification")
    @PostMapping
    public ResponseEntity<ApiResponse<Notification>> createNotification(@RequestBody Map<String, Object> body) {
        Long userId = body.containsKey("userId") && body.get("userId") != null ? Long.valueOf(body.get("userId").toString()) : null;
        String title = (String) body.get("title");
        String message = (String) body.get("message");
        String type = body.containsKey("type") ? (String) body.get("type") : "INFO";
        Notification created = notificationService.sendNotification(userId, title, message, type);
        return ResponseEntity.ok(ApiResponse.ok("Notification created", created));
    }

    @Operation(summary = "Mark single notification as read")
    @PatchMapping("/{id}/read")
    public ResponseEntity<ApiResponse<Notification>> markAsRead(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok("Notification updated", notificationService.markAsRead(id)));
    }

    @Operation(summary = "Mark all notifications as read")
    @PostMapping("/mark-all-read")
    public ResponseEntity<ApiResponse<Void>> markAllAsRead(@RequestParam(required = false) Long userId) {
        notificationService.markAllAsRead(userId);
        return ResponseEntity.ok(ApiResponse.ok("All marked as read", null));
    }
}
