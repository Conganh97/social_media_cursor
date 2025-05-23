package com.socialmedia.modules.notification.service;

import com.socialmedia.entity.Notification;
import com.socialmedia.modules.notification.dto.NotificationResponse;
import com.socialmedia.modules.notification.dto.NotificationSummary;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface NotificationService {
    
    NotificationResponse createNotification(Long userId, Notification.NotificationType type, String content, Long relatedId);
    
    Page<NotificationResponse> getUserNotifications(Long userId, Pageable pageable);
    
    Page<NotificationResponse> getUnreadNotifications(Long userId, Pageable pageable);
    
    Page<NotificationResponse> getNotificationsByType(Long userId, Notification.NotificationType type, Pageable pageable);
    
    NotificationResponse markAsRead(Long notificationId, Long userId);
    
    void markAllAsRead(Long userId);
    
    Long getUnreadCount(Long userId);
    
    NotificationSummary getNotificationSummary(Long userId);
    
    NotificationResponse getNotificationById(Long notificationId, Long userId);
    
    void deleteNotification(Long notificationId, Long userId);
    
    void deleteNotificationsByRelatedId(Long userId, Long relatedId, Notification.NotificationType type);
    
    void sendRealTimeNotification(Long userId, NotificationResponse notification);
} 