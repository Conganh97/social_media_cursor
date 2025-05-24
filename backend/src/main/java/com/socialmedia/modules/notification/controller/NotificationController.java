package com.socialmedia.modules.notification.controller;

import com.socialmedia.modules.notification.entity.Notification;
import com.socialmedia.modules.notification.dto.NotificationResponse;
import com.socialmedia.modules.notification.dto.NotificationSummary;
import com.socialmedia.modules.notification.service.NotificationService;
import com.socialmedia.security.UserPrincipal;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
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

@Tag(name = "Notifications", description = "APIs for real-time notifications and notification management with WebSocket support")
@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
@Slf4j
public class NotificationController {

    private final NotificationService notificationService;

    @Operation(
        summary = "Get User Notifications",
        description = "Retrieve paginated notifications for the authenticated user. Includes all notification types with read status and related user information."
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200",
            description = "User notifications retrieved successfully",
            content = @Content(
                mediaType = "application/json",
                examples = @ExampleObject(
                    name = "User Notifications",
                    value = """
                        {
                          "content": [
                            {
                              "id": 123,
                              "type": "LIKE",
                              "content": "John Doe liked your post",
                              "read": false,
                              "createdAt": "2024-01-01T12:00:00Z",
                              "relatedId": 456,
                              "relatedUser": {
                                "id": 789,
                                "username": "john_doe",
                                "email": "john@example.com"
                              }
                            }
                          ],
                          "totalElements": 1,
                          "totalPages": 1
                        }"""
                )
            )
        ),
        @ApiResponse(responseCode = "401", description = "Authentication required"),
        @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @GetMapping
    public ResponseEntity<Page<NotificationResponse>> getUserNotifications(
            @Parameter(hidden = true) @AuthenticationPrincipal UserPrincipal currentUser,
            @Parameter(
                description = "Page number (0-based)",
                example = "0"
            )
            @RequestParam(defaultValue = "0") int page,
            @Parameter(
                description = "Number of notifications per page",
                example = "20"
            )
            @RequestParam(defaultValue = "20") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<NotificationResponse> notifications = notificationService.getUserNotifications(currentUser.getId(), pageable);
        
        log.info("Retrieved {} notifications for user ID: {}", notifications.getContent().size(), currentUser.getId());
        return ResponseEntity.ok(notifications);
    }

    @Operation(
        summary = "Get Unread Notifications",
        description = "Retrieve paginated unread notifications for the authenticated user. Useful for notification badges and alerts."
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200",
            description = "Unread notifications retrieved successfully",
            content = @Content(
                mediaType = "application/json",
                examples = @ExampleObject(
                    name = "Unread Notifications",
                    value = """
                        {
                          "content": [
                            {
                              "id": 123,
                              "type": "COMMENT",
                              "content": "Jane Smith commented on your post",
                              "read": false,
                              "createdAt": "2024-01-01T12:00:00Z",
                              "relatedId": 456,
                              "relatedUser": {
                                "id": 789,
                                "username": "jane_smith"
                              }
                            }
                          ],
                          "totalElements": 3,
                          "totalPages": 1
                        }"""
                )
            )
        ),
        @ApiResponse(responseCode = "401", description = "Authentication required"),
        @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @GetMapping("/unread")
    public ResponseEntity<Page<NotificationResponse>> getUnreadNotifications(
            @Parameter(hidden = true) @AuthenticationPrincipal UserPrincipal currentUser,
            @Parameter(
                description = "Page number (0-based)",
                example = "0"
            )
            @RequestParam(defaultValue = "0") int page,
            @Parameter(
                description = "Number of notifications per page",
                example = "20"
            )
            @RequestParam(defaultValue = "20") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<NotificationResponse> notifications = notificationService.getUnreadNotifications(currentUser.getId(), pageable);
        
        log.info("Retrieved {} unread notifications for user ID: {}", notifications.getContent().size(), currentUser.getId());
        return ResponseEntity.ok(notifications);
    }

    @Operation(
        summary = "Get Notifications by Type",
        description = "Retrieve paginated notifications filtered by notification type. Useful for categorizing notifications."
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200",
            description = "Notifications by type retrieved successfully",
            content = @Content(
                mediaType = "application/json",
                examples = @ExampleObject(
                    name = "Notifications by Type",
                    value = """
                        {
                          "content": [
                            {
                              "id": 123,
                              "type": "LIKE",
                              "content": "3 people liked your post",
                              "read": false,
                              "createdAt": "2024-01-01T12:00:00Z",
                              "relatedId": 456
                            }
                          ],
                          "totalElements": 5,
                          "totalPages": 1
                        }"""
                )
            )
        ),
        @ApiResponse(
            responseCode = "400",
            description = "Invalid notification type",
            content = @Content(
                mediaType = "application/json",
                examples = @ExampleObject(
                    value = """
                        {
                          "timestamp": "2024-01-01T12:00:00Z",
                          "status": 400,
                          "error": "Bad Request",
                          "message": "Invalid notification type: INVALID_TYPE"
                        }"""
                )
            )
        ),
        @ApiResponse(responseCode = "401", description = "Authentication required"),
        @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @GetMapping("/type/{type}")
    public ResponseEntity<Page<NotificationResponse>> getNotificationsByType(
            @Parameter(hidden = true) @AuthenticationPrincipal UserPrincipal currentUser,
            @Parameter(
                description = "Notification type",
                required = true,
                example = "LIKE",
                schema = @Schema(allowableValues = {"LIKE", "COMMENT", "FRIEND_REQUEST", "MESSAGE", "POST_MENTION", "COMMENT_MENTION"})
            )
            @PathVariable String type,
            @Parameter(
                description = "Page number (0-based)",
                example = "0"
            )
            @RequestParam(defaultValue = "0") int page,
            @Parameter(
                description = "Number of notifications per page",
                example = "20"
            )
            @RequestParam(defaultValue = "20") int size) {
        Notification.NotificationType notificationType = Notification.NotificationType.valueOf(type.toUpperCase());
        Pageable pageable = PageRequest.of(page, size);
        Page<NotificationResponse> notifications = notificationService.getNotificationsByType(
                currentUser.getId(), notificationType, pageable);
        
        log.info("Retrieved {} notifications of type {} for user ID: {}", 
                notifications.getContent().size(), type, currentUser.getId());
        return ResponseEntity.ok(notifications);
    }

    @Operation(
        summary = "Get Notification by ID",
        description = "Retrieve a specific notification by its ID. Only the notification owner can access it."
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200",
            description = "Notification retrieved successfully",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(implementation = NotificationResponse.class),
                examples = @ExampleObject(
                    name = "Notification Details",
                    value = """
                        {
                          "id": 123,
                          "type": "FRIEND_REQUEST",
                          "content": "Alice Johnson sent you a friend request",
                          "read": false,
                          "createdAt": "2024-01-01T12:00:00Z",
                          "relatedId": 789,
                          "relatedUser": {
                            "id": 789,
                            "username": "alice_johnson",
                            "email": "alice@example.com"
                          }
                        }"""
                )
            )
        ),
        @ApiResponse(responseCode = "401", description = "Authentication required"),
        @ApiResponse(responseCode = "403", description = "Access denied - not the notification owner"),
        @ApiResponse(responseCode = "404", description = "Notification not found"),
        @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @GetMapping("/{notificationId}")
    public ResponseEntity<NotificationResponse> getNotificationById(
            @Parameter(hidden = true) @AuthenticationPrincipal UserPrincipal currentUser,
            @Parameter(
                description = "ID of the notification to retrieve",
                required = true,
                example = "123"
            )
            @PathVariable Long notificationId) {
        NotificationResponse notification = notificationService.getNotificationById(notificationId, currentUser.getId());
        return ResponseEntity.ok(notification);
    }

    @Operation(
        summary = "Mark Notification as Read",
        description = "Mark a specific notification as read. Updates read status in real-time via WebSocket."
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200",
            description = "Notification marked as read successfully",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(implementation = NotificationResponse.class),
                examples = @ExampleObject(
                    name = "Marked as Read",
                    value = """
                        {
                          "id": 123,
                          "type": "LIKE",
                          "content": "John Doe liked your post",
                          "read": true,
                          "createdAt": "2024-01-01T12:00:00Z",
                          "relatedId": 456,
                          "relatedUser": {
                            "id": 789,
                            "username": "john_doe"
                          }
                        }"""
                )
            )
        ),
        @ApiResponse(responseCode = "401", description = "Authentication required"),
        @ApiResponse(responseCode = "403", description = "Access denied - not the notification owner"),
        @ApiResponse(responseCode = "404", description = "Notification not found"),
        @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @PutMapping("/{notificationId}/read")
    public ResponseEntity<NotificationResponse> markAsRead(
            @Parameter(hidden = true) @AuthenticationPrincipal UserPrincipal currentUser,
            @Parameter(
                description = "ID of the notification to mark as read",
                required = true,
                example = "123"
            )
            @PathVariable Long notificationId) {
        NotificationResponse notification = notificationService.markAsRead(notificationId, currentUser.getId());
        
        log.info("Notification ID: {} marked as read by user ID: {}", notificationId, currentUser.getId());
        return ResponseEntity.ok(notification);
    }

    @Operation(
        summary = "Mark All Notifications as Read",
        description = "Mark all notifications as read for the authenticated user. Useful for clearing notification badges."
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200",
            description = "All notifications marked as read successfully",
            content = @Content(
                mediaType = "application/json",
                examples = @ExampleObject(
                    value = """
                        {
                          "message": "All notifications marked as read"
                        }"""
                )
            )
        ),
        @ApiResponse(responseCode = "401", description = "Authentication required"),
        @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @PutMapping("/read-all")
    public ResponseEntity<Map<String, String>> markAllAsRead(
            @Parameter(hidden = true) @AuthenticationPrincipal UserPrincipal currentUser) {
        notificationService.markAllAsRead(currentUser.getId());
        
        log.info("All notifications marked as read for user ID: {}", currentUser.getId());
        Map<String, String> response = new HashMap<>();
        response.put("message", "All notifications marked as read");
        return ResponseEntity.ok(response);
    }

    @Operation(
        summary = "Get Unread Notifications Count",
        description = "Get the total number of unread notifications for the authenticated user. Perfect for notification badges."
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200",
            description = "Unread notifications count retrieved successfully",
            content = @Content(
                mediaType = "application/json",
                examples = @ExampleObject(
                    name = "Unread Count",
                    value = """
                        {
                          "unreadCount": 7
                        }"""
                )
            )
        ),
        @ApiResponse(responseCode = "401", description = "Authentication required"),
        @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @GetMapping("/count/unread")
    public ResponseEntity<Map<String, Long>> getUnreadCount(
            @Parameter(hidden = true) @AuthenticationPrincipal UserPrincipal currentUser) {
        Long unreadCount = notificationService.getUnreadCount(currentUser.getId());
        
        Map<String, Long> response = new HashMap<>();
        response.put("unreadCount", unreadCount);
        
        return ResponseEntity.ok(response);
    }

    @Operation(
        summary = "Get Notification Summary",
        description = "Get categorized summary of notifications for the authenticated user. Shows counts by notification type."
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200",
            description = "Notification summary retrieved successfully",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(implementation = NotificationSummary.class),
                examples = @ExampleObject(
                    name = "Notification Summary",
                    value = """
                        {
                          "totalNotifications": 15,
                          "unreadNotifications": 7,
                          "notificationCounts": {
                            "LIKE": 5,
                            "COMMENT": 3,
                            "FRIEND_REQUEST": 2,
                            "MESSAGE": 3,
                            "POST_MENTION": 1,
                            "COMMENT_MENTION": 1
                          },
                          "unreadCounts": {
                            "LIKE": 2,
                            "COMMENT": 1,
                            "FRIEND_REQUEST": 2,
                            "MESSAGE": 2
                          }
                        }"""
                )
            )
        ),
        @ApiResponse(responseCode = "401", description = "Authentication required"),
        @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @GetMapping("/summary")
    public ResponseEntity<NotificationSummary> getNotificationSummary(
            @Parameter(hidden = true) @AuthenticationPrincipal UserPrincipal currentUser) {
        NotificationSummary summary = notificationService.getNotificationSummary(currentUser.getId());
        
        log.info("Retrieved notification summary for user ID: {}", currentUser.getId());
        return ResponseEntity.ok(summary);
    }

    @Operation(
        summary = "Delete Notification",
        description = "Delete a specific notification. Only the notification owner can delete it. This action cannot be undone."
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200",
            description = "Notification deleted successfully",
            content = @Content(
                mediaType = "application/json",
                examples = @ExampleObject(
                    value = """
                        {
                          "message": "Notification deleted successfully"
                        }"""
                )
            )
        ),
        @ApiResponse(responseCode = "401", description = "Authentication required"),
        @ApiResponse(responseCode = "403", description = "Access denied - not the notification owner"),
        @ApiResponse(responseCode = "404", description = "Notification not found"),
        @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @DeleteMapping("/{notificationId}")
    public ResponseEntity<Map<String, String>> deleteNotification(
            @Parameter(hidden = true) @AuthenticationPrincipal UserPrincipal currentUser,
            @Parameter(
                description = "ID of the notification to delete",
                required = true,
                example = "123"
            )
            @PathVariable Long notificationId) {
        notificationService.deleteNotification(notificationId, currentUser.getId());
        
        log.info("Notification ID: {} deleted by user ID: {}", notificationId, currentUser.getId());
        Map<String, String> response = new HashMap<>();
        response.put("message", "Notification deleted successfully");
        return ResponseEntity.ok(response);
    }

    @Operation(
        summary = "Create Test Notification",
        description = "Create a test notification for development and testing purposes. Useful for testing notification systems and UI components."
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "201",
            description = "Test notification created successfully",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(implementation = NotificationResponse.class),
                examples = @ExampleObject(
                    name = "Test Notification Created",
                    value = """
                        {
                          "id": 123,
                          "type": "LIKE",
                          "content": "Test notification content",
                          "read": false,
                          "createdAt": "2024-01-01T12:00:00Z",
                          "relatedId": 456
                        }"""
                )
            )
        ),
        @ApiResponse(
            responseCode = "400",
            description = "Invalid notification type or content",
            content = @Content(
                mediaType = "application/json",
                examples = @ExampleObject(
                    value = """
                        {
                          "timestamp": "2024-01-01T12:00:00Z",
                          "status": 400,
                          "error": "Bad Request",
                          "message": "Invalid notification type"
                        }"""
                )
            )
        ),
        @ApiResponse(responseCode = "401", description = "Authentication required"),
        @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @PostMapping("/test")
    public ResponseEntity<NotificationResponse> createTestNotification(
            @Parameter(hidden = true) @AuthenticationPrincipal UserPrincipal currentUser,
            @Parameter(
                description = "Notification type",
                example = "LIKE",
                schema = @Schema(allowableValues = {"LIKE", "COMMENT", "FRIEND_REQUEST", "MESSAGE", "POST_MENTION", "COMMENT_MENTION"})
            )
            @RequestParam(defaultValue = "LIKE") String type,
            @Parameter(
                description = "Notification content",
                example = "Test notification content"
            )
            @RequestParam(defaultValue = "Test notification content") String content,
            @Parameter(
                description = "Related entity ID (optional)",
                example = "456"
            )
            @RequestParam(required = false) Long relatedId) {
        Notification.NotificationType notificationType = Notification.NotificationType.valueOf(type.toUpperCase());
        NotificationResponse notification = notificationService.createNotification(
                currentUser.getId(), notificationType, content, relatedId);
        
        log.info("Test notification created for user ID: {}", currentUser.getId());
        return ResponseEntity.status(HttpStatus.CREATED).body(notification);
    }
} 