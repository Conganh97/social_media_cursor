package com.socialmedia.modules.notification.websocket;

import com.socialmedia.modules.notification.entity.Notification;
import com.socialmedia.modules.notification.dto.NotificationResponse;
import com.socialmedia.modules.notification.service.NotificationService;
import com.socialmedia.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.annotation.SendToUser;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.util.Map;

@Controller
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "http://localhost:3000")
public class NotificationWebSocketController {

    private final NotificationService notificationService;
    private final SimpMessagingTemplate messagingTemplate;

    @MessageMapping("/notifications.markAsRead")
    @SendToUser("/topic/notifications/read")
    public NotificationResponse markNotificationAsRead(
            @Payload Map<String, Object> request,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        
        log.info("WebSocket request to mark notification as read for user ID: {}", currentUser.getId());
        
        try {
            Long notificationId = Long.valueOf(request.get("notificationId").toString());
            NotificationResponse response = notificationService.markAsRead(notificationId, currentUser.getId());
            
            log.info("Notification ID: {} marked as read via WebSocket", notificationId);
            return response;
        } catch (Exception e) {
            log.error("Error marking notification as read via WebSocket: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to mark notification as read");
        }
    }

    @MessageMapping("/notifications.markAllAsRead")
    @SendToUser("/topic/notifications/read-all")
    public String markAllNotificationsAsRead(@AuthenticationPrincipal UserPrincipal currentUser) {
        
        log.info("WebSocket request to mark all notifications as read for user ID: {}", currentUser.getId());
        
        try {
            notificationService.markAllAsRead(currentUser.getId());
            
            log.info("All notifications marked as read via WebSocket for user ID: {}", currentUser.getId());
            return "All notifications marked as read";
        } catch (Exception e) {
            log.error("Error marking all notifications as read via WebSocket: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to mark all notifications as read");
        }
    }

    @MessageMapping("/notifications.getUnreadCount")
    @SendToUser("/topic/notifications/unread-count")
    public Long getUnreadCount(@AuthenticationPrincipal UserPrincipal currentUser) {
        
        log.info("WebSocket request to get unread count for user ID: {}", currentUser.getId());
        
        try {
            Long unreadCount = notificationService.getUnreadCount(currentUser.getId());
            
            log.info("Unread count retrieved via WebSocket: {} for user ID: {}", unreadCount, currentUser.getId());
            return unreadCount;
        } catch (Exception e) {
            log.error("Error getting unread count via WebSocket: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to get unread count");
        }
    }

    @MessageMapping("/notifications.create")
    public void createNotification(
            @Payload Map<String, Object> request,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        
        log.info("WebSocket request to create notification for user ID: {}", currentUser.getId());
        
        try {
            String typeStr = request.get("type").toString();
            String content = request.get("content").toString();
            Long relatedId = request.get("relatedId") != null ? 
                    Long.valueOf(request.get("relatedId").toString()) : null;
            
            Notification.NotificationType type = Notification.NotificationType.valueOf(typeStr.toUpperCase());
            
            NotificationResponse notification = notificationService.createNotification(
                    currentUser.getId(), type, content, relatedId);
            
            log.info("Notification created via WebSocket with ID: {}", notification.getId());
        } catch (Exception e) {
            log.error("Error creating notification via WebSocket: {}", e.getMessage(), e);
            
            messagingTemplate.convertAndSendToUser(
                    currentUser.getId().toString(),
                    "/topic/notifications/error",
                    "Failed to create notification: " + e.getMessage()
            );
        }
    }

    @MessageMapping("/notifications.delete")
    @SendToUser("/topic/notifications/deleted")
    public String deleteNotification(
            @Payload Map<String, Object> request,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        
        log.info("WebSocket request to delete notification for user ID: {}", currentUser.getId());
        
        try {
            Long notificationId = Long.valueOf(request.get("notificationId").toString());
            notificationService.deleteNotification(notificationId, currentUser.getId());
            
            log.info("Notification ID: {} deleted via WebSocket", notificationId);
            return "Notification deleted successfully";
        } catch (Exception e) {
            log.error("Error deleting notification via WebSocket: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to delete notification");
        }
    }

    @MessageMapping("/notifications.subscribe")
    public void subscribeToNotifications(@AuthenticationPrincipal UserPrincipal currentUser) {
        log.info("User ID: {} subscribed to real-time notifications", currentUser.getId());
        
        messagingTemplate.convertAndSendToUser(
                currentUser.getId().toString(),
                "/topic/notifications/subscribed",
                "Successfully subscribed to notifications"
        );
    }

    @MessageMapping("/notifications.unsubscribe")
    public void unsubscribeFromNotifications(@AuthenticationPrincipal UserPrincipal currentUser) {
        log.info("User ID: {} unsubscribed from real-time notifications", currentUser.getId());
        
        messagingTemplate.convertAndSendToUser(
                currentUser.getId().toString(),
                "/topic/notifications/unsubscribed",
                "Successfully unsubscribed from notifications"
        );
    }
} 