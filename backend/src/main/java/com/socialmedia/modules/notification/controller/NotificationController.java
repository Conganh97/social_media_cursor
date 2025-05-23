package com.socialmedia.modules.notification.controller;

import com.socialmedia.modules.notification.entity.Notification;
import com.socialmedia.modules.notification.dto.NotificationResponse;
import com.socialmedia.modules.notification.dto.NotificationSummary;
import com.socialmedia.modules.notification.service.NotificationService;
import com.socialmedia.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
@Slf4j
public class NotificationController {

    private final NotificationService notificationService;

    @GetMapping
    public ResponseEntity<Page<NotificationResponse>> getUserNotifications(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<NotificationResponse> notifications = notificationService.getUserNotifications(currentUser.getId(), pageable);
        
        log.info("Retrieved {} notifications for user ID: {}", notifications.getContent().size(), currentUser.getId());
        return ResponseEntity.ok(notifications);
    }

    @GetMapping("/unread")
    public ResponseEntity<Page<NotificationResponse>> getUnreadNotifications(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<NotificationResponse> notifications = notificationService.getUnreadNotifications(currentUser.getId(), pageable);
        
        log.info("Retrieved {} unread notifications for user ID: {}", notifications.getContent().size(), currentUser.getId());
        return ResponseEntity.ok(notifications);
    }

    @GetMapping("/type/{type}")
    public ResponseEntity<Page<NotificationResponse>> getNotificationsByType(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @PathVariable String type,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Notification.NotificationType notificationType = Notification.NotificationType.valueOf(type.toUpperCase());
        Pageable pageable = PageRequest.of(page, size);
        Page<NotificationResponse> notifications = notificationService.getNotificationsByType(
                currentUser.getId(), notificationType, pageable);
        
        log.info("Retrieved {} notifications of type {} for user ID: {}", 
                notifications.getContent().size(), type, currentUser.getId());
        return ResponseEntity.ok(notifications);
    }

    @GetMapping("/{notificationId}")
    public ResponseEntity<NotificationResponse> getNotificationById(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @PathVariable Long notificationId) {
        NotificationResponse notification = notificationService.getNotificationById(notificationId, currentUser.getId());
        return ResponseEntity.ok(notification);
    }

    @PutMapping("/{notificationId}/read")
    public ResponseEntity<NotificationResponse> markAsRead(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @PathVariable Long notificationId) {
        NotificationResponse notification = notificationService.markAsRead(notificationId, currentUser.getId());
        
        log.info("Notification ID: {} marked as read by user ID: {}", notificationId, currentUser.getId());
        return ResponseEntity.ok(notification);
    }

    @PutMapping("/read-all")
    public ResponseEntity<Map<String, String>> markAllAsRead(@AuthenticationPrincipal UserPrincipal currentUser) {
        notificationService.markAllAsRead(currentUser.getId());
        
        log.info("All notifications marked as read for user ID: {}", currentUser.getId());
        Map<String, String> response = new HashMap<>();
        response.put("message", "All notifications marked as read");
        return ResponseEntity.ok(response);
    }

    @GetMapping("/count/unread")
    public ResponseEntity<Map<String, Long>> getUnreadCount(@AuthenticationPrincipal UserPrincipal currentUser) {
        Long unreadCount = notificationService.getUnreadCount(currentUser.getId());
        
        Map<String, Long> response = new HashMap<>();
        response.put("unreadCount", unreadCount);
        
        return ResponseEntity.ok(response);
    }

    @GetMapping("/summary")
    public ResponseEntity<NotificationSummary> getNotificationSummary(@AuthenticationPrincipal UserPrincipal currentUser) {
        NotificationSummary summary = notificationService.getNotificationSummary(currentUser.getId());
        
        log.info("Retrieved notification summary for user ID: {}", currentUser.getId());
        return ResponseEntity.ok(summary);
    }

    @DeleteMapping("/{notificationId}")
    public ResponseEntity<Map<String, String>> deleteNotification(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @PathVariable Long notificationId) {
        notificationService.deleteNotification(notificationId, currentUser.getId());
        
        log.info("Notification ID: {} deleted by user ID: {}", notificationId, currentUser.getId());
        Map<String, String> response = new HashMap<>();
        response.put("message", "Notification deleted successfully");
        return ResponseEntity.ok(response);
    }

    @PostMapping("/test")
    public ResponseEntity<NotificationResponse> createTestNotification(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @RequestParam(defaultValue = "LIKE") String type,
            @RequestParam(defaultValue = "Test notification content") String content,
            @RequestParam(required = false) Long relatedId) {
        Notification.NotificationType notificationType = Notification.NotificationType.valueOf(type.toUpperCase());
        NotificationResponse notification = notificationService.createNotification(
                currentUser.getId(), notificationType, content, relatedId);
        
        log.info("Test notification created for user ID: {}", currentUser.getId());
        return ResponseEntity.status(HttpStatus.CREATED).body(notification);
    }
} 