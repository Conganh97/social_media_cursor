package com.socialmedia.shared.exception.exceptions;

import com.socialmedia.shared.exception.enums.ErrorCode;

public class NotificationNotFoundException extends ResourceNotFoundException {
    
    public NotificationNotFoundException(String message) {
        super(ErrorCode.NOTIFICATION_NOT_FOUND, message);
    }
    
    public NotificationNotFoundException(Long notificationId) {
        super(ErrorCode.NOTIFICATION_NOT_FOUND, "Notification not found with id: " + notificationId);
    }
    
    public NotificationNotFoundException(Long notificationId, Long userId) {
        super(ErrorCode.NOTIFICATION_NOT_FOUND, "Notification " + notificationId + " not found for user " + userId);
    }
} 