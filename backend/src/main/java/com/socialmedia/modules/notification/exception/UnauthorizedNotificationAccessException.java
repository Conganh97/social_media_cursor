package com.socialmedia.modules.notification.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.FORBIDDEN)
public class UnauthorizedNotificationAccessException extends RuntimeException {
    public UnauthorizedNotificationAccessException(String message) {
        super(message);
    }

    public UnauthorizedNotificationAccessException(String message, Throwable cause) {
        super(message, cause);
    }
} 