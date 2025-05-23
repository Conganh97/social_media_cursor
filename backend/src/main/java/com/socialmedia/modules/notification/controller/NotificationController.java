package com.socialmedia.modules.notification.controller;

import com.socialmedia.entity.Notification;
import com.socialmedia.modules.notification.dto.NotificationResponse;
import com.socialmedia.modules.notification.dto.NotificationSummary;
import com.socialmedia.modules.notification.exception.NotificationNotFoundException;
import com.socialmedia.modules.notification.exception.UnauthorizedNotificationAccessException;
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
        try {
            Pageable pageable = PageRequest.of(page, size);
            Page<NotificationResponse> notifications = notificationService.getUserNotifications(currentUser.getId(), pageable);
            
            log.info("Retrieved {} notifications for user ID: {}", notifications.getContent().size(), currentUser.getId());
            return ResponseEntity.ok(notifications);
        } catch (Exception e) {
            log.error("Error retrieving notifications for user ID: {}", currentUser.getId(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/unread")
    public ResponseEntity<Page<NotificationResponse>> getUnreadNotifications(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        try {
            Pageable pageable = PageRequest.of(page, size);
            Page<NotificationResponse> notifications = notificationService.getUnreadNotifications(currentUser.getId(), pageable);
            
            log.info("Retrieved {} unread notifications for user ID: {}", notifications.getContent().size(), currentUser.getId());
            return ResponseEntity.ok(notifications);
        } catch (Exception e) {
            log.error("Error retrieving unread notifications for user ID: {}", currentUser.getId(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/type/{type}")
    public ResponseEntity<Page<NotificationResponse>> getNotificationsByType(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @PathVariable String type,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        try {
            Notification.NotificationType notificationType = Notification.NotificationType.valueOf(type.toUpperCase());
            Pageable pageable = PageRequest.of(page, size);
            Page<NotificationResponse> notifications = notificationService.getNotificationsByType(
                    currentUser.getId(), notificationType, pageable);
            
            log.info("Retrieved {} notifications of type {} for user ID: {}", 
                    notifications.getContent().size(), type, currentUser.getId());
            return ResponseEntity.ok(notifications);
        } catch (IllegalArgumentException e) {
            log.error("Invalid notification type: {}", type);
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            log.error("Error retrieving notifications by type for user ID: {}", currentUser.getId(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/{notificationId}")
    public ResponseEntity<?> getNotificationById(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @PathVariable Long notificationId) {
        try {
            NotificationResponse notification = notificationService.getNotificationById(notificationId, currentUser.getId());
            return ResponseEntity.ok(notification);
        } catch (NotificationNotFoundException e) {
            log.error("Notification not found: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(createErrorResponse("Notification not found", e.getMessage()));
        } catch (UnauthorizedNotificationAccessException e) {
            log.error("Unauthorized access to notification: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(createErrorResponse("Access denied", e.getMessage()));
        } catch (Exception e) {
            log.error("Error retrieving notification ID: {}", notificationId, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("Internal server error", "An unexpected error occurred"));
        }
    }

    @PutMapping("/{notificationId}/read")
    public ResponseEntity<?> markAsRead(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @PathVariable Long notificationId) {
        try {
            NotificationResponse notification = notificationService.markAsRead(notificationId, currentUser.getId());
            
            log.info("Notification ID: {} marked as read by user ID: {}", notificationId, currentUser.getId());
            return ResponseEntity.ok(notification);
        } catch (NotificationNotFoundException e) {
            log.error("Notification not found: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(createErrorResponse("Notification not found", e.getMessage()));
        } catch (UnauthorizedNotificationAccessException e) {
            log.error("Unauthorized access to notification: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(createErrorResponse("Access denied", e.getMessage()));
        } catch (Exception e) {
            log.error("Error marking notification as read ID: {}", notificationId, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("Internal server error", "An unexpected error occurred"));
        }
    }

    @PutMapping("/read-all")
    public ResponseEntity<?> markAllAsRead(@AuthenticationPrincipal UserPrincipal currentUser) {
        try {
            notificationService.markAllAsRead(currentUser.getId());
            
            log.info("All notifications marked as read for user ID: {}", currentUser.getId());
            return ResponseEntity.ok(createSuccessResponse("All notifications marked as read"));
        } catch (Exception e) {
            log.error("Error marking all notifications as read for user ID: {}", currentUser.getId(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("Internal server error", "An unexpected error occurred"));
        }
    }

    @GetMapping("/count/unread")
    public ResponseEntity<?> getUnreadCount(@AuthenticationPrincipal UserPrincipal currentUser) {
        try {
            Long unreadCount = notificationService.getUnreadCount(currentUser.getId());
            
            Map<String, Object> response = new HashMap<>();
            response.put("unreadCount", unreadCount);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error retrieving unread count for user ID: {}", currentUser.getId(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("Internal server error", "An unexpected error occurred"));
        }
    }

    @GetMapping("/summary")
    public ResponseEntity<?> getNotificationSummary(@AuthenticationPrincipal UserPrincipal currentUser) {
        try {
            NotificationSummary summary = notificationService.getNotificationSummary(currentUser.getId());
            
            log.info("Retrieved notification summary for user ID: {}", currentUser.getId());
            return ResponseEntity.ok(summary);
        } catch (Exception e) {
            log.error("Error retrieving notification summary for user ID: {}", currentUser.getId(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("Internal server error", "An unexpected error occurred"));
        }
    }

    @DeleteMapping("/{notificationId}")
    public ResponseEntity<?> deleteNotification(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @PathVariable Long notificationId) {
        try {
            notificationService.deleteNotification(notificationId, currentUser.getId());
            
            log.info("Notification ID: {} deleted by user ID: {}", notificationId, currentUser.getId());
            return ResponseEntity.ok(createSuccessResponse("Notification deleted successfully"));
        } catch (NotificationNotFoundException e) {
            log.error("Notification not found: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(createErrorResponse("Notification not found", e.getMessage()));
        } catch (UnauthorizedNotificationAccessException e) {
            log.error("Unauthorized access to notification: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(createErrorResponse("Access denied", e.getMessage()));
        } catch (Exception e) {
            log.error("Error deleting notification ID: {}", notificationId, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("Internal server error", "An unexpected error occurred"));
        }
    }

    @PostMapping("/test")
    public ResponseEntity<?> createTestNotification(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @RequestParam(defaultValue = "LIKE") String type,
            @RequestParam(defaultValue = "Test notification content") String content,
            @RequestParam(required = false) Long relatedId) {
        try {
            Notification.NotificationType notificationType = Notification.NotificationType.valueOf(type.toUpperCase());
            NotificationResponse notification = notificationService.createNotification(
                    currentUser.getId(), notificationType, content, relatedId);
            
            log.info("Test notification created for user ID: {}", currentUser.getId());
            return ResponseEntity.status(HttpStatus.CREATED).body(notification);
        } catch (IllegalArgumentException e) {
            log.error("Invalid notification type: {}", type);
            return ResponseEntity.badRequest()
                    .body(createErrorResponse("Invalid type", "Invalid notification type: " + type));
        } catch (Exception e) {
            log.error("Error creating test notification for user ID: {}", currentUser.getId(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("Internal server error", "An unexpected error occurred"));
        }
    }

    private Map<String, Object> createErrorResponse(String error, String message) {
        Map<String, Object> response = new HashMap<>();
        response.put("error", error);
        response.put("message", message);
        response.put("timestamp", System.currentTimeMillis());
        return response;
    }

    private Map<String, Object> createSuccessResponse(String message) {
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", message);
        response.put("timestamp", System.currentTimeMillis());
        return response;
    }
} 