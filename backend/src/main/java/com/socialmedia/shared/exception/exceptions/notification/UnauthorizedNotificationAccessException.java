package com.socialmedia.shared.exception.exceptions;

import com.socialmedia.shared.exception.enums.ErrorCode;

public class UnauthorizedNotificationAccessException extends AuthorizationException {
    
    public UnauthorizedNotificationAccessException(String message) {
        super(ErrorCode.RESOURCE_FORBIDDEN, message);
    }
    
    public UnauthorizedNotificationAccessException(Long notificationId, Long userId) {
        super(ErrorCode.RESOURCE_FORBIDDEN, "User " + userId + " is not authorized to access notification " + notificationId);
    }
    
    public static UnauthorizedNotificationAccessException forMarkAsRead(Long notificationId, Long userId) {
        return new UnauthorizedNotificationAccessException("User " + userId + " is not authorized to mark notification " + notificationId + " as read");
    }
} 