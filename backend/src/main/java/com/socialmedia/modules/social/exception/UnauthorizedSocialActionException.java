package com.socialmedia.modules.social.exception;

public class UnauthorizedSocialActionException extends RuntimeException {
    
    public UnauthorizedSocialActionException(String message) {
        super(message);
    }
    
    public UnauthorizedSocialActionException(String action, Long userId) {
        super("User " + userId + " is not authorized to perform action: " + action);
    }
    
    public UnauthorizedSocialActionException() {
        super("You are not authorized to perform this social action");
    }
} 