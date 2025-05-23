package com.socialmedia.modules.messaging.exception;

public class UnauthorizedMessageAccessException extends RuntimeException {
    public UnauthorizedMessageAccessException(String message) {
        super(message);
    }
    
    public UnauthorizedMessageAccessException(String message, Throwable cause) {
        super(message, cause);
    }
} 